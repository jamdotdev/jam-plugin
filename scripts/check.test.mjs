import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const checkPath = fileURLToPath(new URL("./check.mjs", import.meta.url));
const skillPath = "skills/sample-skill/SKILL.md";

function fixture(t, frontmatter = "name: sample-skill\ndescription: A useful skill.") {
  const cwd = mkdtempSync(join(tmpdir(), "jam-skills-check-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const write = (path, content) => {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), content);
  };
  write(skillPath, `---\n${frontmatter}\n---\n# Sample skill\n`);
  write("skills/sample-skill/agents/openai.yaml", "interface: {}\n");
  write("README.md", "### sample-skill\n");
  for (const file of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json", "gemini-extension.json", "server.json"]) {
    write(file, '{"version":"1.0.0"}\n');
  }
  execFileSync("git", ["init", "--quiet"], { cwd });
  execFileSync("git", ["add", "."], { cwd });
  return {
    cwd,
    write,
    run: (...args) => {
      const result = spawnSync(process.execPath, [checkPath, ...args], { cwd, encoding: "utf8" });
      assert.ifError(result.error);
      return { status: result.status, output: result.stdout + result.stderr };
    },
  };
}

for (const [label, frontmatter, expected] of [
  ["unquoted colon", "name: sample-skill\ndescription: Record proof: publish it.", /invalid YAML/],
  ["empty description", "name: sample-skill\ndescription:", /description must be a non-empty string/],
  ["null description", "name: sample-skill\ndescription: null", /description must be a non-empty string/],
  ["numeric description", "name: sample-skill\ndescription: 42", /description must be a non-empty string/],
  ["boolean description", "name: sample-skill\ndescription: true", /description must be a non-empty string/],
  ["mapping description", "name: sample-skill\ndescription: { value: text }", /description must be a non-empty string/],
  ["sequence description", "name: sample-skill\ndescription: [text]", /description must be a non-empty string/],
  ["whitespace description", 'name: sample-skill\ndescription: "   "', /description must be a non-empty string/],
  ["missing description", "name: sample-skill", /description must be a non-empty string/],
  ["numeric name", "name: 42\ndescription: A useful skill.", /name must be a string/],
  ["duplicate description", "name: sample-skill\ndescription: First.\ndescription: Second.", /invalid YAML/],
  ["sequence frontmatter", "- name: sample-skill\n- description: A useful skill.", /frontmatter must be a YAML mapping/],
  ["block description", "name: sample-skill\ndescription: >-\n  A useful skill.", /description on one line/],
  ["multiline quoted description", 'name: sample-skill\ndescription: "A useful\n  skill."', /description on one line/],
  ["decoded newline", 'name: sample-skill\ndescription: "A useful\\nskill."', /description on one line/],
  ["long description", `name: sample-skill\ndescription: "${"a".repeat(1025)}"`, /description is 1025 chars, max 1024/],
]) {
  test(`rejects ${label}`, (t) => {
    const result = fixture(t, frontmatter).run();
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, expected);
    assert.match(result.output, /skills\/sample-skill\/SKILL.md/);
  });
}

test("accepts quoted colons, quoted names, and optional metadata", (t) => {
  const result = fixture(t, 'name: "sample-skill"\ndescription: "Record proof: publish it."\nlicense: MIT\nmetadata:\n  category: testing').run();
  assert.equal(result.status, 0, result.output);
});

test("measures decoded description length", (t) => {
  const result = fixture(t, `name: sample-skill\ndescription: "${"\\u0061".repeat(1024)}"`).run();
  assert.equal(result.status, 0, result.output);
});

test("checks untracked Markdown links", (t) => {
  const repo = fixture(t);
  repo.write("skills/sample-skill/references/new.md", "[missing](./missing.md)\n");
  const result = repo.run();
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /references\/new.md: broken link \.\/missing.md/);
});

test("ignores deleted tracked Markdown", (t) => {
  const repo = fixture(t);
  repo.write("skills/sample-skill/references/deleted.md", "A removed reference.\n");
  execFileSync("git", ["add", "."], { cwd: repo.cwd });
  rmSync(join(repo.cwd, "skills/sample-skill/references/deleted.md"));
  const result = repo.run();
  assert.equal(result.status, 0, result.output);
});

test("checks untracked CLI install blocks", (t) => {
  const repo = fixture(t);
  for (const [file, flags] of [["one.md", "--silent"], ["two.md", "--fail"]]) {
    repo.write(`skills/sample-skill/references/${file}`, `\n\`\`\`bash\ncurl ${flags} https://native.jam.dev/install\n\`\`\`\n`);
  }
  const result = repo.run();
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /CLI install blocks differ/);
});

for (const [label, output, status, expected] of [
  ["listed skill", "│\n◇  Available Skills\n│\n│    \u001b[36msample-skill\u001b[39m\n│\n│      A useful skill.\n", 0, /✓/],
  ["path only", "⚠ Skipped skills/sample-skill/SKILL.md: YAML parse error\n", 1, /skills CLI did not list sample-skill/],
  ["description only", "│      sample-skill\n", 1, /skills CLI did not list sample-skill/],
  ["longer name", "│    sample-skill-extra\n", 1, /skills CLI did not list sample-skill/],
  ["YAML warning despite listed skill", "⚠ Skipped other/SKILL.md: YAML parse error\n│    sample-skill\n", 1, /skills CLI skipped a skill/],
]) {
  test(`discovery checks ${label}`, (t) => {
    const repo = fixture(t);
    repo.write("skills.txt", output);
    const result = repo.run("--skills-list", "skills.txt");
    assert.equal(result.status, status, result.output);
    assert.match(result.output, expected);
  });
}

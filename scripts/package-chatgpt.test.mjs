import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { parse } from "yaml";

const script = resolve("scripts/package-chatgpt.mjs");
const originalSkill = readFileSync("skills/jam-fix/SKILL.md", "utf8");
const originalManifest = JSON.parse(readFileSync(".codex-plugin/plugin.json", "utf8"));

function fixture(t, skill = originalSkill) {
  const root = mkdtempSync(join(tmpdir(), "jam-package-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of [".codex-plugin/plugin.json", "mcp.json", "assets/logo.png", "LICENSE", "skills/jam-fix/agents/openai.yaml"]) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    copyFileSync(path, join(root, path));
  }
  writeFileSync(join(root, "skills/jam-fix/SKILL.md"), skill);
  return root;
}

test("packages the current skill with only MCP instructions and matching metadata", (t) => {
  const root = fixture(t, originalSkill + "\nLocal verification marker.\n");
  const archive = join(root, "jam.zip");
  execFileSync(process.execPath, [script, archive], { cwd: root });
  const files = execFileSync("unzip", ["-Z1", archive], { encoding: "utf8" }).split("\n").filter((path) => path && !path.endsWith("/"));
  assert.deepEqual(files.sort(), [
    "jam/.codex-plugin/plugin.json", "jam/LICENSE", "jam/assets/logo.png", "jam/mcp.json",
    "jam/skills/jam-fix/SKILL.md", "jam/skills/jam-fix/agents/openai.yaml",
  ].sort());
  const skill = execFileSync("unzip", ["-p", archive, "jam/skills/jam-fix/SKILL.md"], { encoding: "utf8" });
  assert.match(skill, /Local verification marker/);
  assert.match(skill, /getDetails/);
  assert.match(skill, /submitFeedback/);
  assert.doesNotMatch(skill, /references\/|chatgpt:omit|npx|ffmpeg|curl|Jam CLI|`jam\s/);
  assert.equal(parse(skill.split("---")[1]).name, "jam-fix");
  const manifest = JSON.parse(execFileSync("unzip", ["-p", archive, "jam/.codex-plugin/plugin.json"], { encoding: "utf8" }));
  assert.equal(manifest.name, originalManifest.name);
  assert.equal(manifest.version, originalManifest.version);
  assert.equal(manifest.mcpServers, originalManifest.mcpServers);
  assert.equal(manifest.skills, originalManifest.skills);
  assert.doesNotMatch(manifest.description, /annotat|end-to-end|recorded Jam/);
});

for (const [name, mutate] of [
  ["unclosed omission", (s) => s.replace("<!-- chatgpt:omit:end -->", "")],
  ["nested omission", (s) => s.replace("<!-- chatgpt:omit:start -->", "<!-- chatgpt:omit:start -->\n<!-- chatgpt:omit:start -->")],
  ["unmarked shell command", (s) => s + "\nnpx playwright test\n"],
  ["missing packaged reference", (s) => s + "\nRead [setup](references/missing.md).\n"],
]) {
  test(`rejects ${name}`, (t) => {
    const root = fixture(t, mutate(originalSkill));
    const result = spawnSync(process.execPath, [script, join(root, "jam.zip")], { cwd: root, encoding: "utf8" });
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /AssertionError/);
  });
}

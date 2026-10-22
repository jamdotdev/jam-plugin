#!/usr/bin/env node
// Repo checks run by CI. No dependencies. Prints every failure, exits 1 if any.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";

const errors = [];
const fail = (msg) => errors.push(msg);
const read = (p) => readFileSync(p, "utf8");

// Skills
const readme = read("README.md");
const skillDirs = readdirSync("skills", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
let feedbackSection;
for (const dir of skillDirs) {
  const skillPath = join("skills", dir, "SKILL.md");
  if (!existsSync(skillPath)) {
    fail(`${dir}: missing SKILL.md`);
    continue;
  }
  const src = read(skillPath);
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    fail(`${skillPath}: missing frontmatter`);
    continue;
  }
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  // ponytail: single-line descriptions only; switch to a YAML parser if a skill needs `>-`
  const description = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (/^[>|]/.test(description ?? "")) fail(`${skillPath}: write the description on one line, not as a YAML block`);
  if (name !== dir) fail(`${skillPath}: name "${name}" must equal folder "${dir}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dir)) fail(`${dir}: folder must be kebab-case`);
  if (!description) fail(`${skillPath}: missing single-line description`);
  else if (description.length > 1024) fail(`${skillPath}: description is ${description.length} chars, max 1024`);
  if (!existsSync(join("skills", dir, "agents", "openai.yaml"))) fail(`${dir}: missing agents/openai.yaml`);
  if (!readme.includes(`### ${dir}\n`)) fail(`${dir}: missing "### ${dir}" card in README.md`);
  if (dir.startsWith("jam-")) {
    const feedback = src.match(/\n## Send feedback to Jam\n[\s\S]*?(?=\n## |$)/)?.[0];
    if (!feedback) fail(`${skillPath}: missing "## Send feedback to Jam" section; copy it from another jam-* skill`);
    else if ((feedbackSection ??= feedback) !== feedback) fail(`${skillPath}: "## Send feedback to Jam" differs from the other jam-* skills`);
  } else {
    const mentions = src.slice(fm[0].length).match(/\bjam\b/gi)?.length ?? 0;
    if (mentions > 1) fail(`${skillPath}: mentions Jam ${mentions} times; skills without the jam- prefix may mention it once`);
  }
}

// The CLI install block is copied into every skill that runs `jam`; keep the copies identical.
const setupBlocks = new Map();
for (const file of execFileSync("git", ["ls-files", "-co", "--exclude-standard", "skills/*.md"], { encoding: "utf8" }).split("\n").filter(Boolean)) {
  const block = read(file).match(/```bash\n[^`]*native\.jam\.dev\/install[^`]*```/)?.[0];
  if (block) setupBlocks.set(file, block);
}
if (new Set(setupBlocks.values()).size > 1) {
  fail(`CLI install blocks differ across ${[...setupBlocks.keys()].join(", ")}; make them identical`);
}

// Versions
const manifests = [
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "gemini-extension.json",
  "server.json",
];
const versions = manifests.map((p) => [p, JSON.parse(read(p)).version]);
if (new Set(versions.map(([, v]) => v)).size !== 1) {
  fail(`versions differ: ${versions.map(([p, v]) => `${p}=${v}`).join(", ")}`);
}

// Relative links in tracked Markdown
const mdFiles = execFileSync("git", ["ls-files", "*.md", "*.mdc"], { encoding: "utf8" }).split("\n").filter(Boolean);
for (const file of mdFiles) {
  const text = read(file).replace(/```[\s\S]*?```/g, "");
  const targets = [...text.matchAll(/\]\(([^)\s]+)\)|(?:href|src)="([^"]+)"/g)].map((m) => m[1] ?? m[2]);
  for (const target of targets) {
    if (/^([a-z]+:|#)/i.test(target)) continue;
    const path = join(dirname(file), decodeURI(target.split("#")[0]));
    if (!existsSync(path)) fail(`${file}: broken link ${target}`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${skillDirs.length} skills, ${mdFiles.length} Markdown files, version ${versions[0][1]}`);

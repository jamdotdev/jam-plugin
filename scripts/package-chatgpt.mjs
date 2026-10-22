#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { parse } from "yaml";

assert(process.argv.length === 3, "Usage: node scripts/package-chatgpt.mjs <output.zip>");
const output = resolve(process.argv[2]);
assert(output.endsWith(".zip"), "Output must be a .zip file");

const source = readFileSync("skills/jam-fix/SKILL.md", "utf8");
const lines = [];
let omitted = false;
let blocks = 0;
for (const line of source.split("\n")) {
  if (line === "<!-- chatgpt:omit:start -->") {
    assert(!omitted, "Nested ChatGPT omission block");
    omitted = true;
    blocks++;
  } else if (line === "<!-- chatgpt:omit:end -->") {
    assert(omitted, "Unmatched ChatGPT omission end");
    omitted = false;
  } else if (!omitted) {
    lines.push(line);
  }
}
assert(blocks > 0 && !omitted, "Missing or unclosed ChatGPT omission block");
const skill = lines.join("\n").replace(/\n{3,}/g, "\n\n");
assert(!skill.includes("chatgpt:omit"), "Unrecognized ChatGPT omission marker");
assert(!/```(?:bash|sh|shell|console)|\b(?:npx|ffmpeg|curl|Jam CLI)\b|`jam\s/.test(skill), "ChatGPT skill still contains shell or CLI instructions");
for (const [, target] of skill.matchAll(/\]\(([^)\s]+)\)/g)) {
  assert(/^(?:https?:|#)/.test(target), `ChatGPT skill must be self-contained: ${target}`);
}
const frontmatter = skill.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
assert(frontmatter, "ChatGPT skill is missing frontmatter");
const metadata = parse(frontmatter[1], { uniqueKeys: true });
assert(metadata?.name === "jam-fix", "ChatGPT skill name must be jam-fix");
assert(typeof metadata.description === "string" && metadata.description.trim().length > 0 && metadata.description.length <= 1024, "Invalid ChatGPT skill description");

const manifest = JSON.parse(readFileSync(".codex-plugin/plugin.json", "utf8"));
manifest.description = "Investigate Jam bug reports using recordings, console logs, network requests, and user events through Jam MCP.";
manifest.interface.shortDescription = "Investigate Jam bug reports";
manifest.interface.longDescription = manifest.description;
manifest.interface.defaultPrompt = "Use $jam-fix to investigate this Jam and explain the likely root cause.";

const temporary = mkdtempSync(join(tmpdir(), "jam-chatgpt-"));
try {
  const root = join(temporary, "jam");
  for (const path of ["mcp.json", "assets/logo.png", "LICENSE", "skills/jam-fix/agents/openai.yaml"]) {
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(path, destination);
  }
  mkdirSync(join(root, ".codex-plugin"));
  writeFileSync(join(root, ".codex-plugin/plugin.json"), JSON.stringify(manifest, null, 2) + "\n");
  writeFileSync(join(root, "skills/jam-fix/SKILL.md"), skill);
  const archive = join(temporary, "package.zip");
  execFileSync("zip", ["-qr", archive, "jam"], { cwd: temporary });
  copyFileSync(archive, output);
  console.log(`Created ${output} from the working tree: jam-fix, MCP only, version ${manifest.version}`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}

#!/usr/bin/env node
// Builds the ChatGPT directory package: the MCP-only skills plus the plugin identity,
// with the listing copy rewritten to name only what is inside. Needs `zip` on PATH.

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const output = resolve(process.argv[2] ?? "");
if (!output.endsWith(".zip")) {
  console.error("Usage: node scripts/package-chatgpt.mjs <output.zip>");
  process.exit(1);
}

export const SKILLS = ["jam-fix", "jam-to-e2e"];
const DESCRIPTION = "Jam recordings (video, console, network, logs) as context for ChatGPT. Find the root cause of a bug from a Jam, or turn a Jam into a failing end-to-end test.";

const stage = mkdtempSync(join(tmpdir(), "jam-chatgpt-"));
const root = join(stage, "jam");
for (const path of [".codex-plugin", "mcp.json", "assets", "LICENSE"]) cpSync(path, join(root, path), { recursive: true });
for (const skill of SKILLS) {
  cpSync(join("skills", skill, "SKILL.md"), join(root, "skills", skill, "SKILL.md"));
  cpSync(join("skills", skill, "agents"), join(root, "skills", skill, "agents"), { recursive: true });
}

const manifest = JSON.parse(readFileSync(".codex-plugin/plugin.json", "utf8"));
manifest.description = DESCRIPTION;
manifest.interface.shortDescription = "Fix and test bugs from Jam recordings";
manifest.interface.longDescription = DESCRIPTION;
writeFileSync(join(root, ".codex-plugin/plugin.json"), JSON.stringify(manifest, null, 2) + "\n");

rmSync(output, { force: true });
execFileSync("zip", ["-qr", output, "jam"], { cwd: stage });
rmSync(stage, { recursive: true, force: true });
console.log(output);

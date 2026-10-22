import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

test("ChatGPT package carries only the MCP-only skills and says so", () => {
  const dir = mkdtempSync(join(tmpdir(), "jam-chatgpt-test-"));
  const archive = join(dir, "jam.zip");
  execFileSync("node", ["scripts/package-chatgpt.mjs", archive]);
  const files = execFileSync("unzip", ["-Z1", archive], { encoding: "utf8" }).trim().split("\n");
  assert.ok(files.includes("jam/skills/jam-fix/SKILL.md"));
  assert.ok(files.includes("jam/skills/jam-to-e2e/SKILL.md"));
  assert.ok(!files.some((f) => /jam-proof|jam-annotate|references/.test(f)));
  const manifest = JSON.parse(execFileSync("unzip", ["-p", archive, "jam/.codex-plugin/plugin.json"], { encoding: "utf8" }));
  assert.doesNotMatch(manifest.description, /proof|screenshot|annotat/);
  assert.equal(manifest.interface.longDescription, manifest.description);
  rmSync(dir, { recursive: true, force: true });
});

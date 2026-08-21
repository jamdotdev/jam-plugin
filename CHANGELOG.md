# Changelog

## 1.2.0

- Fixed the plugin logo: it pointed at `https://jam.dev/favicon.svg`, which returns 404. The logo is now committed at `assets/logo.svg` and referenced by relative path, as the marketplace expects.
- Added `.cursor-plugin/marketplace.json` so the repository can be added as a plugin folder in Cursor.
- Documented the 9 tools the Jam MCP server gained since v1.7.0: `getVideoChapters`, `createFolder`, `updateFolder`, `editComment`, `addReaction`, `removeReaction`, `deleteJam`, `deleteComment`, `deleteFolder`. The README and the `jam-bug-analysis` rule now cover all 33 tools.
- Called out the destructive `delete*` tools in their own section of both the README and the rule, with an instruction to confirm with the user before calling them.
- Fixed the Personal Access Token instructions, which told readers to replace an `auth` block that `mcp.json` no longer contains.
- Removed the `rules`, `skills`, and `mcpServers` path fields from the manifest. They named the default directories, which Cursor already discovers on its own.

## 1.1.0

- Updated for Jam MCP server v1.7.0 — now documents all 24 tools.
- New investigation tool: `getFrames` (still frames from video Jams — overview grid or timestamp sampling). Wired into the `jam-bug-analysis` rule and the `/investigate-bug` skill as the first visual-evidence step for video Jams.
- New recording-link tools: `createRecordingLink`, `listRecordingLinks`, `getRecordingLink`, `updateRecordingLink`, `deleteRecordingLink`, `listRecordingLinkJams`, `listRecordingUrls`, `getRecordingUrlVerifyLink`.
- Simplified `mcp.json` to the standard Cursor shape (`{"url": ...}`); removed the non-spec `auth.scopes` block (OAuth scopes come from server discovery).
- README: added a Jam CLI section.

## 1.0.0

- Initial release of the Jam plugin for Cursor.
- Connects to the Jam MCP server at `https://mcp.jam.dev/mcp` via OAuth (Personal Access Token also supported).
- Exposes 15 MCP tools: `getDetails`, `getNetworkRequests`, `getConsoleLogs`, `getUserEvents`, `getScreenshots`, `analyzeVideo`, `getVideoTranscript`, `getMetadata`, `listJams`, `listFolders`, `listMembers`, `createComment`, `updateJam`, `search`, `fetch`.
- Adds the `jam-bug-analysis` rule (always-on guidance for how to use the tools).
- Adds the `/investigate-bug` skill for end-to-end structured bug investigation.

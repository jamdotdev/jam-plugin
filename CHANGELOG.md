# Changelog

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

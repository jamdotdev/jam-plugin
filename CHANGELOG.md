# Changelog

## 1.0.0

- Initial release of the Jam plugin for Cursor.
- Connects to the Jam MCP server at `https://mcp.jam.dev/mcp` via OAuth (Personal Access Token also supported).
- Exposes 15 MCP tools: `getDetails`, `getNetworkRequests`, `getConsoleLogs`, `getUserEvents`, `getScreenshots`, `analyzeVideo`, `getVideoTranscript`, `getMetadata`, `listJams`, `listFolders`, `listMembers`, `createComment`, `updateJam`, `search`, `fetch`.
- Adds the `jam-bug-analysis` rule (always-on guidance for how to use the tools).
- Adds the `/investigate-bug` skill for end-to-end structured bug investigation.

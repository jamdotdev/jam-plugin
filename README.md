# Jam Plugin for Cursor

Integrate [Jam](https://jam.dev) bug reports directly into Cursor. This plugin connects to Jam's MCP server so your AI assistant can analyze bug reports, access diagnostic data (console logs, network requests, screenshots, session replays), and manage Jams — all from your editor.

## Installation

### From the Cursor Plugin Marketplace

Search for **"Jam"** in the Cursor plugin marketplace and click Install.

### Manual Installation

Copy or symlink this directory into your Cursor plugins folder:

```bash
# macOS / Linux
ln -s /path/to/cursor-jam-plugin ~/.cursor/plugins/local/jam

# Or copy directly
cp -r /path/to/cursor-jam-plugin ~/.cursor/plugins/local/jam
```

Then reload Cursor (`Cmd+Shift+P` > "Developer: Reload Window").

## Authentication

### OAuth (Default)

The plugin is pre-configured to use OAuth with `https://mcp.jam.dev/mcp`. When you first use a Jam tool, Cursor will open a browser window to authenticate with your Jam account. No additional configuration needed.

### Personal Access Token

If you prefer token-based auth, edit `mcp.json` in the plugin directory and replace the `auth` block with a `headers` block:

```json
{
  "mcpServers": {
    "Jam": {
      "url": "https://mcp.jam.dev/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

Create a token in your Jam team settings under **Personal Access Tokens**.

## What's Included

### MCP Server Connection (`mcp.json`)

Connects to the Jam MCP server at `https://mcp.jam.dev/mcp`, giving your AI assistant access to 24 tools.

**Investigation:**

| Tool | Description |
|------|-------------|
| `getDetails` | Bug report overview, device info, and investigation guidance |
| `getNetworkRequests` | HTTP requests with filtering (status, method, host) |
| `getConsoleLogs` | Browser console output with log level filtering |
| `getUserEvents` | Timeline of user interactions (clicks, inputs, navigation) |
| `getScreenshots` | Visual screenshots from screenshot-type Jams |
| `getFrames` | Still frames from video Jams — overview grid or timestamp sampling |
| `analyzeVideo` | Extract user intents from video recordings |
| `getVideoTranscript` | Speech transcript from video Jams |
| `getMetadata` | Custom metadata from the `jam.metadata()` SDK |
| `search` | Resolve a Jam URL or text to a Jam |
| `fetch` | Alias for `getDetails` |

**Discovery & management:**

| Tool | Description |
|------|-------------|
| `listJams` | Search and filter bug reports |
| `listFolders` | Browse team folders |
| `listMembers` | Find team members |
| `createComment` | Add comments to a Jam |
| `updateJam` | Move Jams between folders |

**Recording links** (collect bug reports from anyone via a shareable URL):

| Tool | Description |
|------|-------------|
| `createRecordingLink` | Create a reusable recording link (target folder, expiration) |
| `listRecordingLinks` | List the team's recording links |
| `getRecordingLink` | Get a recording link and its recorded-Jam count |
| `updateRecordingLink` | Rename a link or change its folder, expiration, or metadata |
| `deleteRecordingLink` | Revoke a link (existing Jams are untouched) |
| `listRecordingLinkJams` | List Jams recorded through a link |
| `listRecordingUrls` | List the team's connected recording domains |
| `getRecordingUrlVerifyLink` | Get a browser link to verify a connected domain |

### Rule: Jam Bug Analysis (`rules/jam-bug-analysis.mdc`)

An always-active rule that teaches the AI assistant how to effectively use Jam tools — which tool to start with, how to filter results, and how to correlate findings across data sources.

### Skill: Investigate Bug (`skills/investigate-bug/SKILL.md`)

A structured investigation workflow invokable via `/investigate-bug <jam-url-or-id>`. It walks through a systematic analysis: fetching the report, following server guidance, checking network/console/user events, analyzing visual evidence, and producing a structured diagnosis.

## Verification

After installation:

1. Open Cursor Settings > Features > MCP and verify **Jam** appears as a connected server.
2. Paste a Jam URL into chat (e.g., `https://jam.dev/c/abc123`) and ask the assistant to analyze it.
3. Try `/investigate-bug https://jam.dev/c/abc123` for a structured investigation.

## Privacy & Permissions

- OAuth scopes are `mcp:read` (default) and `mcp:write` (needed for `createComment`, `updateJam`, and the recording-link write tools).
- The plugin only talks to `https://mcp.jam.dev/mcp`. No data is sent anywhere else.
- All requests are scoped to Jams your authenticated account already has access to. Permissions are enforced server-side per team and per Jam.

## Support

- Found a bug or have a feature request? Open an issue at [github.com/jamdotdev/cursor-jam-plugin](https://github.com/jamdotdev/cursor-jam-plugin/issues).
- General Jam support: [support@jam.dev](mailto:support@jam.dev).

## Links

- [Jam Website](https://jam.dev)
- [Jam Browser Extension](https://chrome.google.com/webstore/detail/jam/iohjgamcilhbgmhbnllfolmkmmekfmci)
- [MCP Server Documentation](https://jam.dev/mcp)

## License

MIT — see [LICENSE](./LICENSE).

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

If you prefer token-based auth, add a `headers` block to the server entry in `mcp.json`:

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

Connects to the Jam MCP server at `https://mcp.jam.dev/mcp`, giving your AI assistant access to 33 tools.

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
| `getVideoChapters` | AI-generated chapters — titled segments with start/end timestamps |
| `getMetadata` | Custom metadata from the `jam.metadata()` SDK |
| `search` | Resolve a Jam URL or text to a Jam |
| `fetch` | Alias for `getDetails` |

**Discovery & management:**

| Tool | Description |
|------|-------------|
| `listJams` | Search and filter bug reports |
| `listFolders` | Browse team folders |
| `createFolder` | Create a folder to file Jams into |
| `updateFolder` | Rename a folder (does not move Jams) |
| `listMembers` | Find team members |
| `createComment` | Add comments to a Jam |
| `editComment` | Rewrite a comment you authored |
| `addReaction` | React to a comment |
| `removeReaction` | Take back a reaction you left |
| `updateJam` | Move Jams between folders |

**Destructive** — these permanently remove data and nothing can restore it. The assistant is
instructed to confirm with you before calling any of them.

| Tool | Description |
|------|-------------|
| `deleteJam` | Delete a Jam |
| `deleteComment` | Delete a comment you authored, along with its attachments |
| `deleteFolder` | Delete a folder and every Jam inside it |

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

## Jam CLI

Prefer the terminal, or want your agent to script against Jam data? The [Jam CLI](https://jam.dev/docs/cli) is a complementary surface over the same data:

```bash
curl -fsSL https://native.jam.dev/install | bash
jam auth login
jam get console <jam-url-or-id> --json
```

The CLI talks to Jam's API directly (it does not require this plugin or the MCP server) and supports the same Personal Access Tokens. Inside Cursor, the MCP connection this plugin configures is the recommended integration — use the CLI for shell scripts, CI, and piping `--json` output through other tools.

## Privacy & Permissions

- OAuth scopes are `mcp:read` (default) and `mcp:write` (needed for every write tool: comments, reactions, folders, `updateJam`, the recording-link write tools, and the destructive `delete*` tools).
- Write and delete permissions are enforced server-side per team and per Jam. A `mcp:read` token cannot mutate anything.
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

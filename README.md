<p align="center">
  <a href="https://jam.dev">
    <img src="https://storage.googleapis.com/jam-assets/github-repo.png" alt="Jam">
  </a>
</p>

<h1 align="center">Jam plugin</h1>

<p align="center">
  Jam bug reports as context for your coding agent.
</p>

<p align="center">
  <a href="https://jam.dev/docs/jam-mcp"><strong>MCP Docs</strong></a> ·
  <a href="https://jam.dev/docs/cli"><strong>CLI Docs</strong></a> ·
  <a href="https://jam.dev"><strong>Jam.dev</strong></a>
</p>
<br/>

---

Jam's MCP is the fast lane between Jam recordings and your dev tools. Drop a Jam link into your coding agent and the whole recording – video, console, network, logs – arrives pre-packaged. No hand-typing repro steps, no copy-paste stack traces, no screen-share drama. Your tools get instant context, you stay in flow.

One repository works in Cursor, Claude Code, GitHub Copilot CLI, and Gemini CLI. Each agent gets the Jam MCP server and the same skills.

## Installation

### Cursor

Open **Customize** in the Cursor sidebar, search for **Jam**, and select **Install**.

To run an unreleased version, symlink the repository into Cursor's local plugin folder, then run **Developer: Reload Window** from the command palette (`Cmd+Shift+P`):

```bash
ln -s /path/to/jam-plugin ~/.cursor/plugins/local/jam
```

### Claude Code

```shell
/plugin marketplace add jamdotdev/jam-plugin
/plugin install jam@jam-plugins
```

The skills load as `/jam:investigate-bug` and `/jam:jam-cli`. To run an unreleased version, start Claude Code with `claude --plugin-dir /path/to/jam-plugin`.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add jamdotdev/jam-plugin
copilot plugin install jam@jam-plugins
```

### Gemini CLI

```bash
gemini extensions install https://github.com/jamdotdev/jam-plugin
```

Run `/mcp auth Jam` once to sign in. To run an unreleased version, use `gemini extensions link /path/to/jam-plugin`.

## Authentication

### OAuth (default)

The plugin ships pointed at `https://mcp.jam.dev/mcp`. The first time the agent calls a Jam tool, your agent opens a browser window to authenticate with your Jam account. Nothing else to configure.

### Personal access token

Use a token where the OAuth browser flow is not available, such as a headless environment or CI. Create one under [Settings → MCP](https://jam.dev/s/settings/mcp) in the **Personal Access Tokens** section, then add a `headers` block to the Jam server entry in your agent's MCP config. In Cursor, that is `mcp.json`:

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

Each token is scoped to one workspace, tied to your user account, and expires on a date you pick. Jam stores only a hash, so copy the token when you create it.

## What's included

### MCP server connection (`mcp.json`)

Connects to the Jam MCP server at `https://mcp.jam.dev/mcp` and exposes 33 tools.

**Investigation**

| Tool | Description |
|------|-------------|
| `getDetails` | Bug report overview, device info, and the server's investigation guide |
| `getNetworkRequests` | HTTP requests, filterable by status, method, host, and content type |
| `getConsoleLogs` | Browser console output, filterable by log level |
| `getUserEvents` | Timeline of clicks, inputs, navigation, and scrolls |
| `getScreenshots` | Images from screenshot Jams |
| `getFrames` | Still frames from video Jams, as an overview grid or sampled at timestamps |
| `analyzeVideo` | User intents extracted from a video recording |
| `getVideoTranscript` | Speech transcript from video Jams recorded with the mic on |
| `getVideoChapters` | Titled segments of a video Jam with start and end timestamps |
| `getMetadata` | Custom metadata the page sent through `jam.metadata()` |
| `search` | Resolve a Jam URL or pasted text to a Jam |
| `fetch` | Alias for `getDetails` |

**Discovery and management**

| Tool | Description |
|------|-------------|
| `listJams` | Search and filter Jams by text, type, folder, author, URL, or date |
| `listFolders` | Browse the workspace's folders |
| `createFolder` | Create a folder to file Jams into |
| `updateFolder` | Rename a folder. It does not move Jams |
| `listMembers` | Find workspace members |
| `createComment` | Add a Markdown comment to a Jam |
| `editComment` | Rewrite a comment you authored |
| `addReaction` | React to a comment |
| `removeReaction` | Take back a reaction you left |
| `updateJam` | Move a Jam to a different folder |

**Destructive**

These remove data permanently. Nobody in the workspace can restore it, because the dashboard has no trash or archive view. The bundled rule tells the agent to confirm with you before calling any of them.

| Tool | Description |
|------|-------------|
| `deleteJam` | Delete a Jam |
| `deleteComment` | Delete a comment you authored, along with its attachments |
| `deleteFolder` | Delete a folder and every Jam inside it |

**Recording Links**

Reusable URLs that let anyone record a Jam into your workspace.

| Tool | Description |
|------|-------------|
| `createRecordingLink` | Create a link, optionally with a target folder and an expiration |
| `listRecordingLinks` | List the workspace's links |
| `getRecordingLink` | Get one link and how many Jams it collected |
| `updateRecordingLink` | Rename a link, or change its folder, expiration, or metadata |
| `deleteRecordingLink` | Revoke a link. Jams already recorded through it stay |
| `listRecordingLinkJams` | List the Jams recorded through a link |
| `listRecordingUrls` | List the workspace's connected domains |
| `getRecordingUrlVerifyLink` | Get a link a person opens to verify a connected domain |

A Recording Link only captures console and network logs when it starts from a verified connected domain. Create one with a `recordingUrlId` or the Jams it collects carry no logs.

### Rule: Jam bug analysis (`rules/jam-bug-analysis.mdc`)

Cursor only, where it is always on. Other agents do not load rules. It tells the agent which tool to start with, how to filter noisy results, and how to line up console errors against network failures and user events.

### Skill: investigate bug (`skills/investigate-bug/SKILL.md`)

Run `/investigate-bug <jam-url-or-id>` for a full pass: pull the report, follow the server's investigation guide, read the network, console, and user events, look at the visual evidence, and write up a root-cause hypothesis.

## Verifying the install

1. Confirm **Jam** is listed in your agent's MCP servers (Cursor: **Customize**; Claude Code and Gemini CLI: `/mcp`; Copilot CLI: `copilot mcp list`).
2. Paste a Jam URL into chat and ask the agent to analyze it. A browser window opens for OAuth on the first tool call.
3. Run the `investigate-bug` skill on `https://jam.dev/c/<id>`.

## Jam CLI

The [Jam CLI](https://jam.dev/docs/cli) reads the same data from a terminal, with the same personal access tokens the MCP server accepts:

```bash
curl -fsSL https://native.jam.dev/install | bash
jam auth login                                 # or: export JAM_TOKEN=jam_pat_...
jam get console <jam-url-or-id> --level error --json
```

Use the MCP connection in your agent on your machine. Use the CLI where MCP is not wired up, such as cloud agents, CI, and shell scripts that pipe `--json` into other tools.

### Skill: Jam CLI (`skills/jam-cli/SKILL.md`)

Teaches the agent to install the CLI, authenticate with `JAM_TOKEN` in headless environments, triage a Jam with `jam get`, and run `jam skills install --target <agent> --project` to pull the CLI's own full command reference into the repo.

### Record proof with `jam record`

The CLI records a window or display while a command runs, uploads the video, and returns a Jam link. Ask the agent to record the fix it just made:

```bash
jam record windows --json
jam record run --window-id <id> --title "Checkout completes after fix" -- bun run e2e/checkout.ts
```

The Jam link goes on the PR. For a bug fix, ask for two Jams: one of the bug, one of the fix. `jam create jam` turns an existing video or Playwright `trace.zip` into a Jam without recording live. macOS and Linux (X11) only.

## Privacy and permissions

- The plugin talks to `https://mcp.jam.dev/mcp` and nothing else.
- OAuth scopes are `mcp:read` and `mcp:write`. Writes cover comments, reactions, folders, `updateJam`, the Recording Link write tools, and the three `delete*` tools.
- The server enforces permissions per workspace and per Jam. A `mcp:read` token cannot change anything.
- Every request is scoped to the Jams your account can already see.

## Support

- Bug or feature request: open an issue at [github.com/jamdotdev/jam-plugin](https://github.com/jamdotdev/jam-plugin/issues).
- General Jam support: [support@jam.dev](mailto:support@jam.dev).

## Links

- [jam.dev](https://jam.dev)
- [Jam Chrome extension](https://chromewebstore.google.com/detail/jam/iohjgamcilhbgmhbnllfolmkmmekfmci)
- [Jam MCP documentation](https://jam.dev/docs/jam-mcp)
- [Personal access tokens](https://jam.dev/docs/personal-access-tokens)

## License

MIT. See [LICENSE](./LICENSE).

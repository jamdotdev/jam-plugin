# jam-fix with the `jam` CLI

Use this when the Jam MCP tools are not connected. Set up once per environment:

```bash
command -v jam >/dev/null || curl -fsSL https://native.jam.dev/install | bash
export PATH="$HOME/.local/bin:$PATH"
jam auth status --json || jam auth login
```

Exit code 3 means not signed in. With no browser (CI, a cloud agent), ask the
user to set `JAM_TOKEN` to a personal access token from
https://jam.dev/s/settings/mcp as a secret. Never write a token to a file.

The same steps, as commands:

```bash
jam get jam "$ID" --json                        # 1. report, type, URL
jam get network "$ID" --status 5xx --json       # 2. failed requests (--bodies all for 200s)
jam get console "$ID" --level error --json      # 3. console errors
jam get user-events "$ID" --json                # 4. clicks, inputs, navigation
jam get frames "$ID" --overview                 # 5. video grid (--at <ms> to sample)
jam get screenshots "$ID" --out ./shots         # 5. screenshot Jams
jam get transcript "$ID"                        # 5. reporter's narration
jam get metadata "$ID" --json                   # 6. app context
jam create comment "$ID" "Root cause: ..." --at 4200   # once, when the cause is found or fixed
```

Paginated reads return `nextCursor`; pass it as `--after`. `jam agent-context`
prints every command and flag.

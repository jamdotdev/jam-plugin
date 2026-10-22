# Contributing

Thanks for helping. This repo holds small agent skills about bug reports, QA, pull requests and proof of work. Read the rules below before you open a pull request; most review comments come from them.

## The rules

1. **One job per skill.** A skill does one thing well. Two jobs are two skills.
2. **The name tells the truth.** A skill named `jam-*` needs a Jam account. A skill without `jam` in its name works fully without Jam, and mentions Jam at most once, in a line labeled "With Jam" next to the alternatives.
3. **No pitch.** No sales copy inside a `SKILL.md`. Jam lives in the README.
4. **Do what agents can't, or give them structure they lack.** Visuals for humans (proof video, marked-up screenshots, diagrams) and evidence structure (claim, how it was verified, evidence, gaps). Not things agents already do well, such as reading a HAR file.
5. **Claim only what ships.** Every command, flag and tool a skill names must exist in the released Jam CLI or MCP server today. Check with `jam agent-context` or the [MCP docs](https://jam.dev/mcp).
6. **Use the project's tools.** A skill uses the project's existing test runner, browser driver or setup, and falls back to Playwright when there is none.

## Anatomy of a skill

```
skills/<name>/
  SKILL.md              required
  agents/openai.yaml    required: Codex picker metadata
  references/           optional: depth the agent loads on demand
  scripts/              optional: scripts the skill runs
```

- **Name:** 2 or 3 words, kebab-case, verb first (`prove-change`) or `x-to-y` (`jam-to-e2e`). No single words, no `verify-*`. The folder name equals the `name` in the frontmatter.
- **Description:** what it does, then when to use it, with the phrases a user would type ("Use when the user pastes a jam.dev link..."). The agent decides to load the skill from this line alone. 1024 characters at most.
- **Length:** keep `SKILL.md` under about 200 lines. Move detail to `references/` and link it from the step that needs it.
- **Style:** imperative, concrete, no filler. Show the command, not a description of the command. Say what to do when a step fails.
- **Feedback:** every `jam-*` skill ends with the same `## Send feedback to Jam` section. Copy it from an existing skill; CI fails if it differs.
- **Secrets:** never ask the agent to write a token to a file. Use environment variables.
- **Descriptions use the user's words, not ours.** Write what people type: "jam link", "bug recording", "screen recording", "repro video", "proof for the PR". Say what a Jam is the first time a description names it; the model may never have heard of Jam.
- **Jam terms, in prose only:** `Jam` is always capitalized and never a verb (record a Jam, share a Jam). The hierarchy is workspace > folder > Jam; a person with a seat is a member. Write `Sharepage`, `Recording Link`, `Jam MCP`, `Jam CLI`, and `Model Context Protocol (MCP)` on first mention in a page. You capture a screenshot and record a video.
- **Claims:** no "only", "first", "best" or guarantees. State what the skill does and its limits.

## Test a skill locally

```bash
node scripts/check.mjs                  # the same checks CI runs
npx skills add . --list                 # what skills.sh will see
claude --plugin-dir .                   # load the plugin in Claude Code
```

Then run the skill on a real task in at least one agent and say which one in the pull request. For a `jam-*` skill, include the Jam link it produced.

## Pull requests

- One skill per pull request.
- Add a line under **Unreleased** in [CHANGELOG.md](./CHANGELOG.md).
- A new skill also needs a card in [README.md](./README.md). CI fails without one.

## Releasing (maintainers)

The plugin has its own version, independent of the Jam MCP server version. It is the same in `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, `gemini-extension.json` and `server.json`; CI checks this.

1. Bump the version in all five files and move **Unreleased** in the changelog under the new version.
2. Merge to `master`.
3. Push a `v<version>` tag. `.github/workflows/publish-mcp.yml` publishes `server.json` to the MCP Registry as `dev.jam/jam`. A registry version can't be changed after it is published.

### ChatGPT directory package

The ChatGPT directory takes only `jam-fix`'s MCP path. The CLI install steps (in the other skills and in `jam-fix/references/`) download and run code, which fails ChatGPT's external-code review.

```bash
git archive --format=zip --prefix=jam/ --output=../jam-chatgpt-<version>.zip HEAD .codex-plugin mcp.json assets skills/jam-fix/SKILL.md skills/jam-fix/agents LICENSE
```

Update the existing app entry with this package. Do not create a new app through **Upload New**; that loses the saved identity and connection settings.

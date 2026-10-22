<p align="center">
  <a href="https://jam.dev">
    <img src="https://storage.googleapis.com/jam-assets/github-repo.png" alt="Jam">
  </a>
</p>

<h1 align="center">Jam skills</h1>

<p align="center">
  Skills that make coding agents show their work: find the bug, prove the fix, point at the problem.
</p>

<p align="center">
  <a href="https://skills.sh/jamdotdev/skills"><img src="https://skills.sh/b/jamdotdev/skills" alt="skills.sh"></a>
  <a href="https://github.com/jamdotdev/skills/actions/workflows/ci.yml"><img src="https://github.com/jamdotdev/skills/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT"></a>
</p>
<br/>

```bash
npx skills add jamdotdev/skills
```

Works with Claude Code, Cursor, Codex, GitHub Copilot, Gemini CLI, OpenCode and [every agent skills.sh supports](https://skills.sh). Each skill does one job and loads only when the task calls for it.

A Jam is a bug report recorded in the browser: the video or screenshot, console logs, network requests and user steps, on one link. These skills teach your agent to read one, and to make one.

| Skill | You say | You get |
| --- | --- | --- |
| [jam-fix](#jam-fix) | "fix this jam.dev link" | the root cause with evidence, and the fix when you ask |
| [jam-proof](#jam-proof) | "record a Jam showing it works" | a Jam of the change working, console and network attached |
| [jam-annotate](#jam-annotate) | "mark what's broken and file it" | a screenshot Jam with boxes, arrows and redactions |
| [jam-to-e2e](#jam-to-e2e) | "write a regression test for this Jam" | a failing end-to-end test in your own runner |

## Skills

### jam-fix

Paste a Jam link and get the root cause, or the fix. The agent reads the recording's console errors, failed requests, user steps, frames and transcript, then writes a diagnosis with the evidence for it.

**Use when:** "fix this jam.dev/c/…", "debug this Jam", "what went wrong here?", a jam.dev link in a bug ticket.

```bash
npx skills add jamdotdev/skills --skill jam-fix
```

### jam-proof

Record the change working and hand back a Jam link for the pull request. Headless Chrome by default, so nothing of your screen is filmed; the Jam carries the console and network next to the video.

**Use when:** "record a Jam showing the fix", "share a demo as a Jam", before and after a bug fix.

```bash
npx skills add jamdotdev/skills --skill jam-proof
```

### jam-annotate

Turn a screenshot into a Jam that points at the problem: boxes, arrows, notes, redactions and blurs, with the retina math done right.

**Use when:** "mark what's broken and file a Jam", "redact this and share it as a Jam", a screenshot that needs to become a Jam bug report.

```bash
npx skills add jamdotdev/skills --skill jam-annotate
```

### jam-to-e2e

Turn a Jam into repro steps and a failing end-to-end test in the project's own runner: Playwright, [tester-army/e2e](https://github.com/tester-army/e2e) or Cypress. Playwright when there is none. The test fails on the bug, so the fix has something to turn green.

**Use when:** "write a regression test for this Jam", "reproduce this bug", before fixing a bug from a Jam.

```bash
npx skills add jamdotdev/skills --skill jam-to-e2e
```

## Install as a plugin

The plugin installs every skill above and connects the [Jam Model Context Protocol (MCP) server](./docs/plugin.md), and it updates itself. Use the plugin or `npx skills add`, not both, or the agent sees every skill twice.

<details>
<summary><strong>Claude Code</strong></summary>

```shell
/plugin marketplace add jamdotdev/skills
/plugin install jam@jam-plugins
```

Skills load as `/jam:jam-fix`, `/jam:jam-proof`, and so on. To test a checkout, run `claude --plugin-dir /path/to/skills`.

</details>

<details>
<summary><strong>Cursor</strong></summary>

Open **Customize** in the sidebar, search for **Jam**, and click **Install**.

To test a checkout, link it into the local plugin folder and run **Developer: Reload Window**:

```bash
ln -s /path/to/skills ~/.cursor/plugins/local/jam
```

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add jamdotdev/skills
codex plugin add jam@jam-plugins
```

Start a new session, complete the OAuth prompt, and run `/mcp` to check the connection. To test a checkout, pass its path to `marketplace add`.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong></summary>

```bash
copilot plugin marketplace add jamdotdev/skills
copilot plugin install jam@jam-plugins
```

</details>

<details>
<summary><strong>Gemini CLI</strong></summary>

```bash
gemini extensions install https://github.com/jamdotdev/skills
```

Run `/mcp auth Jam` once to sign in. To test a checkout, run `gemini extensions link /path/to/skills`.

</details>

Sign-in, personal access tokens, what the MCP server can do, and permissions are in [docs/plugin.md](./docs/plugin.md).

## What the skills need

Every `jam-*` skill needs a free Jam account and either the Jam MCP server or the [Jam CLI](https://jam.dev/cli). The skill installs the CLI and signs in when MCP is not connected. In CI or a cloud agent, set `JAM_TOKEN` to a [personal access token](https://jam.dev/docs/personal-access-tokens).

Window and display capture in `jam-proof` need macOS or Linux (X11); its default, recording a headless browser, needs only Chrome. Everything else runs anywhere the CLI does.

## Contribute

Bug in a skill, or a skill you want? [Open an issue](https://github.com/jamdotdev/skills/issues/new/choose). Pull requests are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) first; it is short.

## Try Jam

[Try Jam for free](https://jam.dev?utm_source=github&utm_medium=readme&utm_campaign=skills): one-click bug reports with the video, console and network attached, readable by your agent.

---

<p align="center">
  <a href="https://jam.dev">jam.dev</a> ·
  <a href="https://jam.dev/mcp">Jam MCP</a> ·
  <a href="https://jam.dev/cli">Jam CLI</a> ·
  <a href="https://jam.dev/utilities">Dev Utils</a> ·
  <a href="./CHANGELOG.md">Changelog</a> ·
  <a href="./LICENSE">MIT</a>
</p>

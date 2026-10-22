<p align="center">
  <a href="https://jam.dev">
    <img src="https://storage.googleapis.com/jam-assets/github-repo.png" alt="Jam">
  </a>
</p>

<h1 align="center">Jam skills</h1>

<p align="center">
  Skills that make coding agents show their work: read a Jam, prove a change, point at the problem, test a flow.
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

Works with Claude Code, Cursor, Codex, GitHub Copilot, Gemini CLI, OpenCode and [every agent skills.sh supports](https://skills.sh). Add `--skill jam-fix` to install one skill.

A Jam is a recording of what happened on screen, with the console logs, network requests and user actions attached, on one link. A bug report, a demo, a walkthrough of a flow. These skills teach your agent to read one, and to make one.

## Skills

| Skill | You say | You get |
| --- | --- | --- |
| [jam-fix](#jam-fix) | "fix this jam.dev link" | the root cause with evidence, and the fix when you ask |
| [jam-proof](#jam-proof) | "record a Jam showing it works" | a Jam of the change working, console and network attached |
| [jam-annotate](#jam-annotate) | "mark what's broken and file it" | a screenshot Jam with boxes, arrows and redactions |
| [jam-to-e2e](#jam-to-e2e) | "write an e2e test for this Jam" | a test in your own runner: guards a flow, or fails on a bug until it is fixed |

### jam-fix

Reads the recording's console errors, failed requests, user steps, frames and transcript, then writes a diagnosis with the evidence for it. Changes code only when you ask.

### jam-proof

Records the change working and hands back a Jam link for the pull request. Headless Chrome by default: it records the page, not your screen.

### jam-annotate

Turns a screenshot into a Jam that points at the problem: boxes, arrows, notes, redactions and blurs, with the retina math done right.

### jam-to-e2e

Turns a Jam into steps and a test in the project's own runner and language, whatever it is, with first-class guidance for Playwright and [tester-army/e2e](https://github.com/tester-army/e2e). A Jam of a flow becomes a test that guards it. A Jam of a bug becomes a failing test, so the fix has something to turn green.

## Requirements

Every skill needs a free [Jam](https://jam.dev?utm_source=github&utm_medium=readme&utm_campaign=skills) account. `jam-fix` and `jam-to-e2e` read a Jam through the Jam MCP server or the [Jam CLI](https://jam.dev/cli); `jam-proof` and `jam-annotate` create Jams, which needs the CLI. Install the CLI from [jam.dev/cli](https://jam.dev/cli); a skill signs in when it needs it. In CI or a cloud agent, set `JAM_TOKEN` to a [personal access token](https://jam.dev/docs/personal-access-tokens). Window and display capture in `jam-proof` need macOS or Linux (X11); its default, recording a headless browser, needs only Chrome.

## Install as a plugin

The plugin installs every skill, connects the [Jam MCP server](./docs/plugin.md) and updates itself. Use the plugin or `npx skills add`, not both, or the agent sees every skill twice.

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

Sign-in, tokens, what the MCP server can do, and permissions: [docs/plugin.md](./docs/plugin.md).

## Contribute

Bug in a skill, or a skill you want? [Open an issue](https://github.com/jamdotdev/skills/issues/new/choose). Pull requests are welcome; [CONTRIBUTING.md](./CONTRIBUTING.md) is short.

---

<p align="center">
  <a href="https://jam.dev">jam.dev</a> ·
  <a href="https://jam.dev/mcp">Jam MCP</a> ·
  <a href="https://jam.dev/cli">Jam CLI</a> ·
  <a href="https://jam.dev/utilities">Dev Utils</a> ·
  <a href="./CHANGELOG.md">Changelog</a> ·
  <a href="./LICENSE">MIT</a>
</p>

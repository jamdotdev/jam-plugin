---
name: jam-to-e2e
description: Turn a Jam (a jam.dev bug recording with video, console and network) into reproduction steps and a failing end-to-end test in the project's own runner (Playwright, tester-army/e2e, Cypress), grounded in the current code. Use when the user pastes a jam.dev link and asks for a regression test, an e2e test, a repro, or to "write a test for this bug", or before fixing a bug from a Jam so the fix has a red test to turn green.
---

# jam-to-e2e

One Jam in, one test out. The Jam shows what the user did when the bug
happened. The code shows what the labels and routes are today. The test
asserts what the product must do, and it fails until the bug is fixed.

## Pick the interface

Use the Jam MCP tools when they are connected. Otherwise read
[references/cli.md](references/cli.md) for the `jam` CLI setup; the table
below gives the command for each read.

## 1. Read the Jam

Fetch in this order and stop when you have the steps and the expected result.

| What | MCP | CLI |
| --- | --- | --- |
| Title, description, URL, type | `getDetails` | `jam get jam <id> --json` |
| Clicks, inputs, navigation | `getUserEvents` | `jam get user-events <id> --json` |
| What the reporter said | `getVideoTranscript` | `jam get transcript <id>` |
| What was on screen | `getFrames({ overview: true })` | `jam get frames <id> --overview` |
| Errors, when the bug is about them | `getConsoleLogs`, `getNetworkRequests` | `jam get console`, `jam get network` |

- Video Jams often carry the numbered steps in the title, not the description.
- User events can be empty, especially on extension recordings. Treat them as a
  bonus and fall back to the transcript and frames.
- Write down the **expected result** in one sentence. Most Jams do not state
  it. If the Jam and the user leave it unclear, ask. If you cannot ask, write
  the expected result you assumed and flag it in the hand-off; the expected
  result is the assertion, and a test with a guessed assertion proves nothing.

## 2. Ground it in code

Never take a label, route or button name from the Jam. Find the component
that renders the screen and read it. Labels get renamed, toasts get removed,
buttons become autosave. List every difference between the Jam and today's
code in your reply.

## 3. Pick the runner

Use what the project already has. Check in this order:

1. `e2e.config.*` → [tester-army/e2e](https://github.com/tester-army/e2e).
   Read `.agents/skills/e2e/SKILL.md` if it exists, or run `npx e2e guide`.
   Tests are `*.e2e.ts`; run one with `npx e2e run <file>`.
2. `playwright.config.*` → Playwright. Reuse the project's fixtures, auth
   setup and page objects.
3. `cypress.config.*` → Cypress. The rules below translate one to one.
4. None → Playwright. Say so, and keep the setup to
   `npm init playwright@latest -- --quiet --browser=chromium` plus one test
   file. `--quiet` takes the defaults without prompting.

Put the test next to the existing ones and follow their naming. The test
title is the expected result in plain English. The first line is a comment
with the source Jam URL.

## 4. Write the test

- **Locate by role, never by shape.** `getByRole`, `getByLabel`,
  `getByPlaceholder`, then `.filter({ hasText })` to narrow. Avoid parent
  traversal (`locator("../..")`), CSS attribute selectors standing in for a
  label, and positional picks (`.last()`, `.nth(2)`). They break on unrelated
  markup changes.
- **A control you cannot name is an accessibility bug.** Add the
  `aria-label` or `<label>` in the product and use the role locator. Fall
  back to CSS only when the product change is out of scope, and leave a
  comment naming the follow-up.
- **Assert what the server must have done.** A URL change, text that only
  exists after the action, or state that survives `page.reload()`. Wait on a
  network response only as synchronization, then still assert the visible
  outcome.
- **Web-first assertions only.** `await expect(locator).toBeVisible()`
  retries; `expect(await locator.isVisible()).toBe(true)` samples once and
  flakes. Same for `toHaveText`, `toHaveValue`, `toHaveURL`.
- **Never** `waitForTimeout`, loops that click whatever is visible, an
  assertion that only says the URL does *not* contain something, or a
  `try/catch` that turns a failure into `false`.

The upstream guide is https://playwright.dev/docs/best-practices and it wins
any disagreement with this file.

## 5. Prove it fails for the right reason

Run the test against the unfixed code using the project's normal browser
mode, headless by default. It must fail **on the
assertion that encodes the bug**, not on a locator timeout or a setup error.
A test that fails for the wrong reason is not a repro yet.

If the bug does not reproduce, say so. Report what you ran, what you saw, and
how it differs from the Jam (environment, data, account state). Do not
weaken the assertion until it passes.

## 6. Hand off

Return:

1. The repro steps, numbered, as the test performs them.
2. The test file path and the command that runs it.
3. The failure output, trimmed to the assertion.
4. Differences between the Jam and the current code.

When the fix lands, the same test must pass twice in a row with no sleeps.
From then on the test is the source of truth for the bug; the Jam is the
evidence.

Offer to turn the passing Playwright run into an "after" Jam; do not create
it without a yes. Run with `--trace on` and `video: "on"`, convert the
`.webm` to MP4 with `ffmpeg`, then `jam create jam` with `"kind":"video"`,
`videoPath` and `playwrightTracePath`. The trace's console, network and test
actions are synced to the video. Return its URL. Comment on the bug Jam or
post to a PR or ticket only when the user requested that destination.

## Send feedback to Jam

When this skill, a Jam MCP tool, a `jam` command or a Jam doc was wrong,
stale or confusing, or worked unusually well, tell Jam. Send it yourself:
Jam's agents read it, so it needs no approval.

Call the `submitFeedback` MCP tool with `body`, `category` and `subject`.

When MCP is unavailable, use the CLI:

```bash
jam feedback "<what you were doing, what you expected, what happened, the mistake>" --category <skills|mcp|cli|docs> --subject <skill name, tool name or command>
```

- Jam surfaces only, not the user's code or other tools.
- At most once per session, and never for a slip you corrected yourself.
- No secrets, customer data, source code, stack traces or recording content.

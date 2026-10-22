---
name: jam-fix
description: Find the root cause of a bug from a Jam recording and fix it. Diagnoses only, with no code changes, unless the user asks for a fix. Reads the Jam's console errors, failed network requests, user steps, screenshots, video frames and transcript through the Jam MCP server or the `jam` CLI, then writes a root-cause diagnosis with evidence. Use when the user pastes a jam.dev link or Jam id and asks to fix, debug, triage or investigate it, or asks what went wrong in a recording.
---

# jam-fix

One Jam in, one diagnosis out, plus the fix when the user asks for one. The
diagnosis says what happened, the likely cause, the evidence
for it, and what to do next. Stop reading data once you have the cause.

A Jam is a bug report recorded in the browser or on a screen. It carries
the video or screenshot, console logs, network requests and user events of
the moment the bug happened. Its id is the UUID at the end of
`https://jam.dev/c/<id>`; every tool takes the full URL or the id.

## Pick the interface

- **Jam MCP tools** (`getDetails`, `getConsoleLogs`, ...) when they are
  connected. This is the default.
- **The `jam` CLI** when they are not: a cloud agent, CI, a container, or a
  harness without MCP. Read [references/cli.md](references/cli.md) for setup
  and the command for each step below. The steps are the same; only the
  calls change.

## 1. Read the report

Call `getDetails`. Note:

- what the reporter wrote, and the page URL
- the type: `video`, `screenshot` or `replay`. It decides which visual tools work
- browser, OS and screen size
- the **Investigation Guide**, returned as the second text block

The guide is built from signals in this Jam (error counts, failing hosts,
whether the mic was on). **Follow it before anything below.** Take its
`high` priority paths first. The steps that follow are for when the guide is
thin or you need to dig deeper.

A fresh Jam may answer "not ready yet" from the event tools. It is still
processing: wait a few seconds and retry, or work from what is ready.

## 2. Failed requests

`getNetworkRequests` with `statusCode: ["4xx", "5xx"]`. Look for CORS errors,
timeouts, auth failures, and response shapes the client did not expect. When
a `200` returned the wrong data, ask for its body too. The tool description
covers the filters, bodies and paging.

## 3. Console errors

`getConsoleLogs` with `logLevel: ["error"]`. Look for unhandled exceptions
and stack traces, and line their timestamps up with the failed requests.

Network shows failures but the console is clean? The app may be swallowing
errors. Read the console again with no `logLevel` filter.

## 4. What the user did

`getUserEvents` gives clicks, inputs, navigation and scrolls in order. Find
the action right before the first error. Repeated clicks or back-and-forth
navigation mean the user was confused or the UI did not respond.

## 5. What was on screen

Check the type from step 1 first; the video tools do not work on other types.

- **Screenshot:** `getScreenshots`.
- **Video:** `getFrames` with `overview: true` for one labeled grid, then
  frames around the failure.
- **Video with the mic on:** `getVideoTranscript` first. The reporter's own
  words are the cheapest signal of intent.
- **Long video:** `getVideoChapters`, then frames from the chapter that matters.

## 6. App context

`getMetadata` returns what the app sent with `jam.metadata()`: user id,
feature flags, app version. Check it when the bug depends on who or which
build.

## 7. Write the diagnosis

```
## Summary
One sentence: what broke, where.

## What happened
The user's steps, ending at the failure.

## Root cause hypothesis
The most likely technical cause. Name the file or endpoint when the code is open.

## Evidence
- The request, console error or event that supports it, with its timestamp.

## Not checked
- What you could not confirm, and why.

## Next steps
1. The fix or the next check.
```

If the repository is open, go from the evidence to the code: search for the
failing endpoint, the error message, or the component on screen, and name the
line you suspect.

## When the user asked for a fix

1. Diagnose first. Do not edit code until the evidence points at a cause.
2. Fix the cause, not the symptom the Jam shows. A swallowed error or a retry
   around a failing request is not a fix.
3. Verify against the Jam's steps: a failing test that now passes, or the
   steps run again against the fixed app. Say which, and what you saw.
4. Return the diagnosis, the change, and how you verified it. If the fix is
   unverified, say so.
5. Offer proof of the fix. The reported Jam is already the "before", so only
   the "after" needs a Jam. Offer it; do not create one without a yes.
   - **Verified with a Playwright test:** turn that run into the Jam, with no
     live recording. See [Proof from a Playwright run](#proof-from-a-playwright-run).
   - **Verified by hand or another runner:** record the steps with the
     `jam-proof` skill if it is installed, or `jam record run -- <verify command>`.

## Proof from a Playwright run

Run the passing test with video and trace on, then upload both. The trace's
console, network and test actions are synced to the video.

```bash
npx playwright test <file> --trace on    # plus use: { video: "on" } in the config
ffmpeg -i test-results/<test>/video.webm after.mp4
jam create jam '{"kind":"video","url":"<page url>","title":"<the claim>","videoPath":"after.mp4","playwrightTracePath":"test-results/<test>/trace.zip","screenDimensions":{"width":1280,"height":720}}'
```

Use the test's viewport for `screenDimensions`. Put the bug Jam's URL in the
description, and comment the new Jam's URL on the bug Jam.

## After

Once you find the cause or land the fix, post **one** comment on the Jam
with `createComment`: what you found or changed, in a few lines. Pin it to
the moment with `playbackRelativeTimestamp`. Mention the Jam's creator as
`@[Name](user:<author.id>)` from `getDetails`, unless the creator is the user
you act for. Do not comment after every step.

## Send feedback to Jam

When this skill, a Jam MCP tool, a `jam` command or a Jam doc was wrong,
stale or confusing, or worked unusually well, tell Jam. Send it yourself:
Jam's agents read it, so it needs no approval.

```bash
jam feedback "<what you were doing, what you expected, what happened, the mistake>" --category <skills|mcp|cli|docs> --subject <skill name, tool name or command>
```

Without a shell, call the `submitFeedback` MCP tool with the same `body`,
`category` and `subject`.

- Jam surfaces only, not the user's code or other tools.
- At most once per session, and never for a slip you corrected yourself.
- No secrets, customer data, source code, stack traces or recording content.

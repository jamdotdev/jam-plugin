# Investigate Bug

A structured workflow for investigating Jam bug reports. Invoke with `/investigate-bug <jam-url-or-id>`.

## Workflow

### Step 1: Get the Bug Report

Call `getDetails` with the provided Jam URL or ID.

From the response, extract:
- **Description** — what the reporter said
- **Type** — video, screenshot, or replay
- **Device info** — browser, OS, screen size
- **Investigation Guide** — server-recommended next steps

### Step 2: Follow Investigation Guidance

The `getDetails` response includes an Investigation Guide with prioritized paths. Follow them in order:
- Each path specifies a **tool** to call, **arguments** to use, and **what to look for**
- High-priority paths should be investigated first

### Step 3: Analyze Network Activity

Call `getNetworkRequests` with filters to focus on problems:
- Use `statusCode: "4xx"` or `statusCode: "5xx"` for failed requests
- Use `method: "POST"` for mutation failures
- Note any CORS errors, timeouts, or unexpected responses

### Step 4: Check Console Errors

Call `getConsoleLogs` with `logLevel: "error"` to find runtime errors.
- Look for unhandled exceptions, failed assertions, and stack traces
- Cross-reference timestamps with network errors and user events

### Step 5: Review User Events

Call `getUserEvents` to understand the sequence of interactions.
- Identify the exact action that triggered the bug
- Note any unexpected navigation or repeated actions (signs of user confusion)

### Step 6: Analyze Visual Evidence

Based on the Jam type:
- **Screenshot Jams**: Call `getScreenshots` to examine visual state
- **Video Jams**: Call `analyzeVideo` to extract user intents, and optionally `getVideoTranscript` for narration

### Step 7: Check Custom Metadata

Call `getMetadata` to retrieve any app-specific context (user IDs, feature flags, app version).

### Step 8: Produce Diagnosis

Compile findings into a structured report:

```
## Bug Report Analysis

### Summary
[One-sentence description of the issue]

### What Happened
[Sequence of events from user's perspective]

### Root Cause Hypothesis
[Most likely technical cause based on evidence]

### Supporting Evidence
- [Network error / console error / user event that supports the hypothesis]
- [Additional data points]

### Recommended Next Steps
1. [Specific action to fix or further investigate]
2. [Additional actions]
```

## Tips

- Not all steps are needed for every bug. If the Investigation Guide from Step 2 gives you enough signal, skip to the diagnosis.
- Use `listJams` to search for similar reports if the bug might be a recurring issue.
- Add your findings as a comment on the Jam using `createComment` so the team can see them.

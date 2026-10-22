---
name: jam-annotate
description: Turn a screenshot into a Jam (a shareable jam.dev bug report) that points at the problem, with boxes, arrows, notes, redactions and blurs drawn by `jam create jam`. Use when an agent has a screenshot (Playwright, agent-browser, CDP, a file) and the user wants it annotated, marked up, redacted, or filed as a bug with what is wrong and where.
---

# jam-annotate

The deliverable is a screenshot Jam a reviewer reads in five seconds: a box
on the broken thing, a number that matches a line in the description, secrets
redacted. `jam create jam` draws the marks into the image before upload;
`jam agent-context` prints the full payload schema.

## Set up the CLI

```bash
command -v jam >/dev/null || curl -fsSL https://native.jam.dev/install | bash
export PATH="$HOME/.local/bin:$PATH"
jam auth status --json || jam auth login
```

Exit code 3 means not signed in. With no browser (CI, a cloud agent), ask the
user to set `JAM_TOKEN` to a personal access token from
https://jam.dev/s/settings/mcp as a secret. Never write a token to a file.

## Pick the mark

Five kinds. Pick by what the mark says:

| Kind     | Says                                  | Numbered |
| -------- | ------------------------------------- | -------- |
| `box`    | this element is the subject           | yes      |
| `arrow`  | from here, look there (direction)     | yes      |
| `text`   | a fact with no element to point at    | no       |
| `redact` | this region must not leave the screen | no       |
| `blur`   | this region is not the point          | no       |

## Get coordinates right

Coordinates are pixels of the image file, origin top-left. They are not CSS
pixels. A retina capture is 2x, so a button at CSS `(120, 340)` sits at image
`(240, 680)`.

1. Screenshot the viewport, not the full page, so element bounds and the image
   share an origin.
2. Read the image size (the PNG header, or your driver's screenshot metadata)
   and divide by the viewport width. That ratio is the scale.
3. Take element bounds from the driver (Playwright `locator.boundingBox()`,
   CDP `DOM.getBoxModel`) and multiply every number by the scale.
4. Pad a box 6 to 10 CSS pixels beyond the element so the outline does not
   sit on the element's own border.

The CLI refuses a mark that falls outside the image and names the index. A
refusal almost always means the scale was skipped.

## Compose

- One mark per fact you will write. Three to five marks. More is a video.
- Box the element that is wrong. Arrow only when direction is the point:
  where a click should have led, which control changed which value. Put the
  tail in empty space and the head on the edge of the target, not its center.
- Text is for a fact with no element: "nothing happened after click". Place it
  in empty space near the area it describes.
- Redact first, generously: emails, names, avatars, tokens, internal URLs,
  customer identifiers. Redact the whole row, not the word.
- Blur is for clutter, not secrets: a sidebar, a list of unrelated rows, a
  face in a demo. It softens the region so the eye skips it. Large text stays
  legible through a blur, so anything that must not leave the screen is a
  `redact`.
- Order is the story. Numbers follow payload order, so list the marks in the
  order the description tells them.
- Labels are five words or fewer, Latin text, no trailing period. The sentence
  goes in the description.
- Color carries meaning, one color per meaning. Default `lime` is "look here".
  Use `strawberry` for the broken thing when there is more than one mark.
  Other swatches: `grape`, `blueberry`, `mint`, `lemon`, `black`.
- Marks are drawn on the primary screenshot only. A `secondaryScreenshotPath`
  uploads as-is — a redaction on the primary does not cover it.

## Payload

The capture below is 2x, so a 1440×900 viewport is a 2880×1800 image and
every coordinate is doubled.

```
jam create jam '{
  "url": "https://app.example.com/checkout",
  "title": "Pay button does nothing on retry",
  "description": "1. The Pay button, clicked twice.\n2. Where the confirmation should have appeared.\nCard number redacted.",
  "screenshotPath": "./checkout.png",
  "screenDimensions": { "width": 1440, "height": 900 },
  "annotations": [
    { "type": "redact", "x": 1200, "y": 640, "width": 560, "height": 48 },
    { "type": "blur", "x": 0, "y": 0, "width": 480, "height": 1800 },
    { "type": "box", "x": 1180, "y": 1120, "width": 320, "height": 88, "label": "Pay, clicked twice", "color": "strawberry" },
    { "type": "arrow", "from": { "x": 600, "y": 1400 }, "to": { "x": 1440, "y": 980 }, "label": "no confirmation here" }
  ]
}'
```

Write the description so its numbers are the badge numbers: "1." is the first
box or arrow in the payload, "2." the second. Redactions, blurs and text
notes never take a number.

## After

1. Read the receipt: `id`, `url`, `kind`. If the command failed, say so and
   fix the payload. Never hand over a link you did not get.
2. Return the link with the claim it supports. Post it on the PR or ticket
   when there is one.

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

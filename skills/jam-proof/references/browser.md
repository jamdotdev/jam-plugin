# jam-proof: browser details

Read this from `SKILL.md` when the video needs a readable cursor, a size other than 1920x1080, or a visible Chrome window.

## Readable cursor video

What makes a headless video readable is agent-browser's cursor overlay, which
needs agent-browser 0.38 or later:

- `--cursor` draws the pointer into the page as an inert overlay, so the
  screencast shows where each click landed and the hover state it triggered.
  Without it the video cuts from one state to the next and a viewer cannot
  tell what was pressed. The overlay is hidden from accessibility snapshots
  and removed on stop. Its own `/tmp/pointer.webm` is a side effect of
  turning the overlay on — the Jam is the deliverable, so throw the file
  away.
- `--input-mode human` moves the pointer along a curve at human speed, but
  only for `mouse move <x> <y>`. `hover`/`click` on a selector snap the
  pointer to the element in a single frame, so a video built from them cuts
  from place to place with nothing to follow. Drive a cursor proof with
  `mouse move` to the target, then `mouse down` and `mouse up` to click it.
  Read the target's centre first, for example
  `agent-browser eval '(() => { const r = document.querySelector("<sel>").getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()'`.
- The overlay stops following the pointer after a navigation in the middle of
  a recording: it stays frozen wherever the last click left it, on every page
  that follows. Keep a cursor proof on one page, and set the page up before
  `record start`. When the proof has to cross pages, record it without the
  overlay and say in the description what was clicked.
- **Record at 1920x1080 unless the proof calls for another size.** It is the
  size a reader expects and the size anything posted elsewhere wants, and a
  headless page has no window to constrain it. Set it with `agent-browser set
  viewport 1920 1080` **before** recording and reload, because the setting
  does not apply to the page already open. Use another size only when the
  claim is about that size — a mobile layout, a customer's reported window —
  and say which in the description. The frame rate is not yours to pick: the
  screencast is 30 fps, and agent-browser's own `--fps` only governs the
  `/tmp/pointer.webm` you discard.

## Visible Chrome (rung 2)

When the proof needs the address bar, a Chrome dialog or the real OS cursor,
that is rung 2: add `--video-source screen` and a window selector (`--pid` of
the Chrome you launched), and run Chrome visible. Launch it yourself with a
debug port and its own data dir, since Chromium 136 and later refuses
`--remote-debugging-port` on the default profile:

```
<chrome binary> --remote-debugging-port=9222 --user-data-dir=/tmp/jam-chrome about:blank &
jam record start --pid <chrome pid> --cdp 9222 --title "<the claim>" --json
```

The binary is `"/Applications/Google Chrome.app/Contents/MacOS/Google
Chrome"` on macOS and `google-chrome` on Linux. A driver that moves the real
mouse instead of speaking CDP, a computer-use agent for one, leaves no
actions, but console and network still land from the tap.

# Song readability — legibility at night and at a distance

## Problem and goal

Scouts read song texts around a bonfire, usually after dark, holding a phone at arm's length (or further) while playing guitar. The main reported problem is **reading the text at all** in those conditions — not chord timing, not verse navigation.

Goal: find the smallest set of typographic changes that makes lyrics noticeably easier to read at night and at a distance, without harming offline behaviour, battery, or the simplicity of the codebase.

Out of scope for this document: chord placement, chord parsing, JSON curation, justification of chord columns, new settings toggles. Chords are explicitly left as they are.

## State before this change

| Aspect | Before | Where |
| --- | --- | --- |
| Font | Self-hosted Roboto variable 300–500, `font-display: swap`, latin + latin-ext subsets | [`src/styles.scss`](../src/styles.scss) |
| Weight | Not set → renders at 400; nothing prevents 300 | `body` in `src/styles.scss` |
| Size | Default 14 px, user slider 12–20 px; applied as inline styles | [`settings.service.ts`](../src/app/service/settings.service.ts), [`song-view.component.html`](../src/app/song/song-view/song-view.component.html) |
| Line height | No project-level declaration; inherited from Angular Material typography | prebuilt pink-bluegrey theme |
| Letter spacing | No declaration | — |
| Text color | `white` on `#303030` background (~13:1, well above AA); forced white due to [angular/components#26153](https://github.com/angular/components/issues/26153) | [`song-view.component.scss`](../src/app/song/song-view/song-view.component.scss), [`app.component.scss`](../src/app/app.component.scss) |
| Stanza gap | `margin-top: .5rem` plus inline `margin-bottom` equal to font size | `song-view.component.{html,scss}` |
| Offline | Fonts are emitted to `/media/*.woff2` and prefetched by the service worker | [`ngsw-config.json`](../ngsw-config.json) |

Two important properties to preserve: self-hosting (works offline) and `font-display: swap` (text stays visible while a font loads).

## What actually drives legibility here

1. **Stroke weight.** Thin strokes at 12–14 px on a dark background bloom and shimmer. Avoid weights below 400; 500 may help at small sizes but should be compared, not assumed.
2. **x-height and apertures.** A larger x-height and open letterforms (e.g. `a`, `e`, `o`) put more ink on screen at a given point size. Roboto is competent but not exceptional; Atkinson Hyperlegible, Source Sans 3, and Inter are candidates worth comparing. Any new face costs a self-hosted subset (~20–30 KB) and must be added to the offline prefetch.
3. **Point size.** 14 px is small for arm's-length reading. 16 px is a more realistic base for a phone held away from the eyes.
4. **Line height and tracking.** Roughly `1.5–1.6` line height gives the eye a reliable return path across lines; a small positive tracking (~`0.01em`) reduces crowding. Both are currently left to defaults and can be set without any user-visible setting.
5. **Glare, not just contrast.** Pure white on a dark background maximises contrast but can halate at night. An off-white such as `#E8EAED` is still ~11:1 (comfortably AA) and calmer. This must be tested against the Material bug that forced `white` in the first place.
6. **Background.** Keep `#303030`; never pure black — the moderate dark grey already reduces halation.

## Comparison plan

Render one long, representative song from `src/assets/songs_structured.json` in four variants and look at them on a real phone, in the dark, at arm's length:

| Variant | Definition |
| --- | --- |
| A — baseline | Previous rendering, before this change |
| B — spacing only | Roboto 400, size 16, `line-height: 1.55`, `letter-spacing: .01em`, off-white text |
| C — weight | Variant B with Roboto 500 |
| D — alternate face | Variant B with Atkinson Hyperlegible (or Inter / Source Sans 3), 400 |

Method: a throwaway static page using the same CSS declarations as the app (no production changes yet); screenshots at fixed viewport; AXE/WCAG AA check; measure added font bytes and confirm the service-worker prefetch still covers them.

That page now exists: [`readability-comparison.html`](readability-comparison.html). It embeds the "Watra" song and the app's markup, includes the candidate font self-hosted in `readability-fonts/` (~26 KB, SIL OFL 1.1), and needs no build step:

```bash
# from the repository root
python3 -m http.server 8123
# open http://localhost:8123/docs/readability-comparison.html
```

Serve from the repository root, not from `docs/` — the page loads Roboto from `src/assets/fonts/` via a relative path.

Serving over HTTP is recommended — browsers may refuse to load local font files from a `file://` page. The candidate font has latin and latin-ext subsets, matching the app's approach; if the page reports that it did not load, variant D is just a fallback.

Decision criteria, in order: legibility at distance in the dark → no large increase in scrolling → AA contrast → offline correctness → smallest code and asset footprint.

## Decision — implemented

Variant **B** won on a real phone in the dark. Variant C (weight 500) was not preferred as a default, so heavier text became an opt-in setting instead.

Shipped:

- Roboto stays; no new font asset. The self-hosted variable file already contains the full weight axis, so `@font-face` in `src/styles.scss` was widened from `300 500` to `100 900` to get a real 700 — no synthesized bold, no extra bytes.
- `line-height: 1.55`, `letter-spacing: .01em`, off-white `#E8EAED` on `.line`; text remains left-aligned.
- Default font size 14 → 16 px. Slider bounds stay 12–20.
- Stanza gap is now `1em`, so it scales with the size slider, instead of the previous mixed `rem` + inline `px`.
- New `boldText` setting (default off), labelled plainly as **"Pogrubiony tekst"** — no font-weight numbers in the UI. It applies 700 to lyric lines only; chord spans stay at 400.
- Chord placement, justification, and the song JSON are untouched.

Existing users have a persisted `fontSize` in `localStorage` (`spiewnigator.settings.v1`) that overrides the new default, so the size change mainly benefits new installs. The new `boldText` key is merged with the default `false`, so no migration is needed.

## Deferred

- Variant D (alternate font) was not adopted; it would add ~26 KB and a second family for no clear win.
- Widening the slider beyond 12–20 was deferred — one change at a time.

## References

- [`src/app/song/song-view/song-view.component.html`](../src/app/song/song-view/song-view.component.html) — song template
- [`src/app/song/song-view/song-view.component.scss`](../src/app/song/song-view/song-view.component.scss) — song styles
- [`src/styles.scss`](../src/styles.scss) — fonts and global styles
- [`src/app/service/settings.service.ts`](../src/app/service/settings.service.ts) — settings defaults and persistence
- [`e2e/song-view.spec.ts`](../e2e/song-view.spec.ts), [`e2e/settings.spec.ts`](../e2e/settings.spec.ts) — rendering/settings tests
- [`ngsw-config.json`](../ngsw-config.json) — offline prefetch

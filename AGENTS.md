# Śpiewnigator — project guide

This is an Angular application with TypeScript.

## Mission and target user

Śpiewnigator delivers scout song texts to **Polish scouts sitting around a bonfire in the forest, singing with a guitar**. There is typically no mobile signal, and phones have to last through the evening. The app replaces the old printed song binder.

## Guiding principles

* **Offline first.** Songs are static assets cached by the service worker, so the whole catalog works without a network connection.
* **Free and zero-maintenance.** PWA + GitHub Pages hosting: no backend, no app-store fees, no server to maintain.
* **Simplicity.** Single maintainer. Keep functions simple and avoid extra complexity — a small, boring codebase is a feature.
* **Battery life is a secondary principle.** The practical rule today is to *avoid battery-draining features* rather than to optimize for battery directly; direct optimizations may be added in the future. The one informed choice so far is the **dark theme**, motivated both by battery use and by the fact that songs are usually sung at night, after dark. Existing choices already align: static content, prefetch-once caching, OnPush change detection, and no heavy animations or wake locks.
* **Locale.** Repository documentation is in English. The app UI and all song content are Polish only.

## Key features

* **Offline-first PWA**: Uses built-in PWA features (service worker caching) to deliver content offline. Songs are defined as static assets cached by the PWA — no backend required.
* **Zero maintenance cost**: No backend service to maintain. App is hosted on GitHub Pages.
* **Customizable settings**: Font size, bold text, chord visibility, and fuzzy search toggle — all persisted to browser localStorage.
* **Search functionality**: Standard and fuzzy search (optional) for finding songs quickly.

## Architecture

* Static song content stored as JSON in `src/assets/`
* Service worker caches assets for offline access; the songs JSON is prefetched, and fonts are self-hosted so the app renders correctly offline
* Settings persisted client-side (no server sync needed)

## Text rendering

Songs are read at night at arm's length, so lyrics use a 16 px default, `line-height: 1.55`, `letter-spacing: .01em`, and off-white `#E8EAED` on the dark background. Stanza gaps are in `em` so they scale with the size slider.

The "Pogrubiony tekst" (`boldText`) setting applies Roboto 700 to lyrics only; chords stay at 400. Self-hosted Roboto is a variable font, so `src/styles.scss` declares `font-weight: 100 900` to get a real 700 without extra assets. Chord placement and the song JSON are intentionally left alone.

## Songs

Songs are stored in file `src/assets/songs_structured.json`.

### Origin and known issues

The catalog originated as a Word file that was printed and used as a binder. It was later converted to JSON by hand-written scripts: chords were split from lyrics with a heuristic. The original Word file and the parsing script are lost to history and are not part of this repository.

The JSON is therefore **not hand-curated source text**. Some songs still contain artifacts of the automated parsing — misplaced chords, formatting oddities, or missing lines. Treat such songs as known-imperfect and fix them incrementally as they are noticed.

### Format

* File: `songs_structured.json` — JSON array of song objects.
* Song object fields:
    * title: string (required)
    * content: array of stanzas; each stanza is an array of lines (strings)
    * author: optional string (metadata)
* Line format:
    * Lyrics and chord annotations are kept in the same string.
    * Chords are commonly appended after a tab (`\t`) or appear inline (e.g. "Line text\tC G" or "C G a").
    * Some lines are pure metadata/chord-only (e.g. "Capo II próg", chord charts, "Ref:", etc.).
* Notes: The structure makes it easy to render stanzas/lines and to parse chord tokens for display or toggling chord visibility in the app.

Default language for songs is Polish.

### Adding and fixing songs

* Add new songs at the **end** of the array.
* The app and all songs are Polish only.
* Always adjust chord formatting so that lyrics and chords are separated with a tab (`\t`) — text first, chords after.
* Keep metadata and chord-only lines (`Capo ...`, `Ref:`, chord charts); they are meaningful to the singers.
* When fixing a song, compare it with the original source if one is available, and restore missing text rather than silently dropping lines.

## Coding conventions

The codebase is a hybrid: components are standalone, while `SongModule` and the routing modules are still NgModules. Do not rewrite modules just to satisfy a generic "standalone only" rule.

* Strict TypeScript; avoid `any`, use `unknown` where a type is genuinely uncertain, and prefer type inference when the type is obvious.
* Use `inject()` for dependency injection and `providedIn: 'root'` for singleton services.
* Use `ChangeDetectionStrategy.OnPush` on components.
* Use signals for local state and `computed()` for derived state; use `set()`/`update()` rather than mutating a signal.
* Use `input()` and `output()` functions instead of decorators; put host bindings in the `host` object instead of `@HostBinding`/`@HostListener`.
* Use native control flow (`@if`, `@for`, `@switch`); no arrow functions in templates; handle observables with the async pipe.
* Use `class`/`style` bindings instead of `ngClass`/`ngStyle`.
* Keep components small and focused on a single responsibility; prefer reactive forms.
* Accessibility: meet WCAG AA and pass AXE checks (focus management, color contrast, ARIA attributes).

## Browser (E2E) tests

Playwright specs live in `e2e/`, outside `src/`, so neither the app build nor Vitest picks them up. They have a dedicated `tsconfig.e2e.json`; type-check with `npx tsc --noEmit -p tsconfig.e2e.json`. Run them with `npm run test:e2e` after `npx playwright install chromium`.

* Prefer `getByRole` / `getByLabel` locators; use CSS only for structural containers without an accessible role.
* Use Playwright's auto-retrying assertions — never `waitForTimeout`. The song search debounces for 200 ms.
* Derive expectations from `src/assets/songs_structured.json` instead of hard-coding the catalog size.
* Keep offline/service-worker scenarios separate from the default suite; the service worker is enabled only in production builds. The `@pwa`-tagged spec uses `playwright.pwa.config.ts` and runs via `npm run test:e2e:pwa`, which needs port 8080 free (stop any manual `npm run http-server` first).

## Agent browser

For interactive, agent-driven browser work, Playwright MCP is registered project-wide in `opencode.json` with guardrails in `playwright-mcp.config.json`. See [docs/agent-browser.md](docs/agent-browser.md); do not enable `browser_evaluate` or `browser_run_code_unsafe` without reviewing the risk.

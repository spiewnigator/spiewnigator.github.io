# Śpiewnigator

Śpiewnigator is a simple Angular Progressive Web App (PWA) with a small catalog of songs for Polish scouts.

## About

Picture scouts sitting in the middle of a forest around a bonfire, singing songs with a guitar. There is no reliable signal and phones need to last all evening, so the app is built to work fully offline, cost nothing to run, and stay simple. Songs ship as static assets cached by a service worker; there is no backend. Hosting is GitHub Pages, and installing the PWA avoids app-store fees.

The app and the song catalog are in Polish. Repository documentation is in English; see [AGENTS.md](AGENTS.md) for the mission, guiding principles, architecture, and song-maintenance rules.

## Setup

Prerequisites: Node.js and npm installed.

Install dependencies:

```bash
# reproducible install (recommended)
npm ci
```

Start development server:

```bash
npm run start
```

Run tests and lint:

```bash
npm run test      # runs unit tests with coverage
npm run test-ci   # headless CI run
npm run eslint    # static linting
```

Production build:

```bash
npm run build
```

Serve the production build locally:

```bash
npm run http-server
```

### Updating packages

1. update Angular core and @angular-eslint
2. update Angular Material

Example:

```bash
npx ng update @angular/core@22 @angular/cli@22 @angular-eslint/schematics@22
npx ng update @angular/material@22
```

### Notes on testing

Unit tests run with Vitest in a Node/jsdom environment — no browser installation required. The `test` script also generates a coverage report.

End-to-end tests run in a real Chromium via Playwright against `npm run start` (`http://127.0.0.1:4200`). Install the browser once, then run:

```bash
npx playwright install chromium
npm run test:e2e        # headless
npm run test:e2e:ui     # interactive UI mode
npm run test:e2e:report # open the last HTML report
```

The service worker is enabled only in production builds, so offline behavior is not covered by this suite.

## Roadmap

Remaining work / ideas:

- Persist scroll-back position in the song list (testing).

## Guides

Helpful external guides:

- Service worker primer: https://developers.google.com/web/fundamentals/primers/service-workers
- PWA with Angular: https://web.dev/creating-pwa-with-angular-cli/
- Storage for the web: https://web.dev/storage-for-the-web/
- Maskable/adaptive icons: https://web.dev/maskable-icon/
- App shell model: https://developers.google.com/web/fundamentals/architecture/app-shell
- PWA guide:
    - part 1: https://www.monterail.com/blog/pwa-working-offline
    - part 2: https://www.monterail.com/blog/pwa-offline-dynamic-data

### Asset tools

* [Android asset studio](http://romannurik.github.io/AndroidAssetStudio/index.html)
* [pwa-asset-generator](https://github.com/onderceylan/pwa-asset-generator) (use with `npx`)
* [Maskable.app](https://maskable.app/editor) - for generating maskable icons

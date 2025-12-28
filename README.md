# SpiewnigatorAngular

Spiewnigator is a simple Angular Progressive Web App (PWA) that provides a small catalog of songs for Polish scouts. Main features:

- Offline capability via PWA service workers.
- Easy distribution through GitHub Pages and browser installs.

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

Server build files

```bash
npm run http-server
```

### Updating packages

1. update Angular core and @angular-eslint
2. update Angular Material

Example:

```bash
npx ng update @angular/core@21 @angular/cli@21 @angular-eslint/schematics@21
npx ng update @angular/material@21
```

### Notes on testing

Testing requires Chrome. The `test-ci` script runs tests headless using ChromeHeadless.

## Roadmap & guides

Implemented / done:

1. Parse song content (chords)
2. Basic song display styling
3. Basic application styling
4. PWA support
5. Deploy to GitHub Pages
6. Icon / PWA styling updates
7. Better GitHub Pages fallback (404)
9. Sorting songs / search improvements
10. Font size control
11. Toggle chords visibility
12. Convert songs file encoding
14. Service layer song cache

Planned / in progress:

8. Add sticky navbar to stabilize scrolling
13. Add app shell
15. Scroll-back position persistence in list (testing)

Helpful external guides:

- Service worker primer: https://developers.google.com/web/fundamentals/primers/service-workers
- PWA with Angular: https://web.dev/creating-pwa-with-angular-cli/
- Storage for the web: https://web.dev/storage-for-the-web/
- Maskable/adaptive icons: https://web.dev/maskable-icon/
- App shell model: https://developers.google.com/web/fundamentals/architecture/app-shell
- PWA guide:
    - part 1: https://www.monterail.com/blog/pwa-working-offline
    - part 2: https://www.monterail.com/blog/pwa-offline-dynamic-data

### Assest tools

* [Android asset studio](http://romannurik.github.io/AndroidAssetStudio/index.html)
* [pwa-asset-generator](https://github.com/onderceylan/pwa-asset-generator) (use with `npx`)
* [Maskable.app](https://maskable.app/editor) - for generating maskable icons

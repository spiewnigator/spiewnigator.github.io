# SpiewnigatorAngular

## Using

1. Make sure `node`, `npm` are installed.
2. Run `npm ci` in project directory.
3. Run `ng serve` to serve the application locally.

For more usefull scripts check out the `package.json` file - run them with `npm run <script>`.

**Note:** testing requires Chrome.

**Note:** `http-server` dependency must be installed separately.


## Roadmap

Simple changelog of implemented and awaiting features.

1. Parse song content (chords) (done)
2. Basic cong display styling (done)
3. Basic application styling (done)
4. PWA (done)
5. Deploy to github pages (done)
6. Prepare new icon set and PWA styling (theme color) (done)
7. Better github pages deployment (404.html) (done)
8. Add sticky navbar on top to fix the scrolling
9. Sort the songs, update the search - song text search (done)
10. Allow font size change (done)
11. Allow hiding chords (done)
12. Convert songs file encoding (done)
13. Add app shell
14. Service layer song cache (done)
15. Scroll back to place in list (testing)

## Misc

### Guides

* [Service worker introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
* [PWA with angular](https://web.dev/creating-pwa-with-angular-cli/)
* [Storage for the web](https://web.dev/storage-for-the-web/)
* [Adaptive (maskable) icons](https://web.dev/maskable-icon/)
* [App shell model](https://developers.google.com/web/fundamentals/architecture/app-shell)
* PWA guide: [part 1](https://www.monterail.com/blog/pwa-working-offline) and [part 2](https://www.monterail.com/blog/pwa-offline-dynamic-data)

### Assest tools

* [Android asset studio](http://romannurik.github.io/AndroidAssetStudio/index.html)
* [pwa-asset-generator](https://github.com/onderceylan/pwa-asset-generator) (use with `npx`)
* [Maskable.app](https://maskable.app/editor) - for generating maskable icons

### Updating packages

1. update Angular core and @angular-eslint
2. update Angular Material

Example:

```bash
npx ng update @angular/core@19 @angular/cli@19 @angular-eslint/schematics@19
npx ng update @angular/material@19
```
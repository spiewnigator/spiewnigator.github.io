This is an Angular application with TypeScript.

Mission: Handy tool for scouts to use for delivering song texts in offline mode.

Key features:

* **Offline-first PWA**: Uses built-in PWA features (service worker caching) to deliver content offline. Songs are defined as static assets cached by the PWA — no backend required.
* **Zero maintenance cost**: No backend service to maintain. App is hosted on GitHub Pages.
* **Customizable settings**: Font size, chord visibility, and fuzzy search toggle — all persisted to browser localStorage.
* **Search functionality**: Standard and fuzzy search (optional) for finding songs quickly.

Architecture:
* Static song content stored as JSON in `/src/assets/`
* Service worker caches assets for offline access
* Settings persisted client-side (no server sync needed)


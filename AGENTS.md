This is an Angular application with TypeScript.

Mission: Handy tool for scouts to use for delivering song texts in offline mode.

Key features:

* **Offline-first PWA**: Uses built-in PWA features (service worker caching) to deliver content offline. Songs are defined as static assets cached by the PWA — no backend required.
* **Zero maintenance cost**: No backend service to maintain. App is hosted on GitHub Pages.
* **Customizable settings**: Font size, chord visibility, and fuzzy search toggle — all persisted to browser localStorage.
* **Search functionality**: Standard and fuzzy search (optional) for finding songs quickly.

Architecture:
* Static song content stored as JSON in `src/assets/`
* Service worker caches assets for offline access
* Settings persisted client-side (no server sync needed)

## Songs list

Songs are stored in file `src/assets/songs_structured.json`.

Format is defined as follows:

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

Default language for songs is polish.

New sons should be added at the end of the array. When adding new song always adjust chord formatting, always use `\t`.

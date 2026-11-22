# Agent browser (Playwright MCP)

This project exposes a live Chromium browser to coding agents through the [Playwright MCP server](https://github.com/microsoft/playwright-mcp). An agent can open the app, read an accessibility snapshot, click and type, take screenshots, and inspect console messages — without a vision model or manual browser interaction.

## Setup

1. Install dependencies and the browser once:

   ```bash
   npm ci
   npx playwright install chromium
   ```

2. Start the app in a separate terminal (the MCP server does **not** start it):

   ```bash
   npm run start
   ```

   The app is then at `http://127.0.0.1:4200`.

3. The MCP server is registered in the project-local [`opencode.json`](../opencode.json). OpenCode starts it automatically and watches the config, so no restart is needed. Check it with:

   ```bash
   opencode mcp list
   ```

   Expected: `playwright  connected`. If it is missing, run `/reload` in OpenCode. Use `/mcps` to inspect or reconnect it.

The `agent:browser` npm script runs the same server with the same [`playwright-mcp.config.json`](../playwright-mcp.config.json). With no `--port`, Playwright MCP communicates over stdio: the command produces no interactive output and waits for an MCP client. It is meant to be launched by a client such as OpenCode, not typed into a terminal. For a non-blocking sanity check of the installation, use:

```bash
npx --no-install playwright-mcp --help
```

## Tools

Tools are exposed as `tools.playwright.<name>` in OpenCode's Code Mode. The useful ones for this app:

| Tool | Use |
| --- | --- |
| `browser_navigate` | Open a URL, e.g. `http://127.0.0.1:4200`. |
| `browser_snapshot` | Accessibility tree of the page. Prefer this over screenshots for reading and targeting elements. |
| `browser_find` | Search the snapshot for text; cheaper than pulling a whole snapshot. |
| `browser_click` | Click an element by its snapshot reference. |
| `browser_type` | Type into an input by its snapshot reference. |
| `browser_take_screenshot` | Save a screenshot. Omit `filename` to get an auto-named file in the output dir. |
| `browser_console_messages` | Read console output; accepts a `level` argument. |
| `browser_network_requests` | Inspect requests, e.g. the songs JSON fetch. |
| `browser_close` | Close the browser and all tabs. |

Note: in `@playwright/mcp@0.0.86`, `browser_take_screenshot` requires the `scale` argument (for example `"css"`) even though it is documented as optional.

## Guardrails

- **Headless.** The browser launches headless (`launchOptions.headless`), so no display is needed.
- **Origin allowlist.** `network.allowedOrigins` is limited to `http://127.0.0.1:4200`. It is a hint that keeps normal navigation on the local app, **not** an enforced boundary: Playwright MCP documents that it is not a security boundary and does not affect redirects. The permissions below restrict specific tools; they do not confine navigation. Enforce confinement at the network level if it matters.
- **No arbitrary JavaScript.** `browser_evaluate` and `browser_run_code_unsafe` are denied through `permissions` in `opencode.json`. The latter is documented as RCE-equivalent. Do not remove those denies to work around a problem without reviewing the risk.
- **Minimal surface.** Only `core` capabilities are enabled and WebMCP is off, so no page can add extra tools and no vision/PDF/devtools tools are loaded.
- **No file escape.** Unrestricted file access is left disabled; the browser cannot read files outside the workspace or navigate to `file://` URLs.
- **Persistent session.** The profile persists across tool calls, so state (including localStorage settings) survives between calls. A persistent profile can only be used by one browser instance per workspace at a time — do not start a second client against the same workspace.
- **Artifacts.** Auto-named screenshots go to `.agent-browser-output/`, which is gitignored. Explicit `filename` values resolve against the workspace root and bypass this directory.

## Example workflow

1. `browser_navigate` to `http://127.0.0.1:4200`.
2. `browser_find` for "Śpiewnigator" and for a known song title — confirms the toolbar and song list are present without pulling the whole 276-item accessibility tree. Use `browser_snapshot` with `depth` or `target` only when a bounded subtree is needed.
3. Click the `Settings` button, then `browser_snapshot` to verify the settings page.
4. Navigate back to `/`, `browser_type` a song title into the search box, then `browser_find` the title to verify the filtered list.
5. `browser_take_screenshot` with `scale: "css"` and no filename; confirm the file appears under `.agent-browser-output/`.
6. `browser_console_messages` with level `error` — expect no application errors.
7. `browser_close` when done.

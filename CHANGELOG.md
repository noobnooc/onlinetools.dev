# Changelog

All notable changes to onlinetools.dev. The reader-facing version of this list,
with links to every tool, lives at
[onlinetools.dev/changelog](https://onlinetools.dev/changelog) — keep the two in
sync when you ship something user-visible.

Versions are **dates**, not semver: this is a website, not a library. The
current stamp lives in [`src/lib/version.ts`](src/lib/version.ts) and feeds both
the footer badge and every `<lastmod>` in the sitemap.

---

## [2026.07.28] — Read QR codes, not just make them

### Added

- **QR Code Decoder** — drop, paste or pick any image containing a QR code (a
  screenshot, a ticket, a photo of a poster) and read what's inside, without
  pointing a phone at your own screen.
- Payload-aware results: URLs get an open-link button, WiFi codes unpack into
  network / password / security type, and vCard, `mailto:`, `tel:`, `geo:` and
  `otpauth:` payloads are labeled before you act on them.
- Camera mode — point a webcam or phone camera at a code on paper and it scans
  live, no app required.
- The decoder's About & FAQ content in all fourteen languages available at the
  time.

### Notes

- Inverted codes and UTF-8 text (CJK, emoji) decode correctly.
- Scanning is local: the image, the camera feed and the decoded content never
  leave the browser — which also makes this a safe way to inspect a QR code you
  don't trust.

## [2026.07.24] — A page about trust, and a way to check it

### Added

- **About page** — why this exists, in plain terms: every tool runs in your
  browser, nothing you paste is uploaded, no ads, no trackers, no login.
- **Verifiable privacy indicator** — a live counter of the network requests the
  site makes after load, read from the browser's own `PerformanceObserver`. It
  stays at zero; you can sit there typing and watch, or check the DevTools
  Network tab yourself.
- Source links throughout — "view source" and "edit this page" in the footer
  and on the About page.

## [2026.07.22] — Twelve new tools, two new categories

### Added

- **Code & Markup** category: SQL formatter (six dialects), XML formatter &
  validator with exact error positions, HTML / CSS / JavaScript beautifiers
  with real minification (Terser for JS), and a bidirectional Markdown ↔ HTML
  converter with a sanitized live preview.
- **Privacy** category: EXIF viewer & remover — decodes camera, GPS and editing
  metadata from JPEG, PNG and WebP, and strips it losslessly without
  re-encoding a pixel.
- XML ↔ JSON converter, JSON Schema validation and inference (Ajv), a string
  escaper for six dialects, a BigInt-exact number base converter, and text ↔
  hex/binary.

### Changed

- JWT decoder now signs and verifies (HS/RS/ES via WebCrypto).
- Cron parser gained a visual expression builder.
- Timestamp converter adds RFC 2822 output and a date-difference calculator.
- JSON → CSV became bidirectional, parsing CSV back into typed JSON objects
  with delimiter auto-detection.
- Smart Paste recognizes XML, CSV, Markdown and hex byte dumps.

## [2026.07.21c] — Image tools

### Added

- **Image** category (31 tools total): Image ↔ Base64 converter with data URL,
  CSS and HTML snippets in both directions; format converter between PNG, JPEG
  and WebP with a live quality dial; a resizer by width, height or percentage;
  and a favicon generator that packs `favicon.ico` (16/32/48), the Apple touch
  and PWA PNG set, a starter webmanifest and the matching `<link>` tags into
  one ZIP.
- Smart Paste recognizes image data URLs and offers to preview and download
  them.

### Notes

- Images are processed on a local canvas — never uploaded — and formats are
  detected from magic bytes, not file extensions.

## [2026.07.21b] — Ten languages

### Added

- The whole site in ten languages: English, 中文, 日本語, 한국어, Español,
  Français, Deutsch, Português, Русский and Italiano, with a switcher in the
  footer.
- Per-page hreflang alternates for every locale, localized title, description
  and JSON-LD, and a sitemap listing every variant.
- Translated tool names and descriptions everywhere they appear — sidebar,
  catalog, command palette (which now matches queries in your language), Smart
  Paste and the "Continue with" chain.

### Notes

- English URLs are unchanged; every other language lives under its own prefix
  (`/zh/t/json-formatter`).

## [2026.07.21] — Floating workspace & unified controls

> Versions are dates from here on.

### Changed

- New shell: sidebar and page share one recessed canvas, with content in a
  floating rounded card fixed in the viewport — scrolling happens inside it.
- Sidebar: compact labels that never truncate, an active pill that reads on the
  canvas, scroll fade-outs, and a three-state theme control (system / dark /
  light).
- One look for every form control — small selects became segmented toggles with
  visual options (indent, CSV delimiter, sort order), and checkboxes, selects
  and inputs are custom-styled throughout.

## [0.3] — 2026-07 — App shell & offline install

### Added

- Persistent sidebar listing every tool by category, becoming a slide-in drawer
  behind a compact top bar on phones.
- Installable PWA — a service worker caches visited pages and assets, so every
  tool you've opened keeps working with no connection.

### Changed

- Denser, left-aligned overview page sized for the workspace layout.

### Fixed

- JSON → CSV preview misaligned quoted cells.
- QR codes now encode CJK/emoji as UTF-8.

## [0.2] — 2026-07 — 16 new tools & a visual pass

### Added

- 16 tools (27 total): case converter, word counter, lorem ipsum, slug
  generator, sort & dedupe lines, HTML entities, Unicode inspector, cron parser
  with next-run preview, password generator with an entropy meter, QR codes
  (SVG/PNG), JSON ↔ YAML ↔ TOML, JSON → CSV, JSON → TypeScript, JSONPath
  tester, bcrypt hash & verify, User-Agent parser.
- "Continue with →" on every output panel, to pipe a result into another tool.
- Tool icons everywhere, breadcrumbs, and per-tool code splitting.

### Changed

- JSON formatter gained a collapsible tree view with per-node JSONPath copy.
- JWT decoder shows token anatomy and a live lifetime bar.
- Timestamp converter compares 7 timezones on a 24-hour day strip.
- Color converter adds RGB channel bars and WCAG contrast checks.

## [0.1] — 2026-07 — Initial release

### Added

- First 11 tools: JSON formatter, Base64, unix timestamps, JWT decoder, regex
  tester, text diff, URL encode/decode, URL parser, UUID/ULID/Nano ID
  generator, hashes & HMAC, color converter.
- `⌘K` command palette with fuzzy search, aliases and verb-style direct
  execution.
- Smart Paste — paste anywhere and the content type is detected, with tool
  suggestions.
- Shareable state: any tool state serializes into the URL fragment, never to a
  server.
- Dark and light themes, full keyboard operation, visible focus rings.

---

## Unreleased

Changes landed since the last version stamp are listed here until a release
goes out. See the [roadmap](README.md#roadmap) for what's being considered.

### Added

- Tool pipelines (`/chain`) — compose tools into a recipe, with five curated,
  individually indexable preset workflows.
- A paste-first homepage workbench.
- Local-only favorites for tools.
- Turkish, Polish, Vietnamese, Indonesian, Dutch, Thai, Ukrainian and Hindi —
  18 locales in total.
- Open-source documentation set: `LICENSE` (MIT), `CONTRIBUTING`,
  `CODE_OF_CONDUCT`, `SECURITY`, `CHANGELOG`, and `docs/` covering
  architecture, adding a tool, translations and deployment.

### Changed

- Smart Paste and "Continue with" now share one format-affinity engine, so
  irrelevant tools are hidden rather than ranked last.
- CSV → JSON merged into the JSON ↔ CSV converter.
- Brand mark redesigned as a concentric ring, adapting to the active theme.

### Security

- A strict Content-Security-Policy in hash mode, plus frame, referrer and
  permissions hardening in `_headers`.
- The Markdown preview drops `form`, `input`, `button` and inline styles on top
  of DOMPurify's defaults, so a hostile share link can't render a convincing
  credential-harvesting page.
- `ua-parser-js` pinned back to the MIT 1.0.x line — 2.x is AGPL-3.0-or-later
  and its minified code was being conveyed to every visitor of the User-Agent
  tool.
- Added `.well-known/security.txt`.

[2026.07.28]: https://onlinetools.dev/changelog
[2026.07.24]: https://onlinetools.dev/changelog
[2026.07.22]: https://onlinetools.dev/changelog
[2026.07.21c]: https://onlinetools.dev/changelog
[2026.07.21b]: https://onlinetools.dev/changelog
[2026.07.21]: https://onlinetools.dev/changelog
[0.3]: https://onlinetools.dev/changelog
[0.2]: https://onlinetools.dev/changelog
[0.1]: https://onlinetools.dev/changelog

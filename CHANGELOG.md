# Changelog

All notable changes to onlinetools.dev. The reader-facing version of this list,
with links to every tool, lives at
[onlinetools.dev/changelog](https://onlinetools.dev/changelog) — keep the two in
sync when you ship something user-visible.

Versions are **dates**, not semver: this is a website, not a library. The
current stamp lives in [`src/lib/version.ts`](src/lib/version.ts) and feeds both
the footer badge and every `<lastmod>` in the sitemap.

---

## [2026.11.05] — TOTP / 2FA Code Generator

### Added

- **TOTP / 2FA Code Generator** (tool #48): paste a Base32 secret or an
  `otpauth://` URI and see the current, previous and next code with a
  countdown. TOTP and HOTP; SHA-1, SHA-256 and SHA-512; 6–8 digits; any
  period. "Check a code" says whether a code is current, a few steps early or
  late (clock drift), or matches nothing within ±10 steps. "New secret"
  makes a 160-bit secret and its URI for the QR Code Generator. Tested
  against the RFC 6238 and RFC 4226 vectors.
- The secret is never put in a share link, and is removed from the address
  bar when it arrives through "Continue with" or Smart Paste.
- Smart Paste recognizes `otpauth://` URIs, so a decoded 2FA QR code goes
  straight to the new tool.

## [2026.11.04] — Chmod Calculator in every language

### Changed

- **Chmod Calculator** About and FAQ translated into the 16 locales that
  fell back to English, so every localized page (and its `FAQPage` JSON-LD)
  is in its own language.
- **JWT Decoder** recognizes an encrypted JWT (JWE, five segments with `enc`
  in the header) and explains that its payload can't be decoded without the
  recipient's key, instead of reporting a segment count.

## [2026.11.03] — Merge and subtract CIDR lists

### Added

- **CIDR Calculator** list mode: paste several blocks, addresses or ranges
  (one per line or comma-separated, `#` and `//` comments allowed) and get the
  fewest CIDR blocks that cover exactly the same addresses, IPv4 then IPv6.
- An **Exclude** box subtracts blocks from the result — e.g. `0.0.0.0/0`
  minus `192.168.0.0/16` for WireGuard AllowedIPs.
- Lines that don't parse are listed with their line number and skipped.
- Smart Paste recognizes multi-line CIDR lists.

## [2026.11.02] — File permissions, every way they are written

### Added

- **Chmod Calculator**: type 755, 0644, rwxr-xr-x, a whole `ls -l` line,
  u=rwx,g=rx,o=rx or a full `chmod -R 750 dir` command and get the octal
  value, the rwx string, the `ls -l` column and both chmod commands. A
  clickable owner/group/others grid with setuid, setgid and sticky bits.
- Relative expressions (g+w, go-rwx, a+X, g=u) are applied to a starting
  mode you choose, following GNU chmod (X, class copies, `=` on directories).
- `umask 027` shows the modes new files and directories will get.
- Warnings for world-writable modes, setuid/setgid, special bits without
  execute (S/T), and owners with fewer rights than group or others.
- Smart Paste recognizes `ls -l` permission columns and chmod commands.

## [2026.11.01] — Easier to read, steadier to load

### Fixed

- Light theme: footer, breadcrumbs, the "report a problem" link, the
  Smart Paste file details, empty-state hints and sidebar category headings
  used faded `dim` text below the WCAG AA 4.5:1 contrast ratio; they now use
  full `dim`.
- Links inside running text are underlined (WCAG 1.4.1, no color-only cue).
- The language menu button's accessible name now contains the visible
  language name ("Language: English"), not just "Language" (WCAG 2.5.3).
- The tool loading placeholder reserves 18rem instead of 10rem, close to
  the smaller tools' height, which reduces layout shift as the tool mounts.

## [2026.10.31] — Sign and verify JWTs with real keys

### Added

- **JWT Decoder & Encoder** (was "JWT Decoder"): Verify mode accepts a JWK or
  a whole JWKS as well as a PEM; the token's `kid` picks the key, and every
  compatible key is tried when there is no `kid`. It also reports whether
  `exp` and `nbf` pass against the local clock.
- PS256/384/512, ES512 and EdDSA (Ed25519) for signing and verifying.
- Sign mode: extra header fields (e.g. `kid`; a JWK's `kid` is copied in
  automatically), private keys as JWK, one-click `iat`/`exp` stamps, a random
  secret or test key-pair generator, and "Verify this token" with the
  matching public key.

### Changed

- Verifying an HS token with a public key is refused with an explanation of
  algorithm confusion instead of reporting a plain mismatch; `alg: "NONE"` is
  treated as unsigned in any letter case.
- The tool's About & FAQ copy, which still said signature verification was
  out of scope, is rewritten (with a JWKS how-to) in all eighteen languages.

## [2026.10.30] — Every tool explained in every language

### Changed

- About & FAQ copy for the **CIDR / Subnet Calculator** and the **Background
  Remover** translated into the sixteen languages that lacked it; every tool
  page is now fully localized in all eighteen languages, including the
  `FAQPage` structured data.
- Tool meta descriptions join the tagline and the privacy note with the
  locale's own sentence stop (`。` in Chinese and Japanese, `।` in Hindi, a
  space in Thai) instead of an English `. `.

## [2026.10.29] — Subnets, IPv4 and IPv6

### Added

- **CIDR / Subnet Calculator** — type a block like `10.20.0.0/16` or
  `2001:db8::/48` and get the network and broadcast (or last) address,
  netmask and wildcard mask, first and last usable host, exact address
  counts, the special-purpose range it belongs to (RFC 1918, CGNAT,
  link-local, documentation…), and the integer, hex, binary and reverse-DNS
  forms of the address.
- Paste a range (`10.0.0.1 - 10.0.0.200`) to get the fewest CIDR blocks that
  cover it exactly; split a block into equal subnets; check whether an
  address falls inside. Netmask and Cisco wildcard notation are accepted.
- Smart Paste recognizes CIDR blocks and IPv4 ranges.
- About & FAQ copy in English and Chinese; the tool's name, description and
  labels in all eighteen languages.

### Notes

- Addresses with leading zeros (`010.0.0.1`) are rejected with an
  explanation rather than guessed at, since parsers disagree on octal.
- The social preview image now shows the current tool count.

## [2026.09.14] — Remove a background without uploading the photo

### Added

- **Background Remover** — drop a photo and the subject is cut out
  automatically. Download a transparent PNG or WebP, or flatten it onto a
  solid color and export a JPEG, at the original resolution.
- It runs U²-Net (the model behind `rembg`) through ONNX Runtime compiled to
  WebAssembly, in the page. The runtime and the 4.6 MB model are fetched from
  this site once and cached by the browser; later runs work offline.
- About & FAQ copy in English and Chinese; the tool's name, description and
  labels in all eighteen languages.

### Notes

- The Content-Security-Policy now carries `'wasm-unsafe-eval'` in
  `script-src` so WebAssembly can compile. Unlike `'unsafe-eval'` it permits
  no JavaScript `eval`.

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

- A "Report an issue" link on every tool page, opening the GitHub bug form with
  that tool's URL already filled in. Localized in all 18 languages.
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

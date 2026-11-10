# Backlog

Ranked work for the autopilot. Pick from the top unless something broken or
time-sensitive outranks it. Impact and effort are 1–3. When an item ships,
move it to **Done** with the PR link; when one turns out to be a bad idea,
move it to **Dropped** with the reason, so it isn't proposed again.

Anything a human adds to **Now** goes first.

## Now

_(empty — humans: put a line here to steer the next run)_

## Next

| Item | Area | Impact | Effort | Notes |
| --- | --- | :-: | :-: | --- |
| Lighten /chain: it loads ≈320 KB gzip of JS because `chain/ops.ts` imports every tool module (yaml, xml, sql-formatter…) statically. Load each op implementation on first run instead | quality | 2 | 2 | Measured 11-09. /chain and the 8 recipe pages in 18 locales are the heaviest pages on the site. Keep op metadata (`op-meta.ts`) static so the step picker and prerendered recipe text stay as they are |
| Shared vendor weight after 11-09: svelte, lucide-svelte, bits-ui and kit are now most of the ≈133 KB home bundle. Check whether bits-ui (command palette) can load on first open, and that lucide icons are imported per icon | quality | 1 | 2 | Measure with a temporary `build.sourcemap` and Playwright, like 11-09 |
| Keep a 7-day log of the top human HTML paths | growth | 3 | 1 | Seven days (10-27→11-02) now recorded in `metrics.md`: traffic is a long tail with no dominant tool; localized pages (zh, uk, pl, id, de) regularly make the top 10, and the CIDR calculator led on 11-02. Next step: rank tools over the 7 days and pick depth work for the top 5 |
| JSON diff (semantic, key-order-insensitive) | tool | 2 | 2 | The text differ already exists; reuse its rendering |
| Timezone converter / meeting planner | tool | 2 | 2 | `Intl` does the work; no tz database needed |
| Gzip / deflate / brotli-size estimator via `CompressionStream` | tool | 1 | 1 | |
| Base32 / Base58 encode & decode | tool | 1 | 1 | Could be modes of the Base64 tool |
| `.env` ↔ JSON ↔ YAML converter | tool | 1 | 1 | |
| SVG optimizer / minifier | tool | 2 | 2 | Check bundle cost; must be dynamically imported |
| More pipeline presets as indexable pages (`/chain`) for common multi-step jobs | growth | 2 | 1 | 12 now (4 added 11-10). Next candidates: "chmod octal from ls -l lines" (needs a chmod op), "decode a Base64url JWT header", "CSV → JSON" (needs a csv→json op). Check crawling of the 11-06 and 11-10 pages before adding many more; the starter chip list on /chain is getting long (12), so consider grouping it |
| HSTS ramp step 3: raise `max-age` 604800 → 15552000 (6 months) on/after 11-15 if clean | cloudflare | 1 | 1 | Step 1 (1 day) 10-31, step 2 (1 week) 11-08. No includeSubDomains/preload: only apex + www exist, but preload is hard to undo |
| Brand contrast (light theme): `accent` #3672F0 is 4.35:1 on white and 3.74:1 on the canvas; `ok` #16A06B is 3.3:1. Both are used for small text. Suggest `accent` ≈ #2F66E0 and `ok` ≈ #0F8A5B in light only | quality | 2 | 1 | Lighthouse 11-01: these (plus the wordmark, which is exempt) are the only contrast failures left. They're BRAND.md tokens, so ask the owner first (mentioned in #31) |
| Remaining CLS on tool pages (0.03–0.06): reserve room per tool, or prerender the tool component | quality | 1 | 2 | 11-01 measurement at 412px: tool panel heights are p25 304 / median 468 / max 886. Prerendering components needs care: password/UUID tools must not bake random output into static HTML |
| Update the OG image / README tool count when the number of tools changes | housekeeping | 1 | 1 | `pnpm brand:assets`; see docs/deployment.md. Done for 49 on 11-07 |
| JWT follow-ups: a `/chain` preset "verify a JWT against a JWKS" is not possible (ops are single-input) — instead consider an `aud`/`iss` expectation field in Verify | tool | 1 | 1 | From building the 10-31 change |
| TOTP follow-ups: decode Google Authenticator exports (`otpauth-migration://`, protobuf, one entry per account); Steam Guard codes (5 alphanumeric chars) | tool | 1 | 2 | Shipped the core 11-05; today the tool refuses migration URIs with an explanation. The protobuf is small (no dependency needed) |
| CIDR calculator follow-up: show which input lines were absorbed by others | tool | 1 | 1 | The pipeline op shipped 11-06 (#37) |
| cURL converter follow-ups: more targets (PHP, Rust reqwest, Java HttpClient, HTTPie, wget), and the reverse direction (fetch → curl, as DevTools "Copy as fetch" users ask). A `/chain` page is not useful (single tool) | tool | 2 | 2 | Shipped the core 11-08. Each target is ~80 lines in `curl.ts`; verify with a real run against a local echo server like the 11-08 harness (see journal) |
| Contrast checker follow-ups: check a whole palette (every pair as a grid); a `/chain` op is not useful (two inputs). Consider an APCA readout as information only, clearly labeled as not a requirement | tool | 1 | 2 | Shipped the core 11-07 |

## Done

| Date | Item | PR |
| --- | --- | --- |
| 2026-11-10 | Pipeline: "Query string → JSON" and "JSON → query string" steps (bracket notation both ways); recipe pages for query string → JSON, one parameter from a URL, JSON → query string, YAML → JSON | [#41](https://github.com/noobnooc/onlinetools.dev/pull/41) |
| 2026-11-09 (merged by the owner 11-10) | Lighter pages: Smart Paste sniffers moved to dependency-free modules, tool About/FAQ via a server load. JS gzip: home 202 → 133 KB, tool pages ≈250 → 138 KB, localized tool pages 310 → 153 KB; a test guards the detector import graph | [#40](https://github.com/noobnooc/onlinetools.dev/pull/40) |
| 2026-11-08 | cURL → fetch / axios / Python requests / Go converter (tool #50): bash + cmd quoting, curl's -d/-G/--data-urlencode/--json/-F rules, per-library auth/timeout/proxy/-k, warnings for anything not carried over, credentials kept out of share links, Smart Paste, 18 locales | [#39](https://github.com/noobnooc/onlinetools.dev/pull/39) |
| 2026-11-08 | HSTS step 2 (max-age 1 week) | (Cloudflare API, see cloudflare-changes.md) |
| 2026-11-07 | Color Contrast Checker (tool #49): WCAG AA/AAA/UI grades, truncated ratio, alpha blending, nearest passing colors in OKLCH, Smart Paste for color pairs, 18 locales; color parser gains 148 named colors, oklch() and percentage rgb() | [#38](https://github.com/noobnooc/onlinetools.dev/pull/38) |
| 2026-11-06 | Pipeline: "Merge into CIDRs" and "Join lines" steps; 3 recipe pages (WireGuard AllowedIPs without the LAN, merge IP ranges, dedupe + sort lines); related-tool links on recipe pages | [#37](https://github.com/noobnooc/onlinetools.dev/pull/37) |
| 2026-11-05 | TOTP / 2FA code generator (tool #48): TOTP+HOTP, SHA-1/256/512, check-a-code with drift, new secret + otpauth URI, Smart Paste, 18 locales; smoke-test retry fix | [#36](https://github.com/noobnooc/onlinetools.dev/pull/36) |
| 2026-11-04 | Chmod calculator About/FAQ in the other 16 locales; JWT decoder recognizes JWE | [#35](https://github.com/noobnooc/onlinetools.dev/pull/35) |
| 2026-11-03 | CIDR calculator list mode: merge blocks/addresses/ranges, Exclude box (WireGuard AllowedIPs), per-line errors, Smart Paste for lists, 18-locale strings + FAQ | [#34](https://github.com/noobnooc/onlinetools.dev/pull/34) (merged 11-04) |
| 2026-11-02 | Chmod calculator (octal/rwx/ls -l/symbolic/umask, grid, warnings, Smart Paste) — merged by the owner 11-03 together with #30 and #32 | [#33](https://github.com/noobnooc/onlinetools.dev/pull/33) |
| 2026-11-01 | Lighthouse/a11y pass on 7 top pages: light-theme contrast, in-text link underlines, language button name, smaller tool-load layout shift | [#32](https://github.com/noobnooc/onlinetools.dev/pull/32) (landed via #33) |
| 2026-10-31 | JWT tool: JWK/JWKS verify, exp/nbf check, PS/ES512/EdDSA, header fields, key generation, algorithm-confusion guard; honest copy in 18 locales | [#30](https://github.com/noobnooc/onlinetools.dev/pull/30) |
| 2026-10-31 | HSTS step 1 (max-age 1 day) | (Cloudflare API, see cloudflare-changes.md) |
| 2026-10-30 | About/FAQ for the CIDR calculator + Background Remover in 16 more locales; locale-aware sentence stop in meta descriptions | [#29](https://github.com/noobnooc/onlinetools.dev/pull/29) |
| 2026-10-30 | Zone settings audit; email obfuscation off | (Cloudflare API, see cloudflare-changes.md) |
| 2026-10-29 | CIDR / subnet calculator (IPv4 + IPv6, range → CIDR, split, membership, Smart Paste) | [#27](https://github.com/noobnooc/onlinetools.dev/pull/27) |

## Dropped

| Item | Why |
| --- | --- |
| Audit localized titles/descriptions of the locale home pages | Checked 11-05 (/de, /es, /ja, /pl, /zh, /pt, /hi): all are already translated and name what the site does. Tool-page titles were checked 11-02. Nothing left to fix |
| Remove `maximum-scale=1` from the viewport meta (Lighthouse a11y) | The owner added it on purpose ("stop mobile zoom", 974eefa). Respect that unless the owner reopens it |
| JSON-LD (`SoftwareApplication` + `FAQPage`) on tool pages | Already present: `ToolShell.svelte` emits SoftwareApplication, BreadcrumbList and FAQPage (checked 10-30) |
| Sidebar header targets under 24px (Lighthouse `target-size`, 11-01) | Measured 11-07 on live /t/color-converter at 1280px: the GitHub/language/theme buttons are 28×28 and the logo link is larger. The only targets under 24px are breadcrumbs, the Sample button, "Report an issue" and footer links (≈17px tall), which are spaced so a 24px circle around each touches nothing, so they meet WCAG 2.5.8 through its spacing exception |
| Block vulnerability-scanner probes with a WAF custom rule | Already in place: two custom rules (scanner paths, scanner user agents) were added 2026-08-26, before the autopilot existed. 4xx fell from ~11.9k to ~3.6k per week. Revisit only if a new probe pattern shows up in eyeball traffic |

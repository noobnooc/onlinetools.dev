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
| Keep a 7-day log of the top human HTML paths | growth | 3 | 1 | Seven days (10-27→11-02) now recorded in `metrics.md`: traffic is a long tail with no dominant tool; localized pages (zh, uk, pl, id, de) regularly make the top 10, and the CIDR calculator led on 11-02. Next step: rank tools over the 7 days and pick depth work for the top 5 |
| cURL → fetch / Python requests converter | tool | 3 | 3 | Developers paste curl commands with tokens in them — the local angle is strong |
| JSON diff (semantic, key-order-insensitive) | tool | 2 | 2 | The text differ already exists; reuse its rendering |
| Timezone converter / meeting planner | tool | 2 | 2 | `Intl` does the work; no tz database needed |
| WCAG contrast checker | tool | 2 | 1 | Could live inside or beside the color converter |
| Gzip / deflate / brotli-size estimator via `CompressionStream` | tool | 1 | 1 | |
| Base32 / Base58 encode & decode | tool | 1 | 1 | Could be modes of the Base64 tool |
| `.env` ↔ JSON ↔ YAML converter | tool | 1 | 1 | |
| SVG optimizer / minifier | tool | 2 | 2 | Check bundle cost; must be dynamically imported |
| More pipeline presets as indexable pages (`/chain`) for common multi-step jobs | growth | 2 | 1 | 8 now (3 added 11-06). Next candidates need new ops: YAML → JSON → JSONPath (exists), "URL-decode a query string to JSON" (needs a query→JSON op), "chmod octal from ls -l lines" (needs a chmod op). Check whether the 11-06 pages get crawled first |
| HSTS ramp: raise `max-age` 86400 → 604800 (after 11-07 if clean) → 15552000 | cloudflare | 1 | 1 | Step 1 (1 day) done 10-31. No includeSubDomains/preload: only apex + www exist, but preload is hard to undo |
| Brand contrast (light theme): `accent` #3672F0 is 4.35:1 on white and 3.74:1 on the canvas; `ok` #16A06B is 3.3:1. Both are used for small text. Suggest `accent` ≈ #2F66E0 and `ok` ≈ #0F8A5B in light only | quality | 2 | 1 | Lighthouse 11-01: these (plus the wordmark, which is exempt) are the only contrast failures left. They're BRAND.md tokens, so ask the owner first (mentioned in #31) |
| Remaining CLS on tool pages (0.03–0.06): reserve room per tool, or prerender the tool component | quality | 1 | 2 | 11-01 measurement at 412px: tool panel heights are p25 304 / median 468 / max 886. Prerendering components needs care: password/UUID tools must not bake random output into static HTML |
| Sidebar header targets (logo link, language/theme/GitHub buttons) under 24px in Lighthouse `target-size` | quality | 1 | 1 | 11-01; they measure 30×23 |
| Update the OG image / README tool count when the number of tools changes | housekeeping | 1 | 1 | `pnpm brand:assets`; see docs/deployment.md. Done for 48 on 11-05 |
| JWT follow-ups: a `/chain` preset "verify a JWT against a JWKS" is not possible (ops are single-input) — instead consider an `aud`/`iss` expectation field in Verify | tool | 1 | 1 | From building the 10-31 change |
| TOTP follow-ups: decode Google Authenticator exports (`otpauth-migration://`, protobuf, one entry per account); Steam Guard codes (5 alphanumeric chars) | tool | 1 | 2 | Shipped the core 11-05; today the tool refuses migration URIs with an explanation. The protobuf is small (no dependency needed) |
| CIDR calculator follow-up: show which input lines were absorbed by others | tool | 1 | 1 | The pipeline op shipped 11-06 (#37) |

## Done

| Date | Item | PR |
| --- | --- | --- |
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
| Block vulnerability-scanner probes with a WAF custom rule | Already in place: two custom rules (scanner paths, scanner user agents) were added 2026-08-26, before the autopilot existed. 4xx fell from ~11.9k to ~3.6k per week. Revisit only if a new probe pattern shows up in eyeball traffic |

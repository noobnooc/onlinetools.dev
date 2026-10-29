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
| Keep a 7-day log of the top human HTML paths | growth | 3 | 1 | One day (10-28) is recorded in `metrics.md`: traffic is a long tail with no dominant tool; zh/id localized pages show up near the top. Record a day each run until there are 7 to rank against. `clientRefererHost` is not available on this plan |
| Translate the Background Remover About/FAQ content into the 16 locales that lack it | content | 2 | 2 | Every other tool has all 17 translations; `bgremove` only has `en` + `zh`. Follow the tone of each `content.<lang>.ts` |
| JWT encoder / signer (HS256/384/512, RS/ES via WebCrypto) | tool | 3 | 2 | Pairs with the decoder; add as `related` both ways |
| Unix file-permission (chmod) calculator | tool | 2 | 1 | Symbolic ↔ octal, with `ls -l` string parsing |
| cURL → fetch / Python requests converter | tool | 3 | 3 | Developers paste curl commands with tokens in them — the local angle is strong |
| JSON diff (semantic, key-order-insensitive) | tool | 2 | 2 | The text differ already exists; reuse its rendering |
| Timezone converter / meeting planner | tool | 2 | 2 | `Intl` does the work; no tz database needed |
| WCAG contrast checker | tool | 2 | 1 | Could live inside or beside the color converter |
| Gzip / deflate / brotli-size estimator via `CompressionStream` | tool | 1 | 1 | |
| TOTP / 2FA code generator from a secret or `otpauth://` URI | tool | 2 | 1 | The QR decoder already labels `otpauth:` payloads — chain them |
| Base32 / Base58 encode & decode | tool | 1 | 1 | Could be modes of the Base64 tool |
| `.env` ↔ JSON ↔ YAML converter | tool | 1 | 1 | |
| SVG optimizer / minifier | tool | 2 | 2 | Check bundle cost; must be dynamically imported |
| Audit titles and meta descriptions for the top pages against what people search for | seo | 3 | 1 | Use WebSearch to see competing titles; keep copy honest |
| JSON-LD (`SoftwareApplication` + `FAQPage`) on tool pages, if not already present | seo | 2 | 1 | Check the built HTML first |
| More pipeline presets as indexable pages (`/chain`) for common multi-step jobs | growth | 2 | 1 | e.g. "decode a JWT and pretty-print the payload" already exists — find the next ones |
| Lighthouse pass on the 5 most-visited pages (performance, a11y) | quality | 2 | 2 | Chromium + Playwright are preinstalled in the container |
| Audit zone settings (TLS min version, HSTS, Always Use HTTPS, HTTP/3, Brotli, caching of `/_app/immutable/*`) | cloudflare | 2 | 1 | Log every change in `cloudflare-changes.md` |
| Update the OG image / README tool count when the number of tools changes | housekeeping | 1 | 1 | `pnpm brand:assets`; see docs/deployment.md. Done for 46 on 10-29 |
| Translate the CIDR calculator About/FAQ into the 16 locales that lack it | content | 1 | 2 | Shipped with `en` + `zh` only, like the Background Remover |
| CIDR calculator follow-ups: a pipeline op (range → CIDR list) and multi-line input (aggregate/summarize a list of blocks) | tool | 1 | 1 | Aggregation is the next most-asked subnet job after range → CIDR |

## Done

| Date | Item | PR |
| --- | --- | --- |
| 2026-10-29 | CIDR / subnet calculator (IPv4 + IPv6, range → CIDR, split, membership, Smart Paste) | [#27](https://github.com/noobnooc/onlinetools.dev/pull/27) |

## Dropped

| Item | Why |
| --- | --- |
| Block vulnerability-scanner probes with a WAF custom rule | Already in place: two custom rules (scanner paths, scanner user agents) were added 2026-08-26, before the autopilot existed. 4xx fell from ~11.9k to ~3.6k per week. Revisit only if a new probe pattern shows up in eyeball traffic |

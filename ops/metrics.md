# Metrics

Daily numbers for onlinetools.dev from the Cloudflare zone analytics
(GraphQL `httpRequests1dGroups`, zone `9223bb0898c72eb65d27cd77e82b1f05`).
One row per UTC day, appended by the autopilot; backfill missing days when
you can. "Visitors" is Cloudflare's daily unique IPs — rough, but consistent.

| Date (UTC) | Requests | Page views | Visitors | Cached % | 4xx | 5xx | Top countries | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 2026-10-14 | 2076 | 1010 | 641 | 45 | 709 | 0 | US DE AU | backfill |
| 2026-10-15 | 2989 | 510 | 363 | 36 | 1704 | 0 | US IN NL | backfill |
| 2026-10-16 | 2923 | 1593 | 616 | 63 | 809 | 0 | FR US KR | backfill |
| 2026-10-17 | 3201 | 656 | 595 | 34 | 1733 | 0 | LT US AU | backfill |
| 2026-10-18 | 3347 | 891 | 701 | 36 | 1625 | 0 | NL US SG | backfill |
| 2026-10-19 | 4724 | 467 | 468 | 21 | 3387 | 0 | FR CA US | backfill |
| 2026-10-20 | 3230 | 383 | 433 | 29 | 1825 | 0 | US NL BE | backfill |
| 2026-10-21 | 2095 | 325 | 370 | 43 | 785 | 0 | NL US CN | baseline backfill |
| 2026-10-22 | 1642 | 331 | 344 | 45 | 644 | 0 | US ZA IN | |
| 2026-10-23 | 2532 | 618 | 668 | 28 | 1242 | 0 | TW US CA | |
| 2026-10-24 | 3996 | 470 | 533 | 12 | 2996 | 0 | FR BE US | 4xx spike = vulnerability scanners |
| 2026-10-25 | 2231 | 1370 | 739 | 64 | 26 | 0 | US CN SG | |
| 2026-10-26 | 1527 | 468 | 538 | 64 | 401 | 0 | US ID CN | |
| 2026-10-27 | 1974 | 561 | 540 | 52 | 394 | 0 | US BE DE | top HTML paths: / 108, /tools 19, /t/jsonpath-tester 14, /changelog 8, /t/qr-code-decoder 7, /t/unicode-inspector 7 — plus many `.env`/`phpinfo.php` probes |
| 2026-10-28 | 2166 | 473 | 449 | 72 | 73 | 0 | CN US HK | top human HTML: / 78, /zh/t/json-formatter 11, /id/t/bcrypt-generator 10, /zh/t/html-formatter 9, /changelog 7, /about 7, /chain 6; long tail of 3–5 views across ~30 tool pages. Week 10-22→28 vs 10-15→21: page views 4291 vs 4825 (−11%), visitors 3811 vs 3546 (+7%), 4xx 3,573 vs 11,868 |
| 2026-10-29 | 4464 | 1508 | 603 | 64 | 825 | 0 | DE US CN | top human HTML: / 72, /about 16, /tools 12, /ja/t/jsonpath-tester 12, /fr/changelog 11, /zh/t/word-counter 9, /changelog 9, /t/json-to-csv 8, /chain 8, /zh/t/base64-decode 7; localized pages again ~40% of the top 25. Week 10-23→29 vs 10-16→22: page views 5468 vs 4646 (+18%), visitors 4070 vs 3527 (+15%) |
| 2026-10-30 | 6555 | 1846 | 526 | 43 | 1958 | 0 | US NL CN | new high for page views. Top human HTML (200 only): / 106, /tools 17, /about 15, /nl/t/html-entities 11, /chain 10, then an even spread of 8–9 views across ~25 English tool pages (case-converter, regex-tester, lorem-ipsum, cidr-calculator, diff-checker, jwt-decoder…). 4xx were a new wave of scanner paths (`/messages/*`, `/webhook-waiting/*`, `/rest/logout`, `/s3/backup`, `/root/.netrc`) answered 404 by the Worker. Week 10-24→30 vs 10-17→23: page views 6696 vs 3671 (+82%), visitors 3928 vs 3579 (+10%) |
| 2026-10-31 | 4862 | 618 | 480 | 36 | 1458 | 0 | NL CN US | top human HTML (200 only): / 113, /changelog 18, /about 17, /zh/t/image-resizer 14, /tools 10, then 4–6 views each on ~20 tool pages (json-to-typescript, base64-decode, json-to-yaml, url-encode-decode, image-to-base64, sql-formatter…). Week 10-25→31 vs 10-18→24: page views 6844 vs 3485 (+96%), visitors 3875 vs 3517 (+10%) |
| 2026-11-01 | 4048 | 1529 | 786 | 66 | 557 | 0 | US BE CN | most visitors in the log. Top human HTML (200 only): / 101, /de/t/json-schema-validator 10, /chain 10, /changelog 8, /t/json-formatter 8, /t/qr-code-decoder 7, /about 7, /tools 7, /t/json-to-csv 7, /t/url-parser 7, /zh/t/hash-generator 6, then 4–6 views each on ~30 tool pages. 0 eyeball 5xx. Week 10-26→11-01 vs 10-19→25: page views 7003 vs 3964 (+77%), visitors 3922 vs 3555 (+10%) |
| 2026-11-02 | 4422 | 750 | 544 | 29 | 2050 | 0 | US TW CN | Top human HTML (200 only): / 46, /uk/t/cidr-calculator 12, /zh/t/string-escape 9, /zh 5, then 3–4 views each; the CIDR calculator was the top tool page across locales (uk 12, pl 4, nl 4, zh 3, th 3 = 26 views). 0 eyeball 5xx. 4xx up again (scanner probes). Week 10-27→11-02 vs 10-20→26: page views 7285 vs 3965 (+84%), visitors 3928 vs 3625 (+8%) |

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

# Metrics

Daily numbers for onlinetools.dev from the Cloudflare zone analytics
(GraphQL `httpRequests1dGroups`, zone `9223bb0898c72eb65d27cd77e82b1f05`).
One row per UTC day, appended by the autopilot; backfill missing days when
you can. "Visitors" is Cloudflare's daily unique IPs — rough, but consistent.

| Date (UTC) | Requests | Page views | Visitors | Cached % | 4xx | 5xx | Top countries | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 2026-10-21 | 2095 | 325 | 370 | 43 | 785 | 0 | NL US CN | baseline backfill |
| 2026-10-22 | 1642 | 331 | 344 | 45 | 644 | 0 | US ZA IN | |
| 2026-10-23 | 2532 | 618 | 668 | 28 | 1242 | 0 | TW US CA | |
| 2026-10-24 | 3996 | 470 | 533 | 12 | 2996 | 0 | FR BE US | 4xx spike = vulnerability scanners |
| 2026-10-25 | 2231 | 1370 | 739 | 64 | 26 | 0 | US CN SG | |
| 2026-10-26 | 1527 | 468 | 538 | 64 | 401 | 0 | US ID CN | |
| 2026-10-27 | 1974 | 561 | 540 | 52 | 394 | 0 | US BE DE | top HTML paths: / 108, /tools 19, /t/jsonpath-tester 14, /changelog 8, /t/qr-code-decoder 7, /t/unicode-inspector 7 — plus many `.env`/`phpinfo.php` probes |
| 2026-10-28 | 2166 | 473 | 449 | 72 | 73 | 0 | CN US HK | |

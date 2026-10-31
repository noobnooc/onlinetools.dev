# Cloudflare changes

Every write the autopilot makes through the Cloudflare API, newest first, with
enough of the previous value to undo it. Scope is limited to the
`onlinetools.dev` zone (`9223bb0898c72eb65d27cd77e82b1f05`) and the
`onlinetools-dev` Worker in account `b3192aad463ea15f02735c9614aff7a3`.

| Date | What | Before | After | Why | Undo |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31 | Zone setting `security_header` (HSTS) | `enabled: false, max_age: 0` | `enabled: true, max_age: 86400`, no includeSubDomains, no preload, nosniff left to the Worker (it already sends it) | First step of the HSTS ramp from the backlog. Zone has only `onlinetools.dev` and `www` (both proxied, HTTPS-only already), so the risk is low; a 1-day max-age means a mistake expires within a day. Verified `strict-transport-security: max-age=86400` on `/`. Next steps: 1 week (604800) after a clean week, then 6 months (15552000) | `PATCH /zones/9223bb0898c72eb65d27cd77e82b1f05/settings/security_header` `{"value":{"strict_transport_security":{"enabled":false,"max_age":0,"include_subdomains":false,"preload":false,"nosniff":false}}}` |
| 2026-10-30 | Zone setting `email_obfuscation` | `on` | `off` | When on, Cloudflare rewrites any email address in HTML and injects `/cdn-cgi/scripts/…/email-decode.min.js`, a script the site did not ship — at odds with the "zero requests after load" promise. No page contains an address today (checked all 56 English sitemap URLs), so nothing visible changes; this is a guardrail | `PATCH /zones/9223bb0898c72eb65d27cd77e82b1f05/settings/email_obfuscation` `{"value":"on"}` |

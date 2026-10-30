# Cloudflare changes

Every write the autopilot makes through the Cloudflare API, newest first, with
enough of the previous value to undo it. Scope is limited to the
`onlinetools.dev` zone (`9223bb0898c72eb65d27cd77e82b1f05`) and the
`onlinetools-dev` Worker in account `b3192aad463ea15f02735c9614aff7a3`.

| Date | What | Before | After | Why | Undo |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30 | Zone setting `email_obfuscation` | `on` | `off` | When on, Cloudflare rewrites any email address in HTML and injects `/cdn-cgi/scripts/…/email-decode.min.js`, a script the site did not ship — at odds with the "zero requests after load" promise. No page contains an address today (checked all 56 English sitemap URLs), so nothing visible changes; this is a guardrail | `PATCH /zones/9223bb0898c72eb65d27cd77e82b1f05/settings/email_obfuscation` `{"value":"on"}` |

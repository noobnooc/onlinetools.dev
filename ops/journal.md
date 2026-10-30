# Autopilot journal

Newest first. One entry per run; keep each under ~25 lines. Template:

```
## YYYY-MM-DD — <one-line theme of the day>
- Health: <smoke result, live version, anything odd>
- Metrics: <requests / visitors vs. last week, notable movers>
- Shipped: <PR links + one line each; "nothing" is a valid answer>
- Cloudflare: <changes, or "none">
- Community: <issues/PRs handled>
- Learned: <anything the next run should know>
- Next: <what the next run should consider first>
```

---

## 2026-10-30 — Every tool page fully localized
- Health: smoke test green (0 failures) before shipping; live was v2026.10.29 (Worker version `25a07fa7`). No open issues or PRs.
- Metrics: 10-29 was the best day in the log: 1,508 page views, 603 visitors, 0 5xx. Week 10-23→29 vs 10-16→22: page views +18% (5,468 vs 4,646), visitors +15% (4,070 vs 3,527). Human HTML again leans localized: /ja/t/jsonpath-tester 12, /fr/changelog 11, /zh/t/word-counter 9, /zh/t/base64-decode 7, plus pl/ru/vi tool pages.
- Shipped: About/FAQ for the CIDR calculator and the Background Remover in the 16 locales that lacked them (both now have all 18), so the `FAQPage` JSON-LD on those localized pages is no longer English. Also: tool meta descriptions join the tagline and the privacy note with the locale's own stop (`。` zh/ja, `।` hi, a space for th) instead of `. `, via `joinSentences` in `src/lib/i18n/codes.ts` with tests. French sizes use "Mo" to match the tool's UI string. PR link is in the Done table.
- Cloudflare: `email_obfuscation` on → off (privacy guardrail: it injects a Cloudflare script into HTML whenever an email address appears). No page contains one today, so nothing visible changes. Logged in cloudflare-changes.md.
- Community: none open.
- Learned: the translations were done by four parallel subagents (4 locales each), using each locale's own UI labels; that took about 4 minutes. HSTS is off at the zone and the Worker doesn't send it either. I left it alone because HSTS is sticky in browsers once sent; it's in the backlog with a recommended max-age.
- Next: the top-paths log has 3 days now (10-27, 10-28, 10-29). Headline candidates: a tool (JWT signer or chmod calculator), or a Lighthouse/a11y pass on /, /about, /tools.

## 2026-10-29 — CIDR / subnet calculator
- Health: smoke test green before shipping; live was v2026.09.14 (Worker version `da2b57f8`, the #26 merge). `SITE_VERSION` had not been bumped for the Background Remover; today's bump to 2026.10.29 covers it.
- Metrics: week 10-22→28 vs 10-15→21: page views −11% (4,291 vs 4,825), visitors +7% (3,811 vs 3,546), 4xx −70%. 0 user-facing 5xx. Human HTML traffic is a long tail: / 78, then /zh/t/json-formatter 11, /id/t/bcrypt-generator 10, /zh/t/html-formatter 9.
- Shipped: [#27](https://github.com/noobnooc/onlinetools.dev/pull/27) CIDR / Subnet Calculator (tool #46): IPv4 + IPv6, netmask/wildcard input, range → fewest CIDRs, subnet split, membership check, Smart Paste detector, 18-locale labels, en+zh copy. Also fixed the OG image, which still said "27 tools". Released via Workers Builds; post-release smoke green, live v2026.10.29 (Worker version `83ee9fc7`).
- Cloudflare: none. The scanner-blocking WAF item was already done: two custom rules have existed since 2026-08-26, so I dropped it from the backlog.
- Community: no open issues or PRs.
- Learned: zone analytics show 504s on unknown paths with `requestSource: edgeWorkerCacheAPI`. Those are the Worker's own Cache API misses, not responses to visitors (they get 404). Always filter on `requestSource: "eyeball"` before treating 5xx as an incident. `clientRefererHost` isn't available on this zone's plan.
- Next: log another day of top human paths; consider a Content/SEO or i18n headline next (the last two headlines were tools: Background Remover, CIDR). Candidates: title/description audit for the pages that do get traffic, or JSON-LD check.

## 2026-10-28 — Autopilot set up
- Health: smoke test 15/15 green; live version v2026.09.14 (Worker version `ab4991ed`).
- Metrics: baseline backfilled for 10-21 → 10-28: ~2k requests, ~300–1,400 page views and ~350–740 daily visitors; 0 5xx. A large share of 4xx is vulnerability scanners probing `/.env`, `/phpinfo.php`, `/.git/config`.
- Shipped: the autopilot skill, its scripts, and this `ops/` folder.
- Cloudflare: none.
- Learned: merging to `main` deploys automatically (Workers Builds trigger "Deploy default branch"); every branch push gets a preview version ("Deploy non-production branches"). The proxy-injected Cloudflare token works for wrangler but not for the Builds REST API — use the Cloudflare MCP for Builds.
- Next: find which tool pages actually get human traffic (7 days, `requestSource: "eyeball"`, HTML only); pick the first headline item from the backlog.

# Deployment & operations

The production site runs on **Cloudflare Workers Static Assets**. There is no
database, no origin server and no runtime configuration — a deploy is a build
plus an upload of static files.

- [Deploying to Cloudflare](#deploying-to-cloudflare)
- [The release checklist](#the-release-checklist)
- [Headers and CSP](#headers-and-csp)
- [The service worker](#the-service-worker)
- [Brand assets](#brand-assets)
- [Self-hosting on another host](#self-hosting-on-another-host)
- [Troubleshooting](#troubleshooting)

## Deploying to Cloudflare

```sh
pnpm deploy      # = pnpm build && wrangler deploy
```

`@sveltejs/adapter-cloudflare` writes `.svelte-kit/cloudflare/`, and
[`wrangler.jsonc`](../wrangler.jsonc) points the Worker at it:

| Setting | Value | Why |
| --- | --- | --- |
| `main` | `.svelte-kit/cloudflare/_worker.js` | The adapter's asset-serving Worker |
| `assets.directory` | `.svelte-kit/cloudflare` | Prerendered HTML + hashed assets |
| `compatibility_flags` | `nodejs_compat` | Needed by parts of the build output |
| `routes` | `onlinetools.dev`, `www.onlinetools.dev` | Custom domains only |
| `workers_dev` | `false` | Production isn't reachable at `*.workers.dev` |
| `preview_urls` | `true` | Branch builds still get a preview URL |
| `observability` | enabled | Cloudflare-side request logs (no user data — nothing is posted to the Worker) |

First-time setup on a fresh account: `wrangler login`, make sure the zone for
your domain exists, then `pnpm deploy`. The `www` → apex redirect is a
dashboard **Redirect Rule**, not Worker code — it was tried in the Worker and in
`_redirects`, and both were reverted (see the git history around
`4c0e218`). Keep it in the dashboard.

## The release checklist

```
[ ] pnpm test            passes
[ ] pnpm check           0 errors
[ ] pnpm build           prerenders cleanly (a broken internal link fails it)
[ ] pnpm preview         spot-check the built site locally
[ ] src/lib/version.ts   bump SITE_VERSION / SITE_UPDATED (footer badge + sitemap <lastmod>)
[ ] changelog page       add an entry if the change is user-visible
[ ] CHANGELOG.md         mirror it
[ ] pnpm deploy
[ ] Post-deploy: load the site, open DevTools → Network, paste something.
    The request count after load must stay at zero.
```

Versions are dates (`2026.07.24`), not semver — this is a website, not a
library. `src/lib/version.ts` is the single source for both the footer badge and
every `<lastmod>` in the sitemap, so bumping it is what tells search engines the
site changed.

## Headers and CSP

Two places, for a reason:

- **[`svelte.config.js`](../svelte.config.js) → `kit.csp`** emits the
  Content-Security-Policy *per page*, in `hash` mode, so the inline theme and
  hydration scripts are fingerprinted instead of blanket-allowed. `script-src`
  never needs `unsafe-inline`.
- **[`_headers`](../_headers)** (repo root, where adapter-cloudflare looks for
  it) carries what a `<meta>` tag cannot express: `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, COOP/CORP,
  and a `Permissions-Policy` disabling every sensor the site doesn't use.

If you add a genuinely new asset type, extend the CSP directive rather than
loosening an existing one — and if a change requires a third-party origin in
`connect-src`, that change is out of scope for this project.

After deploying, verify with:

```sh
curl -sI https://onlinetools.dev | grep -i -E 'content-security|x-frame|referrer|permissions'
```

## The service worker

`static/sw.js` is hand-written and deliberately tiny:

- `/_app/immutable/*` — content-hashed, cache-first, kept forever.
- Every other same-origin `GET` — network-first with cache fallback.

Bump `VERSION` in `sw.js` when the caching semantics change; the `activate`
handler drops every cache that isn't the current pair. Because hashed assets
are immutable, a normal deploy needs no bump — visitors get new HTML on their
next online load and the old immutable assets simply stop being referenced.

## Brand assets

```sh
pnpm brand:assets
```

Renders every raster asset from the SVG sources plus the OG template in
`scripts/generate-brand-assets.mjs` (via `@resvg/resvg-js` — no browser):
`favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`,
`icon-maskable-512.png`, `og.png`. Inter and JetBrains Mono are fetched once
into `scripts/.fonts/` (gitignored) and cached.

The script mirrors the dark-theme palette from `src/app.css` — keep the two in
sync. If the tool count changes, update the OG eyebrow and the "+ N more" chip
in the script. Design rules live in [BRAND.md](../BRAND.md).

## Self-hosting on another host

Nothing here is Cloudflare-specific except the adapter and the header files, so
a fork can run anywhere that serves static files:

1. Swap `@sveltejs/adapter-cloudflare` for `@sveltejs/adapter-static` (or your
   platform's adapter) in `svelte.config.js`.
2. Re-implement the headers in `_headers`. Netlify reads the same format;
   Vercel and nginx need their own syntax. **Don't skip this step** — the CSP
   is what makes share links safe to open.
3. Update the hardcoded origin: `BASE` in `src/lib/i18n/index.ts`, the sitemap
   `BASE`, `robots.txt`, and the `Canonical:` line in
   `static/.well-known/security.txt`.
4. Point `wrangler.jsonc`'s `routes` at your domain, or delete the file.

Please also change the branding if you publish a fork publicly — the MIT
license covers the code, not the identity. Being a distinct thing with its own
name is better for both of us.

## Troubleshooting

**`pnpm install` refuses to run.** `.npmrc` sets `engine-strict=true` and
`package.json` requires Node ≥ 26. Use the version in `.nvmrc`
(`nvm use`, `fnm use`, or your manager of choice).

**`pnpm build` fails with a 404 during prerender.** `handleHttpError: 'fail'`
is intentional: some page links to a route that doesn't exist. The error names
the source page and the bad href — usually a `related` slug in the registry
that was typo'd or removed.

**A new locale 404s.** Add the code to `EXTRA_LOCALES` in
`src/lib/i18n/codes.ts`. The `lang` param matcher only matches known codes, so
an unregistered prefix is treated as a normal path segment.

**Wrangler can't find the assets directory.** `wrangler deploy` expects
`.svelte-kit/cloudflare` to exist — run `pnpm build` first (or just
`pnpm deploy`, which does both).

**A tool works in dev but not in the built site.** Almost always SSR: something
in the import graph touches `window`/`document` at module scope. Tool
components are dynamically imported for exactly this reason; keep browser-only
work inside `$effect` or behind `if (browser)`.

# Architecture

How onlinetools.dev is put together, and why. If you only read one section,
read [The central constraint](#the-central-constraint) — every other decision
here follows from it.

- [The central constraint](#the-central-constraint)
- [Request lifecycle](#request-lifecycle)
- [Directory map](#directory-map)
- [The tool registry](#the-tool-registry)
- [Tool logic](#tool-logic)
- [The UI layer](#the-ui-layer)
- [Smart Paste and format affinity](#smart-paste-and-format-affinity)
- [Pipelines](#pipelines)
- [State in the URL](#state-in-the-url)
- [Internationalization](#internationalization)
- [SEO surface](#seo-surface)
- [Security model](#security-model)
- [Offline](#offline)
- [Testing](#testing)

## The central constraint

**There is no backend.** Not "a small one", not "just for analytics" — none.
The site builds to static files served by Cloudflare Workers Static Assets, and
after a page loads it issues zero network requests.

Everything else is downstream of that:

| Because there's no server… | …the design has to be |
| --- | --- |
| nothing can be computed remotely | every tool is a pure client-side function |
| there's no session or database | state that needs to survive a link lives in the URL fragment |
| there's no API to rate-limit or authenticate | there's nothing to log in to, and nothing to abuse |
| there's nothing to breach | privacy is a build-time property, not a policy document |
| pages can be fully prerendered | first paint is a static file from an edge cache |

The [About page](https://onlinetools.dev/about) makes this checkable: a
`PerformanceObserver` counts the browser's own network requests after load and
shows the number. It stays at zero. That live counter is the reason the "no
network" rule is treated as non-negotiable rather than aspirational — a single
`fetch()` anywhere in the app would visibly falsify a claim the site makes to
its users.

## Request lifecycle

```
GET /zh/t/json-formatter
        │
        ▼
Cloudflare Workers Static Assets  ──►  prerendered HTML (built at deploy time)
        │                              + CSP, X-Frame-Options, Referrer-Policy
        ▼
Browser hydrates SvelteKit
        │
        ├─ [[lang=lang]]/+layout.ts → loadMessages('zh')   (code-split catalog)
        ├─ t/[slug]/+page.ts        → registry entry + zh long-form content
        └─ TOOL_COMPONENTS[slug]()  → dynamic import of just this tool's UI
        │
        ▼
Typing runs pure functions in the page. No further requests, ever.
```

Build time is where the work happens: `pnpm build` prerenders every page in
every locale — 44 tools × 18 locales, plus the catalog, About, changelog, chain
pages, `sitemap.xml` and `robots.txt`. `handleHttpError: 'fail'` means a broken
internal link fails the build rather than shipping a 404.

## Directory map

```
src/
  app.css                design tokens (CSS variables), both themes
  params/lang.ts         param matcher: only non-English locale prefixes match
  lib/
    tools/               ONE MODULE PER TOOL — pure logic + colocated tests
      types.ts           ToolResult / ok() / err()
      registry.ts        ToolMeta[] — the spine of the whole app
      content.ts         hand-written About + FAQ copy (en)
      content.<loc>.ts   the same, translated (17 locales, optional per tool)
      icons.ts           slug → lucide icon, category → lucide icon
    components/
      tools/             one Svelte component per tool + the lazy import map
      InputArea.svelte   the live badge + inline line:column errors
      OutputPanel.svelte copy / download / share link / "Continue with →"
      CommandPalette…    ⌘K, SmartPaste, Sidebar, ToolShell, …
    detect/
      formats.ts         DataFormat taxonomy + fallback chains
      detectors.ts       confidence-scored content classifiers
      recommend.ts       ranking: content format × ToolMeta.accepts
    chain/
      op-meta.ts         SSR-safe op metadata (no tool imports)
      ops.ts             op id → pure run function
      engine.ts          recipe execution + URL encoding
      presets.ts         curated, individually indexable recipes
    i18n/
      codes.ts           locale list, OG locales, endonyms (no runtime imports)
      index.ts           t() / tt() / lt() / lp() / canonical() / alternates()
      locales/<loc>.ts   message catalogs; en is canonical and types the rest
    state/
      urlstate.ts        base64url fragment encode/decode + size guard
      hashstate.svelte.ts  restore on mount and on hashchange
      handoff.ts         in-memory handoff for payloads too big for a URL
      app.svelte.ts      recent tools, theme preference, current result
      favorites.svelte.ts  favorited tools, synced across tabs
  routes/
    +layout.ts           prerender = true, site-wide
    [[lang=lang]]/       every page behind an optional locale prefix
      t/[slug]/          tool pages (entries: tools × locales)
      chain/[recipe]/    pipeline workbench + preset pages
      tools/, about/, changelog/
    sitemap.xml/, robots.txt/
static/                  icons, manifest, service worker, .well-known/security.txt
scripts/                 brand asset generation (favicons, PWA icons, OG image)
```

## The tool registry

`src/lib/tools/registry.ts` is the single source of truth. One `ToolMeta`
entry drives, without further wiring:

- the sidebar and the `/tools` catalog (grouped by `category`)
- `⌘K` palette matching (`name`, `aliases`, `keywords`, localized names)
- the prerender entry list, `sitemap.xml`, and hreflang alternates
- "Related tools" on every tool page (`related`, expected to be mutual)
- Smart Paste and "Continue with →" ranking (`accepts`)
- JSON-LD `SoftwareApplication` / `BreadcrumbList` / `FAQPage`

Adding a tool means adding data here, not plumbing. See
[adding-a-tool.md](adding-a-tool.md).

## Tool logic

Every module in `src/lib/tools/` is pure: values in, values out, no DOM, no
Svelte, no module-level mutable state. Fallible operations return:

```ts
type ToolResult<T = string> =
	| { ok: true; value: T }
	| { ok: false; error: string; line?: number; column?: number };
```

`line`/`column` exist because "unexpected token in JSON at position 4021" is
exactly the developer experience this site was built to replace. Where the
format allows it, errors point at the character.

Non-determinism is injected rather than imported, so tests can pin it:

```ts
export function uuidV4(random: RandomFn = defaultRandom): string { … }
export function uuidV7(timeMs?: number, random: RandomFn = defaultRandom): string { … }
```

Heavyweight dependencies (`terser`, `bcryptjs`, `yaml`, `jsqr`, `ajv`, …) are
reachable only from the tool that needs them, and every tool component is
dynamically imported, so no visitor downloads a minifier to format JSON.

## The UI layer

Components handle interaction; they never contain conversion logic. The shared
vocabulary is small on purpose:

- **`ToolShell`** — page frame: breadcrumbs, title, favorite button, the
  About/FAQ sections, related tools, JSON-LD. Every tool page gets it for free.
- **`InputArea`** — the site's signature element. A badge on the input's top
  edge reports detected type, size and validity as you type; errors annotate
  inline with `line:column`. No dialogs, no toasts, anywhere in the app.
- **`OutputPanel`** — copy, download, share-link generation, and the "Continue
  with →" menu of ranked follow-up tools.
- **`Segmented`, `StatTile`, `JsonTree`, `ImageDrop`, `Kbd`** — the rest of the
  control set. New one-off control styles are a review comment.

Styling is Tailwind 4 over CSS-variable tokens declared in `src/app.css`
(`--accent`, `--ok`, `--line`, `--surface`, …), so both themes come from the
same class names. One accent color; green means status only. See
[BRAND.md](../BRAND.md).

Svelte 5 runes throughout — `$state`, `$derived`, `$effect`. Cross-component
state lives in `.svelte.ts` modules under `state/`, not in stores.

## Smart Paste and format affinity

Two surfaces share one engine:

1. **Smart Paste** — paste anything on the homepage (or anywhere) and get
   ranked tool suggestions.
2. **"Continue with →"** — pipe one tool's output into the next.

`detect/detectors.ts` holds confidence-scored classifiers — JWT 0.98, image
data URL 0.97, JSON 0.95, HTML 0.94–0.96, XML 0.93, down through CSV, Markdown,
YAML and hex dumps, which are far easier to confuse with plain text. Each
returns a `DataFormat`.

`detect/formats.ts` defines that taxonomy plus a **fallback chain** per format:
JSON also matches tools that accept plain text, but with far lower affinity.
`detect/recommend.ts` ranks `ToolMeta.accepts` against the detected format, so
tools that cannot consume the content at all (image-only tools, pure
generators) drop out entirely rather than being ranked last.

One notable rule: `image` has **no** text fallback — binary content must never
be routed into a text tool.

## Pipelines

`/chain` composes tools into a recipe. The split matters:

- **`op-meta.ts`** — ids, labels, groups, argument specs, with *no* imports of
  tool libraries. Prerendered pages (preset pages, the sitemap) read this.
- **`ops.ts`** — `id → (input, arg?) => ToolResult`, thin pure wrappers over
  already-tested tool functions. Importing it pulls in browser-only code, so it
  stays client-side.

26 ops today. `presets.ts` holds five curated recipes, each with its own page
under `/chain/<slug>` — these target workflow-shaped queries ("decode a JWT and
read its payload") that single-tool pages don't answer. Preset copy is
English-only by design, so the localized prefixes carry `noindex,follow` and
canonicalize to the English original instead of competing as duplicates.

## State in the URL

```
https://onlinetools.dev/t/json-formatter#s=eyJpbnB1dCI6…
                                        └── base64url(JSON), fragment only
```

The **fragment** is the whole trick: browsers never transmit it, so a share
link reproduces state with nobody in the middle. `urlstate.ts` handles
encode/decode and enforces `MAX_SHARED_INPUT` (16,000 chars) — beyond that the
share button refuses with a hint rather than emitting a megabyte URL.
`hashstate.svelte.ts` restores state on mount *and* on `hashchange`, so
same-document navigations (Smart Paste targeting the tool you're already on)
work too. Payloads too large for a URL travel through `handoff.ts`, an
in-memory hand-off that never touches the address bar.

Consequence worth remembering: **content arriving from a share link is
attacker-controlled.** Anything rendered from it gets sanitized — see below.

### What is persisted locally

Three things, all in `localStorage`, all preference-shaped, none of them ever
transmitted:

| Key | Contents |
| --- | --- |
| `ot:favorites` | Slugs of favorited tools (also synced across your open tabs) |
| `ot:recent` | Slugs of recently opened tools, for palette ordering |
| `theme` | `dark` / `light`, or absent when following the system |

**Nothing you type is stored.** Tool input lives in memory for the life of the
tab and in the URL fragment only when you ask for a share link. Adding an
input-persisting feature (local history is on the roadmap) means making it
opt-in and saying so plainly.

## Internationalization

- English is canonical and lives at the URL root. `/en/*` deliberately 404s so
  there is no duplicate of the root.
- Every other locale sits under `/{code}/…`, matched by `params/lang.ts`, which
  matches *only* known non-English codes — so `/tools` is never mistaken for a
  language.
- `[[lang=lang]]/+layout.ts` resolves the locale and loads its catalog through
  a universal load, so catalogs are code-split per locale and never serialized
  into the HTML payload.
- `locales/en.ts` types every other catalog via the `Messages` interface: a
  missing key is a compile error, not a runtime `undefined`.
- Long-form tool copy (`content.<locale>.ts`) is optional per tool; a missing
  entry falls back to English and the section is marked `lang="en"` so the
  fallback is honest to screen readers and crawlers.

Details in [i18n.md](i18n.md).

## SEO surface

Not an afterthought — it's how people find a tool at all. Every page is
prerendered with a localized `<title>`, meta description, canonical, the full
hreflang set (18 + `x-default`), OG/Twitter tags with territory-qualified
locales, and JSON-LD. `sitemap.xml` is generated from the registry × locales
with `<lastmod>` from `src/lib/version.ts`.

`SeoHead` takes an `untranslated` flag for pages whose body is still English
under a non-English prefix: those emit `noindex,follow` and canonicalize to the
English original rather than competing with it. This is why chain preset pages
don't multiply into 18 near-duplicates.

## Security model

There is no server to attack, so the threat model is entirely client-side, and
mostly about hostile share links:

- **CSP in hash mode** (`svelte.config.js`): `default-src 'self'`,
  `form-action 'none'`, `frame-src 'none'`, `object-src 'none'`. Inline theme
  and hydration scripts are hashed, so `script-src` never needs
  `unsafe-inline`. A hostile payload has nowhere to POST and no way to beacon.
- **Header-only hardening** (`_headers`, where adapter-cloudflare expects it):
  `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`, COOP/CORP,
  and a `Permissions-Policy` that switches off every sensor the site doesn't
  use.
- **Sanitized rendering.** The Markdown preview runs through DOMPurify with
  `form`, `input`, `button` and inline styles dropped on top of the defaults —
  Markdown never legitimately emits them, and they're enough to build a
  convincing credential-harvesting page from a share link.
- **Dependency licensing is part of security review.** Every production
  dependency is permissive; `ua-parser-js` was pinned back to the MIT 1.0.x
  line specifically because 2.x is AGPL and its minified code is conveyed to
  every visitor.

Reporting: [SECURITY.md](../SECURITY.md) and `static/.well-known/security.txt`.

## Offline

`static/sw.js` is a hand-written service worker, ~40 lines:

- `/_app/immutable/*` (content-hashed) — cache-first, forever.
- Everything else same-origin `GET` — network-first with cache fallback.

So every tool you've opened keeps working with no connection, and the app
installs to a dock or home screen via `manifest.webmanifest`. Bump `VERSION` in
`sw.js` when cached-asset semantics change; old caches are dropped on activate.

## Testing

- **Unit tests** (Vitest, node environment, `src/**/*.test.ts`) — 37 suites,
  one per tool module plus the detectors, the ranking engine, the chain engine,
  URL state and favorites. Pure logic makes them fast and boring, which is the
  point.
- **`pnpm check`** — `svelte-check` in TypeScript strict mode, 0 errors.
- **`pnpm build`** — the real integration test: it prerenders every page in
  every locale, and `handleHttpError: 'fail'` turns a broken internal link into
  a build failure.

There are no component tests today; UI regressions are caught by review and by
the build. A PR that adds meaningful component-level coverage would be welcome.

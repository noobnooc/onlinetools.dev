# onlinetools.dev

Local-first, keyboard-first developer tools for the web. Every tool computes
entirely in the browser — input never leaves the machine — and the whole site
prerenders to static pages served from Cloudflare Workers Static Assets.

## Principles

1. **Everything runs locally.** Tools are pure client-side computation; pages
   work offline once loaded. The UI states this quietly (a "Runs locally"
   badge per tool), not loudly.
2. **Faster than a desktop app.** No login, no dialogs before first use,
   `⌘K` reaches any tool, pasting anything anywhere suggests the right tool.
3. **AI is a button inside a tool, not a chat window.** (Planned — AI actions
   will live inside specific tools with non-AI fallbacks; no conversational UI.)

## Stack

- **pnpm** (`packageManager` pinned) · **SvelteKit** + **Svelte 5 runes** + TypeScript strict
- **@sveltejs/adapter-cloudflare** — Workers Static Assets; config in `wrangler.jsonc`
- **Tailwind CSS 4** over CSS-variable design tokens (dark-first, light theme first-class)
- **Bits UI** headless primitives, **lucide-svelte** icons
- **Vitest** for pure-function unit tests; Playwright smoke script for flows

## Architecture

```
src/lib/tools/        pure logic, one module per tool + unit tests (no DOM)
src/lib/tools/registry.ts   tool metadata: slugs, aliases, categories, related
src/lib/tools/content.ts    individually written SEO copy + FAQs per tool
src/lib/detect/       Smart Paste detector registry (confidence-scored)
src/lib/state/        URL-fragment state sharing, hash restore, UI stores
src/lib/components/   UI: InputArea (live badge), OutputPanel, palette, …
src/routes/t/[slug]/  tool pages — prerendered, JSON-LD, canonical, FAQ
```

Key invariants:

- Tool logic is **pure functions** returning `{ok, value} | {ok, error, line?, column?}`;
  UI never contains conversion logic. Every tool module has unit tests.
- Tool state serializes into the URL **fragment** (`#s=base64url(json)`), so
  shared links reproduce state without any server involvement. Oversized
  inputs refuse to share rather than emit megabyte URLs.
- Errors render inline with line/column — no dialogs, no toasts.
- One accent color; status colors only for status; borders express hierarchy.

## Develop

```sh
pnpm install
pnpm dev        # vite dev server
pnpm test       # vitest unit tests
pnpm check      # svelte-check, strict
pnpm build      # static build via adapter-cloudflare
pnpm deploy     # build + wrangler deploy
```

## Roadmap

- M2: remaining launch tools (30 total), full Smart Paste coverage, batch
  mode, PWA offline install, dynamic OG images.
- M3: embedded AI actions (regex/cron/SQL explain & generate, mock data,
  error diagnosis) behind a rate-limited Worker endpoint; tool pipelines
  with preset chain pages; local history (IndexedDB).
- M4: AI-generated chains, split-pane workbench, quotas/login, i18n (zh).

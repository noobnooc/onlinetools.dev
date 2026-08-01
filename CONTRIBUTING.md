# Contributing to onlinetools.dev

Thanks for being here. This project is small enough that a good pull request
lands quickly, and opinionated enough that it's worth five minutes of reading
first — most review back-and-forth comes from one of the invariants below, not
from taste.

- [Ways to help](#ways-to-help)
- [Getting set up](#getting-set-up)
- [The non-negotiables](#the-non-negotiables)
- [Adding a tool](#adding-a-tool)
- [Code conventions](#code-conventions)
- [Writing copy](#writing-copy)
- [Translations](#translations)
- [Commits and pull requests](#commits-and-pull-requests)
- [Reviews](#reviews)

## Ways to help

| | |
| --- | --- |
| 🐛 **Report a bug** | [Open an issue](https://github.com/noobnooc/onlinetools.dev/issues/new/choose) with the input that broke it. A minimal reproduction beats a description every time. |
| 🔧 **Add a tool** | Please [open a proposal issue](https://github.com/noobnooc/onlinetools.dev/issues/new/choose) before building, so we agree on scope. Then follow [docs/adding-a-tool.md](docs/adding-a-tool.md). |
| 🌍 **Translate** | 18 locales are live; all of them can be improved by a native speaker. See [docs/i18n.md](docs/i18n.md). |
| ✍️ **Improve the copy** | The About/FAQ text on every tool page is hand-written. If a sentence is wrong, vague, or made you google something else, fix it. |
| ⚡ **Fix an edge case** | Malformed input, a Unicode oddity, a browser quirk — these are the most valuable PRs. Add the failing case as a test first. |

Small fixes need no issue. Anything that adds a dependency, a page, or a
network call should start as a conversation.

## Getting set up

```sh
corepack enable          # gets the pinned pnpm 10.x
pnpm install
pnpm dev                 # → http://localhost:5173
```

Node ≥ 26 is required (`.nvmrc` pins it; `.npmrc` sets `engine-strict=true`, so
an older Node fails the install rather than half-working). There is nothing else
to configure — no `.env`, no keys, no services.

Before pushing:

```sh
pnpm test      # vitest — must pass
pnpm check     # svelte-check, TypeScript strict — must report 0 errors
pnpm build     # catches prerender failures the other two can't
```

CI runs the same three on every pull request.

## The non-negotiables

These are the promises the site makes on its [About page](https://onlinetools.dev/about).
A PR that breaks one will be sent back no matter how good the rest of it is.

1. **No network requests at runtime.** No analytics, no error reporting, no
   CDN fonts, no "check for updates", no API — not even for one tool, not even
   behind a flag. Everything is bundled and prerendered. If your tool cannot
   work with the network cable unplugged, it does not belong here yet.
2. **No user input leaves the page.** Not to a server, not to `localStorage`
   by default, not into a URL query string. State sharing goes through the
   URL **fragment**, which browsers never transmit.
3. **No new runtime dependency without a reason.** Every production dependency
   ships to the visitor and must be permissively licensed (MIT/BSD/Apache/ISC —
   **no (A)GPL**, since we convey the minified code to every visitor). Prefer
   the platform: `WebCrypto`, `Intl`, `URL`, `TextEncoder`, `<canvas>` cover
   more than people expect. Big libraries must be dynamically imported so only
   their own tool page pays for them.
4. **Logic stays pure.** Tool modules under `src/lib/tools/` must not touch the
   DOM, `window`, or Svelte state. They take values and return values.
5. **Tests come with the code.** Every tool module has a `.test.ts` next to it.
   New behavior, new test; bug fix, regression test.
6. **Accessibility isn't optional.** Everything reachable by keyboard, visible
   focus rings, labeled controls, no color-only signals.

## Adding a tool

Full walkthrough with code: **[docs/adding-a-tool.md](docs/adding-a-tool.md)**.
The short version — a new tool touches eight files:

| File | What goes there |
| --- | --- |
| `src/lib/tools/<tool>.ts` | Pure logic, returning `ToolResult` |
| `src/lib/tools/<tool>.test.ts` | Unit tests, including malformed input |
| `src/lib/tools/registry.ts` | `ToolMeta`: slug, name, description, category, aliases, keywords, `accepts`, `related` |
| `src/lib/tools/icons.ts` | A lucide icon for the slug |
| `src/lib/tools/content.ts` | Hand-written About paragraphs + FAQs |
| `src/lib/components/tools/<Name>Tool.svelte` | The UI |
| `src/lib/components/tools/index.ts` | Lazy import entry |
| `src/lib/i18n/locales/en.ts` | Any new UI labels (`tl` namespace) |

Optionally also `src/lib/detect/detectors.ts` (so Smart Paste can suggest it)
and `src/lib/chain/ops.ts` (so it can be used in a pipeline).

Good tool candidates are: things developers actually reach for weekly, that can
be computed locally, and that existing sites do badly (upload your data, bury
the result in ads, or get Unicode wrong). Tools that need a server, an API key,
or someone else's dataset are out of scope by design.

## Code conventions

**Result shape.** Every fallible operation returns a `ToolResult`:

```ts
import { type ToolResult, ok, err } from './types';

export function parseThing(input: string): ToolResult<Thing> {
	if (!input.trim()) return err('Enter something to parse');
	// …
	return ok(thing);
}
```

Include `line` and `column` in `err()` whenever the format makes it possible —
the UI renders them inline, and "unexpected token somewhere" is exactly the
experience this site exists to replace.

**Determinism.** Anything random or time-dependent takes an injectable source
so tests are deterministic (see `src/lib/tools/uuid.ts`):

```ts
export function uuidV4(random: RandomFn = defaultRandom): string { … }
```

**Svelte 5 runes.** `$state`, `$derived`, `$effect`. No stores for local UI
state, no legacy reactive `$:` syntax.

**TypeScript strict.** No `any`, no non-null `!` to silence the checker. If a
type is genuinely unknowable, narrow it explicitly.

**Errors are inline.** No `alert()`, no toasts, no modal dialogs. Ever.

**Styling.** Tailwind 4 utilities over the CSS-variable tokens in
`src/app.css` — use `text-dim`, `border-line`, `bg-surface`, `text-accent`
rather than raw palette values, so both themes stay correct. One accent color;
green means "status", not "primary". See [BRAND.md](BRAND.md).

**Comments** explain *why*, not *what*. The existing code is a good guide:
sparse, but present exactly where a decision would otherwise look arbitrary.

**Formatting.** Tabs for indentation, single quotes, semicolons — match the
file you're in. There is no autoformatter in CI; just don't reformat lines you
aren't changing, so diffs stay readable.

## Writing copy

Tool pages carry hand-written `about` paragraphs and FAQs, and this is
deliberate: templated filler is what makes every other tools site feel like
SEO landfill. When you add or edit copy:

- Write for someone who arrived from a search result and is in a hurry.
- Be specific and concrete: name the RFC, the edge case, the browser behavior.
- FAQs should answer questions people actually ask (the ones that made *you*
  open a second tab), not restate the tool description.
- Say plainly that the tool runs locally where it matters — a JWT or a password
  is exactly when someone wants to know.
- No superlatives, no "blazing fast", no exclamation marks.

## Translations

The UI ships in 18 languages. English is canonical and lives in
`src/lib/i18n/locales/en.ts`; every other locale mirrors its shape, and the
`Messages` type makes a missing key a type error.

Improving an existing translation is one of the easiest useful PRs there is —
you don't need to touch any logic. Adding a whole new locale is a bigger job
(UI catalog + tool names + long-form content). Both are documented in
**[docs/i18n.md](docs/i18n.md)**.

## Commits and pull requests

**Commits.** Imperative mood, one logical change each, no prefix ceremony —
match the existing log:

```
Add a QR code decoder tool
Harden share links, relicense the UA parser, de-duplicate chain URLs
Fix mobile nav app name spacing
```

The subject says what changed; the body says why, and lists anything a reviewer
would otherwise have to discover.

**Pull requests.** Fill in the template. In particular:

- [ ] `pnpm test`, `pnpm check` and `pnpm build` all pass locally
- [ ] New/changed logic has unit tests
- [ ] No new network request at runtime, no new non-permissive dependency
- [ ] Works in both dark and light themes
- [ ] Keyboard reachable, focus visible
- [ ] Screenshots for anything visual (both themes if it's a UI change)

Keep PRs focused. A tool, a fix, or a translation — not all three. Unrelated
refactors in the same diff are the main reason review takes a week instead of a
day.

## Reviews

This is a solo-maintained project, so response time varies; a ping after a week
is welcome, not rude. Expect review to focus on the invariants above, on edge
cases (empty input, huge input, non-ASCII, invalid input), and on whether the
copy earns its place. Direct feedback on code is not feedback on you — and the
same goes in the other direction. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

By contributing, you agree that your contributions are licensed under the
project's [MIT license](LICENSE).

# Adding a tool

A complete walkthrough, using a hypothetical **Text ↔ ROT13** tool as the
example. Nothing here is boilerplate you can skip — each file exists because
something (search, the palette, Smart Paste, the sitemap, a locale) reads it.

> Please [open a proposal issue](https://github.com/noobnooc/onlinetools.dev/issues/new/choose)
> before building. Scope questions are much cheaper to settle before the code
> exists — and some tools are deliberately out of scope (anything needing a
> server, an API key, or a dataset we'd have to ship).

**Contents**

1. [Decide the shape](#1-decide-the-shape)
2. [The logic module](#2-the-logic-module)
3. [The tests](#3-the-tests)
4. [Register the tool](#4-register-the-tool)
5. [The icon](#5-the-icon)
6. [The page copy](#6-the-page-copy)
7. [The UI component](#7-the-ui-component)
8. [Wire it into the lazy map](#8-wire-it-into-the-lazy-map)
9. [Labels and i18n](#9-labels-and-i18n)
10. [Optional: Smart Paste and pipelines](#10-optional-smart-paste-and-pipelines)
11. [Checklist](#11-checklist)

---

## 1. Decide the shape

Ask three questions before writing anything:

- **Can it run entirely offline?** No API, no remote dataset. If not, it does
  not belong here.
- **Is the core a pure function?** `input → output`, no DOM, no globals beyond
  what the platform gives you (`crypto`, `Intl`, `TextEncoder`, `URL`, canvas).
- **Does it need a dependency?** Prefer the platform. If you truly need a
  library it must be permissively licensed (**no (A)GPL**) and dynamically
  imported so only this tool's page downloads it.

Then pick a **slug** — lowercase, hyphenated, and phrased the way somebody
would search for it (`rot13-encoder`, not `rot13`). The slug is the URL, the
key in six different maps, and effectively permanent once shipped.

## 2. The logic module

`src/lib/tools/rot13.ts` — pure functions only.

```ts
import { type ToolResult, ok, err } from './types';

export interface Rot13Options {
	/** ROT13 for letters only, or ROT47 across printable ASCII. */
	variant: 'rot13' | 'rot47';
}

/**
 * ROT13 is its own inverse, so one function covers both directions — which is
 * why the UI has no encode/decode switch.
 */
export function rotate(input: string, opts: Rot13Options): ToolResult {
	if (!input) return err('Enter some text to transform');

	if (opts.variant === 'rot47') {
		return ok(
			[...input]
				.map((ch) => {
					const c = ch.codePointAt(0)!;
					return c >= 33 && c <= 126 ? String.fromCodePoint(33 + ((c - 33 + 47) % 94)) : ch;
				})
				.join('')
		);
	}

	return ok(input.replace(/[a-z]/gi, (ch) => {
		const base = ch <= 'Z' ? 65 : 97;
		return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
	}));
}
```

Rules that matter:

- **Return `ToolResult`**, never throw. `err()` takes optional `line` and
  `column` — supply them whenever the format allows, because the input badge
  renders them inline and that precision is the whole point.
- **No DOM, no Svelte imports, no module-level mutable state.**
- **Inject non-determinism.** Anything using `Math.random`, `crypto`,
  `Date.now()` or a timezone takes it as a defaulted parameter so tests can pin
  it — see `uuid.ts` (`RandomFn`) and `timestamp.ts`.
- **Export a detector predicate** if the format is recognizable
  (`isLikelyRot13`), so step 10 can use it.
- **Unicode is not an edge case.** Decide explicitly what happens with
  astral-plane characters, combining marks and lone surrogates, and test it.

## 3. The tests

`src/lib/tools/rot13.test.ts`, next to the module. Vitest, node environment.

```ts
import { describe, expect, it } from 'vitest';
import { rotate } from './rot13';

describe('rotate', () => {
	it('round-trips ASCII letters', () => {
		const once = rotate('Hello, World!', { variant: 'rot13' });
		expect(once).toEqual({ ok: true, value: 'Uryyb, Jbeyq!' });
		expect(rotate(once.ok ? once.value : '', { variant: 'rot13' }))
			.toEqual({ ok: true, value: 'Hello, World!' });
	});

	it('leaves non-ASCII untouched', () => {
		expect(rotate('日本語 🎉', { variant: 'rot13' }))
			.toEqual({ ok: true, value: '日本語 🎉' });
	});

	it('rejects empty input with a usable message', () => {
		const r = rotate('', { variant: 'rot13' });
		expect(r.ok).toBe(false);
	});
});
```

Cover at minimum: the happy path, a round-trip if the operation is reversible,
empty input, malformed input, and non-ASCII. Bug fixes always land with the
regression test that would have caught them.

```sh
pnpm test              # once
pnpm test:watch        # while working
```

## 4. Register the tool

`src/lib/tools/registry.ts` — add a `ToolMeta`. This single entry feeds the
sidebar, the catalog, the command palette, the sitemap, hreflang alternates,
JSON-LD and the recommendation engine.

```ts
{
	slug: 'rot13-encoder',
	accepts: ['text'],
	name: 'ROT13 / ROT47 Encoder',
	description: 'Shift letters by 13 (or printable ASCII by 47) — its own inverse',
	category: 'encoding',
	aliases: ['rot13', 'rot 13', 'caesar cipher', 'rot47'],
	keywords: ['rot13 decoder', 'rot13 encoder', 'caesar cipher online'],
	related: ['base64-decode', 'string-escape', 'text-to-hex', 'unicode-inspector', 'hash-generator', 'url-encode-decode']
}
```

| Field | Notes |
| --- | --- |
| `slug` | URL and map key. Permanent. |
| `name` | Title case, as shown everywhere. Include both directions if bidirectional (`X ↔ Y`). |
| `description` | One imperative line, ~60–90 chars. Used in cards, the palette and the meta description — write it as a search snippet. |
| `category` | One of the ten in `ToolCategory`. Adding a category means also updating `CATEGORY_LABELS`, `CATEGORY_ICONS` and every locale's `categories` block. |
| `accepts` | `DataFormat`s this tool consumes, best first. Drives "Continue with →" and Smart Paste ranking. Omit for pure generators. |
| `aliases` | What people *type* — abbreviations, misspellings, the name the tool has elsewhere. |
| `keywords` | Search-intent phrases, for the palette and the page. |
| `related` | Six sibling slugs. **Also add your slug to their `related` arrays** — the graph should be mutual, or your tool ends up an orphan. |

## 5. The icon

`src/lib/tools/icons.ts` — import a [lucide](https://lucide.dev) icon and map
the slug. Reuse an existing icon only when the meaning genuinely matches;
`iconFor()` falls back to `Wrench`, which looks like a mistake in the sidebar.

```ts
import { RotateCw } from 'lucide-svelte';
// …
'rot13-encoder': RotateCw,
```

## 6. The page copy

`src/lib/tools/content.ts` — the About paragraphs and FAQs shown under the tool.
**Write these individually.** Templated filler is exactly what makes every other
tools site read like SEO landfill, and it's the single most common thing sent
back in review.

```ts
'rot13-encoder': {
	about: [
		'ROT13 replaces every letter with the one 13 places after it in the alphabet…',
		'ROT47 extends the same idea across the 94 printable ASCII characters…',
		'This is obfuscation, not encryption — anyone can undo it in one step, which is the point. It runs in your browser regardless, so nothing you paste is uploaded.'
	],
	faqs: [
		{
			q: 'Is ROT13 encryption?',
			a: 'No. It has no key…'
		}
	]
}
```

Guidance:

- 2–4 `about` paragraphs. Lead with what the tool does, then the interesting
  detail (a standard, an edge case, a gotcha), then the local-only note where
  it's actually reassuring (tokens, passwords, personal data).
- 3–5 FAQs answering questions people really ask — the ones that made *you*
  open a second tab. Not a restatement of the description.
- Concrete over grand: name the RFC, the browser behavior, the failure mode.
  No superlatives, no exclamation marks.

Translations of this copy live in `content.<locale>.ts` and are optional — a
locale without an entry falls back to English, and the page marks that section
`lang="en"` so screen readers and search engines aren't misled. See
[i18n.md](i18n.md).

## 7. The UI component

`src/lib/components/tools/Rot13Tool.svelte`. Svelte 5 runes; the component
handles interaction only — every transformation goes through your module.

```svelte
<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { rotate, type Rot13Options } from '$lib/tools/rot13';
	import { currentResult } from '$lib/state/app.svelte';
	import { initFromHash } from '$lib/state/hashstate.svelte';

	let input = $state('');
	let variant = $state<Rot13Options['variant']>('rot13');

	// Restore state from a shared link (#s=…) and from same-page handoffs.
	initFromHash((s) => {
		if (s.input !== undefined) input = s.input;
		if (s.variant === 'rot13' || s.variant === 'rot47') variant = s.variant;
	});

	const result = $derived(rotate(input, { variant }));
	const output = $derived(result.ok ? result.value : '');

	// Feeds the global "Continue with →" chain.
	$effect(() => {
		currentResult.text = output;
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('rot13Input')}
		placeholder={tt('rot13Placeholder')}
		badge={[{ text: `${input.length} chars`, tone: 'dim' }]}
		error={result.ok ? null : { message: result.error }}
	/>

	<Segmented
		bind:value={variant}
		label={tt('rot13Variant')}
		options={[
			{ value: 'rot13', label: 'ROT13' },
			{ value: 'rot47', label: 'ROT47' }
		]}
	/>

	<OutputPanel value={output} filename="rot13.txt" shareState={{ input, variant }} />
</div>
```

What you get for free by using the shared components:

- **`InputArea`** — the live badge (type, size, validity) and inline
  `line:column` error annotation.
- **`OutputPanel`** — copy, download, share-link generation (fragment-encoded,
  and it refuses inputs over `MAX_SHARED_INPUT`), and the "Continue with →"
  chain into ranked follow-up tools.
- **`Segmented`, `Kbd`, `StatTile`, `ImageDrop`, `JsonTree`** — the shared
  control vocabulary. Please don't introduce a new select style.
- **`initFromHash`** — share links and Smart Paste handoffs, both directions.

Also: keep `shareState` keys short and stable (they're in people's URLs
forever), work in both themes, and never render untrusted input as HTML without
sanitizing — a share link is attacker-controlled content.

## 8. Wire it into the lazy map

`src/lib/components/tools/index.ts`:

```ts
'rot13-encoder': () => import('./Rot13Tool.svelte'),
```

This is what keeps each tool page downloading only its own code (and its own
dependencies). The route resolves the component from this map at render time —
there is nothing else to register.

## 9. Labels and i18n

Any UI string inside your component goes through `tt()` and is declared in the
`tl` namespace of `src/lib/i18n/locales/en.ts`:

```ts
tl: {
	// …
	rot13Input: 'Text',
	rot13Placeholder: 'Paste text to transform…',
	rot13Variant: 'Variant',
}
```

Prefix tool-specific keys with a short tool name (`rot13…`, `b64…`, `uuid…`) —
`tl` is one flat namespace shared by all 44 tools, so bare words like `mode` or
`count` are already taken as *shared* labels. Reuse those where they fit.

The `Messages` type is derived from `en`, so **every other locale file must
gain the same key** or `pnpm check` fails. If you don't speak the language,
copy the English string — a translator can improve it later, and the type stays
satisfied. Tool `name`/`description` translations live in each locale's `tools`
block; leaving your slug out simply falls back to the registry English.

Full details: [i18n.md](i18n.md).

## 10. Optional: Smart Paste and pipelines

**Smart Paste** (`src/lib/detect/detectors.ts`) — add a detector so pasting
this kind of content anywhere suggests your tool:

```ts
{
	id: 'rot13',
	detect(input) {
		if (!isLikelyRot13(input)) return null;
		return {
			type: 'rot13',
			format: 'text',
			label: 'ROT13-looking text',
			confidence: 0.55,
			tool: 'rot13-encoder',
			actions: [{ label: 'Decode', tool: 'rot13-encoder' }]
		};
	}
}
```

Confidence ordering is what makes suggestions feel smart — be conservative.
Anything that could plausibly be plain text should score below the unambiguous
structured detectors (JWT 0.98, JSON 0.95, XML 0.93), in the band where YAML
(0.6) and CSV (0.7) already sit. If you introduce a genuinely new
data type, add it to `DataFormat` in `src/lib/detect/formats.ts` along with its
fallback chain, and cover the ranking in `detectors.test.ts`.

**Pipelines** — expose the transform as a chainable op so it can appear in
`/chain` recipes. This is two files, deliberately split so prerendered pages can
read op labels without importing browser-only tool libraries:

```ts
// src/lib/chain/op-meta.ts — SSR-safe metadata, no tool imports
{ id: 'rot13', label: 'ROT13', group: 'encoding' },

// src/lib/chain/ops.ts — the run function, keyed by the same id
'rot13': (i) => rotate(i, { variant: 'rot13' }),
```

Ops are `string → ToolResult` and must stay pure — a thin wrapper over logic
that is already unit-tested. `engine.test.ts` exercises every op and every
preset recipe, and an id present in `op-meta.ts` with no entry in `RUNS`
degrades to an error result rather than a crash. A curated recipe in `chain/presets.ts` also gets
its own indexable page — worth it when the *workflow* is what people search
for ("decode a JWT and read its payload"), not the individual tool.

## 11. Checklist

```
[ ] src/lib/tools/<tool>.ts               pure logic, returns ToolResult
[ ] src/lib/tools/<tool>.test.ts          happy path, round-trip, empty, malformed, non-ASCII
[ ] src/lib/tools/registry.ts             ToolMeta — and your slug added to neighbors' `related`
[ ] src/lib/tools/icons.ts                a lucide icon that isn't the fallback wrench
[ ] src/lib/tools/content.ts              hand-written about + FAQs
[ ] src/lib/components/tools/<Name>Tool.svelte
[ ] src/lib/components/tools/index.ts     lazy import entry
[ ] src/lib/i18n/locales/en.ts            new `tl` labels (+ the same keys in all 17 others)
[ ] optional: detect/detectors.ts, chain/ops.ts, content.<locale>.ts

[ ] pnpm test    passes
[ ] pnpm check   0 errors
[ ] pnpm build   prerenders (44 tools × 18 locales — a bad link fails the build)
[ ] Works offline: load the page, kill the network, use the tool
[ ] Both themes, keyboard reachable, visible focus
[ ] ⌘K finds it by name and by alias
[ ] A share link round-trips the state
```

When the build is green, add a line to the changelog page
(`src/routes/[[lang=lang]]/changelog/+page.svelte`) and to
[CHANGELOG.md](../CHANGELOG.md) if your change is user-visible.

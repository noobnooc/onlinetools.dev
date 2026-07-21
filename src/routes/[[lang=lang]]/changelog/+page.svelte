<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead
	path="/changelog"
	title="Changelog — onlinetools.dev"
	description="What's new on onlinetools.dev — new tools, features and fixes."
/>

<div class="mx-auto max-w-3xl px-6 py-8">
	<h1 class="mb-8 text-xl font-semibold tracking-tight">Changelog</h1>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Image tools</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.07.21c</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New Image category (31 tools total): Image ↔ Base64 converter with data URL, CSS and
				HTML snippets in both directions; image format converter between PNG, JPEG and WebP
				with a live quality dial; an image resizer by width, height or percentage; and a
				favicon generator that packs favicon.ico (16/32/48), the Apple touch and PWA PNG
				set, a starter webmanifest and the matching &lt;link&gt; tags into one ZIP.
			</li>
			<li>
				Like everything else here, images are processed entirely in your browser on a local
				canvas — files are never uploaded, and formats are detected from magic bytes, not
				file extensions.
			</li>
			<li>
				Smart Paste now recognizes image data URLs and offers to preview and download them.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Ten languages</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.07.21b</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The whole site now speaks ten languages — English, 中文, 日本語, 한국어, Español,
				Français, Deutsch, Português, Русский and Italiano — with a switcher in the footer.
			</li>
			<li>
				English URLs are unchanged; every other language lives under its own prefix
				(/zh/t/json-formatter). Each page declares hreflang alternates for all ten locales,
				a localized title, description and JSON-LD, and the sitemap lists every variant.
			</li>
			<li>
				Tool names and descriptions are translated everywhere they appear — sidebar, catalog,
				command palette (which now also matches queries in your language), Smart Paste and the
				"Continue with" chain, which keeps you in your language as results flow between tools.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Floating workspace & unified controls</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.07.21 — versions are dates from here on</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New shell: the sidebar and page share one recessed canvas, and the content lives in a
				floating rounded card that stays fixed in the viewport — scrolling happens inside it.
			</li>
			<li>
				Sidebar cleaned up: compact tool labels that never truncate, an active pill that reads on
				the canvas, scroll fade-outs top and bottom, and a three-state theme control (system /
				dark / light) beside the brand.
			</li>
			<li>
				Every form control now shares one look: small selects became segmented toggles with
				visual options (indent as ··&nbsp;/&nbsp;····&nbsp;/&nbsp;⇥&nbsp;/&nbsp;{'{}'}, CSV
				delimiter as ,&nbsp;/&nbsp;;&nbsp;/&nbsp;⇥, sort order as A→Z), and checkboxes, selects
				and inputs are custom-styled everywhere.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">App shell & offline install</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">2026-07 · v0.3</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The site is now an app: a persistent sidebar lists every tool by category with the
				current one highlighted; on phones it becomes a slide-in drawer behind a compact top bar.
			</li>
			<li>
				Installable PWA — a service worker caches visited pages and assets, so every tool you have
				opened keeps working with no connection, and the app can be added to your dock or home
				screen.
			</li>
			<li>Denser, left-aligned overview page sized for the workspace layout.</li>
			<li>Fixed: JSON → CSV preview misaligned quoted cells; QR codes now encode CJK/emoji as UTF-8.</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">16 new tools & a visual pass</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">2026-07 · v0.2</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New tools (27 total): case converter, word counter, lorem ipsum, slug generator, sort &amp;
				dedupe lines, HTML entities, Unicode inspector, cron parser with next-run preview, password
				generator with an entropy meter, QR codes (SVG/PNG), JSON ↔ YAML ↔ TOML, JSON → CSV,
				JSON → TypeScript, JSONPath tester, bcrypt hash &amp; verify, User-Agent parser.
			</li>
			<li>JSON formatter gained a collapsible tree view with per-node JSONPath copy.</li>
			<li>JWT decoder now shows token anatomy and a live lifetime bar.</li>
			<li>Timestamp converter compares 7 timezones on a 24-hour day strip.</li>
			<li>Color converter adds RGB channel bars and WCAG contrast checks.</li>
			<li>Every output panel has “Continue with →” to pipe a result into another tool.</li>
			<li>Tool icons everywhere, breadcrumbs, and per-tool code-splitting for faster loads.</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-2 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Initial release</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">2026-07 · v0.1</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				First 11 tools: JSON formatter, Base64, unix timestamps, JWT decoder, regex tester, text
				diff, URL encode/decode, URL parser, UUID/ULID/Nano ID generator, hashes &amp; HMAC, color
				converter.
			</li>
			<li>⌘K command palette with fuzzy search, aliases and verb-style direct execution.</li>
			<li>Smart Paste: paste anywhere and the content type is detected with tool suggestions.</li>
			<li>Shareable state — any tool state serializes into the URL fragment, never to a server.</li>
			<li>Dark and light themes, full keyboard operation, visible focus rings.</li>
		</ul>
		<p class="mt-3 text-sm text-dim">
			Coming next: the remaining launch tools (YAML/TOML, case converter, cron parser, QR codes,
			password generator, image compression and more), tool pipelines, batch mode, offline PWA
			install, and embedded AI actions inside individual tools.
		</p>
	</section>
</div>

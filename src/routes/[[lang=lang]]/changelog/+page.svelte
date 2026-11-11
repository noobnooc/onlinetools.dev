<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t, lp } from '$lib/i18n';
</script>

<SeoHead
	path="/changelog"
	title="{t('changelog')} — onlinetools.dev"
	description={t('changelogMetaDescription')}
/>

<div class="mx-auto max-w-3xl px-6 py-8">
	<h1 class="mb-8 text-xl font-semibold tracking-tight">{t('changelog')}</h1>

	<!-- Release notes are English-only content; the surrounding page chrome is localized. -->
	<div lang="en">
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">A lighter Pipeline</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.11</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The <a href={lp('/chain')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Pipeline</a>
				and its recipe pages now download less than half the JavaScript they did. Steps that need a bigger library
				(YAML, SQL, Markdown, code formatting, JSON Schema) load it the first time you add one, from this site.
			</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Query strings in the Pipeline</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.10</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				Two new Pipeline steps: "Query string → JSON" and "JSON → query string". Repeated keys become arrays, and
				bracket notation like <code>user[name]=Ada</code> or <code>tags[]=a</code> becomes nested objects and arrays.
			</li>
			<li>
				Four new recipes: <a href={lp('/chain/query-string-to-json')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">parse a query string into JSON</a>,
				<a href={lp('/chain/get-query-parameter-from-url')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">get one parameter from a URL</a>,
				<a href={lp('/chain/json-to-query-string')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">convert JSON to a query string</a> and
				<a href={lp('/chain/yaml-to-json')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">convert YAML to JSON</a>.
			</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Lighter pages</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.09</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				Every page downloads less JavaScript. Tool pages went from about 250 KB to 140 KB (compressed), the home
				page from about 200 KB to 135 KB, and localized tool pages from about 310 KB to 155 KB.
			</li>
			<li>
				Smart Paste no longer loads the YAML, TOML, Markdown and XML libraries on every page just to recognize a
				format. They now load only on the tools that use them.
			</li>
			<li>
				A tool page now carries only its own About and FAQ, not the text for every tool.
			</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">cURL → fetch / Python / Go</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.08</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New tool: <a href={lp('/t/curl-converter')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">cURL →
				fetch / Python / Go</a>. Paste a curl command, for example from "Copy as cURL" in the network panel, and get
				the same request as JavaScript fetch, axios, Python requests or Go net/http.
			</li>
			<li>
				It follows curl's own rules for -d, -G, --data-urlencode, --json, -F uploads, -u, -b and more, and turns a
				JSON body into an object literal. Anything it can't carry over is listed as a warning.
			</li>
			<li>
				Commands with tokens or cookies stay out of share links. Smart Paste recognizes curl commands.
			</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Color Contrast Checker</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.07</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New tool: the <a href={lp('/t/contrast-checker')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Color Contrast
				Checker</a>. It grades a text and background pair for WCAG AA and AAA, normal and large text, and the
				3:1 rule for UI components. The ratio is rounded down, so a failing pair never reads as passing.
			</li>
			<li>
				When a pair fails, it suggests the nearest darker and lighter colors that pass, for either color, keeping
				the hue.
			</li>
			<li>
				Smart Paste opens it for two colors like "#333 on #fff". The <a href={lp('/t/color-converter')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Color
				Converter</a> now reads oklch(), all 148 CSS color names and percentage rgb().
			</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Network steps in the Pipeline</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.06</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				Two new <a href={lp('/chain')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Pipeline</a> steps: "Merge into CIDRs" (the
				<a href={lp('/t/cidr-calculator')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">CIDR Calculator</a>'s list mode, with an optional list to
				subtract) and "Join lines" (any separator, ", " by default).
			</li>
			<li>
				Three new recipes: <a href={lp('/chain/wireguard-allowedips-exclude-lan')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">WireGuard AllowedIPs
				without the LAN</a>, <a href={lp('/chain/merge-ip-ranges-into-cidrs')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">merge IP ranges into CIDR
				blocks</a> and <a href={lp('/chain/remove-duplicate-lines-and-sort')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">remove duplicate lines and
				sort</a>.
			</li>
			<li>Every recipe page now links to the single tools behind its steps.</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">TOTP / 2FA Code Generator</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.05</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New tool: the <a href={lp('/t/totp-generator')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">TOTP / 2FA Code
				Generator</a>. Paste a Base32 secret or an otpauth:// URI and see the current, previous and next code
				with a countdown. TOTP and HOTP, SHA-1/256/512, 6–8 digits, any period.
			</li>
			<li>
				"Check a code" tells you whether a rejected code is a few steps early or late (clock drift) or matches
				nothing, which means the secret or settings differ. "New secret" makes a 160-bit secret and its URI.
			</li>
			<li>
				The secret never goes into a share link. Smart Paste and the <a href={lp('/t/qr-code-decoder')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">QR
				Code Decoder</a> hand otpauth:// URIs straight to the new tool.
			</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Chmod Calculator in every language</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.04</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The About and FAQ of the <a href={lp('/t/chmod-calculator')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Chmod
				Calculator</a> are now translated into all 18 languages, so the localized pages no longer fall back to English.
			</li>
			<li>
				The <a href={lp('/t/jwt-decoder')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">JWT
				Decoder</a> recognizes an encrypted token (JWE, five segments) and says so, instead of only counting segments.
			</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Merge and subtract CIDR lists</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.03</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The <a href={lp('/t/cidr-calculator')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">CIDR
				Calculator</a> takes a whole list now: blocks, addresses and ranges, one per line or comma-separated,
				merged into the fewest CIDR blocks that cover exactly the same addresses.
			</li>
			<li>
				A new Exclude box cuts blocks out of the result, for WireGuard AllowedIPs and similar
				"everything except my LAN" lists. Bad lines are listed with their line number and skipped.
			</li>
			<li>Smart Paste recognizes a pasted list of CIDR blocks.</li>
		</ul>
	</section>
	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">File permissions, every way they are written</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.02</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New <a href={lp('/t/chmod-calculator')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Chmod
				Calculator</a>: 755, rwxr-xr-x, an <code>ls -l</code> line or a whole chmod command, converted to
				every other form, with a clickable grid for owner, group, others and the special bits.
			</li>
			<li>
				Relative expressions like g+w or a+X are applied to a starting mode, following GNU chmod,
				and <code>umask 027</code> shows what new files and directories will get.
			</li>
			<li>
				Warnings for world-writable modes, setuid/setgid and a capital S or T. Smart Paste now
				recognizes <code>ls -l</code> columns and chmod commands.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Easier to read, steadier to load</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.11.01</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The footer, breadcrumbs, the "report a problem" link, empty-state hints and a few labels used faded grey
				text that fell below the WCAG AA contrast ratio in the light theme. They now use the
				regular secondary color.
			</li>
			<li>
				Links inside sentences are underlined, so they don't rely on color alone, and the
				language menu's accessible name now includes the language it shows.
			</li>
			<li>
				While a tool loads, its placeholder reserves about as much room as most tools need,
				so the page below jumps less when the tool appears.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Sign and verify JWTs with real keys</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.10.31</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The <a href={lp('/t/jwt-decoder')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">JWT Decoder &amp;
				Encoder</a> now verifies with a JWK or a whole JWKS — paste the JSON from your issuer's
				jwks_uri and the token's kid picks the key — and reports whether exp and nbf pass.
			</li>
			<li>
				New algorithms: PS256/384/512, ES512 and EdDSA (Ed25519), alongside HS, RS and ES.
				Sign mode takes extra header fields like kid, stamps iat and exp in one click, and can
				generate a random secret or a test key pair, then hand the token to Verify.
			</li>
			<li>
				Verify refuses a public key for an HS token instead of quietly reporting a mismatch —
				that "algorithm confusion" is a classic JWT vulnerability. The page copy, which still
				said the tool couldn't verify, is rewritten in all eighteen languages.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Every tool explained in every language</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.10.30</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				The About and FAQ sections of the <a href={lp('/t/cidr-calculator')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">CIDR
				/ Subnet Calculator</a> and the <a href={lp('/t/background-remover')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Background
				Remover</a> are now translated into all eighteen languages, so every tool page reads in
				one language from top to bottom.
			</li>
			<li>
				Search-result descriptions now end sentences the way each language does — a full-width
				stop in Chinese and Japanese, the danda in Hindi — instead of an English period.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Subnets, IPv4 and IPv6</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.10.29</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New <a href={lp('/t/cidr-calculator')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">CIDR / Subnet
				Calculator</a>: network and broadcast address, netmask and wildcard, usable host range,
				exact address counts and the special-purpose range a block belongs to — for IPv4 and IPv6.
			</li>
			<li>
				Paste a range like 10.0.0.1 - 10.0.0.200 to get the fewest CIDR blocks that cover it
				exactly, split a block into equal subnets, or check whether an address falls inside.
			</li>
			<li>
				Smart Paste now recognizes CIDR blocks and IP ranges. Your network layout stays in the
				browser, like everything else here.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Remove a background without uploading the photo</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.09.14</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New <a href={lp('/t/background-remover')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">Background
				Remover</a>: drop a photo and the subject is cut out automatically — download a transparent
				PNG or WebP, or flatten it onto a color and export a JPEG, all at the original resolution.
			</li>
			<li>
				It runs a U²-Net segmentation model through ONNX Runtime in WebAssembly, right in the page.
				The first use fetches the runtime and the 4.6 MB model from this site (about 19 MB); after
				that both are cached and it works offline.
			</li>
			<li>
				No upload, no signup, no credits, no watermark — and no resolution cap beyond what your
				browser can decode. Fine edges like hair are approximate; it is at its best with one subject
				that stands out from the background.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Read QR codes, not just make them</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.07.28</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New <a href={lp('/t/qr-code-decoder')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">QR Code
				Decoder</a>: drop, paste or pick any image with a QR code — a screenshot, a ticket, a
				photo of a poster — and see what's inside, without pointing a phone at your own screen.
			</li>
			<li>
				It tells you what it found before you use it: URLs get an open-link button, WiFi codes
				unpack into network, password and security type, and vCard / mailto: / tel: / geo: /
				otpauth: payloads are labeled. Inverted codes and UTF-8 text (CJK, emoji) just work.
			</li>
			<li>
				A camera mode too: point your webcam or phone camera at a code on paper and it scans
				live, no app required. And the decoder's About &amp; FAQ content now ships in all
				fourteen languages.
			</li>
			<li>
				Like everything here, scanning is local — the image, the camera feed and whatever the
				code contains never leave your browser, which also makes it a safe way to inspect a QR
				code you don't trust.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">A page about trust — and a way to check it</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.07.24</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New <a href={lp('/about')} class="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">About</a> page: why this thing
				exists, in plain terms — every tool runs in your browser, nothing you paste is uploaded, no
				ads, no trackers, no login. It has a voice, because a person made it.
			</li>
			<li>
				A privacy indicator you can actually verify, not just trust: it watches your browser's own
				network activity and counts the requests this site makes after it loads. The number is
				zero — sit there typing and watch it stay zero, or open your DevTools Network tab and check
				for yourself.
			</li>
			<li>
				Source links throughout: the site is on GitHub, and the footer and About page both carry
				“view source” and “edit this page.” If something looks wrong, you can read exactly how it
				works — or send a fix.
			</li>
		</ul>
		<p class="mt-3 text-sm text-dim">— Nooc</p>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
		<h2 class="text-sm font-medium">Twelve new tools, two new categories</h2>
		<p class="mt-0.5 font-mono text-xs text-dim">v2026.07.22</p>
		<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-dim marker:text-dim/50">
			<li>
				New Code &amp; Markup category: SQL formatter with six dialects, XML formatter &amp;
				validator with exact error positions, HTML / CSS / JavaScript beautifiers with real
				minification (Terser for JS), and a bidirectional Markdown ↔ HTML converter with a
				sanitized live preview.
			</li>
			<li>
				New Privacy category: an EXIF viewer &amp; remover that decodes camera, GPS and
				editing metadata from JPEG, PNG and WebP — and strips it losslessly, without
				re-encoding a single pixel.
			</li>
			<li>
				Data &amp; encoding: an XML ↔ JSON converter, JSON Schema validation and inference
				(Ajv), a string escaper for six dialects, a BigInt-exact number base converter, and
				text ↔ hex/binary.
			</li>
			<li>
				Existing tools grew up: the JWT decoder now signs and verifies (HS/RS/ES via
				WebCrypto), the cron parser gained a visual expression builder, the timestamp
				converter adds RFC 2822 output and a date-difference calculator, and the JSON → CSV
				converter became bidirectional — it now parses CSV back into typed JSON objects
				with delimiter auto-detection.
			</li>
			<li>
				Smart Paste now recognizes XML, CSV, Markdown and hex byte dumps.
			</li>
		</ul>
	</section>

	<section class="relative border-l border-line pb-8 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-line bg-bg" aria-hidden="true"></span>
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
</div>

<svelte:head>
	<title>Changelog — onlinetools.dev</title>
	<meta name="description" content="What's new on onlinetools.dev — new tools, features and fixes." />
	<link rel="canonical" href="https://onlinetools.dev/changelog" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<h1 class="mb-8 text-xl font-semibold tracking-tight">Changelog</h1>

	<section class="relative border-l border-line pb-2 pl-6">
		<span class="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true"></span>
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

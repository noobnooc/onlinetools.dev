<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import SmartPaste from '$lib/components/SmartPaste.svelte';
	import ShortcutHelp from '$lib/components/ShortcutHelp.svelte';
	import GlobalShortcuts from '$lib/components/GlobalShortcuts.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<GlobalShortcuts />
<Header />

<main class="min-h-[calc(100vh-8rem)]">
	{@render children()}
</main>

<footer class="border-t border-line bg-surface/50">
	<div class="mx-auto max-w-6xl px-4 py-10">
		<div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
			<div class="col-span-2 sm:col-span-1">
				<a href="/" class="flex items-center gap-2 text-sm font-medium tracking-tight">
					<span class="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true"></span>
					onlinetools<span class="text-dim">.dev</span>
				</a>
				<p class="mt-3 max-w-52 text-xs leading-relaxed text-dim">
					Every tool computes in your browser. Nothing you paste is uploaded, and pages keep
					working offline.
				</p>
			</div>
			<nav aria-label="Popular tools">
				<span class="block text-[11px] font-medium tracking-[0.08em] text-dim uppercase">Popular</span>
				<ul class="mt-3 space-y-2 text-xs">
					<li><a href="/t/json-formatter" class="text-dim transition-colors duration-120 hover:text-fg">JSON Formatter</a></li>
					<li><a href="/t/base64-decode" class="text-dim transition-colors duration-120 hover:text-fg">Base64 Decode</a></li>
					<li><a href="/t/jwt-decoder" class="text-dim transition-colors duration-120 hover:text-fg">JWT Decoder</a></li>
					<li><a href="/t/timestamp-converter" class="text-dim transition-colors duration-120 hover:text-fg">Timestamp Converter</a></li>
					<li><a href="/t/regex-tester" class="text-dim transition-colors duration-120 hover:text-fg">Regex Tester</a></li>
				</ul>
			</nav>
			<nav aria-label="Convert">
				<span class="block text-[11px] font-medium tracking-[0.08em] text-dim uppercase">Convert</span>
				<ul class="mt-3 space-y-2 text-xs">
					<li><a href="/t/json-to-yaml" class="text-dim transition-colors duration-120 hover:text-fg">JSON ↔ YAML ↔ TOML</a></li>
					<li><a href="/t/json-to-typescript" class="text-dim transition-colors duration-120 hover:text-fg">JSON → TypeScript</a></li>
					<li><a href="/t/json-to-csv" class="text-dim transition-colors duration-120 hover:text-fg">JSON → CSV</a></li>
					<li><a href="/t/case-converter" class="text-dim transition-colors duration-120 hover:text-fg">Case Converter</a></li>
					<li><a href="/t/color-converter" class="text-dim transition-colors duration-120 hover:text-fg">Color Converter</a></li>
				</ul>
			</nav>
			<nav aria-label="Site">
				<span class="block text-[11px] font-medium tracking-[0.08em] text-dim uppercase">Site</span>
				<ul class="mt-3 space-y-2 text-xs">
					<li><a href="/tools" class="text-dim transition-colors duration-120 hover:text-fg">All tools</a></li>
					<li><a href="/changelog" class="text-dim transition-colors duration-120 hover:text-fg">Changelog</a></li>
				</ul>
			</nav>
		</div>
		<div class="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 font-mono text-[11px] text-dim/70">
			<span class="flex items-center gap-1.5">
				<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true"></span>
				All computation stays on this machine
			</span>
			<span>onlinetools.dev</span>
		</div>
	</div>
</footer>

<CommandPalette />
<SmartPaste />
<ShortcutHelp />

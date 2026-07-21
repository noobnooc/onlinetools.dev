<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MobileTopBar from '$lib/components/MobileTopBar.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import SmartPaste from '$lib/components/SmartPaste.svelte';
	import ShortcutHelp from '$lib/components/ShortcutHelp.svelte';
	import GlobalShortcuts from '$lib/components/GlobalShortcuts.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// Register the service worker: cached pages and assets keep every visited
	// tool working offline (the PWA half of the app shell).
	$effect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js').catch(() => {
				// Offline support is progressive enhancement — never block the app.
			});
		}
	});
</script>

<GlobalShortcuts />

<!-- App shell: sidebar and canvas share one background; the content floats. -->
<div class="flex min-h-screen bg-canvas">
	<!-- Desktop rail — borderless, blends into the canvas -->
	<aside class="sticky top-0 hidden h-screen w-60 shrink-0 lg:block">
		<Sidebar />
	</aside>

	<div class="flex min-w-0 flex-1 flex-col lg:p-3">
		<MobileTopBar />
		<!-- Floating content card -->
		<div
			class="flex flex-1 flex-col overflow-hidden bg-surface lg:min-h-[calc(100vh-1.5rem)] lg:rounded-2xl lg:border lg:border-line lg:shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.12)]"
		>
			<main class="grow">
				{@render children()}
			</main>
			<footer class="border-t border-line">
				<div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4 font-mono text-[11px] text-dim/70">
					<span class="flex items-center gap-1.5">
						<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true"></span>
						Runs in your browser — nothing you paste is uploaded
					</span>
					<nav class="flex gap-4" aria-label="Footer">
						<a href="/tools" class="transition-colors duration-120 hover:text-fg">All tools</a>
						<a href="/changelog" class="transition-colors duration-120 hover:text-fg">Changelog</a>
					</nav>
				</div>
			</footer>
		</div>
	</div>
</div>

<CommandPalette />
<SmartPaste />
<ShortcutHelp />

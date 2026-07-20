<script lang="ts">
	import { openPalette, getTheme, setTheme } from '$lib/state/app.svelte';
	import { Search, Sun, Moon } from 'lucide-svelte';

	let theme = $state<'dark' | 'light'>('dark');

	$effect(() => {
		theme = getTheme();
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		setTheme(theme);
	}
</script>

<header class="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
	<div class="mx-auto flex h-13 max-w-6xl items-center justify-between gap-4 px-4">
		<a href="/" class="flex items-center gap-2 font-medium tracking-tight">
			<span class="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true"></span>
			onlinetools<span class="text-dim">.dev</span>
		</a>
		<div class="flex items-center gap-1.5">
			<button
				type="button"
				onclick={() => openPalette()}
				class="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-dim transition-colors duration-120 hover:border-accent/50 hover:text-fg"
			>
				<Search size={14} />
				<span class="hidden sm:inline">Search tools</span>
				<kbd class="rounded border border-line bg-surface-2 px-1 font-mono text-[11px]">⌘K</kbd>
			</button>
			<nav class="hidden items-center gap-1 sm:flex" aria-label="Primary">
				<a
					href="/tools"
					class="rounded-md px-2.5 py-1.5 text-sm text-dim transition-colors duration-120 hover:text-fg"
					>Tools</a
				>
				<a
					href="/changelog"
					class="rounded-md px-2.5 py-1.5 text-sm text-dim transition-colors duration-120 hover:text-fg"
					>Changelog</a
				>
			</nav>
			<button
				type="button"
				onclick={toggleTheme}
				class="rounded-md p-2 text-dim transition-colors duration-120 hover:text-fg"
				aria-label="Toggle color theme"
			>
				{#if theme === 'dark'}<Sun size={15} />{:else}<Moon size={15} />{/if}
			</button>
		</div>
	</div>
</header>

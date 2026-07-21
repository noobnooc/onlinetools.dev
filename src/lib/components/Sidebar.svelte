<script lang="ts">
	import { page } from '$app/state';
	import { openPalette, getTheme, setTheme } from '$lib/state/app.svelte';
	import { TOOLS, CATEGORY_LABELS, type ToolCategory } from '$lib/tools/registry';
	import { iconFor } from '$lib/tools/icons';
	import Kbd from './Kbd.svelte';
	import { Search, Sun, Moon, House } from 'lucide-svelte';

	/** Rendered inside both the desktop rail and the mobile drawer. */
	interface Props {
		onnavigate?: () => void;
	}

	let { onnavigate }: Props = $props();

	const categories = [...new Set(TOOLS.map((t) => t.category))] as ToolCategory[];

	let theme = $state<'dark' | 'light'>('light');
	$effect(() => {
		theme = getTheme();
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		setTheme(theme);
	}

	const current = $derived(page.url.pathname);
</script>

<div class="flex h-full flex-col">
	<!-- Brand -->
	<a
		href="/"
		onclick={onnavigate}
		class="flex shrink-0 items-center gap-2.5 px-4 pt-4 pb-2"
	>
		<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B0D10]" aria-hidden="true">
			<span class="block h-3 w-3 rounded-full border-2 border-accent"></span>
		</span>
		<span class="min-w-0 leading-tight">
			<span class="block text-sm font-semibold tracking-tight">onlinetools.dev</span>
			<span class="block text-[11px] text-dim">Developer tools</span>
		</span>
	</a>

	<!-- Search -->
	<div class="shrink-0 px-3 pt-2">
		<button
			type="button"
			onclick={() => {
				onnavigate?.();
				openPalette();
			}}
			class="flex w-full items-center gap-2 rounded-lg bg-surface-2/70 px-2.5 py-2 text-left text-[13px] text-dim transition-colors duration-120 hover:text-fg"
		>
			<Search size={14} class="shrink-0" />
			<span class="grow">Search</span>
			<Kbd keys="⌘K" />
		</button>
	</div>

	<!-- Navigation -->
	<nav class="grow overflow-y-auto px-3 py-3" aria-label="Tools">
		<a
			href="/"
			aria-current={current === '/' ? 'page' : undefined}
			onclick={onnavigate}
			class="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors duration-120
				{current === '/' ? 'bg-accent/10 font-medium text-accent' : 'text-dim hover:bg-surface-2 hover:text-fg'}"
		>
			<House size={14} class="shrink-0" />
			Overview
		</a>

		{#each categories as cat (cat)}
			<div class="mt-4">
				<span class="block px-2 pb-1 text-[10px] font-medium tracking-[0.08em] text-dim/70 uppercase">
					{CATEGORY_LABELS[cat]}
				</span>
				<ul>
					{#each TOOLS.filter((t) => t.category === cat) as tool (tool.slug)}
						{@const Icon = iconFor(tool.slug)}
						{@const active = current === `/t/${tool.slug}`}
						<li>
							<a
								href="/t/{tool.slug}"
								aria-current={active ? 'page' : undefined}
								onclick={onnavigate}
								title={tool.description}
								class="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors duration-120
									{active ? 'bg-accent/10 font-medium text-accent' : 'text-dim hover:bg-surface-2 hover:text-fg'}"
							>
								<Icon size={14} class="shrink-0 {active ? '' : 'text-dim/70'}" />
								<span class="truncate">{tool.name.replace(/ [—-].*$/, '')}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>

	<!-- Footer of the rail -->
	<div class="flex shrink-0 items-center justify-between px-3 py-3">
		<span class="flex items-center gap-1.5 font-mono text-[10px] text-dim/80" title="All computation happens in your browser. Works offline.">
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true"></span>
			Offline
		</span>
		<div class="flex items-center gap-0.5">
			<a
				href="/changelog"
				onclick={onnavigate}
				class="rounded-md px-1.5 py-1 text-[11px] text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
				>v0.3</a
			>
			<button
				type="button"
				onclick={toggleTheme}
				class="rounded-md p-1.5 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
				aria-label="Toggle color theme"
			>
				{#if theme === 'dark'}<Sun size={13} />{:else}<Moon size={13} />{/if}
			</button>
		</div>
	</div>
</div>

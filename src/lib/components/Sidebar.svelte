<script lang="ts">
	import { page } from '$app/state';
	import { openPalette } from '$lib/state/app.svelte';
	import { TOOLS, type ToolCategory } from '$lib/tools/registry';
	import { iconFor } from '$lib/tools/icons';
	import { t, lt, ltCategory, lp, locale } from '$lib/i18n';
	import Kbd from './Kbd.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import { Search, House } from 'lucide-svelte';

	/** Rendered inside both the desktop rail and the mobile drawer. */
	interface Props {
		onnavigate?: () => void;
	}

	let { onnavigate }: Props = $props();

	const categories = [...new Set(TOOLS.map((t) => t.category))] as ToolCategory[];

	/**
	 * Compact rail label: drop subtitles and generic suffixes so rows never
	 * truncate. English-specific; localized names pass through untouched
	 * (they are written compact already).
	 */
	function shortName(name: string): string {
		if (locale() !== 'en') return name;
		return name
			.replace(/ [—-] .*$/, '')
			.replace(/ Encode \/ Decode$/, '')
			.replace(/ & Validator$/, '')
			.replace(/ Expression Parser$/, ' Parser')
			.replace(/ Character Inspector$/, ' Inspector')
			.replace(/ (Converter|Generator|Tester|Checker|Decoder)$/, '');
	}

	const current = $derived(page.url.pathname);

	const rowClass = (active: boolean) =>
		`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-120 ${
			active
				? 'bg-surface font-medium text-fg shadow-[0_1px_2px_rgba(16,24,40,0.08)] ring-1 ring-line/70'
				: 'text-dim hover:bg-fg/[0.05] hover:text-fg'
		}`;
</script>

<div class="flex h-full flex-col">
	<!-- Brand + theme -->
	<div class="flex shrink-0 items-center justify-between gap-2 px-4 pt-4 pb-3">
		<a href={lp('/')} onclick={onnavigate} class="min-w-0 leading-tight">
			<span class="block truncate text-sm font-semibold tracking-tight">
				<span class="text-accent">online</span><span class="text-fg">tools</span><span
					class="text-ok">.</span><span class="text-dim/60">dev</span>
			</span>
			<span class="block text-[11px] text-dim">Developer tools</span>
		</a>
		<div class="flex shrink-0 items-center gap-1">
			<LanguageToggle />
			<ThemeToggle />
		</div>
	</div>

	<!-- Search -->
	<div class="shrink-0 px-3">
		<button
			type="button"
			onclick={() => {
				onnavigate?.();
				openPalette();
			}}
			class="flex w-full items-center gap-2 rounded-lg bg-fg/[0.05] px-2.5 py-2 text-left text-[13px] text-dim transition-colors duration-120 hover:bg-fg/[0.08] hover:text-fg"
		>
			<Search size={14} class="shrink-0" />
			<span class="grow">{t('search')}</span>
			<Kbd keys="⌘K" />
		</button>
	</div>

	<!-- Navigation — masked top and bottom so the list fades out, not clips -->
	<nav
		class="grow overflow-y-auto px-3 pt-3 pb-5"
		aria-label={t('searchTools')}
		style="mask-image: linear-gradient(to bottom, transparent, black 18px, black calc(100% - 22px), transparent); -webkit-mask-image: linear-gradient(to bottom, transparent, black 18px, black calc(100% - 22px), transparent)"
	>
		<a
			href={lp('/')}
			aria-current={current === lp('/') ? 'page' : undefined}
			onclick={onnavigate}
			class={rowClass(current === lp('/'))}
		>
			<House size={14} class="shrink-0 {current === lp('/') ? 'text-accent' : 'text-dim/70'}" />
			{t('overview')}
		</a>

		{#each categories as cat (cat)}
			<div class="mt-5">
				<span class="block px-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.1em] text-dim/60 uppercase">
					{ltCategory(cat)}
				</span>
				<ul class="space-y-px">
					{#each TOOLS.filter((t) => t.category === cat) as tool (tool.slug)}
						{@const Icon = iconFor(tool.slug)}
						{@const href = lp(`/t/${tool.slug}`)}
						{@const active = current === href}
						<li>
							<a
								{href}
								aria-current={active ? 'page' : undefined}
								onclick={onnavigate}
								title={lt(tool).name}
								class={rowClass(active)}
							>
								<Icon size={14} class="shrink-0 {active ? 'text-accent' : 'text-dim/70'}" />
								<span class="truncate">{shortName(lt(tool).name)}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
</div>

<script lang="ts">
	import { page } from '$app/state';
	import { LOCALES, locale, lp, unlp, t } from '$lib/i18n';
	import { LOCALE_NAMES } from '$lib/i18n/codes';
	import { Globe, Check } from 'lucide-svelte';

	/**
	 * Compact language control that sits beside the theme toggle. A single
	 * icon button opening a menu of real <a> links (crawlable) to the same
	 * page in every locale.
	 */
	let open = $state(false);
	const base = $derived(unlp(page.url.pathname));
</script>

<div class="relative">
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-label={t('language')}
		title={t('language')}
		class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-fg/[0.04] text-dim transition-colors duration-120 hover:bg-fg/[0.08] hover:text-fg"
	>
		<Globe size={14} />
	</button>
	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
		<div class="fixed inset-0 z-10" onclick={() => (open = false)}></div>
		<ul
			class="absolute right-0 top-8 z-20 max-h-72 w-40 overflow-y-auto rounded-lg border border-line bg-surface p-1 font-sans text-[13px] shadow-xl shadow-black/10"
		>
			{#each LOCALES as l (l)}
				<li>
					<a
						href={lp(base, l)}
						hreflang={l}
						onclick={() => (open = false)}
						class="flex items-center justify-between rounded-md px-2.5 py-1.5 transition-colors duration-120
							{l === locale() ? 'font-medium text-fg' : 'text-dim hover:bg-surface-2 hover:text-fg'}"
					>
						{LOCALE_NAMES[l]}
						{#if l === locale()}<Check size={13} class="text-accent" />{/if}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

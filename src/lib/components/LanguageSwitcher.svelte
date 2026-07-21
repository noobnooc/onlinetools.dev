<script lang="ts">
	import { LOCALES, locale, lp, unlp, t } from '$lib/i18n';
	import { Globe, Check } from 'lucide-svelte';

	/**
	 * Footer language menu. Real <a> links (crawlable, prerender-discoverable)
	 * pointing at the same page in every locale.
	 */
	interface Props {
		/** Current pathname (possibly locale-prefixed). */
		path: string;
	}

	let { path }: Props = $props();

	const NAMES: Record<string, string> = {
		en: 'English',
		zh: '中文',
		ja: '日本語',
		ko: '한국어',
		es: 'Español',
		fr: 'Français',
		de: 'Deutsch',
		pt: 'Português',
		ru: 'Русский',
		it: 'Italiano'
	};

	let open = $state(false);
	const base = $derived(unlp(path));
</script>

<div class="relative">
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-label={t('language')}
		class="flex items-center gap-1.5 transition-colors duration-120 hover:text-fg"
	>
		<Globe size={12} />
		{NAMES[locale()]}
	</button>
	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
		<div class="fixed inset-0 z-10" onclick={() => (open = false)}></div>
		<ul
			class="absolute right-0 bottom-7 z-20 max-h-72 w-40 overflow-y-auto rounded-lg border border-line bg-surface p-1 font-sans text-[13px] shadow-xl shadow-black/10"
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
						{NAMES[l]}
						{#if l === locale()}<Check size={13} class="text-accent" />{/if}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<script lang="ts">
	import { getThemePref, setThemePref, type ThemePref } from '$lib/state/app.svelte';
	import { t } from '$lib/i18n';
	import { Sun, Moon, Monitor } from 'lucide-svelte';

	/**
	 * Three-state theme control: follow system → dark → light. One compact
	 * button showing the current preference; the tooltip carries the words.
	 */
	let pref = $state<ThemePref>('system');

	$effect(() => {
		pref = getThemePref();
	});

	// While following the system, react to OS theme changes live.
	$effect(() => {
		if (pref !== 'system') return;
		const mq = matchMedia('(prefers-color-scheme: dark)');
		const apply = () => setThemePref('system');
		mq.addEventListener('change', apply);
		return () => mq.removeEventListener('change', apply);
	});

	const ORDER: ThemePref[] = ['system', 'dark', 'light'];
	const LABEL_KEYS = { system: 'themeSystem', dark: 'themeDark', light: 'themeLight' } as const;

	function cycle() {
		pref = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
		setThemePref(pref);
	}
</script>

<button
	type="button"
	onclick={cycle}
	aria-label="Toggle color theme"
	title={t('themeTitle', { mode: t(LABEL_KEYS[pref]) })}
	class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-fg/[0.04] text-dim transition-colors duration-120 hover:bg-fg/[0.08] hover:text-fg"
>
	{#if pref === 'dark'}
		<Moon size={14} />
	{:else if pref === 'light'}
		<Sun size={14} />
	{:else}
		<Monitor size={14} />
	{/if}
</button>

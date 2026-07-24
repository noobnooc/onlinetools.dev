<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import PlusCorners from './PlusCorners.svelte';
	import { Activity, WifiOff, RefreshCw } from 'lucide-svelte';

	/**
	 * A real, in-page privacy monitor — the honest half of the About page.
	 *
	 * It subscribes to the browser's own Resource Timing stream via
	 * PerformanceObserver and counts every network request this site makes
	 * *after* the widget starts watching. Typing or pasting into the demo box
	 * triggers exactly zero of them, so the number proves the claim instead of
	 * asserting it. Nothing here is faked: the count reflects genuine browser
	 * telemetry. Client-only — PerformanceObserver and the service worker do
	 * not exist during prerender, so the page defers this component to the
	 * browser (see the About page's `{#if browser}` guard).
	 */
	let count = $state(0);
	let recent = $state<Array<{ label: string; type: string }>>([]);
	let offlineReady = $state(false);
	let demo = $state('');

	/** Last path segment of a URL — enough to identify an asset without noise. */
	function shorten(url: string): string {
		try {
			const u = new URL(url);
			return u.pathname.split('/').filter(Boolean).pop() ?? u.hostname;
		} catch {
			return url;
		}
	}

	function readController(): boolean {
		return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
	}

	onMount(() => {
		// Only count requests that begin after this moment — the earlier entries
		// are the assets that built the page, which is not what we're proving.
		const start = performance.now();

		offlineReady = readController();
		const onController = () => (offlineReady = readController());
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('controllerchange', onController);
		}

		let observer: PerformanceObserver | undefined;
		if (typeof PerformanceObserver !== 'undefined') {
			observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					if (entry.startTime < start) continue;
					count += 1;
					const res = entry as PerformanceResourceTiming;
					recent = [
						{ label: shorten(res.name), type: res.initiatorType || 'resource' },
						...recent
					].slice(0, 4);
				}
			});
			observer.observe({ type: 'resource', buffered: false });
		}

		return () => {
			observer?.disconnect();
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.removeEventListener('controllerchange', onController);
			}
		};
	});
</script>

<div class="relative rounded-(--radius-xl) border border-line bg-surface p-5 sm:p-6">
	<PlusCorners />

	<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
		<div class="flex items-center gap-3.5">
			<span
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-accent"
				aria-hidden="true"
			>
				<Activity size={19} />
			</span>
			<div>
				<span class="block text-[11px] tracking-wide text-dim uppercase">
					{t('aboutRequestsLabel')}
				</span>
				<span class="mt-1 block">
					<span
						class="font-mono text-3xl font-semibold tabular-nums {count === 0
							? 'text-ok'
							: 'text-fg'}"
						aria-live="polite">{count}</span
					>
				</span>
			</div>
		</div>

		<span
			class="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] {offlineReady
				? 'border-ok/30 text-ok'
				: 'border-line text-dim'}"
		>
			{#if offlineReady}
				<WifiOff size={11} />{t('aboutOfflineReady')}
			{:else}
				<RefreshCw size={11} />{t('aboutOfflineCaching')}
			{/if}
		</span>
	</div>

	<p class="mt-5 text-sm text-dim">{t('aboutVerifyHint')}</p>

	<textarea
		bind:value={demo}
		rows="3"
		spellcheck="false"
		autocomplete="off"
		placeholder={t('aboutVerifyPlaceholder')}
		class="mt-2 w-full resize-y rounded-lg border border-line bg-surface-2 px-3 py-2 font-mono text-sm text-fg"
	></textarea>

	{#if recent.length > 0}
		<ul class="mt-3 space-y-1 font-mono text-[11px] text-dim">
			{#each recent as r, i (i)}
				<li class="flex items-center gap-2">
					<span class="shrink-0 rounded-sm border border-line px-1 py-px text-dim/70">{r.type}</span>
					<span class="truncate">{r.label}</span>
				</li>
			{/each}
		</ul>
	{/if}

	<p class="mt-4 text-[11px] leading-relaxed text-dim/70">{t('aboutRequestsNote')}</p>
</div>

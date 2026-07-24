<script lang="ts">
	import '../app.css';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MobileTopBar from '$lib/components/MobileTopBar.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import SmartPaste from '$lib/components/SmartPaste.svelte';
	import ShortcutHelp from '$lib/components/ShortcutHelp.svelte';
	import GlobalShortcuts from '$lib/components/GlobalShortcuts.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { t, lp } from '$lib/i18n';
	import { REPO_URL } from '$lib/links';
	import { initFavorites } from '$lib/state/favorites.svelte';
	import { SITE_VERSION } from '$lib/version';
	import { CodeXml } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	/** The card's inner scroller — scrolling happens here, not on the page. */
	let scroller = $state<HTMLElement | null>(null);

	// The window never scrolls on desktop, so reset the card's scroller on
	// navigation ourselves (SvelteKit only manages window scroll).
	afterNavigate(() => {
		scroller?.scrollTo(0, 0);
	});

	// Favorites hydrate after mount so the client's first render matches SSR.
	$effect(() => {
		initFavorites();
	});

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

<!-- App shell: sidebar and canvas share one background; the content card is
     fixed in the viewport and scrolls internally. -->
<div class="flex min-h-screen bg-canvas lg:h-screen lg:overflow-hidden">
	<!-- Desktop rail — borderless, blends into the canvas -->
	<aside class="hidden w-60 shrink-0 lg:block">
		<Sidebar />
	</aside>

	<div class="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:p-3">
		<MobileTopBar />
		<!-- Floating content card (viewport-fixed on desktop) -->
		<div
			class="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface lg:rounded-2xl lg:border-[0.5px] lg:border-line lg:shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.12)]"
		>
			<div bind:this={scroller} class="flex min-h-0 flex-1 flex-col overflow-y-auto">
				<main class="grow">
					{@render children()}
				</main>
				<footer class="border-t border-line">
					<div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4 font-mono text-[11px] text-dim/70">
						<span class="flex items-center gap-1.5">
							<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true"></span>
							{t('footerPrivacy')}
						</span>
						<nav class="flex flex-wrap items-center gap-4" aria-label="Footer">
							<a href={lp('/tools')} class="transition-colors duration-120 hover:text-fg">{t('allTools')}</a>
							<a href={lp('/about')} class="transition-colors duration-120 hover:text-fg">{t('about')}</a>
							<a href={lp('/changelog')} class="transition-colors duration-120 hover:text-fg">{t('changelog')}</a>
							<a
								href={REPO_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1 transition-colors duration-120 hover:text-fg"
							>
								<CodeXml size={12} />
								{t('aboutViewSource')}
							</a>
							<a href={lp('/changelog')} class="text-dim/50 transition-colors duration-120 hover:text-fg" title={t('releaseDate')}>v{SITE_VERSION}</a>
							<LanguageSwitcher path={page.url.pathname} />
						</nav>
					</div>
				</footer>
			</div>
		</div>
	</div>
</div>

<CommandPalette />
<SmartPaste />
<ShortcutHelp />

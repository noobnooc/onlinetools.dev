<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { openPalette } from '$lib/state/app.svelte';
	import Sidebar from './Sidebar.svelte';
	import { t, lp } from '$lib/i18n';
	import { Search, Menu } from 'lucide-svelte';

	let drawerOpen = $state(false);
</script>

<header class="sticky top-0 z-30 flex h-13 items-center justify-between bg-canvas/90 px-3 backdrop-blur lg:hidden">
	<button
		type="button"
		class="flex items-center gap-2 rounded-md p-2 text-dim transition-colors duration-120 hover:text-fg"
		onclick={() => (drawerOpen = true)}
		aria-label={t('openNav')}
	>
		<Menu size={17} />
	</button>
	<a href={lp('/')} class="flex items-center gap-2 text-sm font-semibold tracking-tight">
		<svg class="h-5 w-5 shrink-0" viewBox="0 0 64 64" aria-hidden="true">
			<rect width="64" height="64" rx="14.5" fill="#0B0D10" />
			<circle cx="30" cy="34" r="11.5" fill="none" stroke="#4C8DFF" stroke-width="6" />
			<circle cx="48" cy="16" r="5.75" fill="#3ECF8E" />
		</svg>
		onlinetools<span class="font-normal text-dim">.dev</span>
	</a>
	<button
		type="button"
		class="rounded-md p-2 text-dim transition-colors duration-120 hover:text-fg"
		onclick={() => openPalette()}
		aria-label={t('searchTools')}
	>
		<Search size={17} />
	</button>
</header>

<Dialog.Root bind:open={drawerOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/50 lg:hidden" />
		<Dialog.Content
			class="fixed inset-y-0 left-0 z-50 w-72 bg-canvas shadow-xl shadow-black/20 lg:hidden"
		>
			<Dialog.Title class="sr-only">Navigation</Dialog.Title>
			<Sidebar onnavigate={() => (drawerOpen = false)} />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

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
		<span class="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true"></span>
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

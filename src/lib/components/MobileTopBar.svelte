<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { openPalette } from '$lib/state/app.svelte';
	import Sidebar from './Sidebar.svelte';
	import { Search, Menu } from 'lucide-svelte';

	let drawerOpen = $state(false);
</script>

<header class="sticky top-0 z-30 flex h-13 items-center justify-between border-b border-line bg-bg/90 px-3 backdrop-blur lg:hidden">
	<button
		type="button"
		class="flex items-center gap-2 rounded-md p-2 text-dim transition-colors duration-120 hover:text-fg"
		onclick={() => (drawerOpen = true)}
		aria-label="Open navigation"
	>
		<Menu size={17} />
	</button>
	<a href="/" class="flex items-center gap-2 text-sm font-semibold tracking-tight">
		<span class="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true"></span>
		onlinetools<span class="font-normal text-dim">.dev</span>
	</a>
	<button
		type="button"
		class="rounded-md p-2 text-dim transition-colors duration-120 hover:text-fg"
		onclick={() => openPalette()}
		aria-label="Search tools"
	>
		<Search size={17} />
	</button>
</header>

<Dialog.Root bind:open={drawerOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/50 lg:hidden" />
		<Dialog.Content
			class="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-bg shadow-xl shadow-black/20 lg:hidden"
		>
			<Dialog.Title class="sr-only">Navigation</Dialog.Title>
			<Sidebar onnavigate={() => (drawerOpen = false)} />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

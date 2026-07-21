<script lang="ts">
	import { Dialog } from 'bits-ui';
	import Kbd from './Kbd.svelte';
	import { shortcutHelp } from '$lib/state/app.svelte';
	import { t } from '$lib/i18n';

	const SHORTCUTS: Array<[string, string]> = $derived([
		['⌘K', t('scPalette')],
		['⌘⇧C', t('scCopy')],
		['Esc', t('scEsc')],
		['?', t('scHelp')],
		['⌘V', t('scPaste')],
		['↑ ↓ / ↵', t('scNav')]
	]);
</script>

<Dialog.Root bind:open={shortcutHelp.open}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/50" />
		<Dialog.Content
			class="fixed top-1/2 left-1/2 z-50 w-[min(90vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line bg-surface p-4 shadow-xl shadow-black/20"
		>
			<Dialog.Title class="mb-3 text-sm font-medium">{t('shortcutsTitle')}</Dialog.Title>
			<dl class="space-y-2">
				{#each SHORTCUTS as [key, desc] (key)}
					<div class="flex items-center justify-between gap-4">
						<dt><Kbd keys={key} size="md" /></dt>
						<dd class="text-sm text-dim">{desc}</dd>
					</div>
				{/each}
			</dl>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

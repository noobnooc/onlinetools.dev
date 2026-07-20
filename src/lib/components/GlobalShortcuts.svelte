<script lang="ts">
	import { palette, openPalette, shortcutHelp, currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';

	function isEditable(target: EventTarget | null): boolean {
		return (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			(target instanceof HTMLElement && target.isContentEditable)
		);
	}

	function onkeydown(e: KeyboardEvent) {
		const mod = e.metaKey || e.ctrlKey;
		if (mod && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			palette.open ? (palette.open = false) : openPalette();
			return;
		}
		if (mod && e.shiftKey && e.key.toLowerCase() === 'c') {
			if (currentResult.text !== '') {
				e.preventDefault();
				void copyText(currentResult.text);
			}
			return;
		}
		if (e.key === '?' && !isEditable(e.target) && !mod) {
			e.preventDefault();
			shortcutHelp.open = !shortcutHelp.open;
		}
	}
</script>

<svelte:window {onkeydown} />

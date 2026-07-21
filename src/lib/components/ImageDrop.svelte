<script lang="ts">
	import { tt } from '$lib/i18n';
	import { takePendingFile } from '$lib/state/handoff';
	import { ImageUp } from 'lucide-svelte';

	/**
	 * Drop zone shared by the image tools: click to browse, drag & drop, or
	 * paste an image from the clipboard. Files are handed to the parent and
	 * never leave the page.
	 */
	interface Props {
		label: string;
		onfile: (file: File) => void;
		/** Loaded-state summary shown inside the zone, e.g. "photo.png · 1.2 MB". */
		summary?: string;
	}

	let { label, onfile, summary = '' }: Props = $props();

	let input: HTMLInputElement | undefined = $state();
	let dragging = $state(false);

	// A file pasted/dropped elsewhere (Smart Paste) arrives via the one-shot
	// handoff store when the user picks an image tool.
	$effect(() => {
		const pending = takePendingFile();
		if (pending) onfile(pending);
	});

	function pick(files: FileList | null | undefined) {
		const file = files?.[0];
		if (file) onfile(file);
	}

	function onpaste(e: ClipboardEvent) {
		const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith('image/'));
		const file = item?.getAsFile();
		if (file) {
			e.preventDefault();
			onfile(file);
		}
	}
</script>

<svelte:window {onpaste} />

<div class="group relative">
	<div class="mb-1.5 flex items-baseline justify-between gap-2">
		<span class="text-xs font-medium tracking-wide text-dim uppercase">{label}</span>
	</div>
	<button
		type="button"
		class="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-sm transition-colors duration-120
			{dragging ? 'border-accent bg-accent/5' : 'border-line bg-surface-2 hover:border-accent/50'}"
		onclick={() => input?.click()}
		ondragover={(e) => {
			e.preventDefault();
			dragging = true;
		}}
		ondragleave={() => (dragging = false)}
		ondrop={(e) => {
			e.preventDefault();
			dragging = false;
			pick(e.dataTransfer?.files);
		}}
	>
		<ImageUp size={20} class="text-dim" />
		{#if summary}
			<span class="font-mono text-xs text-fg">{summary}</span>
			<span class="text-xs text-dim">{tt('imgReplace')}</span>
		{:else}
			<span class="text-dim">{tt('imgDrop')}</span>
			<span class="text-xs text-dim/70">{tt('imgLocal')}</span>
		{/if}
	</button>
	<input
		bind:this={input}
		type="file"
		accept="image/*,.svg"
		class="hidden"
		onchange={(e) => {
			pick(e.currentTarget.files);
			e.currentTarget.value = '';
		}}
	/>
</div>

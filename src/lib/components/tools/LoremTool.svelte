<script lang="ts">
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { loremIpsum, type LoremOptions } from '$lib/tools/text';
	import { currentResult } from '$lib/state/app.svelte';
	import { RefreshCw } from 'lucide-svelte';

	let unit = $state<LoremOptions['unit']>('paragraphs');
	let count = $state(3);
	let startClassic = $state(true);
	let output = $state('');
	let error = $state('');

	function generate() {
		const r = loremIpsum({ unit, count, startClassic });
		if (r.ok) {
			output = r.value;
			error = '';
		} else {
			error = r.error;
		}
	}

	$effect(() => {
		void unit;
		void count;
		void startClassic;
		generate();
	});

	$effect(() => {
		currentResult.text = output;
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={unit}
			label="Unit"
			options={[
				{ value: 'words', label: 'Words' },
				{ value: 'sentences', label: 'Sentences' },
				{ value: 'paragraphs', label: 'Paragraphs' }
			]}
		/>
		<label class="flex items-center gap-2 text-dim">
			Count
			<input
				type="number"
				bind:value={count}
				min="1"
				max="1000"
				class="w-20 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg"
			/>
		</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={startClassic} class="accent-(--accent)" />
			Start with “Lorem ipsum…”
		</label>
		<button
			type="button"
			onclick={generate}
			class="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-120 hover:opacity-90"
		>
			<RefreshCw size={13} /> Regenerate
		</button>
	</div>
	{#if error}<p class="font-mono text-xs text-err" role="alert">{error}</p>{/if}
	<OutputPanel value={output} filename="lorem-ipsum.txt" />
</div>

<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { processLines, type LineToolOptions } from '$lib/tools/text';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let dedupe = $state(true);
	let caseInsensitive = $state(false);
	let trim = $state(true);
	let removeEmpty = $state(true);
	let sort = $state<NonNullable<LineToolOptions['sort']>>('asc');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const result = $derived(
		input === ''
			? null
			: processLines(input, { dedupe, caseInsensitiveDedupe: caseInsensitive, trim, removeEmpty, sort })
	);
	const output = $derived(result?.output ?? '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] =>
		result === null
			? []
			: [
					{ text: `${result.inputLines} in`, tone: 'accent' },
					{ text: `${result.outputLines} out` },
					...(result.removed > 0 ? [{ text: `−${result.removed}`, tone: 'warn' as const }] : [])
				]
	);
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('slInput')}
		placeholder={tt('slPh')}
		{badge}
		rows={8}
		onsample={() => (input = 'banana\napple\nitem10\nitem2\nApple\nbanana\n\n  cherry  ')}
	/>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<div class="flex items-center gap-2 text-dim">
			{tt('slSort')}
			<Segmented
				bind:value={sort}
				label={tt('slSort')}
				options={[
					{ value: 'none', label: '=', title: tt('slKeep'), mono: true },
					{ value: 'asc', label: 'A→Z', title: tt('slAsc'), mono: true },
					{ value: 'desc', label: 'Z→A', title: tt('slDesc'), mono: true },
					{ value: 'natural', label: '1,2,10', title: tt('slNatural'), mono: true },
					{ value: 'length', label: '≡', title: tt('slLength'), mono: true },
					{ value: 'shuffle', label: '⤨', title: tt('slShuffle'), mono: true }
				]}
			/>
		</div>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={dedupe} class="accent-(--accent)" /> {tt('slDedupe')}
		</label>
		{#if dedupe}
			<label class="flex items-center gap-2 text-dim">
				<input type="checkbox" bind:checked={caseInsensitive} class="accent-(--accent)" /> {tt('slIgnoreCase')}
			</label>
		{/if}
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={trim} class="accent-(--accent)" /> {tt('slTrim')}
		</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={removeEmpty} class="accent-(--accent)" /> {tt('slDropEmpty')}
		</label>
	</div>
	<OutputPanel
		value={output}
		filename="lines.txt"
		shareState={input === '' ? null : { input }}
		label={result ? `Output · ${result.outputLines} lines` : 'Output'}
	/>
</div>

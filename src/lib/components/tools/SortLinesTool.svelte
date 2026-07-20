<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
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

	const SORTS: Array<[NonNullable<LineToolOptions['sort']>, string]> = [
		['none', 'Keep order'],
		['asc', 'A → Z'],
		['desc', 'Z → A'],
		['natural', 'Natural'],
		['length', 'By length'],
		['shuffle', 'Shuffle']
	];

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
		label="Lines"
		placeholder="one per line"
		{badge}
		rows={8}
		onsample={() => (input = 'banana\napple\nitem10\nitem2\nApple\nbanana\n\n  cherry  ')}
	/>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<label class="flex items-center gap-2 text-dim">
			Sort
			<select bind:value={sort} class="rounded-md border border-line bg-surface-2 px-2 py-1 text-sm text-fg">
				{#each SORTS as [id, label] (id)}<option value={id}>{label}</option>{/each}
			</select>
		</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={dedupe} class="accent-(--accent)" /> Dedupe
		</label>
		{#if dedupe}
			<label class="flex items-center gap-2 text-dim">
				<input type="checkbox" bind:checked={caseInsensitive} class="accent-(--accent)" /> Ignore case
			</label>
		{/if}
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={trim} class="accent-(--accent)" /> Trim
		</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={removeEmpty} class="accent-(--accent)" /> Drop empty
		</label>
	</div>
	<OutputPanel
		value={output}
		filename="lines.txt"
		shareState={input === '' ? null : { input }}
		label={result ? `Output · ${result.outputLines} lines` : 'Output'}
	/>
</div>

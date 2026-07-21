<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { csvToJson, type CsvToJsonOptions } from '$lib/tools/dataconvert';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let delimiter = $state<CsvToJsonOptions['delimiter']>('auto');
	let header = $state(true);
	let typed = $state(true);

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.header === '0') header = false;
	});

	const result = $derived.by(() => {
		if (input.trim() === '') return null;
		return csvToJson(input, { delimiter, header, typed });
	});
	const output = $derived(result?.ok ? result.value.json : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!result?.ok) return [{ text: 'error', tone: 'err' }];
		return [
			{ text: `CSV · ${result.value.delimiter}`, tone: 'accent' },
			{ text: `${result.value.rows} × ${result.value.columns.length}`, tone: 'ok' }
		];
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<div class="flex items-center gap-2 text-dim">
			{tt('jcDelimiter')}
			<Segmented
				bind:value={delimiter}
				label={tt('jcDelimiter')}
				options={[
					{ value: 'auto', label: tt('cjAuto') },
					{ value: ',', label: ',', mono: true, title: tt('jcComma') },
					{ value: ';', label: ';', mono: true, title: tt('jcSemicolon') },
					{ value: '\t', label: '⇥', mono: true, title: tt('jcTab') },
					{ value: '|', label: '|', mono: true, title: tt('cjPipe') }
				]}
			/>
		</div>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={header} class="accent-(--accent)" /> {tt('cjHeader')}
		</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={typed} class="accent-(--accent)" /> {tt('cjTyped')}
		</label>
	</div>
	<InputArea
		bind:value={input}
		label={tt('cjInput')}
		placeholder={'name,age,active\nAda,36,true'}
		{badge}
		rows={9}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				'name,email,age,active,city\nAda Lovelace,ada@example.com,36,true,London\n"Grace Hopper",grace@example.com,85,false,"New York"\nAlan Turing,alan@example.com,41,true,Manchester')}
	/>
	<OutputPanel
		value={output}
		label="Output · JSON"
		filename="data.json"
		shareState={input.trim() === '' ? null : { input, header: header ? '1' : '0' }}
	/>
</div>

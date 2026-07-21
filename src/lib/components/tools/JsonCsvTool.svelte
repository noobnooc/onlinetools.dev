<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { jsonToCsv, csvToJson, type CsvToJsonOptions } from '$lib/tools/dataconvert';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let direction = $state<'to-csv' | 'to-json'>('to-csv');
	let delimiter = $state<',' | ';' | '\t'>(',');
	let csvDelimiter = $state<CsvToJsonOptions['delimiter']>('auto');
	let header = $state(true);
	let typed = $state(true);

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.direction === 'to-csv' || s.direction === 'to-json') direction = s.direction;
		else if (s.input) direction = /^\s*[[{]/.test(s.input) ? 'to-csv' : 'to-json';
		if (s.header === '0') header = false;
	});

	/* ---------- JSON → CSV ---------- */

	const csvResult = $derived(
		direction === 'to-csv' && input.trim() !== '' ? jsonToCsv(input, delimiter) : null
	);
	const csv = $derived(csvResult?.ok ? csvResult.value : null);

	/** Table preview straight from the structured grid — no string re-parsing. */
	const preview = $derived(csv ? csv.grid.slice(0, 9).map((row) => row.slice(0, 8)) : null);

	/* ---------- CSV → JSON ---------- */

	const jsonResult = $derived(
		direction === 'to-json' && input.trim() !== ''
			? csvToJson(input, { delimiter: csvDelimiter, header, typed })
			: null
	);

	const result = $derived(direction === 'to-csv' ? csvResult : jsonResult);
	const output = $derived.by(() => {
		if (direction === 'to-csv') return csv?.csv ?? '';
		return jsonResult?.ok ? jsonResult.value.json : '';
	});

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (direction === 'to-csv') {
			if (!csv) return [{ text: 'invalid', tone: 'err' }];
			return [
				{ text: 'JSON', tone: 'accent' },
				{ text: `${csv.rows} rows` },
				{ text: `${csv.columns.length} cols`, tone: 'ok' }
			];
		}
		if (!jsonResult?.ok) return [{ text: 'error', tone: 'err' }];
		return [
			{ text: `CSV · ${jsonResult.value.delimiter}`, tone: 'accent' },
			{ text: `${jsonResult.value.rows} × ${jsonResult.value.columns.length}`, tone: 'ok' }
		];
	});
</script>

<div class="space-y-4">
	<Segmented
		bind:value={direction}
		label={tt('direction')}
		options={[
			{ value: 'to-csv', label: 'JSON → CSV' },
			{ value: 'to-json', label: 'CSV → JSON' }
		]}
	/>
	<InputArea
		bind:value={input}
		label={direction === 'to-csv' ? tt('jcInput') : tt('cjInput')}
		placeholder={direction === 'to-csv'
			? '[{"name": "Ada", "role": "admin"}, {"name": "Alan"}]'
			: 'name,age,active\nAda,36,true'}
		{badge}
		rows={8}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				direction === 'to-csv'
					? '[\n  {"name": "Ada", "role": "admin", "contact": {"email": "ada@example.com"}},\n  {"name": "Alan", "role": "user", "tags": ["ml", "crypto"]},\n  {"name": "Grace", "contact": {"email": "grace@example.com", "phone": "555-0199"}}\n]'
					: 'name,email,age,active,city\nAda Lovelace,ada@example.com,36,true,London\n"Grace Hopper",grace@example.com,85,false,"New York"\nAlan Turing,alan@example.com,41,true,Manchester')}
	/>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		{#if direction === 'to-csv'}
			<div class="flex items-center gap-2 text-dim">
				{tt('jcDelimiter')}
				<Segmented
					bind:value={delimiter}
					label={tt('jcDelimiter')}
					options={[
						{ value: ',', label: ',', title: tt('jcComma'), mono: true },
						{ value: ';', label: ';', title: tt('jcSemicolon'), mono: true },
						{ value: '\t', label: '⇥', title: tt('jcTab'), mono: true }
					]}
				/>
			</div>
		{:else}
			<div class="flex items-center gap-2 text-dim">
				{tt('jcDelimiter')}
				<Segmented
					bind:value={csvDelimiter}
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
		{/if}
	</div>

	{#if direction === 'to-csv' && preview && preview.length > 1}
		<div class="overflow-x-auto rounded-lg border border-line">
			<table class="w-full font-mono text-xs">
				<thead>
					<tr class="border-b border-line bg-surface-2/60">
						{#each preview[0] as h, i (i)}
							<th class="px-2.5 py-1.5 text-left font-medium whitespace-nowrap text-accent">{h}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each preview.slice(1) as row, ri (ri)}
						<tr class="border-b border-line/50 bg-surface last:border-0">
							{#each row as cell, ci (ci)}
								<td class="max-w-48 truncate px-2.5 py-1.5 whitespace-nowrap">{cell}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if csv && csv.rows > 8}
			<p class="text-xs text-dim">Preview shows the first 8 rows — the download contains all {csv.rows}.</p>
		{/if}
	{/if}

	<OutputPanel
		value={output}
		label={direction === 'to-csv' ? 'CSV' : 'Output · JSON'}
		filename={direction === 'to-csv' ? 'data.csv' : 'data.json'}
		shareState={input.trim() === ''
			? null
			: direction === 'to-csv'
				? { input, direction }
				: { input, direction, header: header ? '1' : '0' }}
	/>
</div>

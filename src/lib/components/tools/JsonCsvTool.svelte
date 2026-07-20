<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { jsonToCsv } from '$lib/tools/dataconvert';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let delimiter = $state<',' | ';' | '\t'>(',');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const result = $derived(input.trim() === '' ? null : jsonToCsv(input, delimiter));
	const csv = $derived(result?.ok ? result.value : null);

	$effect(() => {
		currentResult.text = csv?.csv ?? '';
	});

	/** Table preview straight from the structured grid — no string re-parsing. */
	const preview = $derived(csv ? csv.grid.slice(0, 9).map((row) => row.slice(0, 8)) : null);

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!csv) return [{ text: 'invalid', tone: 'err' }];
		return [
			{ text: 'JSON', tone: 'accent' },
			{ text: `${csv.rows} rows` },
			{ text: `${csv.columns.length} cols`, tone: 'ok' }
		];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="JSON array of objects"
		placeholder={'[{"name": "Ada", "role": "admin"}, {"name": "Alan"}]'}
		{badge}
		rows={8}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				'[\n  {"name": "Ada", "role": "admin", "contact": {"email": "ada@example.com"}},\n  {"name": "Alan", "role": "user", "tags": ["ml", "crypto"]},\n  {"name": "Grace", "contact": {"email": "grace@example.com", "phone": "555-0199"}}\n]')}
	/>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<label class="flex items-center gap-2 text-dim">
			Delimiter
			<select bind:value={delimiter} class="rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg">
				<option value=",">, comma</option>
				<option value=";">; semicolon (EU Excel)</option>
				<option value="	">⇥ tab</option>
			</select>
		</label>
	</div>

	{#if preview && preview.length > 1}
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
		value={csv?.csv ?? ''}
		label="CSV"
		filename="data.csv"
		shareState={input.trim() === '' ? null : { input }}
	/>
</div>

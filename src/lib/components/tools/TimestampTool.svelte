<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { parseTimestamp } from '$lib/tools/timestamp';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let now = $state(Date.now());

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(t);
	});

	const result = $derived(input.trim() === '' ? null : parseTimestamp(input, now));
	const info = $derived(result?.ok ? result.value : null);

	const localFormatter = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'full',
		timeStyle: 'long'
	});
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const rows = $derived(
		info
			? ([
					['ISO 8601', info.iso],
					['UTC', info.utc],
					[`Local (${timezone})`, localFormatter.format(new Date(info.epochMs))],
					['Relative', info.relative],
					['Unix seconds', String(info.unixSeconds)],
					['Unix milliseconds', String(info.unixMilliseconds)]
				] as Array<[string, string]>)
			: []
	);

	const output = $derived(rows.map(([k, v]) => `${k}: ${v}`).join('\n'));

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (!info) return [];
		return [
			{ text: info.unit === 'seconds' ? 'unix · s' : info.unit === 'milliseconds' ? 'unix · ms' : info.unit, tone: 'accent' },
			{ text: 'valid', tone: 'ok' }
		];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="Timestamp or date"
		placeholder="1700000000 · 1700000000000 · 2026-07-20T12:00:00Z"
		{badge}
		rows={2}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = String(Math.floor(now / 1000)))}
	/>
	<p class="font-mono text-xs text-dim">
		Current unix time: <button
			type="button"
			class="text-accent hover:underline"
			onclick={() => (input = String(Math.floor(now / 1000)))}
			title="Use current time as input">{Math.floor(now / 1000)}</button
		>
	</p>
	<OutputPanel value={output} filename="timestamp.txt" shareState={input.trim() === '' ? null : { input }}>
		{#if info}
			<table class="w-full font-mono text-sm">
				<tbody>
					{#each rows as [key, val] (key)}
						<tr class="border-b border-line/50 last:border-0">
							<th scope="row" class="py-1.5 pr-4 text-left font-normal whitespace-nowrap text-dim">{key}</th>
							<td class="py-1.5 break-all">{val}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p class="font-mono text-sm text-dim/50">—</p>
		{/if}
	</OutputPanel>
</div>

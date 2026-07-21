<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { baseViews, groupDigits } from '$lib/tools/numberbase';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let from = $state<'auto' | '2' | '8' | '10' | '16'>('auto');
	let customBase = $state(36);
	let grouped = $state(true);

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (['auto', '2', '8', '10', '16'].includes(s.from)) from = s.from as typeof from;
	});

	const result = $derived.by(() => {
		if (input.trim() === '') return null;
		return baseViews(input, from === 'auto' ? 'auto' : Number(from), customBase);
	});
	const views = $derived(result?.ok ? result.value : null);

	const rows = $derived.by((): Array<[string, string, string]> => {
		if (!views) return [];
		const g = (s: string, b: number) => (grouped ? groupDigits(s, b) : s);
		const out: Array<[string, string, string]> = [
			[tt('nbBin'), g(views.binary, 2), '0b'],
			[tt('nbOct'), g(views.octal, 8), '0o'],
			[tt('nbDec'), g(views.decimal, 10), ''],
			[tt('nbHex'), g(views.hex, 16), '0x']
		];
		if (views.custom !== undefined) out.push([`${tt('nbBase')} ${customBase}`, views.custom, '']);
		return out;
	});

	const output = $derived(rows.map(([k, v]) => `${k}: ${v}`).join('\n'));

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!views) return [{ text: 'error', tone: 'err' }];
		return [
			{ text: `${views.bits} ${tt('nbBits')}`, tone: 'accent' },
			...(views.negative ? [{ text: 'negative', tone: 'dim' as const }] : [])
		];
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<div class="flex items-center gap-2 text-dim">
			{tt('nbFrom')}
			<Segmented
				bind:value={from}
				label={tt('nbFrom')}
				options={[
					{ value: 'auto', label: tt('cjAuto'), title: tt('nbAutoT') },
					{ value: '2', label: 'BIN' },
					{ value: '8', label: 'OCT' },
					{ value: '10', label: 'DEC' },
					{ value: '16', label: 'HEX' }
				]}
			/>
		</div>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={grouped} class="accent-(--accent)" /> {tt('nbGroup')}
		</label>
		<label class="flex items-center gap-2 text-dim">
			{tt('nbBase')}
			<input
				type="number"
				min="2"
				max="36"
				bind:value={customBase}
				class="w-16 rounded-lg border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg focus:border-accent"
			/>
		</label>
	</div>
	<InputArea
		bind:value={input}
		label={tt('nbInput')}
		placeholder="255 · 0xff · 0b1111 · deadbeef"
		{badge}
		rows={2}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = '0xDEADBEEF')}
	/>
	{#if views}
		<div class="overflow-hidden rounded-lg border border-line">
			<table class="w-full font-mono text-sm">
				<tbody>
					{#each rows as [key, val, prefix] (key)}
						<tr class="border-b border-line/60 bg-surface last:border-0">
							<th scope="row" class="py-1.5 pr-4 pl-3 text-left font-normal whitespace-nowrap text-dim">{key}</th>
							<td class="py-1.5 pr-3 break-all">
								{#if prefix}<span class="text-dim/60">{prefix}</span>{/if}{val}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
	<OutputPanel value={output} filename="bases.txt" shareState={input.trim() === '' ? null : { input, from }} />
</div>

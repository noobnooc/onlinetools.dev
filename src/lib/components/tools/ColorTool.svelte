<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { parseColor } from '$lib/tools/color';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';
	import { Copy, Check } from 'lucide-svelte';

	let input = $state('');
	let copiedFormat = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const result = $derived(input.trim() === '' ? null : parseColor(input));
	const color = $derived(result?.ok ? result.value : null);

	const rows = $derived(
		color
			? ([
					['HEX', color.hex],
					['RGB', color.rgb],
					['HSL', color.hsl],
					['OKLCH', color.oklch]
				] as Array<[string, string]>)
			: []
	);

	const output = $derived(rows.map(([k, v]) => `${k.toLowerCase()}: ${v}`).join('\n'));

	$effect(() => {
		currentResult.text = output;
	});

	async function copyRow(format: string, value: string) {
		if (await copyText(value)) {
			copiedFormat = format;
			setTimeout(() => (copiedFormat = ''), 1500);
		}
	}

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!color) return [{ text: 'unrecognized', tone: 'err' }];
		return [{ text: 'color', tone: 'accent' }, { text: color.hex }, { text: 'valid', tone: 'ok' }];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="Color"
		placeholder="#4c8dff · rgb(76 141 255) · hsl(218 100% 65%) · tomato"
		{badge}
		rows={2}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = '#4c8dff')}
	/>
	<OutputPanel value={output} label="Formats" filename="color.txt" shareState={input.trim() === '' ? null : { input }}>
		{#if color}
			<div class="flex flex-col gap-4 sm:flex-row">
				<div
					class="h-24 w-full shrink-0 rounded-lg border border-line sm:w-32"
					style="background: {color.hex}"
					aria-label="Color swatch"
					role="img"
				></div>
				<table class="w-full font-mono text-sm">
					<tbody>
						{#each rows as [format, value] (format)}
							<tr class="border-b border-line/50 last:border-0">
								<th scope="row" class="py-1.5 pr-4 text-left font-normal text-dim">{format}</th>
								<td class="py-1.5 break-all">{value}</td>
								<td class="w-8 py-1.5 text-right">
									<button
										type="button"
										class="rounded-md p-1 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
										onclick={() => copyRow(format, value)}
										aria-label="Copy {format} value"
									>
										{#if copiedFormat === format}<Check size={13} class="text-ok" />{:else}<Copy
												size={13}
											/>{/if}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="font-mono text-sm text-dim/50">—</p>
		{/if}
	</OutputPanel>
</div>

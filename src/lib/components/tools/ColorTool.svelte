<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import EmptyState from '../EmptyState.svelte';
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

	/** WCAG relative luminance and contrast ratios vs black/white text. */
	function luminance(r: number, g: number, b: number): number {
		const lin = (c: number) => {
			const cn = c / 255;
			return cn <= 0.04045 ? cn / 12.92 : ((cn + 0.055) / 1.055) ** 2.4;
		};
		return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
	}

	const contrast = $derived.by(() => {
		if (!color) return null;
		const L = luminance(color.r, color.g, color.b);
		const vsWhite = (1 + 0.05) / (L + 0.05);
		const vsBlack = (L + 0.05) / 0.05;
		const grade = (ratio: number) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'fail');
		return {
			white: { ratio: vsWhite, grade: grade(vsWhite) },
			black: { ratio: vsBlack, grade: grade(vsBlack) }
		};
	});

	const channels = $derived.by(() => {
		if (!color) return [];
		return [
			{ label: 'R', value: color.r, max: 255, cls: 'bg-err/70' },
			{ label: 'G', value: color.g, max: 255, cls: 'bg-ok/70' },
			{ label: 'B', value: color.b, max: 255, cls: 'bg-accent/70' }
		];
	});

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
		label={tt('colorInput')}
		placeholder="#4c8dff · rgb(76 141 255) · hsl(218 100% 65%) · tomato"
		{badge}
		rows={2}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = '#4c8dff')}
	/>
	{#if color && contrast}
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			<!-- Channel bars -->
			<div class="rounded-lg border border-line bg-surface px-4 py-3">
				<span class="mb-2 block text-[11px] tracking-wide text-dim uppercase">{tt('colorRgb')}</span>
				<div class="space-y-2">
					{#each channels as ch (ch.label)}
						<div class="flex items-center gap-2">
							<span class="w-3 font-mono text-xs text-dim">{ch.label}</span>
							<div class="h-1.5 grow overflow-hidden rounded-full bg-surface-2">
								<div class="h-full rounded-full {ch.cls}" style="width: {(ch.value / ch.max) * 100}%"></div>
							</div>
							<span class="w-8 text-right font-mono text-xs tabular-nums">{ch.value}</span>
						</div>
					{/each}
				</div>
			</div>
			<!-- Contrast check -->
			<div class="rounded-lg border border-line bg-surface px-4 py-3">
				<span class="mb-2 block text-[11px] tracking-wide text-dim uppercase">{tt('colorContrast')}</span>
				<div class="flex gap-2">
					<div
						class="flex grow flex-col items-center rounded-md border border-line px-2 py-2"
						style="background: {color.hex}"
					>
						<span class="text-sm font-medium" style="color: #fff">Aa</span>
						<span class="mt-0.5 font-mono text-[11px]" style="color: #fff"
							>{contrast.white.ratio.toFixed(2)} · {contrast.white.grade}</span
						>
					</div>
					<div
						class="flex grow flex-col items-center rounded-md border border-line px-2 py-2"
						style="background: {color.hex}"
					>
						<span class="text-sm font-medium" style="color: #000">Aa</span>
						<span class="mt-0.5 font-mono text-[11px]" style="color: #000"
							>{contrast.black.ratio.toFixed(2)} · {contrast.black.grade}</span
						>
					</div>
				</div>
				<p class="mt-1.5 text-[11px] text-dim/70">AA needs ≥ 4.5 for body text, ≥ 3 for large text.</p>
			</div>
		</div>
	{/if}

	<OutputPanel value={output} label={tt('colorFormats')} filename="color.txt" shareState={input.trim() === '' ? null : { input }}>
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
			<EmptyState hint="Every format appears here — try #4c8dff" />
		{/if}
	</OutputPanel>
</div>

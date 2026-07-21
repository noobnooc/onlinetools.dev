<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import Segmented from '../Segmented.svelte';
	import { generateQr, type EcLevel } from '$lib/tools/qr';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { downloadText } from '$lib/utils/format';
	import { Download } from 'lucide-svelte';

	let input = $state('');
	let ecLevel = $state<EcLevel>('M');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const result = $derived(input === '' ? null : generateQr(input, ecLevel));
	const qr = $derived(result?.ok ? result.value : null);

	$effect(() => {
		currentResult.text = qr?.svg ?? '';
	});

	function downloadSvg() {
		if (qr) downloadText(qr.svg, 'qr-code.svg', 'image/svg+xml');
	}

	function downloadPng() {
		if (!qr) return;
		const scale = 12;
		const size = (qr.moduleCount + 8) * scale;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const img = new Image();
		img.onload = () => {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, size, size);
			ctx.drawImage(img, 0, 0, size, size);
			const a = document.createElement('a');
			a.href = canvas.toDataURL('image/png');
			a.download = 'qr-code.png';
			a.click();
		};
		img.src = 'data:image/svg+xml;base64,' + btoa(qr.svg);
	}

	const EC_LEVELS: Array<[EcLevel, string]> = [
		['L', '7%'],
		['M', '15%'],
		['Q', '25%'],
		['H', '30%']
	];

	const badge = $derived.by((): BadgeSegment[] => {
		if (input === '') return [];
		if (!qr) return [{ text: 'too long', tone: 'err' }];
		return [
			{ text: /^https?:\/\//i.test(input.trim()) ? 'URL' : 'text', tone: 'accent' },
			{ text: `v${Math.round((qr.moduleCount - 17) / 4)} · ${qr.moduleCount}×${qr.moduleCount}` }
		];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="Content"
		placeholder="https://example.com — or any text, WiFi config, contact card…"
		{badge}
		rows={3}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = 'https://onlinetools.dev')}
	/>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<span class="text-dim">Error correction</span>
		<Segmented
			bind:value={ecLevel}
			label="Error correction level"
			options={EC_LEVELS.map(([level, pct]) => ({
				value: level,
				label: level,
				title: `Survives ${pct} damage`,
				mono: true
			}))}
		/>
	</div>

	{#if qr}
		<div class="flex flex-col items-start gap-4 sm:flex-row">
			<div class="w-full max-w-60 rounded-lg border border-line bg-white p-3">
				<!-- eslint-disable-next-line svelte/no-at-html-tags — SVG is generated locally from a trusted builder -->
				{@html qr.svg}
			</div>
			<div class="flex flex-col gap-2">
				<button
					type="button"
					onclick={downloadSvg}
					class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
				>
					<Download size={13} /> SVG (vector, print)
				</button>
				<button
					type="button"
					onclick={downloadPng}
					class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
				>
					<Download size={13} /> PNG (chat, slides)
				</button>
				<p class="max-w-52 text-xs text-dim">
					The content is encoded directly — no redirect service, nothing expires, no scan tracking.
				</p>
			</div>
		</div>
	{/if}
</div>

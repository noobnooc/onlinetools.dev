<script lang="ts">
	import { t, tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import ImageDrop from '../ImageDrop.svelte';
	import Segmented from '../Segmented.svelte';
	import StatTile from '../StatTile.svelte';
	import {
		parseImageInput,
		base64EncodedSize,
		cssSnippet,
		htmlSnippet,
		IMAGE_EXT,
		IMAGE_LABEL
	} from '$lib/tools/image';
	import { readImageFile, measureImage, downloadBlob, baseName, type LoadedImage } from '$lib/utils/image';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText, formatBytes } from '$lib/utils/format';
	import { Copy, Check, Download } from 'lucide-svelte';

	type Mode = 'encode' | 'decode';
	let mode = $state<Mode>('encode');

	// Image → Base64
	let img = $state<LoadedImage | null>(null);
	let loadError = $state('');

	async function onfile(file: File) {
		const r = await readImageFile(file);
		if (r.ok) {
			img = r.value;
			loadError = '';
		} else {
			img = null;
			loadError = r.error === 'notImage' ? tt('imgErrNotImage') : tt('imgErrDecode');
		}
	}

	// Base64 → image
	let input = $state('');
	initFromHash((s) => {
		if (s.input) {
			input = s.input;
			mode = 'decode';
		}
	});

	const parsed = $derived(input.trim() === '' ? null : parseImageInput(input));
	const decoded = $derived(parsed?.ok ? parsed.value : null);
	let decodedDims = $state<{ width: number; height: number } | null>(null);
	$effect(() => {
		const d = decoded;
		decodedDims = null;
		if (d) void measureImage(d.dataUrl).then((dims) => (decodedDims = dims));
	});

	const outputs = $derived.by(() => {
		if (!img) return [];
		return [
			{ key: 'i2bDataUrl', value: img.dataUrl },
			{ key: 'i2bCss', value: cssSnippet(img.dataUrl) },
			{ key: 'i2bHtml', value: htmlSnippet(img.dataUrl, img.width, img.height) },
			{ key: 'i2bRawB64', value: img.base64 }
		] as const;
	});

	$effect(() => {
		currentResult.text = mode === 'encode' ? (img?.dataUrl ?? '') : (decoded?.dataUrl ?? '');
	});

	let copiedKey = $state('');
	async function copyRow(key: string, value: string) {
		if (await copyText(value)) {
			copiedKey = key;
			setTimeout(() => (copiedKey = ''), 1200);
		}
	}

	function downloadDecoded() {
		const d = decoded;
		if (!d) return;
		downloadBlob(new Blob([d.bytes as BlobPart], { type: d.mime }), `decoded.${IMAGE_EXT[d.kind]}`);
	}

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!decoded) return [{ text: 'invalid', tone: 'err' }];
		return [
			{ text: IMAGE_LABEL[decoded.kind], tone: 'accent' },
			{ text: formatBytes(decoded.bytes.length) }
		];
	});

	const overheadPct = $derived(
		img && img.bytes.length > 0
			? Math.round(((base64EncodedSize(img.bytes.length) - img.bytes.length) / img.bytes.length) * 100)
			: 0
	);
</script>

<div class="space-y-4">
	<Segmented
		bind:value={mode}
		label={tt('i2bToB64')}
		options={[
			{ value: 'encode', label: tt('i2bToB64') },
			{ value: 'decode', label: tt('i2bFromB64') }
		]}
	/>

	{#if mode === 'encode'}
		<ImageDrop
			label={tt('imgSource')}
			{onfile}
			summary={img ? `${img.name} · ${formatBytes(img.bytes.length)}` : ''}
		/>
		{#if loadError}
			<p class="text-sm text-err">{loadError}</p>
		{/if}
		{#if img}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<StatTile label={tt('imgDimensions')} value={`${img.width}×${img.height}`} hint={IMAGE_LABEL[img.kind]} />
				<StatTile label={tt('imgOriginal')} value={formatBytes(img.bytes.length)} />
				<StatTile label={tt('i2bEncodedSize')} value={formatBytes(base64EncodedSize(img.bytes.length))} hint={tt('i2bOverhead', { pct: overheadPct })} />
			</div>
			<div class="space-y-2">
				{#each outputs as row (row.key)}
					<div class="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
						<span class="w-40 shrink-0 text-xs font-medium tracking-wide text-dim uppercase">{tt(row.key)}</span>
						<code class="min-w-0 flex-1 truncate font-mono text-xs text-dim">{row.value.slice(0, 120)}</code>
						<button
							type="button"
							onclick={() => copyRow(row.key, row.value)}
							class="flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs transition-colors duration-120 hover:border-accent/50"
						>
							{#if copiedKey === row.key}<Check size={12} class="text-ok" />{:else}<Copy size={12} />{/if}
							{t(copiedKey === row.key ? 'copied' : 'copy')}
						</button>
					</div>
				{/each}
			</div>
			<p class="text-xs text-dim">{tt('i2bNote')}</p>
		{/if}
	{:else}
		<InputArea
			bind:value={input}
			label={tt('i2bInput')}
			placeholder="data:image/png;base64,iVBORw0KGgo…"
			{badge}
			rows={6}
			error={parsed && !parsed.ok ? { message: parsed.error } : null}
		/>
		{#if decoded}
			<div class="flex flex-col items-start gap-4 sm:flex-row">
				<div class="max-w-72 rounded-lg border border-line bg-[repeating-conic-gradient(rgba(128,128,128,0.15)_0%_25%,transparent_0%_50%)] bg-size-[16px_16px] p-3">
					<img src={decoded.dataUrl} alt="" class="max-h-64 max-w-full" />
				</div>
				<div class="flex flex-col gap-2">
					{#if decodedDims}
						<p class="font-mono text-sm tabular-nums">
							{decodedDims.width}×{decodedDims.height} · {formatBytes(decoded.bytes.length)}
						</p>
					{/if}
					<button
						type="button"
						onclick={downloadDecoded}
						class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
					>
						<Download size={13} /> {tt('imgDownload', { fmt: IMAGE_LABEL[decoded.kind] })}
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>

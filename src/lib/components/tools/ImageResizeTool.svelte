<script lang="ts">
	import { tt } from '$lib/i18n';
	import ImageDrop from '../ImageDrop.svelte';
	import Segmented from '../Segmented.svelte';
	import StatTile from '../StatTile.svelte';
	import { IMAGE_EXT, IMAGE_LABEL, resizeDimensions, type ResizeMode } from '$lib/tools/image';
	import {
		readImageFile,
		encodeImage,
		downloadBlob,
		baseName,
		type LoadedImage,
		type EncodedImage,
		type EncodeKind
	} from '$lib/utils/image';
	import { formatBytes } from '$lib/utils/format';
	import { Download } from 'lucide-svelte';

	let img = $state<LoadedImage | null>(null);
	let loadError = $state('');
	let mode = $state<ResizeMode>('width');
	let value = $state(800);
	let format = $state<'keep' | EncodeKind>('keep');
	let quality = $state(85);

	let result = $state<EncodedImage | null>(null);
	let resizeError = $state('');
	let busy = $state(false);

	async function onfile(file: File) {
		const r = await readImageFile(file);
		if (r.ok) {
			img = r.value;
			loadError = '';
			// Sensible default: halve large images, keep small ones as-is.
			if (mode === 'width') value = Math.max(1, Math.round(r.value.width / 2));
		} else {
			img = null;
			result = null;
			loadError = r.error === 'notImage' ? tt('imgErrNotImage') : tt('imgErrDecode');
		}
	}

	/** Actual output format: "keep" maps to a canvas-encodable kind. */
	const outKind = $derived.by((): EncodeKind => {
		if (format !== 'keep') return format;
		if (img?.kind === 'jpeg') return 'jpeg';
		if (img?.kind === 'webp') return 'webp';
		return 'png';
	});
	const lossy = $derived(outKind !== 'png');

	const dims = $derived(img ? resizeDimensions(img, mode, value) : null);
	const targetDims = $derived(dims?.ok ? dims.value : null);

	let run = 0;
	$effect(() => {
		const source = img;
		const d = targetDims;
		const fmt = outKind;
		const q = quality;
		if (!source || !d) {
			result = null;
			return;
		}
		const id = ++run;
		busy = true;
		void encodeImage(source.dataUrl, d.width, d.height, fmt, q).then((r) => {
			if (id !== run) return;
			busy = false;
			if (r.ok) {
				result = r.value;
				resizeError = '';
			} else {
				result = null;
				resizeError =
					r.error === 'formatUnsupported'
						? tt('imgErrFormat', { fmt: IMAGE_LABEL[fmt] })
						: tt('imgErrEncode');
			}
		});
	});

	function download() {
		if (!img || !result) return;
		downloadBlob(
			result.blob,
			`${baseName(img.name)}-${result.width}x${result.height}.${IMAGE_EXT[outKind]}`
		);
	}
</script>

<div class="space-y-4">
	<ImageDrop
		label={tt('imgSource')}
		{onfile}
		summary={img ? `${img.name} · ${img.width}×${img.height} · ${formatBytes(img.bytes.length)}` : ''}
	/>
	{#if loadError}
		<p class="text-sm text-err">{loadError}</p>
	{/if}

	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<div class="flex items-center gap-2 text-dim">
			{tt('irBy')}
			<Segmented
				bind:value={mode}
				label={tt('irBy')}
				options={[
					{ value: 'width', label: tt('irWidth') },
					{ value: 'height', label: tt('irHeight') },
					{ value: 'percent', label: '%', title: tt('irPercent'), mono: true }
				]}
			/>
		</div>
		<label class="flex items-center gap-2 text-dim">
			{mode === 'percent' ? tt('irPercent') : mode === 'width' ? tt('irWidth') : tt('irHeight')}
			<input
				type="number"
				bind:value
				min="1"
				max={mode === 'percent' ? 1000 : 16384}
				class="w-24 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg"
			/>
			<span class="font-mono text-xs text-dim">{mode === 'percent' ? '%' : 'px'}</span>
		</label>
		<div class="flex items-center gap-2 text-dim">
			{tt('irFormat')}
			<Segmented
				bind:value={format}
				label={tt('irFormat')}
				options={[
					{ value: 'keep', label: tt('irKeep') },
					{ value: 'png', label: 'PNG' },
					{ value: 'jpeg', label: 'JPEG' },
					{ value: 'webp', label: 'WebP' }
				]}
			/>
		</div>
		{#if lossy}
			<label class="flex items-center gap-2 text-dim">
				{tt('icQuality')}
				<input type="range" bind:value={quality} min="1" max="100" class="w-32 accent-(--accent)" />
				<span class="w-8 font-mono text-fg tabular-nums">{quality}</span>
			</label>
		{/if}
	</div>

	{#if dims && !dims.ok}
		<p class="text-sm text-err">{dims.error}</p>
	{:else if resizeError}
		<p class="text-sm text-err">{resizeError}</p>
	{/if}

	{#if img && result && targetDims}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			<StatTile label={tt('imgOriginal')} value={`${img.width}×${img.height}`} hint={formatBytes(img.bytes.length)} />
			<StatTile label={tt('irResized')} value={`${result.width}×${result.height}`} hint={formatBytes(result.blob.size)} />
			<StatTile
				label={tt('irScale')}
				value={`${Math.round((result.width / img.width) * 100)}%`}
				hint={IMAGE_LABEL[outKind]}
			/>
		</div>
		<div class="flex flex-col items-start gap-4 sm:flex-row">
			<div class="max-w-72 rounded-lg border border-line bg-[repeating-conic-gradient(rgba(128,128,128,0.15)_0%_25%,transparent_0%_50%)] bg-size-[16px_16px] p-3 {busy ? 'opacity-60' : ''}">
				<img src={result.dataUrl} alt="" class="max-h-64 max-w-full" />
			</div>
			<div class="flex flex-col gap-2">
				<button
					type="button"
					onclick={download}
					class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
				>
					<Download size={13} /> {tt('imgDownload', { fmt: IMAGE_LABEL[outKind] })}
				</button>
				<p class="max-w-52 text-xs text-dim">{tt('irNote')}</p>
			</div>
		</div>
	{/if}
</div>

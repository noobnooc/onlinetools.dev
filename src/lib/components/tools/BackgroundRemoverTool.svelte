<script lang="ts">
	import { tt } from '$lib/i18n';
	import ImageDrop from '../ImageDrop.svelte';
	import Segmented from '../Segmented.svelte';
	import StatTile from '../StatTile.svelte';
	import { IMAGE_EXT, IMAGE_LABEL } from '$lib/tools/image';
	import { coverage, parseHexColor } from '$lib/tools/bgremove';
	import {
		readImageFile,
		loadImageElement,
		downloadBlob,
		baseName,
		type LoadedImage,
		type EncodedImage,
		type EncodeKind
	} from '$lib/utils/image';
	import {
		segmentImage,
		renderCutout,
		type BgProgress,
		type Segmentation
	} from '$lib/utils/bgremove';
	import { formatBytes } from '$lib/utils/format';
	import { Download } from 'lucide-svelte';

	let img = $state<LoadedImage | null>(null);
	let element = $state<HTMLImageElement | null>(null);
	let loadError = $state('');

	let seg = $state<Segmentation | null>(null);
	let progress = $state<BgProgress | null>(null);
	let segError = $state('');

	let background = $state<'transparent' | 'color'>('transparent');
	let color = $state('#ffffff');
	let format = $state<EncodeKind>('png');
	let quality = $state(90);

	let result = $state<EncodedImage | null>(null);
	let renderError = $state('');
	let busy = $state(false);

	const SEG_ERRORS: Record<string, () => string> = {
		load: () => tt('brErrLoad'),
		flatMask: () => tt('brErrFlat')
	};

	let run = 0;
	async function onfile(file: File) {
		const r = await readImageFile(file);
		if (!r.ok) {
			img = null;
			element = null;
			seg = null;
			result = null;
			loadError = r.error === 'notImage' ? tt('imgErrNotImage') : tt('imgErrDecode');
			return;
		}
		loadError = '';
		const id = ++run;
		img = r.value;
		seg = null;
		result = null;
		segError = '';
		const el = await loadImageElement(r.value.dataUrl);
		if (id !== run) return;
		if (!el) {
			loadError = tt('imgErrDecode');
			return;
		}
		element = el;
		progress = { phase: 'download', loaded: 0 };
		const s = await segmentImage(el, (p) => {
			if (id === run) progress = p;
		});
		if (id !== run) return;
		progress = null;
		if (s.ok) {
			seg = s.value;
		} else {
			segError = (SEG_ERRORS[s.error] ?? (() => tt('brErrRun')))();
		}
	}

	// JPEG cannot carry transparency; switching to a transparent background
	// while JPEG is selected falls back to PNG rather than silently flattening.
	$effect(() => {
		if (background === 'transparent' && format === 'jpeg') format = 'png';
	});

	const lossy = $derived(format !== 'png');
	const rgb = $derived(background === 'color' ? parseHexColor(color) : null);

	// Re-composite whenever the mask, background or output settings change.
	// The run id guards against a slow older encode overwriting a newer one.
	let renderRun = 0;
	$effect(() => {
		const el = element;
		const mask = seg;
		const bg = rgb;
		const fmt = format;
		const q = quality;
		if (!el || !mask) {
			result = null;
			return;
		}
		const id = ++renderRun;
		busy = true;
		void renderCutout(el, mask, bg, fmt, q).then((r) => {
			if (id !== renderRun) return;
			busy = false;
			if (r.ok) {
				result = r.value;
				renderError = '';
			} else {
				result = null;
				renderError =
					r.error === 'formatUnsupported'
						? tt('imgErrFormat', { fmt: IMAGE_LABEL[fmt] })
						: tt('imgErrEncode');
			}
		});
	});

	const progressLabel = $derived.by(() => {
		if (!progress) return '';
		if (progress.phase === 'download') return tt('brDownloading');
		if (progress.phase === 'load') return tt('brStarting');
		return tt('brRunning');
	});
	const progressPct = $derived(
		progress?.phase === 'download' && progress.total
			? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
			: null
	);

	function download() {
		if (!img || !result) return;
		downloadBlob(result.blob, `${baseName(img.name)}-no-bg.${IMAGE_EXT[format]}`);
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

	{#if progress}
		<div class="space-y-1.5" role="status" aria-live="polite">
			<div class="flex items-baseline justify-between gap-3 text-sm">
				<span class="text-dim">{progressLabel}</span>
				{#if progress.phase === 'download'}
					<span class="font-mono text-xs text-dim tabular-nums">
						{formatBytes(progress.loaded)}{progress.total ? ` / ${formatBytes(progress.total)}` : ''}
					</span>
				{/if}
			</div>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
				{#if progressPct !== null}
					<div class="h-full rounded-full bg-accent transition-[width] duration-150" style="width: {progressPct}%"></div>
				{:else}
					<div class="h-full w-1/3 animate-pulse rounded-full bg-accent/70"></div>
				{/if}
			</div>
			{#if progress.phase === 'download'}
				<p class="text-xs text-dim/70">{tt('brFirstLoad')}</p>
			{/if}
		</div>
	{/if}

	{#if segError}
		<p class="text-sm text-err">{segError}</p>
	{/if}

	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<div class="flex items-center gap-2 text-dim">
			{tt('brBackground')}
			<Segmented
				bind:value={background}
				label={tt('brBackground')}
				options={[
					{ value: 'transparent', label: tt('brTransparent') },
					{ value: 'color', label: tt('brColor') }
				]}
			/>
		</div>
		{#if background === 'color'}
			<label class="flex items-center gap-2 text-dim">
				<span class="sr-only">{tt('brColor')}</span>
				<input
					type="color"
					bind:value={color}
					class="h-7 w-9 cursor-pointer rounded-md border border-line bg-surface-2 p-0.5"
				/>
				<span class="font-mono text-xs text-fg">{color}</span>
			</label>
		{/if}
		<div class="flex items-center gap-2 text-dim">
			{tt('brFormat')}
			<Segmented
				bind:value={format}
				label={tt('brFormat')}
				options={[
					{ value: 'png', label: 'PNG' },
					{ value: 'webp', label: 'WebP' },
					...(background === 'color' ? [{ value: 'jpeg' as EncodeKind, label: 'JPEG' }] : [])
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

	{#if renderError}
		<p class="text-sm text-err">{renderError}</p>
	{/if}

	{#if img && seg && result}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			<StatTile label={tt('imgOriginal')} value={`${img.width}×${img.height}`} hint={formatBytes(img.bytes.length)} />
			<StatTile label={tt('brResult')} value={formatBytes(result.blob.size)} hint={IMAGE_LABEL[format]} />
			<StatTile
				label={tt('brSubject')}
				value={`${Math.round(coverage(seg.alpha) * 100)}%`}
				hint={tt('brTime', { s: (seg.inferenceMs / 1000).toFixed(1) })}
			/>
		</div>
		<div class="flex flex-col items-start gap-4 sm:flex-row">
			<div class="flex flex-wrap gap-3">
				<figure class="m-0">
					<div class="max-w-64 rounded-lg border border-line bg-surface-2 p-2">
						<img src={img.dataUrl} alt="" class="max-h-56 max-w-full" />
					</div>
					<figcaption class="mt-1 text-[11px] tracking-wide text-dim uppercase">{tt('imgOriginal')}</figcaption>
				</figure>
				<figure class="m-0">
					<div class="max-w-64 rounded-lg border border-line bg-[repeating-conic-gradient(rgba(128,128,128,0.15)_0%_25%,transparent_0%_50%)] bg-size-[16px_16px] p-2 {busy ? 'opacity-60' : ''}">
						<img src={result.dataUrl} alt="" class="max-h-56 max-w-full" />
					</div>
					<figcaption class="mt-1 text-[11px] tracking-wide text-dim uppercase">{tt('brResult')}</figcaption>
				</figure>
			</div>
			<div class="flex flex-col gap-2">
				<button
					type="button"
					onclick={download}
					class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
				>
					<Download size={13} /> {tt('imgDownload', { fmt: IMAGE_LABEL[format] })}
				</button>
				<p class="max-w-52 text-xs text-dim">{tt('brNote')}</p>
			</div>
		</div>
	{/if}
</div>

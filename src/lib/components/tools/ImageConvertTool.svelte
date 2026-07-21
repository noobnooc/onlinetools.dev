<script lang="ts">
	import { tt } from '$lib/i18n';
	import ImageDrop from '../ImageDrop.svelte';
	import Segmented from '../Segmented.svelte';
	import StatTile from '../StatTile.svelte';
	import { IMAGE_EXT, IMAGE_LABEL } from '$lib/tools/image';
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
	let target = $state<EncodeKind>('webp');
	let quality = $state(85);

	let result = $state<EncodedImage | null>(null);
	let convertError = $state('');
	let busy = $state(false);

	async function onfile(file: File) {
		const r = await readImageFile(file);
		if (r.ok) {
			img = r.value;
			loadError = '';
		} else {
			img = null;
			result = null;
			loadError = r.error === 'notImage' ? tt('imgErrNotImage') : tt('imgErrDecode');
		}
	}

	const lossy = $derived(target !== 'png');

	// Re-encode whenever source, target format or quality changes. A run id
	// guards against a slow older encode overwriting a newer result.
	let run = 0;
	$effect(() => {
		const source = img;
		const fmt = target;
		const q = quality;
		if (!source) return;
		const id = ++run;
		busy = true;
		void encodeImage(source.dataUrl, source.width, source.height, fmt, q).then((r) => {
			if (id !== run) return;
			busy = false;
			if (r.ok) {
				result = r.value;
				convertError = '';
			} else {
				result = null;
				convertError =
					r.error === 'formatUnsupported'
						? tt('imgErrFormat', { fmt: IMAGE_LABEL[fmt] })
						: tt('imgErrEncode');
			}
		});
	});

	const deltaPct = $derived(
		img && result && img.bytes.length > 0
			? Math.round(((result.blob.size - img.bytes.length) / img.bytes.length) * 100)
			: 0
	);

	function download() {
		if (!img || !result) return;
		downloadBlob(result.blob, `${baseName(img.name)}.${IMAGE_EXT[target]}`);
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
			{tt('icTarget')}
			<Segmented
				bind:value={target}
				label={tt('icTarget')}
				options={[
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

	{#if convertError}
		<p class="text-sm text-err">{convertError}</p>
	{/if}

	{#if img && result}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			<StatTile label={tt('imgOriginal')} value={formatBytes(img.bytes.length)} hint={IMAGE_LABEL[img.kind]} />
			<StatTile label={tt('icConverted')} value={formatBytes(result.blob.size)} hint={IMAGE_LABEL[target]} />
			<StatTile
				label="Δ"
				value={`${deltaPct > 0 ? '+' : ''}${deltaPct}%`}
				hint={tt(deltaPct <= 0 ? 'icSmaller' : 'icLarger')}
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
					<Download size={13} /> {tt('imgDownload', { fmt: IMAGE_LABEL[target] })}
				</button>
				{#if target === 'jpeg'}
					<p class="max-w-52 text-xs text-dim">{tt('icBgNote')}</p>
				{/if}
				<p class="max-w-52 text-xs text-dim">{tt('icNote')}</p>
			</div>
		</div>
	{/if}
</div>

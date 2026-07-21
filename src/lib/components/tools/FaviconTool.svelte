<script lang="ts">
	import { t, tt } from '$lib/i18n';
	import ImageDrop from '../ImageDrop.svelte';
	import {
		ICO_SIZES,
		PNG_SET,
		packIco,
		packZip,
		faviconHtmlSnippet,
		webManifest,
		type ZipEntry
	} from '$lib/tools/favicon';
	import { buildDataUrl, bytesToBase64 } from '$lib/tools/image';
	import {
		readImageFile,
		loadImageElement,
		drawSquarePng,
		downloadBlob,
		type LoadedImage
	} from '$lib/utils/image';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText, formatBytes } from '$lib/utils/format';
	import { Copy, Check, Download } from 'lucide-svelte';

	let img = $state<LoadedImage | null>(null);
	let loadError = $state('');
	let appleBg = $state('#ffffff');

	interface GeneratedFile {
		name: string;
		data: Uint8Array;
		/** Preview data URL for PNGs, absent for ico/manifest. */
		preview?: string;
		size?: number;
	}
	let files = $state<GeneratedFile[]>([]);
	let genError = $state('');

	async function onfile(file: File) {
		const r = await readImageFile(file);
		if (r.ok) {
			img = r.value;
			loadError = '';
		} else {
			img = null;
			files = [];
			loadError = r.error === 'notImage' ? tt('imgErrNotImage') : tt('imgErrDecode');
		}
	}

	// Regenerate the whole set when the source or the Apple background changes.
	let run = 0;
	$effect(() => {
		const source = img;
		const bg = appleBg;
		if (!source) return;
		const id = ++run;
		void (async () => {
			const el = await loadImageElement(source.dataUrl);
			if (!el) {
				if (id === run) genError = tt('imgErrDecode');
				return;
			}
			const out: GeneratedFile[] = [];
			const icoEntries = [];
			for (const size of ICO_SIZES) {
				const png = await drawSquarePng(el, size);
				if (!png) {
					if (id === run) genError = tt('imgErrEncode');
					return;
				}
				icoEntries.push({ size, png });
			}
			const ico = packIco(icoEntries);
			if (!ico.ok) {
				if (id === run) genError = ico.error;
				return;
			}
			out.push({ name: 'favicon.ico', data: ico.value });
			for (const { size, name } of PNG_SET) {
				const apple = name.startsWith('apple-touch');
				const png = await drawSquarePng(el, size, apple ? bg : undefined);
				if (!png) {
					if (id === run) genError = tt('imgErrEncode');
					return;
				}
				out.push({
					name,
					data: png,
					preview: buildDataUrl('image/png', bytesToBase64(png)),
					size
				});
			}
			out.push({ name: 'site.webmanifest', data: new TextEncoder().encode(webManifest()) });
			if (id === run) {
				files = out;
				genError = '';
			}
		})();
	});

	const snippet = faviconHtmlSnippet();
	$effect(() => {
		currentResult.text = files.length > 0 ? snippet : '';
	});

	let copied = $state(false);
	async function copySnippet() {
		if (await copyText(snippet)) {
			copied = true;
			setTimeout(() => (copied = false), 1200);
		}
	}

	function downloadIco() {
		const ico = files.find((f) => f.name === 'favicon.ico');
		if (ico) downloadBlob(new Blob([ico.data as BlobPart], { type: 'image/x-icon' }), 'favicon.ico');
	}

	function downloadZip() {
		const zip = packZip(files.map((f): ZipEntry => ({ name: f.name, data: f.data })));
		if (zip.ok) downloadBlob(new Blob([zip.value as BlobPart], { type: 'application/zip' }), 'favicons.zip');
	}

	const previews = $derived(files.filter((f) => f.preview));
	const smallSource = $derived(img !== null && Math.min(img.width, img.height) < 512);
</script>

<div class="space-y-4">
	<ImageDrop
		label={tt('imgSource')}
		{onfile}
		summary={img ? `${img.name} · ${img.width}×${img.height} · ${formatBytes(img.bytes.length)}` : ''}
	/>
	{#if loadError}
		<p class="text-sm text-err">{loadError}</p>
	{:else if genError}
		<p class="text-sm text-err">{genError}</p>
	{/if}

	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<label class="flex items-center gap-2 text-dim">
			{tt('fgAppleBg')}
			<input
				type="color"
				bind:value={appleBg}
				class="h-7 w-10 cursor-pointer rounded-md border border-line bg-surface-2"
			/>
			<span class="font-mono text-xs">{appleBg}</span>
		</label>
	</div>

	{#if smallSource && img}
		<p class="text-sm text-warn">{tt('fgSmall', { px: Math.min(img.width, img.height) })}</p>
	{/if}

	{#if img && files.length > 0}
		<div class="flex flex-wrap items-end gap-4 rounded-lg border border-line bg-[repeating-conic-gradient(rgba(128,128,128,0.15)_0%_25%,transparent_0%_50%)] bg-size-[16px_16px] p-4">
			{#each previews as file (file.name)}
				<figure class="flex flex-col items-center gap-1.5">
					<img
						src={file.preview}
						alt={file.name}
						width={Math.min(file.size ?? 48, 64)}
						height={Math.min(file.size ?? 48, 64)}
						style="image-rendering: {(file.size ?? 0) <= 32 ? 'pixelated' : 'auto'};"
					/>
					<figcaption class="font-mono text-[10px] text-dim">{file.size}px</figcaption>
				</figure>
			{/each}
		</div>

		<div class="space-y-1.5">
			<span class="text-xs font-medium tracking-wide text-dim uppercase">{tt('fgFiles')}</span>
			<ul class="space-y-1 font-mono text-xs text-dim">
				{#each files as file (file.name)}
					<li class="flex justify-between gap-4 border-b border-line/50 pb-1">
						<span class="text-fg">{file.name}</span>
						<span class="tabular-nums">{formatBytes(file.data.length)}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				onclick={downloadIco}
				class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
			>
				<Download size={13} /> {tt('imgDownload', { fmt: 'favicon.ico' })}
			</button>
			<button
				type="button"
				onclick={downloadZip}
				class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
			>
				<Download size={13} /> {tt('imgDownload', { fmt: 'ZIP' })}
			</button>
		</div>

		<div class="space-y-1.5">
			<div class="flex items-baseline justify-between gap-2">
				<span class="text-xs font-medium tracking-wide text-dim uppercase">{tt('fgHtml')}</span>
				<button
					type="button"
					onclick={copySnippet}
					class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs transition-colors duration-120 hover:border-accent/50"
				>
					{#if copied}<Check size={12} class="text-ok" />{:else}<Copy size={12} />{/if}
					{t(copied ? 'copied' : 'copy')}
				</button>
			</div>
			<pre class="overflow-x-auto rounded-lg border border-line bg-surface-2 px-3 py-2.5 font-mono text-xs leading-relaxed">{snippet}</pre>
		</div>

		<p class="text-xs text-dim">{tt('fgNote')}</p>
	{/if}
</div>

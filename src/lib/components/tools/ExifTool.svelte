<script lang="ts">
	import { tt } from '$lib/i18n';
	import ImageDrop from '../ImageDrop.svelte';
	import { readImageMeta, stripImageMeta, type ImageMeta } from '$lib/tools/exif';
	import { downloadBlob, baseName } from '$lib/utils/image';
	import { formatBytes } from '$lib/utils/format';
	import { currentResult } from '$lib/state/app.svelte';
	import { Download, MapPin, ShieldCheck } from 'lucide-svelte';

	let fileName = $state('');
	let fileSize = $state(0);
	let bytes = $state<Uint8Array | null>(null);
	let meta = $state<ImageMeta | null>(null);
	let loadError = $state('');

	async function onfile(file: File) {
		const buf = new Uint8Array(await file.arrayBuffer());
		const r = readImageMeta(buf);
		if (r.ok) {
			bytes = buf;
			meta = r.value;
			fileName = file.name;
			fileSize = file.size;
			loadError = '';
		} else {
			bytes = null;
			meta = null;
			loadError = r.error;
		}
	}

	const groups = $derived.by(() => {
		if (!meta) return [];
		const order = [...new Set(meta.tags.map((t) => t.group))];
		return order.map((g) => ({ group: g, tags: meta!.tags.filter((t) => t.group === g) }));
	});

	const output = $derived(
		meta ? meta.tags.map((t) => `${t.group} · ${t.name}: ${t.value}`).join('\n') : ''
	);

	$effect(() => {
		currentResult.text = output;
	});

	function downloadClean() {
		if (!bytes || !meta) return;
		const r = stripImageMeta(bytes);
		if (!r.ok) return;
		const mime = meta.kind === 'jpeg' ? 'image/jpeg' : meta.kind === 'png' ? 'image/png' : 'image/webp';
		const ext = meta.kind === 'jpeg' ? 'jpg' : meta.kind;
		downloadBlob(new Blob([r.value.buffer as ArrayBuffer], { type: mime }), `${baseName(fileName)}-clean.${ext}`);
	}

	const mapUrl = $derived(
		meta?.gps ? `https://www.openstreetmap.org/?mlat=${meta.gps.lat}&mlon=${meta.gps.lon}#map=15/${meta.gps.lat}/${meta.gps.lon}` : null
	);
</script>

<div class="space-y-4">
	<ImageDrop
		label={tt('imgSource')}
		{onfile}
		summary={fileName === '' ? '' : `${fileName} · ${formatBytes(fileSize)} · ${meta?.kind.toUpperCase() ?? ''}`}
	/>
	{#if loadError}
		<p class="text-sm text-err">{loadError}</p>
	{/if}

	{#if meta}
		{#if meta.tags.length === 0}
			<div class="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm">
				<ShieldCheck class="h-5 w-5 shrink-0 text-ok" />
				<span>{tt('exNone')}</span>
			</div>
		{:else}
			<div class="flex flex-wrap items-center justify-between gap-3">
				<span class="text-xs font-medium tracking-wide text-dim uppercase">
					{tt('exTags', { n: meta.tags.length })} · {formatBytes(meta.metadataBytes)}
				</span>
				<button
					type="button"
					class="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent"
					onclick={downloadClean}
				>
					<Download class="h-4 w-4" /> {tt('exStrip')}
				</button>
			</div>

			{#if meta.gps && mapUrl}
				<div class="flex items-center gap-3 rounded-lg border border-warn/40 bg-surface px-4 py-3 text-sm">
					<MapPin class="h-5 w-5 shrink-0 text-warn" />
					<div>
						<span class="font-medium">{tt('exGps')}</span>
						<span class="ml-2 font-mono">{meta.gps.lat}, {meta.gps.lon}</span>
						<a href={mapUrl} target="_blank" rel="noopener noreferrer" class="ml-2 text-accent hover:underline">{tt('exMap')}</a>
					</div>
				</div>
			{/if}

			{#each groups as { group, tags } (group)}
				<div>
					<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{group}</span>
					<div class="overflow-hidden rounded-lg border border-line">
						<table class="w-full font-mono text-sm">
							<tbody>
								{#each tags as tag, i (group + i)}
									<tr class="border-b border-line/60 bg-surface last:border-0">
										<th scope="row" class="w-1/3 py-1.5 pr-4 pl-3 text-left font-normal whitespace-nowrap text-dim">{tag.name}</th>
										<td class="py-1.5 pr-3 break-all">{tag.value}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/each}
		{/if}
	{/if}

	<p class="text-xs text-dim">{tt('exNote')}</p>
</div>

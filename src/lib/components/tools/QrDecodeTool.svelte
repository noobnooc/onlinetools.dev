<script lang="ts">
	import { tt } from '$lib/i18n';
	import ImageDrop from '../ImageDrop.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { decodeQr, type DecodedQr, type QrPayloadKind } from '$lib/tools/qrdecode';
	import { readImageFile, loadImageElement, type LoadedImage } from '$lib/utils/image';
	import { formatBytes } from '$lib/utils/format';
	import { currentResult } from '$lib/state/app.svelte';
	import { ExternalLink, Wifi } from 'lucide-svelte';

	let image = $state<LoadedImage | null>(null);
	let decoded = $state<DecodedQr | null>(null);
	let scanError = $state('');

	const KIND_LABEL: Record<QrPayloadKind, string> = {
		url: 'URL',
		wifi: 'WiFi',
		vcard: 'vCard',
		mecard: 'MeCard',
		email: 'email',
		tel: 'phone',
		sms: 'SMS',
		geo: 'location',
		otp: 'OTP',
		event: 'event',
		text: 'text'
	};

	/**
	 * Scan at a few sizes: as-is first, then downscaled (huge photos defeat
	 * the locator) and upscaled (tiny screenshots lack pixels per module).
	 */
	async function scan(img: LoadedImage): Promise<DecodedQr | null> {
		const el = await loadImageElement(img.dataUrl);
		if (!el) return null;
		const max = Math.max(img.width, img.height);
		const scales = [1];
		if (max > 1200) scales.push(1000 / max);
		if (max > 2400) scales.push(600 / max);
		if (max < 300) scales.push(3);
		for (const s of scales) {
			const w = Math.max(1, Math.round(img.width * s));
			const h = Math.max(1, Math.round(img.height * s));
			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			if (!ctx) continue;
			// Flatten transparency to white so black-on-transparent codes scan.
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, w, h);
			ctx.imageSmoothingEnabled = s < 1;
			ctx.imageSmoothingQuality = 'high';
			ctx.drawImage(el, 0, 0, w, h);
			const r = decodeQr(ctx.getImageData(0, 0, w, h).data, w, h);
			if (r.ok) return r.value;
		}
		return null;
	}

	async function onfile(file: File) {
		decoded = null;
		scanError = '';
		const r = await readImageFile(file);
		if (!r.ok) {
			image = null;
			scanError = r.error === 'notImage' ? tt('imgErrNotImage') : tt('imgErrDecode');
			return;
		}
		image = r.value;
		const result = await scan(r.value);
		if (result) decoded = result;
		else scanError = tt('qrdNone');
	}

	const output = $derived(decoded?.text ?? '');

	$effect(() => {
		currentResult.text = output;
	});

	const openUrl = $derived(
		decoded?.kind === 'url' && /^https?:\/\//i.test(decoded.text.trim()) ? decoded.text.trim() : null
	);
</script>

<div class="space-y-4">
	<ImageDrop
		label={tt('imgSource')}
		{onfile}
		summary={image ? `${image.name} · ${formatBytes(image.bytes.length)} · ${image.width}×${image.height}` : ''}
	/>
	{#if scanError}
		<p class="text-sm text-err">{scanError}</p>
	{/if}

	{#if decoded}
		<div class="flex flex-wrap items-center gap-2">
			<span class="rounded-sm border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-accent">{KIND_LABEL[decoded.kind]}</span>
			<span class="rounded-sm border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-dim">v{decoded.version} · {decoded.moduleCount}×{decoded.moduleCount}</span>
			{#if openUrl}
				<a
					href={openUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-accent transition-colors duration-120 hover:border-accent/50"
				>
					<ExternalLink size={12} /> {tt('qrdOpen')}
				</a>
			{/if}
		</div>

		{#if decoded.wifi}
			<div class="overflow-hidden rounded-lg border border-line">
				<table class="w-full font-mono text-sm">
					<tbody>
						{#each [
							[tt('qrdWifiSsid'), decoded.wifi.ssid],
							[tt('qrdWifiPass'), decoded.wifi.password || '—'],
							[tt('qrdWifiSec'), decoded.wifi.security],
							[tt('qrdWifiHidden'), decoded.wifi.hidden ? '✓' : '—']
						] as [name, value] (name)}
							<tr class="border-b border-line/60 bg-surface last:border-0">
								<th scope="row" class="w-1/3 py-1.5 pr-4 pl-3 text-left font-normal whitespace-nowrap text-dim">
									{#if name === tt('qrdWifiSsid')}<Wifi size={13} class="mr-1.5 inline-block align-[-2px]" />{/if}{name}
								</th>
								<td class="py-1.5 pr-3 break-all">{value}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}

	<OutputPanel value={output} label={tt('qrdResult')} filename="qr-content.txt" emptyHint={tt('imgDrop')} />

	<p class="text-xs text-dim">{tt('qrdNote')}</p>
</div>

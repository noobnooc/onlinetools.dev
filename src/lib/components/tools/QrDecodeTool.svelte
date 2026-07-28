<script lang="ts">
	import { onDestroy } from 'svelte';
	import { tt } from '$lib/i18n';
	import ImageDrop from '../ImageDrop.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { decodeQr, type DecodedQr, type QrPayloadKind } from '$lib/tools/qrdecode';
	import { readImageFile, loadImageElement, type LoadedImage } from '$lib/utils/image';
	import { formatBytes } from '$lib/utils/format';
	import { currentResult } from '$lib/state/app.svelte';
	import { Camera, ExternalLink, VideoOff, Wifi } from 'lucide-svelte';

	let image = $state<LoadedImage | null>(null);
	let decoded = $state<DecodedQr | null>(null);
	let scanError = $state('');

	let videoEl = $state<HTMLVideoElement | null>(null);
	let cameraOn = $state(false);
	let stream: MediaStream | null = null;

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
		stopCamera();
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

	async function startCamera() {
		decoded = null;
		scanError = '';
		image = null;
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
				audio: false
			});
		} catch {
			scanError = tt('qrdCameraErr');
			return;
		}
		cameraOn = true;
	}

	function stopCamera() {
		stream?.getTracks().forEach((t) => t.stop());
		stream = null;
		cameraOn = false;
	}

	// Once the <video> renders, attach the stream and poll frames until a
	// code decodes or the camera is stopped.
	$effect(() => {
		if (!cameraOn || !videoEl || !stream) return;
		const video = videoEl;
		video.srcObject = stream;
		void video.play();
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		const timer = setInterval(() => {
			if (!ctx || video.readyState < 2 || video.videoWidth === 0) return;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			ctx.drawImage(video, 0, 0);
			const r = decodeQr(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
			if (r.ok) {
				decoded = r.value;
				stopCamera();
			}
		}, 250);
		return () => clearInterval(timer);
	});

	onDestroy(stopCamera);

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
	<div class="flex flex-wrap items-center gap-3">
		<button
			type="button"
			onclick={() => (cameraOn ? stopCamera() : startCamera())}
			class="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
		>
			{#if cameraOn}
				<VideoOff size={13} /> {tt('qrdCameraStop')}
			{:else}
				<Camera size={13} /> {tt('qrdCamera')}
			{/if}
		</button>
	</div>
	{#if cameraOn}
		<!-- svelte-ignore a11y_media_has_caption — live camera preview has no audio track -->
		<video
			bind:this={videoEl}
			playsinline
			muted
			class="w-full max-w-md rounded-lg border border-line bg-black"
		></video>
	{/if}
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

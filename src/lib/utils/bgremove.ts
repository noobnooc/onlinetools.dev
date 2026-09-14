import { type ToolResult, ok, err } from '$lib/tools/types';
import {
	BG_MODEL,
	compositeAlpha,
	maskToAlpha,
	toModelInput,
	type RGB
} from '$lib/tools/bgremove';
import { encodeCanvas, type EncodeKind, type EncodedImage } from './image';
// The ONNX Runtime WebAssembly build is fingerprinted into /_app/immutable
// like any other asset, so it is same-origin (the CSP allows nothing else)
// and cached forever once fetched.
import ortWasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url';
import ortMjsUrl from 'onnxruntime-web/ort-wasm-simd-threaded.mjs?url';

/**
 * Browser side of the background remover: loads ONNX Runtime and the model
 * on first use, runs the network on a 320×320 downscale, and scales the
 * predicted mask back up to the source resolution. Everything stays on the
 * page — the only network traffic is fetching the runtime and the model
 * from this site, once.
 */

export type BgPhase = 'download' | 'load' | 'run';

export interface BgProgress {
	phase: BgPhase;
	/** Bytes so far and expected total (undefined when the server omits it). */
	loaded: number;
	total?: number;
}

export interface Segmentation {
	/** One byte per pixel, source resolution, row-major. */
	alpha: Uint8ClampedArray;
	width: number;
	height: number;
	/** Wall-clock time of the network run alone, in milliseconds. */
	inferenceMs: number;
}

type Ort = typeof import('onnxruntime-web/wasm');
type Session = import('onnxruntime-web/wasm').InferenceSession;

let sessionPromise: Promise<Session> | null = null;

/** Fetch with byte-level progress, so a 20 MB first load is not a blank wait. */
async function fetchBytes(
	url: string,
	onProgress: (loaded: number, total?: number) => void
): Promise<Uint8Array> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
	const header = Number(res.headers.get('content-length'));
	const total = Number.isFinite(header) && header > 0 ? header : undefined;
	if (!res.body) {
		const buf = new Uint8Array(await res.arrayBuffer());
		onProgress(buf.length, buf.length);
		return buf;
	}
	const reader = res.body.getReader();
	const chunks: Uint8Array[] = [];
	let loaded = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
		loaded += value.length;
		onProgress(loaded, total);
	}
	const out = new Uint8Array(loaded);
	let offset = 0;
	for (const c of chunks) {
		out.set(c, offset);
		offset += c.length;
	}
	return out;
}

async function createSession(onProgress: (p: BgProgress) => void): Promise<Session> {
	// Runtime and model are fetched together so one bar covers the whole
	// first-use download; afterwards both come from the browser cache.
	const parts = [0, 0];
	const totals: Array<number | undefined> = [undefined, BG_MODEL.bytes];
	const report = () => {
		const known = totals.every((t) => t !== undefined);
		onProgress({
			phase: 'download',
			loaded: parts[0] + parts[1],
			total: known ? totals.reduce<number>((a, t) => a + (t ?? 0), 0) : undefined
		});
	};
	const [ort, wasm, model] = await Promise.all([
		import('onnxruntime-web/wasm') as Promise<Ort>,
		fetchBytes(ortWasmUrl, (l, t) => {
			parts[0] = l;
			totals[0] = t;
			report();
		}),
		fetchBytes(BG_MODEL.url, (l) => {
			parts[1] = l;
			report();
		})
	]);
	onProgress({ phase: 'load', loaded: 0 });
	// Single-threaded: the site is not cross-origin isolated, so ORT could
	// not spawn a worker pool anyway, and saying so avoids the warning.
	ort.env.wasm.numThreads = 1;
	ort.env.wasm.proxy = false;
	ort.env.wasm.wasmBinary = wasm;
	ort.env.wasm.wasmPaths = { mjs: ortMjsUrl };
	return ort.InferenceSession.create(model, {
		executionProviders: ['wasm'],
		graphOptimizationLevel: 'all'
	});
}

/** The session is created once per page and shared by every run. */
function getSession(onProgress: (p: BgProgress) => void): Promise<Session> {
	if (!sessionPromise) {
		sessionPromise = createSession(onProgress).catch((e) => {
			sessionPromise = null; // let the next attempt retry the download
			throw e;
		});
	}
	return sessionPromise;
}

function canvasOf(width: number, height: number) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	return { canvas, ctx };
}

/**
 * Predict the subject mask for a decoded image. Errors are keys the UI
 * maps to localized messages: `load` (runtime/model could not be fetched or
 * started), `run` (the network failed on this input), `flatMask` (nothing
 * stood out), `canvas` (no 2D context).
 */
export async function segmentImage(
	img: HTMLImageElement,
	onProgress: (p: BgProgress) => void
): Promise<ToolResult<Segmentation>> {
	let session: Session;
	try {
		session = await getSession(onProgress);
	} catch {
		return err('load');
	}
	const width = img.naturalWidth;
	const height = img.naturalHeight;
	const size = BG_MODEL.size;

	// The network wants a fixed square; squashing (not letterboxing) is how
	// U²-Net was trained, so the mask maps straight back with one resize.
	const small = canvasOf(size, size);
	if (!small.ctx) return err('canvas');
	small.ctx.imageSmoothingEnabled = true;
	small.ctx.imageSmoothingQuality = 'high';
	small.ctx.drawImage(img, 0, 0, size, size);
	const input = toModelInput(small.ctx.getImageData(0, 0, size, size).data, size, size);

	onProgress({ phase: 'run', loaded: 0 });
	let mask: Float32Array;
	let inferenceMs: number;
	try {
		const ort = await import('onnxruntime-web/wasm');
		const tensor = new ort.Tensor('float32', input, [1, 3, size, size]);
		const t0 = performance.now();
		const out = await session.run({ [session.inputNames[0]]: tensor });
		inferenceMs = performance.now() - t0;
		// Output 0 is the fused side-output — the one rembg uses.
		mask = out[session.outputNames[0]].data as Float32Array;
	} catch {
		return err('run');
	}
	const smallAlpha = maskToAlpha(mask);
	if (!smallAlpha.ok) return smallAlpha;

	// Scale the 320×320 mask to source size with the canvas resampler —
	// bilinear is enough for a soft matte and far faster than doing it by hand.
	const maskImage = new ImageData(size, size);
	for (let i = 0; i < size * size; i++) {
		const v = smallAlpha.value[i];
		maskImage.data[i * 4] = v;
		maskImage.data[i * 4 + 1] = v;
		maskImage.data[i * 4 + 2] = v;
		maskImage.data[i * 4 + 3] = 255;
	}
	small.ctx.putImageData(maskImage, 0, 0);
	const full = canvasOf(width, height);
	if (!full.ctx) return err('canvas');
	full.ctx.imageSmoothingEnabled = true;
	full.ctx.imageSmoothingQuality = 'high';
	full.ctx.drawImage(small.canvas, 0, 0, width, height);
	const scaled = full.ctx.getImageData(0, 0, width, height).data;
	const alpha = new Uint8ClampedArray(width * height);
	for (let i = 0; i < alpha.length; i++) alpha[i] = scaled[i * 4];

	return ok({ alpha, width, height, inferenceMs });
}

/**
 * Apply a mask to the source and encode: transparent (PNG/WebP keep the
 * alpha channel) or flattened onto a solid color (required for JPEG).
 */
export async function renderCutout(
	img: HTMLImageElement,
	seg: Segmentation,
	background: RGB | null,
	target: EncodeKind,
	quality: number
): Promise<ToolResult<EncodedImage>> {
	const { canvas, ctx } = canvasOf(seg.width, seg.height);
	if (!ctx) return err('canvas');
	ctx.drawImage(img, 0, 0, seg.width, seg.height);
	const pixels = ctx.getImageData(0, 0, seg.width, seg.height);
	compositeAlpha(pixels.data, seg.alpha, background);
	ctx.putImageData(pixels, 0, 0);
	return encodeCanvas(canvas, target, quality);
}

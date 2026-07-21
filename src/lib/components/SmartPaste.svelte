<script lang="ts">
	import { goto } from '$app/navigation';
	import { detect, syntheticDetection, type Detection } from '$lib/detect/detectors';
	import { rankTools, PASTE_MIN } from '$lib/detect/recommend';
	import { EXTENSION_FORMATS } from '$lib/detect/formats';
	import { pushRecentTool } from '$lib/state/app.svelte';
	import { setPendingFile, setPendingState } from '$lib/state/handoff';
	import { encodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';
	import { TOOL_BY_SLUG } from '$lib/tools/registry';
	import { t, lt, lp } from '$lib/i18n';

	/**
	 * Smart Paste: paste or drop content anywhere (outside a form field) and a
	 * small suggestion panel offers the matching tools, ranked by the same
	 * format-affinity engine as "Continue with". Handles plain text, images
	 * and text files (.md, .json, .csv, …). Enter runs the first suggestion;
	 * Esc dismisses.
	 */

	interface Suggestion {
		tool: string;
		/** Curated action label, e.g. "Decode"; absent for affinity matches. */
		action?: string;
	}

	/** Files above this size are never read into memory for detection. */
	const TEXT_FILE_MAX = 2_000_000;
	const MAX_SUGGESTIONS = 5;

	let content = $state('');
	let file = $state<File | null>(null);
	let detectedLabel = $state('');
	let suggestions = $state<Suggestion[]>([]);
	let selected = $state(0);
	let visible = $derived(suggestions.length > 0);

	function offer(detections: Detection[], opts: { baselineText?: boolean } = {}) {
		if (detections.length === 0) return;
		const ranked = rankTools(detections, opts)
			.filter((r) => r.score >= PASTE_MIN)
			.slice(0, MAX_SUGGESTIONS);
		if (ranked.length === 0) return;
		detectedLabel = detections.reduce((a, b) => (b.confidence > a.confidence ? b : a)).label;
		suggestions = ranked.map((r) => ({ tool: r.slug, action: r.action }));
		selected = 0;
	}

	function offerText(text: string, extra: Detection[] = []) {
		content = text;
		file = null;
		offer([...detect(text), ...extra]);
	}

	async function offerFile(f: File) {
		if (f.type.startsWith('image/') || /\.svg$/i.test(f.name)) {
			content = '';
			file = f;
			offer([syntheticDetection('image', 'Image', 1)], { baselineText: false });
			return;
		}
		const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
		const hint = EXTENSION_FORMATS[ext];
		if (!hint || f.size > TEXT_FILE_MAX) return;
		const text = await f.text();
		if (text.trim() === '') return;
		offerText(text, [syntheticDetection(hint.format, hint.label, 0.9)]);
	}

	function dismiss() {
		suggestions = [];
		content = '';
		file = null;
	}

	function run(s: Suggestion) {
		const slug = s.tool;
		const payloadFile = file;
		const text = content;
		pushRecentTool(slug);
		dismiss();
		if (payloadFile) {
			setPendingFile(payloadFile);
			void goto(lp(`/t/${slug}`));
		} else if (text.length <= MAX_SHARED_INPUT) {
			void goto(`${lp(`/t/${slug}`)}#s=${encodeState({ input: text })}`);
		} else {
			setPendingState({ input: text });
			void goto(lp(`/t/${slug}`));
		}
	}

	function isEditable(target: EventTarget | null): boolean {
		if (!(target instanceof HTMLElement)) return false;
		return (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target.isContentEditable
		);
	}

	function onpaste(e: ClipboardEvent) {
		if (isEditable(e.target)) return;
		// Clipboard data must be read synchronously, but page-level handlers
		// (e.g. an image tool's drop zone) get first claim via preventDefault —
		// so decide after the dispatch completes.
		const f = [...(e.clipboardData?.items ?? [])].find((i) => i.kind === 'file')?.getAsFile();
		const text = e.clipboardData?.getData('text/plain') ?? '';
		setTimeout(() => {
			if (e.defaultPrevented) return;
			if (f) void offerFile(f);
			else if (text) offerText(text);
		}, 0);
	}

	function ondrop(e: DragEvent) {
		// A page-level drop zone (ImageDrop) that already claimed the event
		// has preventDefault'ed it before it bubbles up to the window.
		if (isEditable(e.target) || e.defaultPrevented) return;
		e.preventDefault();
		const f = e.dataTransfer?.files?.[0];
		const text = e.dataTransfer?.getData('text/plain') ?? '';
		if (f) void offerFile(f);
		else if (text) offerText(text);
	}

	function onkeydown(e: KeyboardEvent) {
		if (!visible) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			dismiss();
		} else if (e.key === 'Enter' && suggestions[selected]) {
			e.preventDefault();
			run(suggestions[selected]);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selected = Math.min(selected + 1, suggestions.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selected = Math.max(selected - 1, 0);
		}
	}

	function toolName(slug: string): string {
		const m = TOOL_BY_SLUG.get(slug);
		return m ? lt(m).name : slug;
	}
</script>

<svelte:window
	{onpaste}
	{ondrop}
	ondragover={(e) => !isEditable(e.target) && e.preventDefault()}
	{onkeydown}
/>

{#if visible}
	<div
		class="fixed bottom-6 left-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 rounded-lg border border-line bg-surface shadow-xl shadow-black/25"
		role="dialog"
		aria-label="Paste suggestions"
	>
		<div class="flex items-center justify-between border-b border-line px-3 py-2">
			<span class="font-mono text-xs text-dim">
				{t('detected')} <span class="text-accent">{detectedLabel}</span>
				{#if file}
					<span class="text-dim/50">· {file.name}</span>
				{:else}
					<span class="text-dim/50">· {content.length.toLocaleString()} {t('chars')}</span>
				{/if}
			</span>
			<button type="button" class="text-xs text-dim hover:text-fg" onclick={dismiss}>esc</button>
		</div>
		<ul class="p-1.5">
			{#each suggestions as s, i (s.tool + (s.action ?? ''))}
				<li>
					<button
						type="button"
						class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-120
							{i === selected ? 'bg-surface-2' : 'hover:bg-surface-2/60'}"
						onclick={() => run(s)}
						onmousemove={() => (selected = i)}
					>
						<span>
							{#if s.action}
								{s.action} <span class="text-dim">— {toolName(s.tool)}</span>
							{:else}
								{toolName(s.tool)}
							{/if}
						</span>
						{#if i === selected}<span class="font-mono text-[11px] text-dim">↵</span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}

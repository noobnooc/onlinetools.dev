<script lang="ts">
	import { goto } from '$app/navigation';
	import { detect, type Detection } from '$lib/detect/detectors';
	import { pushRecentTool } from '$lib/state/app.svelte';
	import { encodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';
	import { TOOL_BY_SLUG } from '$lib/tools/registry';
	import { t, lt, lp } from '$lib/i18n';

	/**
	 * Smart Paste: paste or drop content anywhere (outside a form field) and a
	 * small suggestion panel offers the matching tools. Enter runs the first
	 * suggestion; Esc dismisses.
	 */

	interface Suggestion {
		detection: Detection;
		actionLabel: string;
		tool: string;
	}

	let content = $state('');
	let suggestions = $state<Suggestion[]>([]);
	let selected = $state(0);
	let visible = $derived(suggestions.length > 0);

	function offer(text: string) {
		const detections = detect(text);
		if (detections.length === 0) return;
		content = text;
		selected = 0;
		const out: Suggestion[] = [];
		for (const d of detections.slice(0, 3)) {
			for (const a of d.actions) {
				if (out.length >= 4) break;
				out.push({ detection: d, actionLabel: a.label, tool: a.tool });
			}
		}
		suggestions = out;
	}

	function dismiss() {
		suggestions = [];
		content = '';
	}

	function run(s: Suggestion) {
		const slug = s.tool;
		pushRecentTool(slug);
		const hash =
			content.length <= MAX_SHARED_INPUT ? '#s=' + encodeState({ input: content }) : '';
		dismiss();
		void goto(`${lp(`/t/${slug}`)}${hash}`);
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
		const text = e.clipboardData?.getData('text/plain') ?? '';
		if (text) offer(text);
	}

	function ondrop(e: DragEvent) {
		if (isEditable(e.target)) return;
		const text = e.dataTransfer?.getData('text/plain') ?? '';
		if (text) {
			e.preventDefault();
			offer(text);
		}
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
</script>

<svelte:window {onpaste} {ondrop} ondragover={(e) => !isEditable(e.target) && e.preventDefault()} {onkeydown} />

{#if visible}
	<div
		class="fixed bottom-6 left-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 rounded-lg border border-line bg-surface shadow-xl shadow-black/25"
		role="dialog"
		aria-label="Paste suggestions"
	>
		<div class="flex items-center justify-between border-b border-line px-3 py-2">
			<span class="font-mono text-xs text-dim">
				{t('detected')} <span class="text-accent">{suggestions[0].detection.label}</span>
				<span class="text-dim/50">· {content.length.toLocaleString()} {t('chars')}</span>
			</span>
			<button type="button" class="text-xs text-dim hover:text-fg" onclick={dismiss}>esc</button>
		</div>
		<ul class="p-1.5">
			{#each suggestions as s, i (s.tool + s.actionLabel)}
				<li>
					<button
						type="button"
						class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-120
							{i === selected ? 'bg-surface-2' : 'hover:bg-surface-2/60'}"
						onclick={() => run(s)}
						onmousemove={() => (selected = i)}
					>
						<span>
							{s.actionLabel}
							<span class="text-dim">— {(() => { const m = TOOL_BY_SLUG.get(s.tool); return m ? lt(m).name : s.tool; })()}</span>
						</span>
						{#if i === selected}<span class="font-mono text-[11px] text-dim">↵</span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}

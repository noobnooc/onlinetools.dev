<script lang="ts">
	import { copyText, downloadText, byteLength, formatBytes } from '$lib/utils/format';
	import { shareUrl, encodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';
	import { detect } from '$lib/detect/detectors';
	import { TOOLS, TOOL_BY_SLUG } from '$lib/tools/registry';
	import { pushRecentTool } from '$lib/state/app.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Copy, Check, Download, Link, ArrowRight } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Text result; used for copy/download. Empty string hides actions. */
		value: string;
		label?: string;
		filename?: string;
		/** Tool state to encode into a share URL, or null to hide sharing. */
		shareState?: Record<string, string> | null;
		/** Optional custom rendering; defaults to a <pre> of value. */
		children?: Snippet;
	}

	let { value, label = 'Output', filename = 'output.txt', shareState = null, children }: Props = $props();

	let copied = $state(false);
	let linkCopied = $state(false);
	let shareTooLarge = $state(false);
	let flash = $state(false);
	let chainOpen = $state(false);

	/** Pipeline seed: send this output into another tool, detections first. */
	const chainTargets = $derived.by(() => {
		if (value === '' || value.length > MAX_SHARED_INPUT) return [];
		const current = page.url.pathname.replace(/^\/t\//, '');
		const detected = detect(value)
			.flatMap((d) => d.actions.map((a) => a.tool))
			.filter((slug, i, arr) => arr.indexOf(slug) === i && slug !== current)
			.slice(0, 3);
		const rest = TOOLS.map((t) => t.slug).filter((s) => s !== current && !detected.includes(s));
		return [...detected, ...rest].map((slug) => ({
			slug,
			name: TOOL_BY_SLUG.get(slug)?.name ?? slug,
			suggested: detected.includes(slug)
		}));
	});

	function continueWith(slug: string) {
		chainOpen = false;
		pushRecentTool(slug);
		void goto(`/t/${slug}#s=${encodeState({ input: value })}`);
	}

	// One short highlight when the result changes — the "updated" cue.
	$effect(() => {
		void value;
		if (value === '') return;
		flash = true;
		const t = setTimeout(() => (flash = false), 450);
		return () => clearTimeout(t);
	});

	async function onCopy() {
		if (await copyText(value)) {
			copied = true;
			setTimeout(() => (copied = false), 1500);
		}
	}

	async function onShare() {
		if (!shareState) return;
		const url = shareUrl(location.origin + location.pathname, shareState);
		if (!url) {
			shareTooLarge = true;
			setTimeout(() => (shareTooLarge = false), 3000);
			return;
		}
		history.replaceState(null, '', url);
		if (await copyText(url)) {
			linkCopied = true;
			setTimeout(() => (linkCopied = false), 1500);
		}
	}

	export function copy() {
		void onCopy();
	}
</script>

<div>
	<div class="mb-1.5 flex items-baseline justify-between gap-2">
		<span class="text-xs font-medium tracking-wide text-dim uppercase">{label}</span>
		{#if value !== ''}
			<div class="flex items-center gap-1">
				<span class="mr-1 font-mono text-[11px] text-dim/70">{formatBytes(byteLength(value))}</span>
				<button
					type="button"
					class="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
					onclick={onCopy}
					title="Copy result (⌘⇧C)"
				>
					{#if copied}<Check size={13} class="text-ok" /><span class="text-ok">Copied</span>
					{:else}<Copy size={13} /><span>Copy</span>{/if}
				</button>
				<button
					type="button"
					class="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
					onclick={() => downloadText(value, filename)}
					title="Download result"
				>
					<Download size={13} /><span>Download</span>
				</button>
				{#if shareState}
					<button
						type="button"
						class="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
						onclick={onShare}
						title="Copy a link that restores this state"
					>
						{#if linkCopied}<Check size={13} class="text-ok" /><span class="text-ok">Link copied</span>
						{:else}<Link size={13} /><span>Share</span>{/if}
					</button>
				{/if}
				{#if chainTargets.length > 0}
					<div class="relative">
						<button
							type="button"
							class="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs transition-colors duration-120
								{chainOpen ? 'bg-surface-2 text-fg' : 'text-dim hover:bg-surface-2 hover:text-fg'}"
							onclick={() => (chainOpen = !chainOpen)}
							aria-expanded={chainOpen}
							title="Send this result into another tool"
						>
							<ArrowRight size={13} /><span>Continue with</span>
						</button>
						{#if chainOpen}
							<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
							<div class="fixed inset-0 z-10" onclick={() => (chainOpen = false)}></div>
							<ul
								class="absolute right-0 z-20 mt-1 max-h-64 w-56 overflow-y-auto rounded-lg border border-line bg-surface p-1 shadow-xl shadow-black/20"
								role="menu"
							>
								{#each chainTargets as target (target.slug)}
									<li role="none">
										<button
											type="button"
											role="menuitem"
											class="w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors duration-120 hover:bg-surface-2
												{target.suggested ? 'text-accent' : 'text-fg'}"
											onclick={() => continueWith(target.slug)}
										>
											{target.name}
											{#if target.suggested}<span class="ml-1 text-[10px] text-dim">suggested</span>{/if}
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
	{#if shareTooLarge}
		<p class="mb-1.5 text-xs text-warn">
			Input too large for a URL — share links are capped so they stay portable. Content never leaves
			this machine.
		</p>
	{/if}
	<div
		class="min-h-24 rounded-lg border border-line bg-surface px-3 py-2.5 {flash ? 'result-flash' : ''}"
	>
		{#if children}
			{@render children()}
		{:else if value !== ''}
			<pre class="overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">{value}</pre>
		{:else}
			<p class="font-mono text-sm text-dim/50">—</p>
		{/if}
	</div>
</div>

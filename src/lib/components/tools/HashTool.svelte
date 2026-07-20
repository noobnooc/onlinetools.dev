<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import EmptyState from '../EmptyState.svelte';
	import { hashText, hmacText, HASH_ALGORITHMS, type HashAlgorithm } from '$lib/tools/hash';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { formatBytes, byteLength } from '$lib/utils/format';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';
	import { Copy, Check } from 'lucide-svelte';

	let input = $state('');
	let hmacKey = $state('');
	let digests = $state<Array<{ algo: string; value: string }>>([]);
	let copiedAlgo = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	// Recompute all digests when input or key changes (async, guarded against races).
	$effect(() => {
		const text = input;
		const key = hmacKey;
		if (text === '') {
			digests = [];
			return;
		}
		let cancelled = false;
		void (async () => {
			const out: Array<{ algo: string; value: string }> = [];
			for (const algo of HASH_ALGORITHMS) {
				const r = await hashText(text, algo);
				if (r.ok) out.push({ algo, value: r.value });
			}
			if (key !== '') {
				for (const algo of ['SHA-256', 'SHA-512'] as const) {
					const r = await hmacText(text, key, algo);
					if (r.ok) out.push({ algo: `HMAC-${algo}`, value: r.value });
				}
			}
			if (!cancelled) digests = out;
		})();
		return () => {
			cancelled = true;
		};
	});

	const output = $derived(digests.map((d) => `${d.algo}: ${d.value}`).join('\n'));

	$effect(() => {
		currentResult.text = output;
	});

	async function copyRow(d: { algo: string; value: string }) {
		if (await copyText(d.value)) {
			copiedAlgo = d.algo;
			setTimeout(() => (copiedAlgo = ''), 1500);
		}
	}

	const badge = $derived.by((): BadgeSegment[] => {
		if (input === '') return [];
		return [{ text: 'text', tone: 'accent' }, { text: formatBytes(byteLength(input)) }];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="Text to hash"
		placeholder="Any text — hashes update as you type"
		{badge}
		rows={5}
		onsample={() => (input = 'The quick brown fox jumps over the lazy dog')}
	/>
	<label class="block">
		<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase"
			>HMAC secret key <span class="normal-case">(optional)</span></span
		>
		<input
			type="text"
			bind:value={hmacKey}
			spellcheck="false"
			autocomplete="off"
			placeholder="Leave empty for plain hashes"
			class="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 font-mono text-sm outline-none placeholder:text-dim/50 focus:border-accent"
		/>
	</label>
	<OutputPanel value={output} label="Digests" filename="hashes.txt" shareState={input === '' ? null : { input }}>
		{#if digests.length > 0}
			<div class="space-y-1">
				{#each digests as d (d.algo)}
					<div class="flex items-start justify-between gap-2 border-b border-line/50 py-1.5 last:border-0">
						<div class="min-w-0">
							<span class="block font-mono text-xs text-dim">{d.algo}</span>
							<span class="block font-mono text-sm break-all">{d.value}</span>
						</div>
						<button
							type="button"
							class="mt-1 shrink-0 rounded-md p-1 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
							onclick={() => copyRow(d)}
							aria-label="Copy {d.algo} digest"
						>
							{#if copiedAlgo === d.algo}<Check size={13} class="text-ok" />{:else}<Copy size={13} />{/if}
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState hint="Digests update live as you type" />
		{/if}
	</OutputPanel>
	<p class="text-xs text-dim">
		MD5 and SHA-1 are shown for legacy checksums only — use SHA-256 or stronger for anything
		security-relevant.
	</p>
</div>

<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import { convertCase, CASE_STYLES, tokenize } from '$lib/tools/text';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';
	import { Copy, Check } from 'lucide-svelte';

	let input = $state('');
	let copiedStyle = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const rows = $derived(
		input.trim() === ''
			? []
			: CASE_STYLES.map((style) => ({ ...style, output: convertCase(input, style.id) }))
	);

	$effect(() => {
		currentResult.text = rows.map((r) => `${r.label}: ${r.output}`).join('\n');
	});

	async function copyRow(id: string, text: string) {
		if (await copyText(text)) {
			copiedStyle = id;
			setTimeout(() => (copiedStyle = ''), 1500);
		}
	}

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		const words = tokenize(input.split('\n')[0]);
		return [{ text: 'identifier', tone: 'accent' }, { text: `${words.length} word${words.length === 1 ? '' : 's'}` }];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="Text or identifier (one per line)"
		placeholder="getUserByID
response_status_code"
		{badge}
		rows={4}
		onsample={() => (input = 'getUserByID\nHTTP_response_code\nsome kebab-case-value')}
	/>
	{#if rows.length > 0}
		<div class="overflow-hidden rounded-lg border border-line">
			{#each rows as row (row.id)}
				<div
					class="flex items-center justify-between gap-3 border-b border-line/60 bg-surface px-3 py-2 last:border-0"
				>
					<div class="min-w-0 grow">
						<span class="block font-mono text-[11px] text-dim">{row.label}</span>
						<pre class="overflow-x-auto font-mono text-sm whitespace-pre">{row.output}</pre>
					</div>
					<button
						type="button"
						class="shrink-0 rounded-md p-1.5 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
						onclick={() => copyRow(row.id, row.output)}
						aria-label="Copy {row.label}"
					>
						{#if copiedStyle === row.id}<Check size={13} class="text-ok" />{:else}<Copy size={13} />{/if}
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<p class="rounded-lg border border-line bg-surface px-3 py-6 text-center font-mono text-sm text-dim/50">
			All nine styles appear here as you type
		</p>
	{/if}
</div>

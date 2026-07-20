<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { encodeEntities, decodeEntities } from '$lib/tools/htmlentities';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	let all = $state(false);
	let numeric = $state(false);

	initFromHash((s) => {
		if (s.input) {
			input = s.input;
			if (s.mode === 'encode' || s.mode === 'decode') mode = s.mode;
			else if (/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/.test(s.input)) mode = 'decode';
		}
	});

	const output = $derived.by(() => {
		if (input === '') return '';
		if (mode === 'encode') return encodeEntities(input, { all, numeric });
		const r = decodeEntities(input);
		return r.ok ? r.value : '';
	});

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input === '') return [];
		const entityCount = (input.match(/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g) ?? []).length;
		if (mode === 'decode') {
			return [{ text: 'HTML', tone: 'accent' }, { text: `${entityCount} entities` }];
		}
		return [{ text: 'text', tone: 'accent' }, { text: `${input.length} chars` }];
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<div class="flex rounded-md border border-line p-0.5" role="radiogroup" aria-label="Direction">
			{#each ['encode', 'decode'] as m (m)}
				<button
					type="button"
					role="radio"
					aria-checked={mode === m}
					class="rounded-[5px] px-3 py-1 text-sm capitalize transition-colors duration-120
						{mode === m ? 'bg-surface-2 text-fg' : 'text-dim hover:text-fg'}"
					onclick={() => (mode = m as typeof mode)}>{m}</button
				>
			{/each}
		</div>
		{#if mode === 'encode'}
			<label class="flex items-center gap-2 text-dim">
				<input type="checkbox" bind:checked={all} class="accent-(--accent)" />
				Encode all non-ASCII
			</label>
			<label class="flex items-center gap-2 text-dim">
				<input type="checkbox" bind:checked={numeric} class="accent-(--accent)" />
				Numeric only
			</label>
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={mode === 'encode' ? 'Text to escape' : 'HTML with entities'}
		placeholder={mode === 'encode' ? '<a href="x">Fish & chips</a>' : '&lt;b&gt;caf&eacute;&lt;/b&gt; &rarr; &#x1F389;'}
		{badge}
		rows={6}
		onsample={() =>
			(input =
				mode === 'encode'
					? '<a href="https://example.com?a=1&b=2">Fish & chips — “quoted” text</a>'
					: '&lt;b&gt;caf&#xE9;&lt;/b&gt; &amp; &rarr; &#169; &hellip;')}
	/>
	<OutputPanel value={output} filename="entities.txt" shareState={input === '' ? null : { input, mode }} />
</div>

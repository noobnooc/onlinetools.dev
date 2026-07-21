<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { slugify } from '$lib/tools/text';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let separator = $state<'-' | '_'>('-');
	let lowercase = $state(true);
	let maxLength = $state(0);

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const output = $derived(
		input.trim() === ''
			? ''
			: input
					.split('\n')
					.map((line) =>
						slugify(line, { separator, lowercase, maxLength: maxLength > 0 ? maxLength : undefined })
					)
					.join('\n')
	);

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		const first = output.split('\n')[0] ?? '';
		return [{ text: 'title', tone: 'accent' }, { text: `${first.length} chars out` }];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('slugInput')}
		placeholder="10 Things I Learned Building a Design System"
		{badge}
		rows={4}
		onsample={() => (input = "10 Things I Learned Building a Design System\nCrème brûlée à Paris — A Récipe")}
	/>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<div class="flex items-center gap-2 text-dim">
			{tt('slugSep')}
			<Segmented
				bind:value={separator}
				label={tt('slugSep')}
				options={[
					{ value: '-', label: '-', title: tt('slugHyphen'), mono: true },
					{ value: '_', label: '_', title: tt('slugUnderscore'), mono: true }
				]}
			/>
		</div>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={lowercase} class="accent-(--accent)" />
			{tt('lowercase')}
		</label>
		<label class="flex items-center gap-2 text-dim">
			{tt('slugMax')}
			<input
				type="number"
				bind:value={maxLength}
				min="0"
				max="200"
				placeholder="0"
				class="w-20 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg"
				title="0 = unlimited"
			/>
		</label>
	</div>
	<OutputPanel value={output} label={tt('slugOut')} filename="slugs.txt" shareState={input.trim() === '' ? null : { input }} />
</div>

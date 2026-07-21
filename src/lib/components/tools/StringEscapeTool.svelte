<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { escapeText, unescapeText, DIALECTS, type EscapeDialect } from '$lib/tools/escape';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let direction = $state<'escape' | 'unescape'>('escape');
	let dialect = $state<EscapeDialect>('json');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.direction === 'escape' || s.direction === 'unescape') direction = s.direction;
		if (DIALECTS.includes(s.dialect as EscapeDialect)) dialect = s.dialect as EscapeDialect;
	});

	const result = $derived.by(() => {
		if (input === '') return null;
		return direction === 'escape' ? escapeText(input, dialect) : unescapeText(input, dialect);
	});
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const DIALECT_LABELS: Record<EscapeDialect, string> = {
		json: 'JSON',
		js: 'JavaScript',
		java: 'Java / C#',
		xml: 'XML',
		sql: 'SQL',
		csv: 'CSV'
	};

	const badge = $derived.by((): BadgeSegment[] => {
		if (input === '') return [];
		return result?.ok
			? [{ text: DIALECT_LABELS[dialect], tone: 'accent' }, { text: 'ok', tone: 'ok' }]
			: [{ text: 'error', tone: 'err' }];
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={direction}
			label={tt('direction')}
			options={[
				{ value: 'escape', label: tt('escEscape') },
				{ value: 'unescape', label: tt('escUnescape') }
			]}
		/>
		<Segmented
			bind:value={dialect}
			label={tt('escDialect')}
			options={DIALECTS.map((d) => ({ value: d, label: DIALECT_LABELS[d] }))}
		/>
	</div>
	<InputArea
		bind:value={input}
		label={direction === 'escape' ? tt('escInputEsc') : tt('escInputUnesc')}
		placeholder={direction === 'escape' ? 'He said "hello"\nover two lines' : 'He said \\"hello\\"\\nover two lines'}
		{badge}
		rows={7}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				direction === 'escape'
					? 'She said "it\'s ready" —\nsee C:\\temp\\notes.txt'
					: 'Line one\\nLine two: \\"quoted\\" and a tab\\there')}
	/>
	<OutputPanel
		value={output}
		filename="escaped.txt"
		shareState={input === '' ? null : { input, direction, dialect }}
	/>
</div>

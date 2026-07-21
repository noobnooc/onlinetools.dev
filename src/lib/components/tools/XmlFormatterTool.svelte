<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { formatXml, minifyXml, validateXml } from '$lib/tools/xml';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let mode = $state<'format' | 'minify'>('format');
	let indent = $state<'2' | '4'>('2');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.mode === 'format' || s.mode === 'minify') mode = s.mode;
	});

	const valid = $derived(input.trim() === '' ? null : validateXml(input));
	const result = $derived.by(() => {
		if (input.trim() === '') return null;
		return mode === 'format' ? formatXml(input, Number(indent)) : minifyXml(input);
	});
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		return valid?.ok
			? [{ text: 'XML', tone: 'accent' }, { text: 'well-formed', tone: 'ok' }]
			: [{ text: 'XML', tone: 'accent' }, { text: 'invalid', tone: 'err' }];
	});

	const error = $derived.by(() => {
		if (!result || result.ok) return null;
		return { message: result.error, line: result.line, column: result.column };
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={mode}
			label={tt('mode')}
			options={[
				{ value: 'format', label: tt('fmtFormat') },
				{ value: 'minify', label: tt('fmtMinify') }
			]}
		/>
		{#if mode === 'format'}
			<Segmented
				bind:value={indent}
				label={tt('jfIndentation')}
				options={[
					{ value: '2', label: tt('jfSp2') },
					{ value: '4', label: tt('jfSp4') }
				]}
			/>
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={tt('xmlInput')}
		placeholder={'<catalog><book id="1"><title>…</title></book></catalog>'}
		{badge}
		rows={9}
		{error}
		onsample={() =>
			(input =
				'<?xml version="1.0" encoding="UTF-8"?><library><book id="1" lang="en"><title>The Mythical Man-Month</title><author>Fred Brooks</author><price currency="USD">29.99</price></book><!-- classics --><book id="2"><title>SICP</title><available/></book></library>')}
	/>
	<OutputPanel
		value={output}
		label="Output · XML"
		filename={mode === 'minify' ? 'document.min.xml' : 'document.xml'}
		shareState={input.trim() === '' ? null : { input, mode }}
	/>
</div>

<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { xmlToJson, jsonToXml } from '$lib/tools/xml';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let direction = $state<'to-json' | 'to-xml'>('to-json');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.direction === 'to-json' || s.direction === 'to-xml') direction = s.direction;
		else if (s.input && /^\s*[[{]/.test(s.input)) direction = 'to-xml';
	});

	const result = $derived.by(() => {
		if (input.trim() === '') return null;
		return direction === 'to-json' ? xmlToJson(input) : jsonToXml(input);
	});
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		return result?.ok
			? [
					{ text: direction === 'to-json' ? 'XML' : 'JSON', tone: 'accent' },
					{ text: 'valid', tone: 'ok' }
				]
			: [{ text: 'invalid', tone: 'err' }];
	});

	const error = $derived.by(() => {
		if (!result || result.ok) return null;
		return { message: result.error, line: result.line, column: result.column };
	});
</script>

<div class="space-y-4">
	<Segmented
		bind:value={direction}
		label={tt('direction')}
		options={[
			{ value: 'to-json', label: 'XML → JSON' },
			{ value: 'to-xml', label: 'JSON → XML' }
		]}
	/>
	<InputArea
		bind:value={input}
		label={direction === 'to-json' ? tt('xjInputXml') : tt('xjInputJson')}
		placeholder={direction === 'to-json'
			? '<user id="7"><name>Ada</name></user>'
			: '{"user": {"@_id": 7, "name": "Ada"}}'}
		{badge}
		rows={9}
		{error}
		onsample={() =>
			(input =
				direction === 'to-json'
					? '<order id="A-1001" priority="high"><customer>ACME Corp</customer><items><item sku="X1" qty="3">Widget</item><item sku="Y2" qty="1">Gadget</item></items><total currency="EUR">149.50</total></order>'
					: '{"order": {"@_id": "A-1001", "customer": "ACME Corp", "total": {"@_currency": "EUR", "#text": 149.5}}}')}
	/>
	<OutputPanel
		value={output}
		label={direction === 'to-json' ? 'Output · JSON' : 'Output · XML'}
		filename={direction === 'to-json' ? 'converted.json' : 'converted.xml'}
		shareState={input.trim() === '' ? null : { input, direction }}
	/>
	<p class="text-xs text-dim">{tt('xjNote')}</p>
</div>

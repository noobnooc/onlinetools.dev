<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { formatJson, validateJson } from '$lib/tools/json';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { formatBytes, byteLength } from '$lib/utils/format';
	import { currentResult } from '$lib/state/app.svelte';

	const SAMPLE = '{"name":"onlinetools.dev","local":true,"tools":[{"slug":"json-formatter","ready":true},{"slug":"base64-decode","ready":true}],"stats":{"stars":null,"launched":"2026-07-20"}}';

	let input = $state('');
	let indent = $state<'2' | '4' | 'tab' | 'min'>('2');
	let sortKeys = $state(false);

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.indent === '2' || s.indent === '4' || s.indent === 'tab' || s.indent === 'min') indent = s.indent;
		if (s.sort === '1') sortKeys = true;
	});

	const validation = $derived(input.trim() === '' ? null : validateJson(input));
	const result = $derived(
		input.trim() === ''
			? null
			: formatJson(input, {
					indent: indent === '2' ? 2 : indent === '4' ? 4 : indent,
					sortKeys
				})
	);
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		const size = formatBytes(byteLength(input));
		if (validation?.ok) return [{ text: 'JSON', tone: 'accent' }, { text: size }, { text: 'valid', tone: 'ok' }];
		return [{ text: 'JSON', tone: 'accent' }, { text: size }, { text: 'invalid', tone: 'err' }];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="JSON input"
		placeholder={'Paste JSON here — {"like": "this"}'}
		{badge}
		rows={10}
		error={result && !result.ok ? { message: result.error, line: result.line, column: result.column } : null}
		onsample={() => (input = SAMPLE)}
	/>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<label class="flex items-center gap-2 text-dim">
			Indent
			<select
				bind:value={indent}
				class="rounded-md border border-line bg-surface-2 px-2 py-1 text-sm text-fg"
			>
				<option value="2">2 spaces</option>
				<option value="4">4 spaces</option>
				<option value="tab">Tabs</option>
				<option value="min">Minified</option>
			</select>
		</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={sortKeys} class="accent-(--accent)" />
			Sort keys
		</label>
	</div>
	<OutputPanel
		value={output}
		filename="formatted.json"
		shareState={input.trim() === '' ? null : { input, indent, ...(sortKeys ? { sort: '1' } : {}) }}
	/>
</div>

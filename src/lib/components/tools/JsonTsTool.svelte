<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { jsonToTypescript } from '$lib/tools/dataconvert';
	import { validateJson } from '$lib/tools/json';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let rootName = $state('Root');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.name) rootName = s.name;
	});

	const result = $derived(input.trim() === '' ? null : jsonToTypescript(input, rootName));
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		const v = validateJson(input);
		return v.ok
			? [{ text: 'JSON', tone: 'accent' }, { text: 'valid', tone: 'ok' }]
			: [{ text: 'JSON', tone: 'accent' }, { text: 'invalid', tone: 'err' }];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('jtInput')}
		placeholder={'{"id": 1, "name": "Ada", "tags": ["a"]}'}
		{badge}
		rows={8}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				'{\n  "id": 42,\n  "name": "Ada Lovelace",\n  "email": null,\n  "roles": ["admin", "dev"],\n  "profile": {\n    "joined": "2024-03-14",\n    "verified": true,\n    "login-count": 128\n  }\n}')}
	/>
	<label class="flex items-center gap-2 text-sm text-dim">
		{tt('jtRoot')}
		<input
			type="text"
			bind:value={rootName}
			spellcheck="false"
			class="w-40 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg"
		/>
	</label>
	<OutputPanel
		value={output}
		label="TypeScript"
		filename="{rootName || 'types'}.ts"
		shareState={input.trim() === '' ? null : { input, name: rootName }}
	/>
	<p class="text-xs text-dim">
		{tt('jtNote')}
	</p>
</div>

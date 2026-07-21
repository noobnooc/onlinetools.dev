<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { queryJsonPath } from '$lib/tools/dataconvert';
	import { validateJson } from '$lib/tools/json';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let json = $state('');
	let path = $state('$');

	initFromHash((s) => {
		if (s.input) json = s.input;
		if (s.path) path = s.path;
	});

	const result = $derived(json.trim() === '' || path.trim() === '' ? null : queryJsonPath(json, path));
	const matches = $derived(result?.ok ? result.value : []);

	const output = $derived(
		matches.length === 1
			? JSON.stringify(matches[0].value, null, 2)
			: JSON.stringify(matches.map((m) => m.value), null, 2)
	);

	$effect(() => {
		currentResult.text = result?.ok ? output : '';
	});

	const jsonValid = $derived(json.trim() !== '' && validateJson(json).ok);

	const badge = $derived.by((): BadgeSegment[] => {
		if (json.trim() === '') return [];
		if (!jsonValid) return [{ text: 'JSON', tone: 'accent' }, { text: 'invalid', tone: 'err' }];
		return [
			{ text: 'JSON', tone: 'accent' },
			{ text: `${matches.length} match${matches.length === 1 ? '' : 'es'}`, tone: matches.length > 0 ? 'ok' : 'dim' }
		];
	});

	const EXAMPLES = ['$.store.book[*].title', '$..price', '$.store.book[-1]', "$['store']['bicycle']"];
</script>

<div class="space-y-4">
	<div>
		<label for="jsonpath-expr" class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase"
			>{tt('jpExpr')}</label
		>
		<input
			id="jsonpath-expr"
			bind:value={path}
			type="text"
			spellcheck="false"
			autocomplete="off"
			placeholder="$.store.book[*].title"
			aria-invalid={result && !result.ok && jsonValid ? 'true' : undefined}
			class="w-full"
		/>
		{#if result && !result.ok && jsonValid}
			<p class="mt-1.5 font-mono text-xs text-err" role="alert">{result.error}</p>
		{/if}
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each EXAMPLES as ex (ex)}
				<button
					type="button"
					class="rounded-md border border-line px-2 py-1 font-mono text-xs text-dim transition-colors duration-120 hover:border-accent/50 hover:text-fg"
					onclick={() => (path = ex)}>{ex}</button
				>
			{/each}
		</div>
	</div>

	<InputArea
		bind:value={json}
		label={tt('jpDoc')}
		placeholder={'{"store": {"book": [ … ]}}'}
		{badge}
		rows={8}
		onsample={() => {
			json =
				'{\n  "store": {\n    "book": [\n      {"title": "Sayings of the Century", "price": 8.95},\n      {"title": "Moby Dick", "price": 12.99},\n      {"title": "The Lord of the Rings", "price": 22.99}\n    ],\n    "bicycle": {"color": "red", "price": 199}\n  }\n}';
			path = '$..price';
		}}
	/>

	{#if matches.length > 0}
		<div>
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase"
				>{tt('jpMatches')} ({matches.length})</span
			>
			<div class="max-h-72 space-y-1.5 overflow-auto">
				{#each matches.slice(0, 100) as m (m.path)}
					<div class="rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs">
						<span class="text-accent">{m.path}</span>
						<pre class="mt-0.5 overflow-x-auto text-fg/90">{JSON.stringify(m.value)}</pre>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<OutputPanel
		value={result?.ok ? output : ''}
		label={tt('jpResults')}
		filename="jsonpath-result.json"
		shareState={json.trim() === '' ? null : { input: json, path }}
	/>
</div>

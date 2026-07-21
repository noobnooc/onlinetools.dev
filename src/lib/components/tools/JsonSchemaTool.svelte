<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { inferJsonSchema, validateAgainstSchema } from '$lib/tools/jsonschema';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let mode = $state<'infer' | 'validate'>('infer');
	let input = $state('');
	let schema = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.schema) schema = s.schema;
		if (s.mode === 'infer' || s.mode === 'validate') mode = s.mode;
		else if (s.schema) mode = 'validate';
	});

	const inferResult = $derived(
		mode === 'infer' && input.trim() !== '' ? inferJsonSchema(input) : null
	);
	const validateResult = $derived(
		mode === 'validate' && input.trim() !== '' && schema.trim() !== ''
			? validateAgainstSchema(input, schema)
			: null
	);

	const violations = $derived(validateResult?.ok ? validateResult.value : null);

	const output = $derived.by(() => {
		if (mode === 'infer') return inferResult?.ok ? inferResult.value : '';
		if (!violations) return '';
		if (violations.length === 0) return tt('schValid');
		return violations.map((v) => `${v.path}: ${v.message}`).join('\n');
	});

	$effect(() => {
		currentResult.text = output;
	});

	const dataError = $derived.by(() => {
		const r = mode === 'infer' ? inferResult : validateResult;
		if (!r || r.ok) return null;
		return { message: r.error };
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (mode === 'infer') {
			return inferResult?.ok
				? [{ text: 'JSON', tone: 'accent' }, { text: 'valid', tone: 'ok' }]
				: [{ text: 'invalid', tone: 'err' }];
		}
		if (!validateResult) return [];
		if (!validateResult.ok) return [{ text: 'error', tone: 'err' }];
		return violations && violations.length === 0
			? [{ text: 'valid', tone: 'ok' }]
			: [{ text: `${violations?.length} ${tt('schViolations').toLowerCase()}`, tone: 'err' }];
	});
</script>

<div class="space-y-4">
	<Segmented
		bind:value={mode}
		label={tt('mode')}
		options={[
			{ value: 'infer', label: tt('schInfer'), title: tt('schInferT') },
			{ value: 'validate', label: tt('schValidate'), title: tt('schValidateT') }
		]}
	/>
	<InputArea
		bind:value={input}
		label={tt('schData')}
		placeholder={'{"name": "Ada", "age": 36}'}
		{badge}
		rows={mode === 'infer' ? 9 : 6}
		error={dataError}
		onsample={() => {
			input = '{"id": 7, "name": "Ada", "email": "ada@example.com", "tags": ["admin", "dev"], "profile": {"active": true, "score": 9.5}}';
			if (mode === 'validate')
				schema =
					'{\n  "type": "object",\n  "properties": {\n    "id": {"type": "integer"},\n    "name": {"type": "string", "minLength": 2},\n    "email": {"type": "string", "pattern": "^[^@]+@[^@]+$"},\n    "tags": {"type": "array", "items": {"type": "string"}}\n  },\n  "required": ["id", "name", "email"]\n}';
		}}
	/>
	{#if mode === 'validate'}
		<InputArea bind:value={schema} label={tt('schSchema')} placeholder={'{"type": "object", "required": ["name"]}'} rows={7} />
	{/if}

	{#if violations && violations.length > 0}
		<div class="overflow-hidden rounded-lg border border-line">
			<table class="w-full font-mono text-sm">
				<tbody>
					{#each violations as v, i (i)}
						<tr class="border-b border-line/60 bg-surface last:border-0">
							<th scope="row" class="py-1.5 pr-4 pl-3 text-left font-normal whitespace-nowrap text-err">{v.path}</th>
							<td class="py-1.5 pr-3">{v.message}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<OutputPanel
		value={output}
		label={mode === 'infer' ? 'Output · JSON Schema' : tt('schResult')}
		filename={mode === 'infer' ? 'schema.json' : 'validation.txt'}
		shareState={input.trim() === '' ? null : mode === 'infer' ? { input, mode } : { input, schema, mode }}
	/>
</div>

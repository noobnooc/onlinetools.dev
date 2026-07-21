<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import EmptyState from '../EmptyState.svelte';
	import JsonTree from '../JsonTree.svelte';
	import Segmented from '../Segmented.svelte';
	import { formatJson, validateJson } from '$lib/tools/json';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { formatBytes, byteLength } from '$lib/utils/format';
	import { currentResult } from '$lib/state/app.svelte';

	const SAMPLE = '{"name":"onlinetools.dev","local":true,"tools":[{"slug":"json-formatter","ready":true},{"slug":"base64-decode","ready":true}],"stats":{"stars":null,"launched":"2026-07-20"}}';

	let input = $state('');
	let indent = $state<'2' | '4' | 'tab' | 'min'>('2');
	let sortKeys = $state(false);
	let view = $state<'text' | 'tree'>('text');

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
	const parsed = $derived.by((): unknown => {
		if (!result?.ok) return undefined;
		try {
			return JSON.parse(input);
		} catch {
			return undefined;
		}
	});

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
		label={tt('jfInput')}
		placeholder={'Paste JSON here — {"like": "this"}'}
		{badge}
		rows={10}
		error={result && !result.ok ? { message: result.error, line: result.line, column: result.column } : null}
		onsample={() => (input = SAMPLE)}
	/>
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<div class="flex items-center gap-2 text-dim">
			{tt('jfIndent')}
			<Segmented
				bind:value={indent}
				label={tt('jfIndentation')}
				options={[
					{ value: '2', label: '··', title: tt('jfSp2'), mono: true },
					{ value: '4', label: '····', title: tt('jfSp4'), mono: true },
					{ value: 'tab', label: '⇥', title: tt('jfTabs'), mono: true },
					{ value: 'min', label: '{}', title: tt('jfMin'), mono: true }
				]}
			/>
		</div>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={sortKeys} />
			{tt('jfSortKeys')}
		</label>
		<Segmented
			bind:value={view}
			label={tt('jfText')}
			options={[
				{ value: 'text', label: tt('jfText') },
				{ value: 'tree', label: tt('jfTree') }
			]}
		/>
	</div>
	<OutputPanel
		value={output}
		filename="formatted.json"
		shareState={input.trim() === '' ? null : { input, indent, ...(sortKeys ? { sort: '1' } : {}) }}
	>
		{#if view === 'tree' && parsed !== undefined}
			<div class="max-h-[32rem] overflow-auto">
				<JsonTree value={parsed} />
			</div>
			<p class="mt-2 border-t border-line/50 pt-2 text-[11px] text-dim">
				{tt('jfTreeHint')}
				<a href="/t/jsonpath-tester" class="text-accent hover:underline">{tt('jfTreeLink')}</a>.
			</p>
		{:else if output !== ''}
			<pre class="max-h-[32rem] overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">{output}</pre>
		{:else}
			<EmptyState hint="Formatted JSON appears here — try the sample" />
		{/if}
	</OutputPanel>
</div>

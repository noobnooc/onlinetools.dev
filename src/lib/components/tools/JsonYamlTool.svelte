<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { convertData, detectFormat, type DataFormat } from '$lib/tools/dataconvert';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let from = $state<DataFormat | 'auto'>('auto');
	let to = $state<DataFormat>('yaml');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.to === 'json' || s.to === 'yaml' || s.to === 'toml') to = s.to;
	});

	const detected = $derived(detectFormat(input));
	const effectiveFrom = $derived(from === 'auto' ? detected : from);
	const result = $derived.by(() => {
		if (input.trim() === '') return null;
		if (!effectiveFrom) return { ok: false as const, error: 'Could not detect the input format — choose it manually' };
		if (effectiveFrom === to) return { ok: true as const, value: input };
		return convertData(input, effectiveFrom, to);
	});
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const FORMATS: DataFormat[] = ['json', 'yaml', 'toml'];

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!detected && from === 'auto') return [{ text: 'unrecognized', tone: 'err' }];
		return [
			{ text: (effectiveFrom ?? '?').toUpperCase(), tone: 'accent' },
			...(result?.ok ? [{ text: 'valid', tone: 'ok' as const }] : [{ text: 'invalid', tone: 'err' as const }])
		];
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<div class="flex items-center gap-2 text-dim">
			From
			<Segmented
				bind:value={from}
				label="Source format"
				options={[
					{
						value: 'auto',
						label: detected ? `Auto · ${detected.toUpperCase()}` : 'Auto',
						title: 'Detect the source format from the content'
					},
					...FORMATS.map((f) => ({ value: f, label: f.toUpperCase() }))
				]}
			/>
		</div>
		<span class="font-mono text-dim">→</span>
		<Segmented
			bind:value={to}
			label="Target format"
			options={FORMATS.map((f) => ({ value: f, label: f.toUpperCase() }))}
		/>
	</div>
	<InputArea
		bind:value={input}
		label="Input ({effectiveFrom ?? 'unknown format'})"
		placeholder={'{"server": {"host": "example.com", "ports": [80, 443]}}'}
		{badge}
		rows={9}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input = '{\n  "service": "api",\n  "replicas": 3,\n  "ports": [80, 443],\n  "resources": {\n    "cpu": "500m",\n    "memory": "512Mi"\n  },\n  "tls": true\n}')}
	/>
	<OutputPanel
		value={output}
		label="Output · {to.toUpperCase()}"
		filename="converted.{to === 'json' ? 'json' : to === 'yaml' ? 'yaml' : 'toml'}"
		shareState={input.trim() === '' ? null : { input, to }}
	/>
</div>

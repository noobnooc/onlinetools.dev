<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
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
		<label class="flex items-center gap-2 text-dim">
			From
			<select bind:value={from} class="rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg">
				<option value="auto">auto{detected ? ` (${detected})` : ''}</option>
				{#each FORMATS as f (f)}<option value={f}>{f}</option>{/each}
			</select>
		</label>
		<span class="font-mono text-dim">→</span>
		<div class="flex rounded-md border border-line p-0.5" role="radiogroup" aria-label="Target format">
			{#each FORMATS as f (f)}
				<button
					type="button"
					role="radio"
					aria-checked={to === f}
					class="rounded-[5px] px-3 py-1 font-mono text-sm transition-colors duration-120
						{to === f ? 'bg-surface-2 text-fg' : 'text-dim hover:text-fg'}"
					onclick={() => (to = f)}>{f}</button
				>
			{/each}
		</div>
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

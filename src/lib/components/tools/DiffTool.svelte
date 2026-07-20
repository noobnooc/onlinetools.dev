<script lang="ts">
	import InputArea from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { diffLines } from '$lib/tools/diff';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let left = $state('');
	let right = $state('');

	initFromHash((s) => {
		if (s.left) left = s.left;
		if (s.right) right = s.right;
		if (s.input && !s.left) left = s.input;
	});

	const diff = $derived(left === '' && right === '' ? null : diffLines(left, right));

	const output = $derived(
		diff
			? diff.lines
					.map((l) => (l.type === 'add' ? '+ ' : l.type === 'del' ? '- ' : '  ') + l.text)
					.join('\n')
			: ''
	);

	$effect(() => {
		currentResult.text = output;
	});

	function sample() {
		left = '{\n  "name": "api-service",\n  "version": "1.2.0",\n  "port": 8080,\n  "debug": true\n}';
		right = '{\n  "name": "api-service",\n  "version": "1.3.0",\n  "port": 8080,\n  "debug": false,\n  "timeout": 30\n}';
	}
</script>

<div class="space-y-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<InputArea bind:value={left} label="Original" rows={8} onsample={sample} />
		<InputArea bind:value={right} label="Changed" rows={8} />
	</div>

	{#if diff}
		<p class="font-mono text-xs">
			<span class="text-ok">+{diff.stats.added}</span>
			<span class="ml-2 text-err">−{diff.stats.removed}</span>
			<span class="ml-2 text-dim">{diff.stats.unchanged} unchanged</span>
		</p>
	{/if}

	<OutputPanel
		value={output}
		label="Diff"
		filename="diff.txt"
		shareState={left === '' && right === '' ? null : { left, right }}
	>
		{#if diff}
			<div class="max-h-[32rem] overflow-auto font-mono text-sm leading-relaxed">
				{#each diff.lines as line, i (i)}
					<div
						class="grid grid-cols-[3rem_3rem_1fr] gap-2 px-1 whitespace-pre-wrap break-all
							{line.type === 'add' ? 'bg-ok/10 text-ok' : line.type === 'del' ? 'bg-err/10 text-err' : ''}"
					>
						<span class="text-right text-xs leading-relaxed text-dim/60 select-none">{line.left ?? ''}</span>
						<span class="text-right text-xs leading-relaxed text-dim/60 select-none">{line.right ?? ''}</span>
						<span
							>{line.type === 'add' ? '+ ' : line.type === 'del' ? '− ' : '  '}{line.text || ' '}</span
						>
					</div>
				{/each}
			</div>
		{:else}
			<p class="font-mono text-sm text-dim/50">—</p>
		{/if}
	</OutputPanel>
</div>

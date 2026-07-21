<script lang="ts">
	import { tt } from '$lib/i18n';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { generateIds, type UuidBatchOptions } from '$lib/tools/uuid';
	import { currentResult } from '$lib/state/app.svelte';
	import { RefreshCw } from 'lucide-svelte';

	let kind = $state<UuidBatchOptions['kind']>('uuid-v4');
	let count = $state(1);
	let uppercase = $state(false);
	let ids = $state<string[]>([]);
	let error = $state('');

	const KINDS: Array<[UuidBatchOptions['kind'], string, string]> = [
		['uuid-v4', 'UUID v4', tt('uuidHintV4')],
		['uuid-v7', 'UUID v7', tt('uuidHintV7')],
		['ulid', 'ULID', tt('uuidHintUlid')],
		['nanoid', 'Nano ID', tt('uuidHintNano')]
	];

	function generate() {
		const r = generateIds({ kind, count, uppercase });
		if (r.ok) {
			ids = r.value;
			error = '';
		} else {
			error = r.error;
		}
	}

	// Generate on load and whenever options change.
	$effect(() => {
		void kind;
		void count;
		void uppercase;
		generate();
	});

	const output = $derived(ids.join('\n'));

	$effect(() => {
		currentResult.text = output;
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={kind}
			label={tt('uuidFormat')}
			options={KINDS.map(([k, label, hint]) => ({ value: k, label, title: hint }))}
		/>
		<label class="flex items-center gap-2 text-dim">
			{tt('count')}
			<input
				type="number"
				bind:value={count}
				min="1"
				max="1000"
				class="w-20 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg"
			/>
		</label>
		{#if kind !== 'nanoid'}
			<label class="flex items-center gap-2 text-dim">
				<input type="checkbox" bind:checked={uppercase} class="accent-(--accent)" />
				{tt('uppercase')}
			</label>
		{/if}
		<button
			type="button"
			onclick={generate}
			class="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-120 hover:opacity-90"
		>
			<RefreshCw size={13} /> {tt('regenerate')}
		</button>
	</div>
	{#if error}
		<p class="font-mono text-xs text-err" role="alert">{error}</p>
	{/if}
	<OutputPanel value={output} filename="ids.txt" label={tt('uuidOut')} />
	<p class="text-xs text-dim">
		{tt('uuidNote')}
	</p>
</div>

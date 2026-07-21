<script lang="ts">
	import { tt } from '$lib/i18n';
	import OutputPanel from '../OutputPanel.svelte';
	import { generatePasswords, strengthOf, type Strength } from '$lib/tools/password';
	import { currentResult } from '$lib/state/app.svelte';
	import { RefreshCw } from 'lucide-svelte';

	let length = $state(20);
	let count = $state(3);
	let lower = $state(true);
	let upper = $state(true);
	let digits = $state(true);
	let symbols = $state(true);
	let excludeAmbiguous = $state(false);
	let passwords = $state<string[]>([]);
	let entropyBits = $state(0);
	let error = $state('');

	function generate() {
		const r = generatePasswords({ length, count, lower, upper, digits, symbols, excludeAmbiguous });
		if (r.ok) {
			passwords = r.value.passwords;
			entropyBits = r.value.entropyBits;
			error = '';
		} else {
			error = r.error;
			passwords = [];
		}
	}

	$effect(() => {
		void length; void count; void lower; void upper; void digits; void symbols; void excludeAmbiguous;
		generate();
	});

	const output = $derived(passwords.join('\n'));

	$effect(() => {
		currentResult.text = output;
	});

	const strength = $derived<Strength>(strengthOf(entropyBits));
	const strengthPct = $derived(Math.min(100, Math.round((entropyBits / 128) * 100)));
	const STRENGTH_META: Record<Strength, { key: 'pwWeak' | 'pwFair' | 'pwStrong' | 'pwExcellent'; cls: string }> = {
		weak: { key: 'pwWeak' as const, cls: 'bg-err' },
		fair: { key: 'pwFair' as const, cls: 'bg-warn' },
		strong: { key: 'pwStrong' as const, cls: 'bg-ok' },
		excellent: { key: 'pwExcellent' as const, cls: 'bg-ok' }
	};
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<label class="flex items-center gap-2 text-dim">
			{tt('lengthLbl')}
			<input type="range" bind:value={length} min="8" max="64" class="w-32 accent-(--accent)" />
			<span class="w-8 font-mono text-fg tabular-nums">{length}</span>
		</label>
		<label class="flex items-center gap-2 text-dim">
			{tt('count')}
			<input type="number" bind:value={count} min="1" max="100" class="w-16 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg" />
		</label>
		<button
			type="button"
			onclick={generate}
			class="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-120 hover:opacity-90"
		>
			<RefreshCw size={13} /> {tt('regenerate')}
		</button>
	</div>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={lower} class="accent-(--accent)" /> a–z</label>
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={upper} class="accent-(--accent)" /> A–Z</label>
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={digits} class="accent-(--accent)" /> 0–9</label>
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={symbols} class="accent-(--accent)" /> !@#…</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={excludeAmbiguous} class="accent-(--accent)" /> {tt('pwNoLookalikes')}
		</label>
	</div>

	{#if error}
		<p class="font-mono text-xs text-err" role="alert">{error}</p>
	{:else}
		<div class="rounded-lg border border-line bg-surface px-4 py-3">
			<div class="flex items-baseline justify-between">
				<span class="text-xs font-medium tracking-wide text-dim uppercase">{tt('pwEntropy')}</span>
				<span class="font-mono text-sm">
					{entropyBits} {tt('pwBits')}
					<span class="ml-2 text-xs {strength === 'weak' ? 'text-err' : strength === 'fair' ? 'text-warn' : 'text-ok'}"
						>{tt(STRENGTH_META[strength].key)}</span
					>
				</span>
			</div>
			<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
				<div
					class="h-full rounded-full transition-all duration-180 {STRENGTH_META[strength].cls}"
					style="width: {strengthPct}%"
				></div>
			</div>
			<p class="mt-1.5 text-[11px] text-dim">
				{tt('pwNote')}
			</p>
		</div>
	{/if}

	<OutputPanel value={output} label={tt('pwOut')} filename="passwords.txt" />
	<p class="text-xs text-dim">
		{tt('pwCrypto')}
	</p>
</div>

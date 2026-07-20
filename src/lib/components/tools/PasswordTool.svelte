<script lang="ts">
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
	const STRENGTH_META: Record<Strength, { label: string; cls: string }> = {
		weak: { label: 'Weak', cls: 'bg-err' },
		fair: { label: 'Fair', cls: 'bg-warn' },
		strong: { label: 'Strong', cls: 'bg-ok' },
		excellent: { label: 'Excellent', cls: 'bg-ok' }
	};
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<label class="flex items-center gap-2 text-dim">
			Length
			<input type="range" bind:value={length} min="8" max="64" class="w-32 accent-(--accent)" />
			<span class="w-8 font-mono text-fg tabular-nums">{length}</span>
		</label>
		<label class="flex items-center gap-2 text-dim">
			Count
			<input type="number" bind:value={count} min="1" max="100" class="w-16 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg" />
		</label>
		<button
			type="button"
			onclick={generate}
			class="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-120 hover:opacity-90"
		>
			<RefreshCw size={13} /> Regenerate
		</button>
	</div>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={lower} class="accent-(--accent)" /> a–z</label>
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={upper} class="accent-(--accent)" /> A–Z</label>
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={digits} class="accent-(--accent)" /> 0–9</label>
		<label class="flex items-center gap-2 text-dim"><input type="checkbox" bind:checked={symbols} class="accent-(--accent)" /> !@#…</label>
		<label class="flex items-center gap-2 text-dim">
			<input type="checkbox" bind:checked={excludeAmbiguous} class="accent-(--accent)" /> No look-alikes (0O1lI)
		</label>
	</div>

	{#if error}
		<p class="font-mono text-xs text-err" role="alert">{error}</p>
	{:else}
		<div class="rounded-lg border border-line bg-surface px-4 py-3">
			<div class="flex items-baseline justify-between">
				<span class="text-xs font-medium tracking-wide text-dim uppercase">Entropy</span>
				<span class="font-mono text-sm">
					{entropyBits} bits
					<span class="ml-2 text-xs {strength === 'weak' ? 'text-err' : strength === 'fair' ? 'text-warn' : 'text-ok'}"
						>{STRENGTH_META[strength].label}</span
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
				≥ 80 bits withstands offline cracking of fast hashes; ≥ 100 bits is effectively unguessable.
			</p>
		</div>
	{/if}

	<OutputPanel value={output} label="Passwords" filename="passwords.txt" />
	<p class="text-xs text-dim">
		Generated with crypto.getRandomValues, in your browser only. Nothing is stored or transmitted.
	</p>
</div>

<script lang="ts">
	import { tt } from '$lib/i18n';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { bcryptHash, bcryptVerify, bcryptInfo } from '$lib/tools/bcrypt';
	import { currentResult } from '$lib/state/app.svelte';
	import { ShieldCheck, ShieldX, LoaderCircle } from 'lucide-svelte';

	let mode = $state<'hash' | 'verify'>('hash');
	let password = $state('');
	let rounds = $state(10);
	let hashOut = $state('');
	let hashMs = $state(0);
	let working = $state(false);
	let error = $state('');

	let verifyPassword = $state('');
	let verifyHash = $state('');
	let verifyResult = $state<null | boolean>(null);
	let verifyError = $state('');

	async function doHash() {
		working = true;
		error = '';
		const r = await bcryptHash(password, rounds);
		working = false;
		if (r.ok) {
			hashOut = r.value.hash;
			hashMs = r.value.ms;
		} else {
			error = r.error;
			hashOut = '';
		}
	}

	async function doVerify() {
		working = true;
		verifyError = '';
		verifyResult = null;
		const r = await bcryptVerify(verifyPassword, verifyHash);
		working = false;
		if (r.ok) verifyResult = r.value;
		else verifyError = r.error;
	}

	$effect(() => {
		currentResult.text = mode === 'hash' ? hashOut : verifyResult === null ? '' : String(verifyResult);
	});

	const info = $derived.by(() => {
		const h = mode === 'hash' ? hashOut : verifyHash;
		if (h === '') return null;
		const r = bcryptInfo(h);
		return r.ok ? r.value : null;
	});
</script>

<div class="space-y-4">
	<Segmented
		bind:value={mode}
		label={tt('mode')}
		options={[
			{ value: 'hash', label: tt('bcHash'), title: tt('bcHashT') },
			{ value: 'verify', label: tt('bcVerify'), title: tt('bcVerifyT') }
		]}
	/>

	{#if mode === 'hash'}
		<label class="block">
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('bcPassword')}</span>
			<input
				type="text"
				bind:value={password}
				spellcheck="false"
				autocomplete="off"
				placeholder={tt('bcPh')}
				class="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 font-mono text-sm outline-none placeholder:text-dim/50 focus:border-accent"
				onkeydown={(e) => e.key === 'Enter' && doHash()}
			/>
		</label>
		<div class="flex flex-wrap items-center gap-4 text-sm">
			<label class="flex items-center gap-2 text-dim">
				{tt('bcCost')}
				<input type="range" bind:value={rounds} min="4" max="14" class="w-32 accent-(--accent)" />
				<span class="w-16 font-mono text-fg tabular-nums">{rounds} <span class="text-dim">(2^{rounds})</span></span>
			</label>
			<button
				type="button"
				onclick={doHash}
				disabled={working || password === ''}
				class="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-120 hover:opacity-90 disabled:opacity-40"
			>
				{#if working}<LoaderCircle size={13} class="animate-spin" />{/if}
				{tt('bcHash')}
			</button>
			{#if hashMs > 0}<span class="font-mono text-xs text-dim">{hashMs} ms</span>{/if}
		</div>
		{#if error}<p class="font-mono text-xs text-err" role="alert">{error}</p>{/if}
		<OutputPanel value={hashOut} label={tt('bcHashLbl')} filename="bcrypt.txt" />
	{:else}
		<label class="block">
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('bcPassword')}</span>
			<input
				type="text"
				bind:value={verifyPassword}
				spellcheck="false"
				autocomplete="off"
				class="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
			/>
		</label>
		<label class="block">
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('bcHashLbl')}</span>
			<input
				type="text"
				bind:value={verifyHash}
				spellcheck="false"
				autocomplete="off"
				placeholder="$2b$10$…"
				class="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 font-mono text-sm outline-none placeholder:text-dim/50 focus:border-accent"
				onkeydown={(e) => e.key === 'Enter' && doVerify()}
			/>
		</label>
		<button
			type="button"
			onclick={doVerify}
			disabled={working || verifyPassword === '' || verifyHash === ''}
			class="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-120 hover:opacity-90 disabled:opacity-40"
		>
			{#if working}<LoaderCircle size={13} class="animate-spin" />{/if}
			{tt('bcVerify')}
		</button>
		{#if verifyError}<p class="font-mono text-xs text-err" role="alert">{verifyError}</p>{/if}
		{#if verifyResult !== null}
			<div
				class="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm
					{verifyResult ? 'border-ok/40 text-ok' : 'border-err/40 text-err'}"
				role="status"
			>
				{#if verifyResult}<ShieldCheck size={16} /> Password matches this hash{:else}<ShieldX size={16} /> Password does NOT match{/if}
			</div>
		{/if}
	{/if}

	{#if info}
		<div class="grid grid-cols-3 gap-2">
			<div class="rounded-lg border border-line bg-surface px-3 py-2">
				<span class="block text-[11px] tracking-wide text-dim uppercase">{tt('bcVersion')}</span>
				<span class="font-mono text-sm">${info.version}$</span>
			</div>
			<div class="rounded-lg border border-line bg-surface px-3 py-2">
				<span class="block text-[11px] tracking-wide text-dim uppercase">{tt('bcCostShort')}</span>
				<span class="font-mono text-sm">{info.rounds} <span class="text-dim">(2^{info.rounds})</span></span>
			</div>
			<div class="rounded-lg border border-line bg-surface px-3 py-2">
				<span class="block text-[11px] tracking-wide text-dim uppercase">{tt('bcSalt')}</span>
				<span class="block truncate font-mono text-sm" title={info.salt}>{info.salt}</span>
			</div>
		</div>
	{/if}
	<p class="text-xs text-dim">
		{tt('bcNote')}
	</p>
</div>

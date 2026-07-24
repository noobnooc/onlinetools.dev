<script lang="ts">
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n';
	import PlusCorners from './PlusCorners.svelte';
	import Eyebrow from './Eyebrow.svelte';
	import {
		PIPE_OPS,
		PIPE_OP_BY_ID,
		PIPE_GROUPS,
		PIPE_GROUP_LABELS,
		type PipeOp
	} from '$lib/chain/ops';
	import { runChain, encodeRecipe, decodeRecipe, PRESETS, type Step } from '$lib/chain/engine';
	import {
		Plus,
		X,
		ArrowUp,
		ArrowDown,
		Copy,
		Check,
		Share2,
		CornerDownRight,
		Search
	} from 'lucide-svelte';

	/**
	 * The interactive pipeline. Loaded client-side only (its op registry pulls
	 * in tool libraries that expect a browser), so the page shell stays
	 * prerender-safe. Initial state hydrates synchronously from the share
	 * fragment before any effect runs, so a shared link reproduces the pipeline.
	 */
	let input = $state('');
	let steps = $state<Step[]>([]);
	if (browser) {
		const r = decodeRecipe(location.hash);
		if (r && (r.input !== '' || r.steps.length > 0)) {
			input = r.input;
			steps = r.steps;
		}
	}

	let addOpen = $state(false);
	let opQuery = $state('');
	let copied = $state(false);
	let shared = $state<'ok' | 'toolarge' | null>(null);

	const run = $derived(runChain(input, steps));

	// Keep the URL fragment in sync so refresh / copy-address reproduce state.
	$effect(() => {
		const frag = encodeRecipe({ input, steps });
		const base = location.pathname + location.search;
		history.replaceState(history.state, '', frag ? base + frag : base);
	});

	const filteredGroups = $derived(
		PIPE_GROUPS.map((g) => ({
			group: g,
			ops: PIPE_OPS.filter(
				(o) =>
					o.group === g &&
					(opQuery.trim() === '' || o.label.toLowerCase().includes(opQuery.trim().toLowerCase()))
			)
		})).filter((g) => g.ops.length > 0)
	);

	function opLabel(id: string): string {
		return PIPE_OP_BY_ID.get(id)?.label ?? id;
	}

	function addStep(op: PipeOp) {
		steps = [...steps, { op: op.id, arg: op.arg?.default }];
		addOpen = false;
		opQuery = '';
	}

	function removeStep(i: number) {
		steps = steps.filter((_, idx) => idx !== i);
	}

	function move(i: number, dir: -1 | 1) {
		const j = i + dir;
		if (j < 0 || j >= steps.length) return;
		const next = [...steps];
		[next[i], next[j]] = [next[j], next[i]];
		steps = next;
	}

	function setArg(i: number, value: string) {
		steps = steps.map((s, idx) => (idx === i ? { ...s, arg: value } : s));
	}

	function loadPreset(recipeInput: string, recipeSteps: Step[]) {
		input = recipeInput;
		steps = recipeSteps.map((s) => ({ ...s }));
		addOpen = false;
	}

	function clearAll() {
		input = '';
		steps = [];
		addOpen = false;
	}

	async function copyOutput() {
		try {
			await navigator.clipboard.writeText(run.output);
			copied = true;
			setTimeout(() => (copied = false), 1200);
		} catch {
			// Clipboard blocked — no-op rather than throw.
		}
	}

	async function share() {
		const frag = encodeRecipe({ input, steps });
		if (!frag) {
			shared = 'toolarge';
			setTimeout(() => (shared = null), 2400);
			return;
		}
		try {
			await navigator.clipboard.writeText(location.origin + location.pathname + frag);
			shared = 'ok';
			setTimeout(() => (shared = null), 1400);
		} catch {
			// Clipboard blocked — leave state unchanged.
		}
	}

	function preview(value: string | undefined): string {
		if (!value) return '';
		const oneLine = value.replace(/\s+/g, ' ').trim();
		return oneLine.length > 96 ? oneLine.slice(0, 96) + '…' : oneLine;
	}
</script>

<!-- Starters -->
<div class="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1.5">
	<span class="font-mono text-[11px] text-dim">{t('chainStarters')}</span>
	{#each PRESETS as p (p.id)}
		<button
			type="button"
			onclick={() => loadPreset(p.recipe.input, p.recipe.steps)}
			class="rounded-md border border-line bg-surface px-2 py-0.5 text-[12px] text-dim transition-colors duration-120 hover:border-accent/50 hover:text-accent"
		>
			{p.title}
		</button>
	{/each}
</div>

<!-- Pipeline -->
<div class="relative rounded-(--radius-lg) border border-line bg-surface p-4">
	<PlusCorners />

	<!-- Input -->
	<label
		class="mb-1.5 block font-mono text-[11px] tracking-wide text-dim uppercase"
		for="chain-input">input</label
	>
	<textarea
		id="chain-input"
		bind:value={input}
		spellcheck="false"
		autocapitalize="off"
		rows="3"
		placeholder={t('chainInputPlaceholder')}
		class="block w-full resize-y rounded-md border border-line bg-surface-2/50 px-3 py-2 font-mono text-[13px] leading-6 text-fg outline-none transition-colors duration-120 placeholder:text-dim/60 focus:border-accent/50"
	></textarea>

	<!-- Steps -->
	{#each steps as step, i (i)}
		{@const op = PIPE_OP_BY_ID.get(step.op)}
		{@const result = run.steps[i]}
		<div class="flex justify-center py-1.5 text-dim/50" aria-hidden="true">
			<CornerDownRight size={14} />
		</div>
		<div
			class="rounded-md border bg-surface-2/40 px-3 py-2 {result?.status === 'error'
				? 'border-err/50'
				: 'border-line'}"
		>
			<div class="flex items-center gap-2">
				<span
					class="inline-block h-1.5 w-1.5 shrink-0 rounded-full {result?.status === 'ok'
						? 'bg-ok'
						: result?.status === 'error'
							? 'bg-err'
							: 'bg-dim/40'}"
				></span>
				<span class="font-mono text-[12px] font-medium">{opLabel(step.op)}</span>
				{#if op?.arg}
					<input
						type="text"
						value={step.arg ?? ''}
						oninput={(e) => setArg(i, e.currentTarget.value)}
						placeholder={op.arg.placeholder}
						spellcheck="false"
						class="min-w-0 grow rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-fg outline-none focus:border-accent/50"
					/>
				{:else}
					<span class="grow"></span>
				{/if}
				<div class="flex shrink-0 items-center gap-0.5 text-dim">
					<button
						type="button"
						onclick={() => move(i, -1)}
						disabled={i === 0}
						class="flex h-6 w-6 items-center justify-center rounded hover:bg-surface hover:text-fg disabled:opacity-30"
						aria-label="Move up"
					>
						<ArrowUp size={13} />
					</button>
					<button
						type="button"
						onclick={() => move(i, 1)}
						disabled={i === steps.length - 1}
						class="flex h-6 w-6 items-center justify-center rounded hover:bg-surface hover:text-fg disabled:opacity-30"
						aria-label="Move down"
					>
						<ArrowDown size={13} />
					</button>
					<button
						type="button"
						onclick={() => removeStep(i)}
						class="flex h-6 w-6 items-center justify-center rounded hover:bg-surface hover:text-err"
						aria-label={t('clearHint')}
					>
						<X size={13} />
					</button>
				</div>
			</div>
			{#if result?.status === 'error'}
				<p class="mt-1.5 pl-3.5 font-mono text-[11px] text-err">{result.error}</p>
			{:else if result?.status === 'skipped'}
				<p class="mt-1.5 pl-3.5 font-mono text-[11px] text-dim/50">—</p>
			{:else if result?.value}
				<p class="mt-1.5 truncate pl-3.5 font-mono text-[11px] text-dim">{preview(result.value)}</p>
			{/if}
		</div>
	{/each}

	<!-- Add step -->
	<div class="flex justify-center py-1.5 text-dim/40" aria-hidden="true">
		<CornerDownRight size={14} />
	</div>
	<div class="relative">
		<button
			type="button"
			onclick={() => (addOpen = !addOpen)}
			class="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-line py-2 text-[13px] text-dim transition-colors duration-120 hover:border-accent/50 hover:text-accent"
		>
			<Plus size={14} /> {t('chainAddStep')}
		</button>

		{#if addOpen}
			<div
				class="absolute top-full right-0 left-0 z-30 mt-1.5 max-h-80 overflow-y-auto rounded-md border border-line bg-surface p-2 shadow-xl shadow-black/25"
			>
				<div class="mb-2 flex items-center gap-2 rounded border border-line bg-surface-2/50 px-2">
					<Search size={13} class="shrink-0 text-dim" />
					<!-- svelte-ignore a11y_autofocus -->
					<input
						type="text"
						bind:value={opQuery}
						autofocus
						placeholder={t('chainSearchSteps')}
						class="w-full bg-transparent py-1.5 text-[13px] text-fg outline-none placeholder:text-dim/60"
					/>
				</div>
				{#each filteredGroups as g (g.group)}
					<div class="mb-1.5">
						<div class="px-1.5 pb-0.5 font-mono text-[10px] tracking-wide text-dim/60 uppercase">
							{PIPE_GROUP_LABELS[g.group]}
						</div>
						{#each g.ops as op (op.id)}
							<button
								type="button"
								onclick={() => addStep(op)}
								class="flex w-full items-center gap-2 rounded px-1.5 py-1.5 text-left text-[13px] transition-colors duration-120 hover:bg-surface-2"
							>
								<span class="font-mono text-[12px]">{op.label}</span>
								{#if op.arg}
									<span
										class="ml-auto rounded-sm border border-line px-1 font-mono text-[10px] text-dim/70"
										>{op.arg.label}</span
									>
								{/if}
							</button>
						{/each}
					</div>
				{/each}
				{#if filteredGroups.length === 0}
					<p class="px-1.5 py-2 text-[13px] text-dim">{t('noMatch')}</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Output -->
<div class="mt-6">
	<div class="mb-2 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Eyebrow text={t('output')} />
			{#if run.failedAt !== -1}
				<span class="font-mono text-[11px] text-err">{opLabel(steps[run.failedAt].op)}</span>
			{/if}
		</div>
		<div class="flex items-center gap-1.5">
			{#if shared === 'toolarge'}
				<span class="max-w-56 text-right text-[11px] text-dim">{t('shareTooLarge')}</span>
			{/if}
			<button
				type="button"
				onclick={share}
				disabled={steps.length === 0}
				class="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-[12px] text-dim transition-colors duration-120 hover:border-accent/50 hover:text-accent disabled:opacity-40"
			>
				<Share2 size={12} /> {shared === 'ok' ? t('linkCopied') : t('share')}
			</button>
			<button
				type="button"
				onclick={copyOutput}
				disabled={run.output === ''}
				class="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-[12px] text-dim transition-colors duration-120 hover:border-accent/50 hover:text-accent disabled:opacity-40"
			>
				{#if copied}<Check size={12} /> {t('copied')}{:else}<Copy size={12} /> {t('copy')}{/if}
			</button>
		</div>
	</div>
	<div class="relative min-h-32 rounded-(--radius-lg) border border-line bg-surface p-4">
		<PlusCorners />
		{#if steps.length === 0}
			<p class="font-mono text-[13px] text-dim/60">{t('chainEmpty')}</p>
		{:else}
			<pre
				class="overflow-x-auto font-mono text-[13px] leading-6 whitespace-pre-wrap text-fg">{run.output}</pre>
		{/if}
	</div>
	{#if steps.length > 0}
		<div class="mt-3 text-right">
			<button
				type="button"
				onclick={clearAll}
				class="font-mono text-[11px] text-dim/70 transition-colors duration-120 hover:text-err"
			>
				{t('clearHint')}
			</button>
		</div>
	{/if}
</div>

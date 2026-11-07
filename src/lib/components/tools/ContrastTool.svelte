<script lang="ts">
	import { tt } from '$lib/i18n';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { checkContrast, suggestColors, extractColors, formatRatio, type ContrastCheck } from '$lib/tools/contrast';
	import { parseColor } from '$lib/tools/color';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { ArrowLeftRight } from 'lucide-svelte';

	// #777 on white is the classic near miss: 4.48:1, just under AA.
	let fg = $state('#777777');
	let bg = $state('#ffffff');
	let target = $state<'4.5' | '7' | '3'>('4.5');

	initFromHash((s) => {
		if (s.fg !== undefined) fg = s.fg;
		if (s.bg !== undefined) bg = s.bg;
		if (s.t === '4.5' || s.t === '7' || s.t === '3') target = s.t;
		// "Continue with" and Smart Paste hand over free text: "#333 on #fff", or one color.
		if (s.input !== undefined) {
			const found = extractColors(s.input);
			if (found[0]) fg = found[0];
			if (found[1]) bg = found[1];
		}
	});

	const result = $derived(checkContrast(fg, bg));
	const report = $derived(result.ok ? result.value : null);
	const fgError = $derived(!result.ok && !result.error.startsWith('Background') ? result.error : null);
	const bgError = $derived(!result.ok && result.error.startsWith('Background') ? result.error : null);

	const CHECK_LABELS: Record<ContrastCheck['id'], () => string> = {
		aa: () => tt('contrastAa'),
		'aa-large': () => tt('contrastAaLarge'),
		aaa: () => tt('contrastAaa'),
		'aaa-large': () => tt('contrastAaaLarge'),
		ui: () => tt('contrastUi')
	};

	const targetNum = $derived(Number(target));
	const meetsTarget = $derived(report ? report.ratio >= targetNum : false);

	/** Suggestions are computed on what is seen (alpha already blended), and are opaque. */
	const fixes = $derived.by(() => {
		if (!report || meetsTarget) return null;
		const fgRgb = parseColor(report.fgSeen);
		const bgRgb = parseColor(report.bgSeen);
		if (!fgRgb.ok || !bgRgb.ok) return null;
		return {
			text: suggestColors(fgRgb.value, bgRgb.value, targetNum),
			background: suggestColors(bgRgb.value, fgRgb.value, targetNum)
		};
	});

	/** `<input type="color">` only takes #rrggbb, so alpha is dropped there. */
	const fgParsed = $derived(parseColor(fg));
	const bgParsed = $derived(parseColor(bg));
	const fgPicker = $derived(fgParsed.ok ? fgParsed.value.hex.slice(0, 7) : '#000000');
	const bgPicker = $derived(bgParsed.ok ? bgParsed.value.hex.slice(0, 7) : '#ffffff');

	function swap() {
		[fg, bg] = [bg, fg];
	}

	const output = $derived.by(() => {
		if (!report) return '';
		const lines = [
			`Text ${report.fgSeen} on ${report.bgSeen}`,
			`Contrast ${report.ratioText}:1`,
			...report.checks.map((c) => `${CHECK_LABELS[c.id]()} (≥ ${c.min}): ${c.pass ? 'pass' : 'fail'}`)
		];
		return lines.join('\n');
	});

	$effect(() => {
		currentResult.text = output;
	});

	const fieldClass =
		'w-full min-w-0 rounded-lg border bg-surface-2 px-2 py-1.5 font-mono text-sm text-fg focus:border-accent';
</script>

<div class="space-y-4">
	<div class="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
		<div>
			<label for="contrast-fg" class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('contrastText')}</label>
			<div class="flex items-center gap-2">
				<input
					type="color"
					value={fgPicker}
					oninput={(e) => (fg = e.currentTarget.value)}
					aria-label={tt('contrastPickText')}
					class="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-line bg-surface-2 p-0.5"
				/>
				<input
					id="contrast-fg"
					type="text"
					bind:value={fg}
					spellcheck="false"
					autocomplete="off"
					aria-invalid={fgError ? 'true' : undefined}
					aria-describedby={fgError ? 'contrast-fg-err' : undefined}
					class="{fieldClass} {fgError ? 'border-err' : 'border-line'}"
				/>
			</div>
			{#if fgError}<p id="contrast-fg-err" class="mt-1 text-xs text-err">{fgError}</p>{/if}
		</div>
		<button
			type="button"
			onclick={swap}
			class="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-line text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
			aria-label={tt('contrastSwap')}
			title={tt('contrastSwap')}
		>
			<ArrowLeftRight size={15} />
		</button>
		<div>
			<label for="contrast-bg" class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('contrastBackground')}</label>
			<div class="flex items-center gap-2">
				<input
					type="color"
					value={bgPicker}
					oninput={(e) => (bg = e.currentTarget.value)}
					aria-label={tt('contrastPickBg')}
					class="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-line bg-surface-2 p-0.5"
				/>
				<input
					id="contrast-bg"
					type="text"
					bind:value={bg}
					spellcheck="false"
					autocomplete="off"
					aria-invalid={bgError ? 'true' : undefined}
					aria-describedby={bgError ? 'contrast-bg-err' : undefined}
					class="{fieldClass} {bgError ? 'border-err' : 'border-line'}"
				/>
			</div>
			{#if bgError}<p id="contrast-bg-err" class="mt-1 text-xs text-err">{bgError}</p>{/if}
		</div>
	</div>

	<OutputPanel
		value={output}
		label={tt('contrastRatio')}
		filename="contrast.txt"
		shareState={{ fg, bg, t: target }}
		emptyHint={tt('contrastEmpty')}
	>
		{#if report}
			<div class="space-y-4">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-stretch">
					<div class="flex shrink-0 flex-col justify-center sm:w-40">
						<span class="font-mono text-4xl font-medium tabular-nums" aria-live="polite">{report.ratioText}<span class="text-dim">:1</span></span>
						<span class="mt-1 text-xs text-dim">{report.fgSeen} · {report.bgSeen}</span>
					</div>
					<!-- Preview, drawn with the colors as seen (alpha blended). -->
					<div
						class="grow space-y-2 rounded-lg border border-line px-4 py-3"
						style="background: {report.bgSeen}; color: {report.fgSeen}"
						role="img"
						aria-label={tt('contrastPreview')}
					>
						<p class="text-base">{tt('contrastSampleBody')}</p>
						<p class="text-2xl">{tt('contrastSampleLarge')}</p>
						<div class="flex items-center gap-3 pt-1">
							<span class="rounded-md border-2 px-3 py-1 text-sm font-medium" style="border-color: {report.fgSeen}">{tt('contrastSampleUi')}</span>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>
						</div>
					</div>
				</div>

				<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{#each report.checks as c (c.id)}
						<li class="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-2 text-sm">
							<span>{CHECK_LABELS[c.id]()} <span class="font-mono text-xs text-dim">≥ {c.min}</span></span>
							{#if c.pass}
								<span class="shrink-0 font-medium text-ok">✓ {tt('contrastPass')}</span>
							{:else}
								<span class="shrink-0 font-medium text-err">✗ {tt('contrastFail')}</span>
							{/if}
						</li>
					{/each}
				</ul>
				<p class="text-xs text-dim">{tt('contrastLargeHint')}</p>
				{#each report.notes as note (note)}
					<p class="text-xs text-warn">{note}</p>
				{/each}
			</div>
		{/if}
	</OutputPanel>

	{#if report}
		<div class="rounded-lg border border-line bg-surface p-3">
			<div class="mb-2 flex flex-wrap items-center justify-between gap-2">
				<span class="text-xs font-medium tracking-wide text-dim uppercase">{tt('contrastFix')}</span>
				<Segmented
					bind:value={target}
					label={tt('contrastTarget')}
					options={[
						{ value: '4.5', label: 'AA 4.5' },
						{ value: '7', label: 'AAA 7' },
						{ value: '3', label: tt('contrastTargetLarge') }
					]}
				/>
			</div>
			{#if meetsTarget}
				<p class="text-sm text-ok">✓ {tt('contrastAllPass')}</p>
			{:else if fixes}
				<div class="grid gap-3 sm:grid-cols-2">
					{#each [{ key: 'text', label: tt('contrastFixText'), list: fixes.text, apply: (h: string) => (fg = h) }, { key: 'bg', label: tt('contrastFixBg'), list: fixes.background, apply: (h: string) => (bg = h) }] as group (group.key)}
						<div>
							<p class="mb-1.5 text-xs text-dim">{group.label}</p>
							{#if group.list.length === 0}
								<p class="text-xs text-dim">{tt('contrastNoFix')}</p>
							{:else}
								<div class="flex flex-wrap gap-2">
									{#each group.list as s (s.direction)}
										<button
											type="button"
											onclick={() => group.apply(s.hex)}
											class="flex items-center gap-2 rounded-md border border-line px-2 py-1.5 text-left transition-colors duration-120 hover:bg-surface-2"
										>
											<span class="h-5 w-5 shrink-0 rounded border border-line" style="background: {s.hex}" aria-hidden="true"></span>
											<span class="text-xs">
												<span class="block font-mono">{s.hex}</span>
												<span class="block text-dim">{s.direction === 'darker' ? tt('contrastDarker') : tt('contrastLighter')} · {formatRatio(s.ratio)}:1</span>
											</span>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { testRegex } from '$lib/tools/regex';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let pattern = $state('');
	let flags = $state('g');
	let text = $state('');

	initFromHash((s) => {
		if (s.pattern) pattern = s.pattern;
		if (s.flags !== undefined) flags = s.flags;
		if (s.input) text = s.input;
	});

	const FLAG_INFO: Array<[string, string]> = [
		['g', 'global'],
		['i', 'ignore case'],
		['m', 'multiline'],
		['s', 'dotall'],
		['u', 'unicode'],
		['y', 'sticky']
	];

	function toggleFlag(f: string) {
		flags = flags.includes(f) ? flags.replace(f, '') : flags + f;
	}

	const result = $derived(pattern === '' ? null : testRegex(pattern, flags, text));
	const matches = $derived(result?.ok ? result.value.matches : []);

	/** Split text into alternating plain/matched segments for highlighting. */
	const segments = $derived.by(() => {
		const segs: Array<{ text: string; hit: boolean }> = [];
		let pos = 0;
		for (const m of matches) {
			if (m.index > pos) segs.push({ text: text.slice(pos, m.index), hit: false });
			segs.push({ text: text.slice(m.index, m.end), hit: true });
			pos = m.end;
		}
		if (pos < text.length) segs.push({ text: text.slice(pos), hit: false });
		return segs;
	});

	const output = $derived(matches.map((m) => m.text).join('\n'));

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (pattern === '') return [];
		if (result && !result.ok) return [{ text: 'invalid pattern', tone: 'err' }];
		const n = matches.length;
		return [
			{ text: 'regex', tone: 'accent' },
			{ text: `${n} match${n === 1 ? '' : 'es'}`, tone: n > 0 ? 'ok' : 'dim' }
		];
	});
</script>

<div class="space-y-4">
	<div>
		<label for="regex-pattern" class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase"
			>Pattern</label
		>
		<div class="flex items-center gap-0 rounded-lg border {result && !result.ok ? 'border-err/60' : 'border-line'} bg-surface-2 focus-within:border-accent">
			<span class="pl-3 font-mono text-sm text-dim select-none">/</span>
			<input
				id="regex-pattern"
				bind:value={pattern}
				type="text"
				spellcheck="false"
				autocomplete="off"
				placeholder="(?&lt;year&gt;\d{4})-(\d{2})-(\d{2})"
				class="w-full bg-transparent px-1 py-2.5 font-mono text-sm outline-none placeholder:text-dim/50"
			/>
			<span class="pr-3 font-mono text-sm text-dim select-none">/{flags}</span>
		</div>
		{#if result && !result.ok}
			<p class="mt-1.5 font-mono text-xs text-err" role="alert">{result.error}</p>
		{/if}
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each FLAG_INFO as [f, name] (f)}
				<button
					type="button"
					aria-pressed={flags.includes(f)}
					class="rounded-md border px-2 py-0.5 font-mono text-xs transition-colors duration-120
						{flags.includes(f) ? 'border-accent/60 text-accent' : 'border-line text-dim hover:text-fg'}"
					onclick={() => toggleFlag(f)}
					title={name}>{f}</button
				>
			{/each}
		</div>
	</div>

	<InputArea
		bind:value={text}
		label="Test string"
		placeholder="Paste text to test the pattern against"
		{badge}
		rows={6}
		onsample={() => {
			pattern = '(?<year>\\d{4})-(\\d{2})-(\\d{2})';
			flags = 'g';
			text = 'Released 2024-03-14, patched 2025-11-02.\nNext review due 2026-07-20.';
		}}
	/>

	{#if text !== '' && pattern !== '' && result?.ok}
		<div>
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">Highlighted</span>
			<pre
				class="max-h-64 overflow-auto rounded-lg border border-line bg-surface px-3 py-2.5 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">{#each segments as seg, i (i)}{#if seg.hit}<mark
							class="rounded-[3px] bg-accent/25 text-inherit">{seg.text}</mark
						>{:else}{seg.text}{/if}{/each}</pre>
		</div>
		{#if matches.length > 0}
			<div>
				<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase"
					>Matches ({matches.length})</span
				>
				<div class="max-h-64 space-y-1.5 overflow-auto">
					{#each matches.slice(0, 200) as m, i (i)}
						<div class="rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs">
							<span class="text-dim">#{i + 1} @ {m.index}</span>
							<span class="ml-2 break-all">{m.text}</span>
							{#if m.groups.length > 0}
								<div class="mt-1 space-y-0.5 border-t border-line/50 pt-1 text-dim">
									{#each m.groups as g, gi (gi)}
										<div>
											<span class="text-accent">{g.name ?? `$${gi + 1}`}</span>
											= {g.value ?? '(no match)'}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}

	<OutputPanel
		value={output}
		label="Matched text"
		filename="matches.txt"
		shareState={pattern === '' ? null : { pattern, flags, input: text }}
	/>
</div>

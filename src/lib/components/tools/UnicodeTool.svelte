<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import StatTile from '../StatTile.svelte';
	import { inspectChars, unicodeSummary } from '$lib/tools/unicode';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const summary = $derived(unicodeSummary(input));
	const chars = $derived(inspectChars(input, 300));

	$effect(() => {
		currentResult.text = chars
			.map((c) => `${c.codePointHex}\t${JSON.stringify(c.char)}\tUTF-8 ${c.utf8}\t${c.category}`)
			.join('\n');
	});

	const badge = $derived.by((): BadgeSegment[] =>
		input === ''
			? []
			: [
					{ text: `${summary.graphemes} graphemes`, tone: 'accent' },
					{ text: `${summary.codePoints} cp` },
					{ text: `${summary.utf8Bytes} B` }
				]
	);
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('uniInput')}
		placeholder={tt('uniPh')}
		{badge}
		rows={3}
		onsample={() => (input = 'Héllo​ 世界 🎉 é')}
	/>
	{#if input !== ''}
		<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
			<StatTile label={tt('uniGraphemes')} value={summary.graphemes} hint={tt('uniGraphemesHint')} />
			<StatTile label={tt('uniCodePoints')} value={summary.codePoints} />
			<StatTile label={tt('uniUtf16')} value={summary.utf16Units} hint={tt('uniUtf16Hint')} />
			<StatTile label={tt('uniUtf8')} value={summary.utf8Bytes} />
		</div>
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
			{#each chars as c, i (i)}
				<div class="rounded-lg border border-line bg-surface p-3">
					<div class="flex items-center justify-between">
						<span
							class="flex h-10 min-w-10 items-center justify-center rounded-md border border-line bg-surface-2 px-2 font-mono text-lg"
							>{c.char === ' ' || /\p{C}|\p{Z}/u.test(c.char) ? '·' : c.char}</span
						>
						<div class="text-right">
							<span class="block font-mono text-sm text-accent">{c.codePointHex}</span>
							<span class="block text-[11px] text-dim">{c.category}</span>
						</div>
					</div>
					<dl class="mt-2 space-y-0.5 font-mono text-[11px] text-dim">
						<div class="flex justify-between gap-2"><dt>UTF-8</dt><dd class="text-fg/80">{c.utf8}</dd></div>
						<div class="flex justify-between gap-2"><dt>UTF-16</dt><dd class="text-fg/80">{c.utf16}</dd></div>
						<div class="flex justify-between gap-2"><dt>JS</dt><dd class="text-fg/80">{c.jsEscape}</dd></div>
						<div class="flex justify-between gap-2"><dt>HTML</dt><dd class="text-fg/80">{c.htmlEntity}</dd></div>
					</dl>
				</div>
			{/each}
		</div>
		{#if summary.codePoints > 300}
			<p class="text-xs text-dim">{tt('uniLimit')}</p>
		{/if}
	{/if}
</div>

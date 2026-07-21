<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import StatTile from '../StatTile.svelte';
	import { textStats } from '$lib/tools/text';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const stats = $derived(textStats(input));

	$effect(() => {
		currentResult.text =
			input === ''
				? ''
				: `words: ${stats.words}\ncharacters: ${stats.characters}\ncharacters (no spaces): ${stats.charactersNoSpaces}\nbytes (UTF-8): ${stats.bytes}\nlines: ${stats.lines}\nsentences: ${stats.sentences}\nparagraphs: ${stats.paragraphs}\nreading time: ~${stats.readingMinutes} min`;
	});

	const badge = $derived.by((): BadgeSegment[] =>
		input === ''
			? []
			: [{ text: 'text', tone: 'accent' }, { text: `${stats.words} words` }, { text: `${stats.bytes} B` }]
	);
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="Text"
		placeholder="Paste or type — every number updates live"
		{badge}
		rows={8}
		spellcheck={true}
		onsample={() =>
			(input =
				'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs!\n\nHow vexingly quick daft zebras jump — 日本語も数えられます 🎉')}
	/>
	<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
		<StatTile label={tt('wcWords')} value={stats.words} />
		<StatTile label={tt('wcChars')} value={stats.characters} hint={tt('wcCharsHint', { n: stats.charactersNoSpaces })} />
		<StatTile label={tt('uniUtf8')} value={stats.bytes} />
		<StatTile label={tt('wcReading')} value={stats.readingMinutes === 0 ? '—' : `~${stats.readingMinutes} min`} hint={tt('wcReadingHint')} />
		<StatTile label={tt('wcLines')} value={stats.lines} />
		<StatTile label={tt('wcSentences')} value={stats.sentences} />
		<StatTile label={tt('wcParagraphs')} value={stats.paragraphs} />
		<StatTile label={tt('wcAvg')} value={stats.words === 0 ? '—' : (stats.charactersNoSpaces / stats.words).toFixed(1)} />
	</div>
</div>

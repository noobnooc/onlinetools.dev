<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { encodeUrl, decodeUrl } from '$lib/tools/url';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	let component = $state(true);

	initFromHash((s) => {
		if (s.input) {
			input = s.input;
			if (s.mode === 'encode' || s.mode === 'decode') mode = s.mode;
			else if (/%[0-9a-fA-F]{2}/.test(s.input)) mode = 'decode';
		}
	});

	const result = $derived(
		input === '' ? null : mode === 'encode' ? encodeUrl(input, component) : decodeUrl(input)
	);
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input === '') return [];
		if (mode === 'decode') {
			return result?.ok
				? [{ text: 'url-encoded', tone: 'accent' }, { text: 'valid', tone: 'ok' }]
				: [{ text: 'malformed', tone: 'err' }];
		}
		return [{ text: 'text', tone: 'accent' }, { text: `${input.length} chars` }];
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={mode}
			label={tt('direction')}
			options={[
				{ value: 'encode', label: tt('encode') },
				{ value: 'decode', label: tt('decode') }
			]}
		/>
		{#if mode === 'encode'}
			<label class="flex items-center gap-2 text-dim" title="Component mode escapes &, = and / — use it for values inside a query string">
				<input type="checkbox" bind:checked={component} class="accent-(--accent)" />
				{tt('urlComponent')}
			</label>
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={mode === 'encode' ? tt('b64InputEnc') : tt('urlInputDec')}
		placeholder={mode === 'encode' ? 'a param value with spaces & symbols' : 'hello%20world%21'}
		{badge}
		rows={5}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				mode === 'encode'
					? 'redirect=https://example.com/path?next=1&lang=中文'
					: 'redirect%3Dhttps%3A%2F%2Fexample.com%2Fpath%3Fnext%3D1%26lang%3D%E4%B8%AD%E6%96%87')}
	/>
	<OutputPanel value={output} filename="url.txt" shareState={input === '' ? null : { input, mode }} />
</div>

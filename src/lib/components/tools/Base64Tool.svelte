<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { encodeBase64, decodeBase64, isLikelyBase64Text } from '$lib/tools/base64';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { formatBytes, byteLength } from '$lib/utils/format';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	let urlSafe = $state(false);

	initFromHash((s) => {
		if (s.input) {
			input = s.input;
			// Smart Paste hands us encoded content — pick the sensible direction.
			if (s.mode === 'encode' || s.mode === 'decode') mode = s.mode;
			else if (isLikelyBase64Text(s.input)) mode = 'decode';
		}
	});

	const result = $derived(
		input === '' ? null : mode === 'encode' ? encodeBase64(input, urlSafe) : decodeBase64(input)
	);
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input === '') return [];
		const size = formatBytes(byteLength(input));
		if (mode === 'decode') {
			return result?.ok
				? [{ text: 'Base64', tone: 'accent' }, { text: size }, { text: 'valid', tone: 'ok' }]
				: [{ text: size }, { text: 'not base64', tone: 'err' }];
		}
		return [{ text: 'text', tone: 'accent' }, { text: size }];
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
			<label class="flex items-center gap-2 text-dim">
				<input type="checkbox" bind:checked={urlSafe} />
				{tt('b64UrlSafe')}
			</label>
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={mode === 'encode' ? tt('b64InputEnc') : tt('b64InputDec')}
		placeholder={mode === 'encode' ? tt('b64PhEnc') : 'aGVsbG8gd29ybGQ='}
		{badge}
		rows={7}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => {
			if (mode === 'encode') input = 'Hello from onlinetools.dev 👋 — encoded locally, never uploaded.';
			else input = 'SGVsbG8gZnJvbSBvbmxpbmV0b29scy5kZXYg8J+Riw==';
		}}
	/>
	<OutputPanel
		value={output}
		filename={mode === 'encode' ? 'encoded.txt' : 'decoded.txt'}
		shareState={input === '' ? null : { input, mode }}
	/>
</div>

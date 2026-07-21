<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { encodeBytes, decodeBytes, textToBytes, type ByteFormat } from '$lib/tools/hexbin';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let direction = $state<'encode' | 'decode'>('encode');
	let format = $state<ByteFormat>('hex');
	let separator = $state<'space' | 'none' | 'colon'>('space');
	let uppercase = $state(false);
	let prefix = $state(false);

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.direction === 'encode' || s.direction === 'decode') direction = s.direction;
		if (s.format === 'hex' || s.format === 'binary' || s.format === 'decimal') format = s.format;
	});

	const SEPS: Record<typeof separator, string> = { space: ' ', none: '', colon: ':' };

	const result = $derived.by(() => {
		if (input === '') return null;
		return direction === 'encode'
			? encodeBytes(input, { format, separator: SEPS[separator], uppercase, prefix: prefix && format === 'hex' })
			: decodeBytes(input, format);
	});
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const byteCount = $derived(
		direction === 'encode' && input !== '' ? textToBytes(input).length : null
	);

	const badge = $derived.by((): BadgeSegment[] => {
		if (input === '') return [];
		if (!result?.ok) return [{ text: 'error', tone: 'err' }];
		const segs: BadgeSegment[] = [{ text: format, tone: 'accent' }];
		if (byteCount !== null) segs.push({ text: `${byteCount} B`, tone: 'dim' });
		return segs;
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<Segmented
			bind:value={direction}
			label={tt('direction')}
			options={[
				{ value: 'encode', label: tt('encode') },
				{ value: 'decode', label: tt('decode') }
			]}
		/>
		<Segmented
			bind:value={format}
			label={tt('hbFormat')}
			options={[
				{ value: 'hex', label: 'Hex' },
				{ value: 'binary', label: tt('nbBin') },
				{ value: 'decimal', label: tt('nbDec') }
			]}
		/>
		{#if direction === 'encode'}
			<Segmented
				bind:value={separator}
				label={tt('hbSep')}
				options={[
					{ value: 'space', label: tt('hbSpace') },
					{ value: 'none', label: tt('hbNone') },
					{ value: 'colon', label: ':', mono: true, title: tt('hbColon') }
				]}
			/>
			{#if format === 'hex'}
				<label class="flex items-center gap-2 text-dim">
					<input type="checkbox" bind:checked={uppercase} class="accent-(--accent)" /> {tt('uppercase')}
				</label>
				<label class="flex items-center gap-2 text-dim">
					<input type="checkbox" bind:checked={prefix} class="accent-(--accent)" /> 0x
				</label>
			{/if}
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={direction === 'encode' ? tt('hbInputEnc') : tt('hbInputDec')}
		placeholder={direction === 'encode' ? 'Hello' : '48 65 6c 6c 6f'}
		{badge}
		rows={6}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = direction === 'encode' ? 'Hello, 世界! 👋' : '48 65 78 20 69 73 20 66 75 6e')}
	/>
	<OutputPanel
		value={output}
		filename={direction === 'encode' ? `bytes.${format === 'hex' ? 'hex' : 'txt'}` : 'decoded.txt'}
		shareState={input === '' ? null : { input, direction, format }}
	/>
</div>

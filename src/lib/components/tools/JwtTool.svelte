<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { decodeJwt } from '$lib/tools/jwt';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	const SAMPLE =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzUyMDAwMDAwfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';

	let input = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const result = $derived(input.trim() === '' ? null : decodeJwt(input));
	const jwt = $derived(result?.ok ? result.value : null);

	const output = $derived(
		jwt
			? `// Header\n${JSON.stringify(jwt.header, null, 2)}\n\n// Payload\n${JSON.stringify(jwt.payload, null, 2)}`
			: ''
	);

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (!jwt) return input.trim() === '' ? [] : [{ text: 'not a JWT', tone: 'err' }];
		const alg = typeof jwt.header.alg === 'string' ? jwt.header.alg : '?';
		const segs: BadgeSegment[] = [{ text: 'JWT', tone: 'accent' }, { text: alg }];
		if (jwt.expired === true) segs.push({ text: 'expired', tone: 'err' });
		else if (jwt.expired === false) segs.push({ text: 'not expired', tone: 'ok' });
		return segs;
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="JWT"
		placeholder="eyJhbGciOi… (or paste a whole Authorization header)"
		{badge}
		rows={5}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = SAMPLE)}
	/>
	{#if jwt}
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
			{#each [['Issued', jwt.issuedAt], ['Expires', jwt.expiresAt], ['Not before', jwt.notBefore]] as [label, value] (label)}
				{#if value}
					<div class="rounded-lg border border-line bg-surface px-3 py-2">
						<span class="block text-[11px] tracking-wide text-dim uppercase">{label}</span>
						<span class="font-mono text-xs">{value}</span>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
	<OutputPanel value={output} filename="jwt-decoded.txt" shareState={input.trim() === '' ? null : { input }} />
	<p class="text-xs text-dim">
		Decoding only reads the token — it does not verify the signature. Verify signatures server-side
		with the issuer's keys.
	</p>
</div>

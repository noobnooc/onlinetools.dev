<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { decodeJwt } from '$lib/tools/jwt';
	import { formatRelative } from '$lib/tools/timestamp';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	const SAMPLE =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzUyMDAwMDAwfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';

	let input = $state('');
	let now = $state(Date.now());

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(t);
	});

	const result = $derived(input.trim() === '' ? null : decodeJwt(input, now));
	const jwt = $derived(result?.ok ? result.value : null);

	/** The three raw dot-separated segments, for the colored token view. */
	const segments = $derived.by(() => {
		if (!jwt) return null;
		const token = input.trim().replace(/^Bearer\s+/i, '');
		const parts = token.split('.');
		return parts.length === 3 ? parts : null;
	});

	const output = $derived(
		jwt
			? `// Header\n${JSON.stringify(jwt.header, null, 2)}\n\n// Payload\n${JSON.stringify(jwt.payload, null, 2)}`
			: ''
	);

	$effect(() => {
		currentResult.text = output;
	});

	/** Lifetime progress: how far between iat and exp we are now. */
	const lifetime = $derived.by(() => {
		if (!jwt) return null;
		const iat = typeof jwt.payload.iat === 'number' ? jwt.payload.iat * 1000 : null;
		const exp = typeof jwt.payload.exp === 'number' ? jwt.payload.exp * 1000 : null;
		if (iat === null || exp === null || exp <= iat) return null;
		const pct = Math.min(100, Math.max(0, ((now - iat) / (exp - iat)) * 100));
		return { pct, expired: now > exp, remaining: formatRelative(exp - now) };
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

	{#if segments}
		<!-- Colored token anatomy: header · payload · signature -->
		<div>
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">Token anatomy</span>
			<div class="overflow-x-auto rounded-lg border border-line bg-surface px-3 py-2.5 font-mono text-xs leading-relaxed break-all">
				<span class="text-accent">{segments[0]}</span><span class="text-dim">.</span><span
					class="text-fg">{segments[1]}</span
				><span class="text-dim">.</span><span class="text-dim/60">{segments[2]}</span>
			</div>
			<div class="mt-1.5 flex gap-4 font-mono text-[11px]">
				<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-accent"></span> header</span>
				<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-(--text)"></span> payload</span>
				<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-(--text-dim) opacity-60"></span> signature (not verified)</span>
			</div>
		</div>
	{/if}

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
		{#if lifetime}
			<div class="rounded-lg border border-line bg-surface px-4 py-3">
				<div class="flex items-baseline justify-between text-xs">
					<span class="font-medium tracking-wide text-dim uppercase">Lifetime</span>
					<span class="font-mono {lifetime.expired ? 'text-err' : 'text-ok'}">
						{lifetime.expired ? `expired ${lifetime.remaining.replace('in ', '')}` : `expires ${lifetime.remaining}`}
					</span>
				</div>
				<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
					<div
						class="h-full rounded-full {lifetime.expired ? 'bg-err' : lifetime.pct > 85 ? 'bg-warn' : 'bg-ok'}"
						style="width: {lifetime.pct}%"
					></div>
				</div>
				<div class="mt-1 flex justify-between font-mono text-[11px] text-dim/70">
					<span>iat</span><span>exp</span>
				</div>
			</div>
		{/if}
	{/if}

	<OutputPanel value={output} filename="jwt-decoded.txt" shareState={input.trim() === '' ? null : { input }} />
	<p class="text-xs text-dim">
		Decoding only reads the token — it does not verify the signature. Verify signatures server-side
		with the issuer's keys.
	</p>
</div>

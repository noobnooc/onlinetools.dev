<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { decodeJwt, signJwt, verifyJwt, SIGN_ALGS, type JwtAlg, type VerifyOutcome } from '$lib/tools/jwt';
	import type { ToolResult } from '$lib/tools/types';
	import { formatRelative } from '$lib/tools/timestamp';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	const SAMPLE =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzUyMDAwMDAwfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';

	let mode = $state<'decode' | 'sign' | 'verify'>('decode');
	let input = $state('');
	let now = $state(Date.now());

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.mode === 'decode' || s.mode === 'sign' || s.mode === 'verify') mode = s.mode;
	});

	/* ---------- sign ---------- */

	let signPayload = $state('{\n  "sub": "1234567890",\n  "name": "Ada Lovelace"\n}');
	let signAlg = $state<JwtAlg>('HS256');
	let signKey = $state('');
	let signResult = $state<ToolResult | null>(null);

	$effect(() => {
		if (mode !== 'sign' || signPayload.trim() === '' || signKey === '') {
			signResult = null;
			return;
		}
		const payload = signPayload;
		const alg = signAlg;
		const key = signKey;
		let cancelled = false;
		const timer = setTimeout(() => {
			void signJwt(payload, alg, key).then((r) => {
				if (!cancelled) signResult = r;
			});
		}, 200);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	/* ---------- verify ---------- */

	let verifyKey = $state('');
	let verifyResult = $state<ToolResult<VerifyOutcome> | null>(null);

	$effect(() => {
		if (mode !== 'verify' || input.trim() === '' || verifyKey === '') {
			verifyResult = null;
			return;
		}
		const token = input;
		const key = verifyKey;
		let cancelled = false;
		const timer = setTimeout(() => {
			void verifyJwt(token, key).then((r) => {
				if (!cancelled) verifyResult = r;
			});
		}, 200);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	const keyIsPem = $derived(/-----BEGIN/.test(mode === 'sign' ? signKey : verifyKey));

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

	const output = $derived.by(() => {
		if (mode === 'sign') return signResult?.ok ? signResult.value : '';
		if (mode === 'verify') return verifyResult?.ok ? verifyResult.value.detail : '';
		return jwt
			? `// Header\n${JSON.stringify(jwt.header, null, 2)}\n\n// Payload\n${JSON.stringify(jwt.payload, null, 2)}`
			: '';
	});

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
	<Segmented
		bind:value={mode}
		label={tt('mode')}
		options={[
			{ value: 'decode', label: tt('jwtDecode') },
			{ value: 'sign', label: tt('jwtSign') },
			{ value: 'verify', label: tt('jwtVerify') }
		]}
	/>

	{#if mode !== 'sign'}
		<InputArea
			bind:value={input}
			label="JWT"
			placeholder="eyJhbGciOi… (or paste a whole Authorization header)"
			{badge}
			rows={5}
			error={result && !result.ok ? { message: result.error } : null}
			onsample={() => (input = SAMPLE)}
		/>
	{/if}

	{#if mode === 'sign'}
		<div class="flex flex-wrap items-center gap-2 text-sm">
			<span class="text-dim">{tt('jwtAlg')}</span>
			<select
				bind:value={signAlg}
				class="rounded-lg border border-line bg-surface-2 px-2 py-1.5 font-mono text-sm text-fg focus:border-accent"
			>
				{#each SIGN_ALGS as alg (alg)}
					<option value={alg}>{alg}</option>
				{/each}
			</select>
		</div>
		<InputArea
			bind:value={signPayload}
			label={tt('jwtPayloadLbl')}
			placeholder={'{"sub": "…"}'}
			rows={6}
			error={signResult && !signResult.ok ? { message: signResult.error } : null}
		/>
		<InputArea
			bind:value={signKey}
			label={signAlg.startsWith('HS') ? tt('jwtSecret') : tt('jwtPrivKey')}
			placeholder={signAlg.startsWith('HS') ? 'your-256-bit-secret' : '-----BEGIN PRIVATE KEY-----'}
			rows={signAlg.startsWith('HS') ? 2 : 6}
			badge={signKey === '' ? [] : signAlg.startsWith('HS') || keyIsPem ? [] : [{ text: 'expects PEM', tone: 'warn' }]}
		/>
	{/if}

	{#if mode === 'verify'}
		<InputArea
			bind:value={verifyKey}
			label={tt('jwtPubKey')}
			placeholder={'your-256-bit-secret — or -----BEGIN PUBLIC KEY-----'}
			rows={4}
			error={verifyResult && !verifyResult.ok ? { message: verifyResult.error } : null}
		/>
		{#if verifyResult?.ok}
			<div
				class="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm
					{verifyResult.value.valid ? 'border-ok/40' : 'border-err/40'}"
			>
				<span class="h-2.5 w-2.5 shrink-0 rounded-full {verifyResult.value.valid ? 'bg-ok' : 'bg-err'}"></span>
				<span class="font-mono text-xs text-dim">{verifyResult.value.alg}</span>
				<span>{verifyResult.value.detail}</span>
			</div>
		{/if}
	{/if}

	{#if mode === 'decode' && segments}
		<!-- Colored token anatomy: header · payload · signature -->
		<div>
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('jwtAnatomy')}</span>
			<div class="overflow-x-auto rounded-lg border border-line bg-surface px-3 py-2.5 font-mono text-xs leading-relaxed break-all">
				<span class="text-accent">{segments[0]}</span><span class="text-dim">.</span><span
					class="text-fg">{segments[1]}</span
				><span class="text-dim">.</span><span class="text-dim/60">{segments[2]}</span>
			</div>
			<div class="mt-1.5 flex gap-4 font-mono text-[11px]">
				<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-accent"></span> {tt('jwtHeader')}</span>
				<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-(--text)"></span> {tt('jwtPayload')}</span>
				<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-(--text-dim) opacity-60"></span> {tt('jwtSignature')}</span>
			</div>
		</div>
	{/if}

	{#if mode === 'decode' && jwt}
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
			{#each [[tt('jwtIssued'), jwt.issuedAt], [tt('jwtExpires'), jwt.expiresAt], [tt('jwtNotBefore'), jwt.notBefore]] as [label, value] (label)}
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
					<span class="font-medium tracking-wide text-dim uppercase">{tt('jwtLifetime')}</span>
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

	<OutputPanel
		value={output}
		label={mode === 'sign' ? 'Output · JWT' : undefined}
		filename={mode === 'sign' ? 'token.jwt' : 'jwt-decoded.txt'}
		shareState={mode === 'sign' || input.trim() === '' ? null : { input, mode }}
	/>
	<p class="text-xs text-dim">
		{mode === 'sign' ? tt('jwtSignNote') : mode === 'verify' ? tt('jwtVerifyNote') : tt('jwtNote')}
	</p>
</div>

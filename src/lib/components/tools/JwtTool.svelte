<script lang="ts">
	import { t, tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import {
		decodeJwt,
		signJwt,
		verifyJwt,
		stampTimeClaims,
		generateSecret,
		generateKeyPair,
		isHmacAlg,
		SIGN_ALGS,
		type JwtAlg,
		type VerifyOutcome,
		type GeneratedKeyPair
	} from '$lib/tools/jwt';
	import type { ToolResult } from '$lib/tools/types';
	import { formatRelative } from '$lib/tools/timestamp';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';
	import { Copy, Check, KeyRound } from 'lucide-svelte';

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
	let signHeader = $state('');
	let signAlg = $state<JwtAlg>('HS256');
	let signKey = $state('');
	let signResult = $state<ToolResult | null>(null);
	let claimError = $state<string | null>(null);
	/** The key pair made by "Generate key pair", kept only while it matches the key box. */
	let generated = $state<{ alg: JwtAlg; pair: GeneratedKeyPair } | null>(null);
	let genError = $state<string | null>(null);
	let pubFormat = $state<'pem' | 'jwk'>('pem');
	let copiedPub = $state(false);

	const hmac = $derived(isHmacAlg(signAlg));
	const pair = $derived(
		generated && generated.alg === signAlg && generated.pair.privatePem === signKey ? generated.pair : null
	);

	$effect(() => {
		if (mode !== 'sign' || signPayload.trim() === '' || signKey === '') {
			signResult = null;
			return;
		}
		const payload = signPayload;
		const header = signHeader;
		const alg = signAlg;
		const key = signKey;
		let cancelled = false;
		const timer = setTimeout(() => {
			void signJwt(payload, alg, key, header).then((r) => {
				if (!cancelled) signResult = r;
			});
		}, 200);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	function stamp(expiresIn: number | null) {
		const r = stampTimeClaims(signPayload, Date.now(), expiresIn);
		if (r.ok) {
			signPayload = r.value;
			claimError = null;
		} else {
			claimError = r.error;
		}
	}

	async function generateKey() {
		genError = null;
		if (hmac) {
			signKey = generateSecret(signAlg);
			return;
		}
		const alg = signAlg;
		const r = await generateKeyPair(alg);
		if (r.ok) {
			generated = { alg, pair: r.value };
			signKey = r.value.privatePem;
		} else {
			genError = r.error;
		}
	}

	async function copyPub() {
		if (!pair) return;
		if (await copyText(pubFormat === 'pem' ? pair.publicPem : pair.publicJwk)) {
			copiedPub = true;
			setTimeout(() => (copiedPub = false), 1500);
		}
	}

	/** Hand the freshly signed token (and its key) over to Verify mode. */
	function verifySigned() {
		if (!signResult?.ok) return;
		input = signResult.value;
		verifyKey = hmac ? signKey : pair ? pair.publicPem : '';
		mode = 'verify';
	}

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

	const chip =
		'rounded-md border border-line bg-surface-2 px-2.5 py-1 font-medium text-fg transition-colors duration-120 hover:border-accent';

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
			<label for="jwt-alg" class="text-dim">{tt('jwtAlg')}</label>
			<select
				id="jwt-alg"
				bind:value={signAlg}
				class="rounded-lg border border-line bg-surface-2 px-2 py-1.5 font-mono text-sm text-fg focus:border-accent"
			>
				{#each SIGN_ALGS as alg (alg)}
					<option value={alg}>{alg}</option>
				{/each}
			</select>
		</div>
		<InputArea
			bind:value={signHeader}
			label={tt('jwtHeaderLbl')}
			placeholder={'{"kid": "key-1"}'}
			rows={2}
		/>
		<InputArea
			bind:value={signPayload}
			label={tt('jwtPayloadLbl')}
			placeholder={'{"sub": "…"}'}
			rows={6}
			error={claimError
				? { message: claimError }
				: signResult && !signResult.ok && signResult.error.startsWith('Payload')
					? { message: signResult.error }
					: null}
		/>
		<div class="flex flex-wrap items-center gap-2 text-xs">
			<button type="button" class={chip} onclick={() => stamp(null)}>{tt('jwtSetIat')}</button>
			<span class="text-dim">{tt('jwtExpIn')}</span>
			{#each [['15m', 900], ['1h', 3600], ['24h', 86400], ['30d', 2592000]] as const as [label, secs] (label)}
				<button type="button" class={chip} onclick={() => stamp(secs)}>+{label}</button>
			{/each}
		</div>
		<InputArea
			bind:value={signKey}
			label={hmac ? tt('jwtSecret') : tt('jwtPrivKey')}
			placeholder={hmac ? 'your-256-bit-secret' : '-----BEGIN PRIVATE KEY----- or {"kty": …, "d": …}'}
			rows={hmac ? 2 : 6}
			badge={signKey === '' || hmac || keyIsPem || signKey.trim().startsWith('{')
				? []
				: [{ text: 'expects PEM or JWK', tone: 'warn' }]}
			error={signResult && !signResult.ok && !signResult.error.startsWith('Payload')
				? { message: signResult.error }
				: genError
					? { message: genError }
					: null}
		/>
		<div class="flex flex-wrap items-center gap-2 text-xs">
			<button type="button" class="{chip} flex items-center gap-1.5" onclick={generateKey}>
				<KeyRound size={13} aria-hidden="true" />
				{hmac ? tt('jwtGenSecret') : tt('jwtGenPair')}
			</button>
			{#if signResult?.ok && (hmac || pair)}
				<button type="button" class={chip} onclick={verifySigned}>{tt('jwtVerifyThis')}</button>
			{/if}
		</div>
		{#if pair}
			<div class="rounded-lg border border-line bg-surface">
				<div class="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
					<span class="text-xs font-medium tracking-wide text-dim uppercase">{tt('jwtPubForVerify')}</span>
					<div class="flex shrink-0 items-center gap-2">
						<Segmented
							bind:value={pubFormat}
							label="Format"
							options={[
								{ value: 'pem', label: 'PEM' },
								{ value: 'jwk', label: 'JWK' }
							]}
						/>
						<button
							type="button"
							class="rounded-md p-1 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
							aria-label={t('copy')}
							onclick={copyPub}
						>
							{#if copiedPub}<Check size={14} />{:else}<Copy size={14} />{/if}
						</button>
					</div>
				</div>
				<pre class="px-3 py-2.5 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap">{pubFormat === 'pem'
						? pair.publicPem
						: pair.publicJwk}</pre>
			</div>
		{/if}
	{/if}

	{#if mode === 'verify'}
		<InputArea
			bind:value={verifyKey}
			label={tt('jwtPubKey')}
			placeholder={'your-256-bit-secret — or -----BEGIN PUBLIC KEY----- — or {"keys": [ … ]}'}
			rows={4}
			error={verifyResult && !verifyResult.ok ? { message: verifyResult.error } : null}
		/>
		{#if verifyResult?.ok}
			{@const v = verifyResult.value}
			<div class="space-y-2" role="status">
				<div
					class="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm
						{v.valid ? 'border-ok/40' : 'border-err/40'}"
				>
					<span class="h-2.5 w-2.5 shrink-0 rounded-full {v.valid ? 'bg-ok' : 'bg-err'}"></span>
					<span class="font-mono text-xs text-dim">{v.alg}</span>
					<span>{v.detail}</span>
				</div>
				{#if v.time}
					<div
						class="flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm
							{v.time.status === 'ok' ? 'border-line' : 'border-warn/50'}"
					>
						<span class="h-2.5 w-2.5 shrink-0 rounded-full {v.time.status === 'ok' ? 'bg-ok' : 'bg-warn'}"></span>
						<span class="font-mono text-xs">{v.time.message}</span>
					</div>
				{/if}
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

<script lang="ts">
	import { untrack } from 'svelte';
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import EmptyState from '../EmptyState.svelte';
	import Segmented from '../Segmented.svelte';
	import {
		OTP_ALGORITHMS,
		OTP_DIGITS,
		buildOtpauthUri,
		findCode,
		generateSecret,
		otpWindows,
		parseOtpInput,
		secondsLeft,
		timeStep,
		type OtpAlgorithm,
		type OtpType,
		type OtpWarning,
		type OtpWindow
	} from '$lib/tools/totp';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';
	import { Copy, Check, RefreshCw } from 'lucide-svelte';

	const CHECK_RANGE = 10;
	// The RFC 4226 test seed "12345678901234567890": a full 160-bit secret.
	const SAMPLE = 'otpauth://totp/Example:alice@example.com?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ&issuer=Example';

	let input = $state('');
	let type = $state<OtpType>('totp');
	let algorithm = $state<OtpAlgorithm>('SHA-1');
	let digits = $state(6);
	let period = $state(30);
	let counter = $state(0);
	let check = $state('');
	let copied = $state('');
	let now = $state(Date.now());

	// Content can arrive via "Continue with" or Smart Paste in the fragment. A 2FA
	// secret should not linger in the address bar or the history entry, so drop it
	// once read. The tool never builds a share link of its own.
	initFromHash((s) => {
		if (s.input) input = s.input;
		if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
	});

	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});

	const result = $derived(
		input.trim() === '' ? null : parseOtpInput(input, { type, algorithm, digits, period, counter })
	);
	const info = $derived(result?.ok ? result.value : null);
	const params = $derived(info?.params ?? null);
	const isTotp = $derived(params?.type !== 'hotp');
	/** Changes once per period (TOTP) or when the counter does (HOTP), not every tick. */
	const step = $derived(params ? (params.type === 'totp' ? timeStep(now, params.period) : params.counter) : -1);

	let windows = $state<OtpWindow[]>([]);
	$effect(() => {
		const p = info;
		void step;
		if (!p) {
			windows = [];
			return;
		}
		let stale = false;
		void otpWindows(p, untrack(() => now), 1).then((w) => {
			if (!stale) windows = w;
		});
		return () => {
			stale = true;
		};
	});

	const current = $derived(windows.find((w) => w.offset === 0) ?? null);
	const prev = $derived(windows.find((w) => w.offset === -1) ?? null);
	const next = $derived(windows.find((w) => w.offset === 1) ?? null);
	const left = $derived(params && isTotp ? secondsLeft(now, params.period) : 0);

	let match = $state<number | null | undefined>(undefined);
	$effect(() => {
		const p = info;
		const code = check.replace(/\s/g, '');
		void step;
		if (!p || !/^\d+$/.test(code)) {
			match = undefined;
			return;
		}
		let stale = false;
		void findCode(p, code, untrack(() => now), CHECK_RANGE).then((m) => {
			if (!stale) match = m;
		});
		return () => {
			stale = true;
		};
	});

	const matchText = $derived.by(() => {
		if (match === undefined || !params) return '';
		if (match === null) return tt('totpNoMatch', { n: CHECK_RANGE });
		if (!isTotp) return tt('totpMatchCounter', { c: params.counter + match });
		if (match === 0) return tt('totpMatchNow');
		const n = Math.abs(match);
		return tt(match < 0 ? 'totpMatchPast' : 'totpMatchFuture', { n, s: n * params.period });
	});

	const uri = $derived(params ? buildOtpauthUri(params) : '');

	const rows = $derived.by((): Array<[string, string]> => {
		if (!params) return [];
		const out: Array<[string, string]> = [];
		if (params.issuer) out.push([tt('totpIssuer'), params.issuer]);
		if (params.account) out.push([tt('totpAccount'), params.account]);
		out.push([tt('totpSecret'), params.secret]);
		out.push([tt('totpUri'), uri]);
		return out;
	});

	// The URI is the shareable artifact: "Continue with" → QR Code Generator
	// turns it into a scannable enrollment code.
	$effect(() => {
		currentResult.text = uri;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (!result) return [];
		if (!params) return [{ text: 'invalid', tone: 'err' }];
		return [
			{ text: params.type.toUpperCase(), tone: 'accent' },
			{ text: `${params.algorithm} · ${params.digits}`, tone: 'dim' },
			...(isTotp ? [{ text: `${params.period}s`, tone: 'dim' as const }] : [])
		];
	});

	const warningText: Record<OtpWarning, () => string> = {
		shortSecret: () => tt('totpWarnShort'),
		nonDefault: () => tt('totpWarnNonDefault')
	};

	function newSecret() {
		input = buildOtpauthUri({
			type: 'totp',
			secret: generateSecret(),
			algorithm: 'SHA-1',
			digits: 6,
			period: 30,
			counter: 0,
			issuer: 'Example',
			account: 'alice@example.com'
		});
		check = '';
	}

	async function copy(key: string, value: string) {
		await copyText(value);
		copied = key;
		setTimeout(() => {
			if (copied === key) copied = '';
		}, 1200);
	}

	const fromUri = $derived(info?.source === 'uri' || /^\s*otpauth:/i.test(input));
	const selectCls =
		'rounded-lg border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg focus:border-accent';
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('totpInput')}
		placeholder="JBSW Y3DP EHPK 3PXP · otpauth://totp/Issuer:me@example.com?secret=…"
		{badge}
		rows={2}
		error={result && !result.ok ? { message: result.error, line: result.line, column: result.column } : null}
		onsample={() => (input = SAMPLE)}
	/>

	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		{#if fromUri}
			<span class="text-dim">{tt('totpFromUri')}</span>
		{:else}
			<Segmented
				label={tt('totpType')}
				bind:value={type}
				options={[
					{ value: 'totp', label: 'TOTP' },
					{ value: 'hotp', label: 'HOTP' }
				]}
			/>
			<label class="flex items-center gap-2 text-dim">
				{tt('totpAlgorithm')}
				<select bind:value={algorithm} class={selectCls}>
					{#each OTP_ALGORITHMS as a (a)}<option value={a}>{a}</option>{/each}
				</select>
			</label>
			<label class="flex items-center gap-2 text-dim">
				{tt('totpDigits')}
				<select bind:value={digits} class={selectCls}>
					{#each OTP_DIGITS as d (d)}<option value={d}>{d}</option>{/each}
				</select>
			</label>
			{#if type === 'totp'}
				<label class="flex items-center gap-2 text-dim">
					{tt('totpPeriod')}
					<input type="number" bind:value={period} min="1" max="86400" class="w-20 {selectCls}" />
				</label>
			{:else}
				<label class="flex items-center gap-2 text-dim">
					{tt('totpCounter')}
					<input type="number" bind:value={counter} min="0" class="w-24 {selectCls}" />
				</label>
			{/if}
		{/if}
		<button
			type="button"
			onclick={newSecret}
			class="ml-auto flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors duration-120 hover:border-accent/50"
		>
			<RefreshCw size={13} /> {tt('totpNewSecret')}
		</button>
	</div>

	{#if params && current}
		<div class="rounded-lg border border-line bg-surface px-4 py-3">
			<div class="flex flex-wrap items-end justify-between gap-3">
				<div>
					<span class="text-xs font-medium tracking-wide text-dim uppercase">{tt('totpCurrent')}</span>
					<div class="flex items-center gap-2">
						<output class="font-mono text-3xl tracking-[0.15em] tabular-nums" aria-live="polite">{current.code}</output>
						<button
							type="button"
							class="rounded-md p-1.5 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
							onclick={() => copy('code', current.code)}
							aria-label="Copy {tt('totpCurrent')}"
						>
							{#if copied === 'code'}<Check size={15} class="text-ok" />{:else}<Copy size={15} />{/if}
						</button>
					</div>
				</div>
				<dl class="flex gap-5 font-mono text-sm">
					<div>
						<dt class="font-sans text-xs text-dim">{tt('totpPrev')}</dt>
						<dd class="tabular-nums text-dim">{prev?.code ?? '—'}</dd>
					</div>
					<div>
						<dt class="font-sans text-xs text-dim">{tt('totpNext')}</dt>
						<dd class="tabular-nums text-dim">{next?.code ?? '—'}</dd>
					</div>
				</dl>
			</div>
			{#if isTotp}
				<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
					<div
						class="h-full rounded-full transition-[width] duration-1000 ease-linear {left <= 5 ? 'bg-warn' : 'bg-accent'}"
						style="width: {(left / params.period) * 100}%"
					></div>
				</div>
				<p class="mt-1.5 text-[11px] text-dim tabular-nums">{tt('totpRefresh', { s: left })}</p>
			{:else}
				<p class="mt-1.5 text-[11px] text-dim">{tt('totpHotpNote')}</p>
			{/if}
		</div>

		<div>
			<label for="totp-check" class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('totpCheck')}</label>
			<input
				id="totp-check"
				type="text"
				inputmode="numeric"
				autocomplete="off"
				spellcheck="false"
				bind:value={check}
				placeholder={tt('totpCheckPlaceholder')}
				class="w-full max-w-xs rounded-lg border border-line bg-surface-2 px-3 py-1.5 font-mono text-sm text-fg focus:border-accent"
			/>
			{#if matchText}
				<p class="mt-1.5 text-sm {match === null ? 'text-err' : match === 0 ? 'text-ok' : 'text-warn'}" aria-live="polite">
					{match === null ? '✕' : match === 0 ? '✓' : '⚠'} {matchText}
				</p>
			{/if}
		</div>
	{/if}

	{#if info && info.warnings.length}
		<ul class="space-y-1 text-sm text-warn">
			{#each info.warnings as w (w)}<li>⚠ {warningText[w]()}</li>{/each}
		</ul>
	{/if}

	<OutputPanel value={uri} filename="otpauth.txt">
		{#if params}
			<table class="w-full font-mono text-sm">
				<tbody>
					{#each rows as [key, value] (key)}
						<tr class="border-b border-line/50 last:border-0">
							<th scope="row" class="py-1.5 pr-4 text-left align-top font-sans font-normal whitespace-nowrap text-dim">{key}</th>
							<td class="py-1.5 break-all">{value}</td>
							<td class="w-8 py-1.5 text-right align-top">
								<button
									type="button"
									class="rounded-md p-1 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
									onclick={() => copy(key, value)}
									aria-label="Copy {key}"
								>
									{#if copied === key}<Check size={13} class="text-ok" />{:else}<Copy size={13} />{/if}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<EmptyState hint={tt('totpEmpty')} />
		{/if}
	</OutputPanel>
	<p class="text-xs text-dim">{tt('totpPrivacy')}</p>
</div>

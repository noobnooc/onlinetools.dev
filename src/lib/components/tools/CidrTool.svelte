<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import EmptyState from '../EmptyState.svelte';
	import { aggregateCidrs, analyzeCidr, blockContains, isCidrList, splitBlock } from '$lib/tools/cidr';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';
	import { Copy, Check } from 'lucide-svelte';

	/** Rows shown when splitting — enough to plan with, cheap to render. */
	const SPLIT_LIMIT = 256;

	let input = $state('');
	let probe = $state('');
	let exclude = $state('');
	let splitTo = $state<number | null>(null);
	let copied = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.probe) probe = s.probe;
		if (s.exclude) exclude = s.exclude;
		if (s.split && /^\d{1,3}$/.test(s.split)) splitTo = Number(s.split);
	});

	// More than one entry, or anything to exclude, turns the calculator into a
	// list aggregator: merge everything, subtract the exclusions.
	const listMode = $derived(input.trim() !== '' && (isCidrList(input) || exclude.trim() !== ''));
	const listResult = $derived(listMode ? aggregateCidrs(input, exclude) : null);
	const list = $derived(listResult?.ok ? listResult.value : null);
	const listSummary = $derived.by(() => {
		if (!list) return '';
		let head = tt('cidrEntries', { n: list.entries });
		if (list.excluded) head += ` − ${tt('cidrExcludedN', { n: list.excluded })}`;
		const parts = [`${head} → ${tt('cidrBlocks', { n: list.cidrs.length })}`];
		if (list.v4.cidrs) parts.push(`IPv4 ${tt('cidrTotal')}: ${list.v4.total}`);
		if (list.v6.cidrs) parts.push(`IPv6 ${tt('cidrTotal')}: ${list.v6.total}`);
		return parts.join(' · ');
	});
	const result = $derived(input.trim() === '' || listMode ? null : analyzeCidr(input));
	const info = $derived(result?.ok ? result.value : null);
	const blk = $derived(info?.kind === 'block' ? info : null);
	const range = $derived(info?.kind === 'range' ? info : null);

	const maxPrefix = $derived(blk ? (blk.version === 4 ? 32 : 128) : 32);
	// Default split: one step finer than the block (a /16 into /24s, a /48 into /64s).
	const splitPrefix = $derived.by(() => {
		if (!blk) return 0;
		if (splitTo !== null && splitTo >= blk.prefix && splitTo <= maxPrefix) return splitTo;
		const step = blk.version === 4 ? 8 : 16;
		return Math.min(maxPrefix, Math.max(blk.prefix, Math.ceil((blk.prefix + 1) / step) * step));
	});
	const split = $derived(blk && blk.prefix < maxPrefix ? splitBlock(blk, splitPrefix, SPLIT_LIMIT) : null);
	const subnets = $derived(split?.ok ? split.value : null);

	const membership = $derived(blk && probe.trim() !== '' ? blockContains(blk, probe) : null);

	const rows = $derived.by((): Array<[string, string]> => {
		if (!blk) return [];
		const out: Array<[string, string]> = [];
		if (blk.hostBitsSet) out.push([tt('cidrAddress'), blk.address]);
		out.push([tt('cidrNetwork'), `${blk.network}/${blk.prefix}`]);
		out.push([blk.version === 4 ? tt('cidrBroadcast') : tt('cidrLastAddr'), blk.last]);
		if (blk.netmask && blk.wildcard) {
			out.push([tt('cidrNetmask'), blk.netmask]);
			out.push([tt('cidrWildcard'), blk.wildcard]);
		}
		out.push([tt('cidrFirstHost'), blk.firstHost]);
		out.push([tt('cidrLastHost'), blk.lastHost]);
		out.push([tt('cidrTotal'), blk.total]);
		out.push([tt('cidrUsable'), blk.usable]);
		out.push([tt('cidrScope'), blk.scope.ref ? `${blk.scope.name} · ${blk.scope.ref}` : blk.scope.name]);
		if (blk.expanded) out.push([tt('cidrExpanded'), blk.expanded]);
		out.push([tt('cidrInteger'), blk.integer]);
		out.push([tt('nbHex'), blk.hex]);
		out.push([tt('cidrBinary'), blk.binary]);
		out.push([tt('cidrReverse'), blk.reverse]);
		return out;
	});

	const output = $derived.by(() => {
		if (list) return list.cidrs.join('\n');
		if (range) return range.cidrs.join('\n');
		return rows.map(([k, v]) => `${k}: ${v}`).join('\n');
	});

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (listMode) {
			if (!list) return [{ text: 'invalid', tone: 'err' }];
			const out: BadgeSegment[] = [{ text: tt('cidrEntries', { n: list.entries }), tone: 'accent' }];
			if (list.errors.length) out.push({ text: tt('cidrSkipped', { n: list.errors.length }), tone: 'warn' });
			return out;
		}
		if (!info) return [{ text: 'invalid', tone: 'err' }];
		if (info.kind === 'range') return [{ text: `IPv${info.version} range`, tone: 'accent' }];
		return [
			{ text: `IPv${info.version} /${info.prefix}`, tone: 'accent' },
			{ text: info.scope.name, tone: 'dim' }
		];
	});

	async function copyRow(key: string, value: string) {
		await copyText(value);
		copied = key;
		setTimeout(() => {
			if (copied === key) copied = '';
		}, 1200);
	}

	const shareState = $derived.by(() => {
		if (input.trim() === '') return null;
		const s: Record<string, string> = { input };
		if (probe.trim()) s.probe = probe;
		if (exclude.trim()) s.exclude = exclude;
		if (splitTo !== null) s.split = String(splitTo);
		return s;
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('cidrInput')}
		placeholder="192.168.1.0/24 · 2001:db8::/48 · 10.0.0.1 - 10.0.0.99"
		{badge}
		rows={listMode ? 6 : 2}
		error={listResult && !listResult.ok
			? { message: listResult.error }
			: result && !result.ok
				? { message: result.error }
				: null}
		onsample={() => (input = '10.20.0.0/16')}
	/>

	{#if blk?.hostBitsSet}
		<p class="text-sm text-warn">{tt('cidrHostBits', { net: `${blk.network}/${blk.prefix}` })}</p>
	{/if}

	<OutputPanel value={output} filename={range || list ? 'cidrs.txt' : 'subnet.txt'} {shareState}>
		{#if list}
			<p class="mb-2 text-sm text-dim">{listSummary}</p>
			{#if list.cidrs.length}
				<ul class="space-y-0.5 font-mono text-sm">
					{#each list.cidrs as c (c)}<li>{c}</li>{/each}
				</ul>
			{:else}
				<p class="text-sm text-warn">{tt('cidrNothingLeft')}</p>
			{/if}
			{#if list.errors.length}
				<ul class="mt-3 space-y-0.5 text-sm text-warn">
					{#each list.errors as e (e.source + e.line + e.entry)}
						<li>
							{e.source === 'exclude' ? tt('cidrExcludeLine', { n: e.line }) : tt('cidrLine', { n: e.line })}:
							<code class="font-mono">{e.entry}</code> — {e.message}
						</li>
					{/each}
				</ul>
			{/if}
		{:else if blk}
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
									onclick={() => copyRow(key, value)}
									aria-label="Copy {key}"
								>
									{#if copied === key}<Check size={13} class="text-ok" />{:else}<Copy size={13} />{/if}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if range}
			<p class="mb-2 text-sm text-dim">
				{range.start} → {range.end} · {tt('cidrTotal')}: {range.total} · {tt('cidrBlocks', { n: range.cidrs.length })}
			</p>
			<ul class="space-y-0.5 font-mono text-sm">
				{#each range.cidrs as c (c)}<li>{c}</li>{/each}
			</ul>
		{:else}
			<EmptyState hint={tt('cidrEmpty')} />
		{/if}
	</OutputPanel>

	{#if blk}
		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-lg border border-line bg-surface p-3">
				<label for="cidr-probe" class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('cidrCheck')}</label>
				<input
					id="cidr-probe"
					type="text"
					bind:value={probe}
					spellcheck="false"
					autocomplete="off"
					placeholder={blk.version === 4 ? blk.lastHost : blk.firstHost}
					class="w-full rounded-lg border border-line bg-surface-2 px-2 py-1.5 font-mono text-sm text-fg focus:border-accent"
				/>
				{#if membership}
					<p class="mt-2 text-sm" aria-live="polite">
						{#if !membership.ok}
							<span class="text-err">{membership.error}</span>
						{:else if membership.value}
							<span class="text-ok">✓ {tt('cidrInside')}</span>
						{:else}
							<span class="text-err">✗ {tt('cidrOutside')}</span>
						{/if}
					</p>
				{/if}
			</div>

			{#if blk.prefix < maxPrefix}
				<div class="rounded-lg border border-line bg-surface p-3">
					<div class="mb-1.5 flex items-center justify-between gap-2">
						<label for="cidr-split" class="text-xs font-medium tracking-wide text-dim uppercase">{tt('cidrSplit')}</label>
						<span class="flex items-center gap-1 font-mono text-sm">
							/<input
								id="cidr-split"
								type="number"
								min={blk.prefix}
								max={maxPrefix}
								value={splitPrefix}
								oninput={(e) => {
									const v = Number(e.currentTarget.value);
									if (Number.isInteger(v)) splitTo = v;
								}}
								class="w-16 rounded-lg border border-line bg-surface-2 px-2 py-1 font-mono text-sm text-fg focus:border-accent"
							/>
						</span>
					</div>
					{#if split && !split.ok}
						<p class="text-sm text-err">{split.error}</p>
					{:else if subnets}
						<p class="mb-1 text-xs text-dim">
							{tt('cidrSubnets', { n: subnets.count })}{#if BigInt(subnets.count) > BigInt(subnets.subnets.length)}
								· {tt('cidrShowing', { n: subnets.subnets.length })}{/if}
						</p>
						<ul class="max-h-48 overflow-y-auto font-mono text-sm">
							{#each subnets.subnets as s (s)}<li>{s}</li>{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	{#if input.trim() !== ''}
		<div class="rounded-lg border border-line bg-surface p-3">
			<label for="cidr-exclude" class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('cidrExclude')}</label>
			<textarea
				id="cidr-exclude"
				bind:value={exclude}
				rows="2"
				spellcheck="false"
				autocomplete="off"
				placeholder="192.168.0.0/16, 10.0.0.0/8"
				class="w-full resize-y rounded-lg border border-line bg-surface-2 px-2 py-1.5 font-mono text-sm text-fg focus:border-accent"
			></textarea>
			<p class="mt-1 text-xs text-dim">{tt('cidrExcludeHint')}</p>
		</div>
	{/if}
</div>

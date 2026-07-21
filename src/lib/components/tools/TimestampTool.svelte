<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { parseTimestamp } from '$lib/tools/timestamp';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let now = $state(Date.now());

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(t);
	});

	const result = $derived(input.trim() === '' ? null : parseTimestamp(input, now));
	const info = $derived(result?.ok ? result.value : null);

	const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const ZONES: Array<{ tz: string; label: string }> = [
		{ tz: 'UTC', label: 'UTC' },
		{ tz: 'America/Los_Angeles', label: 'Los Angeles' },
		{ tz: 'America/New_York', label: 'New York' },
		{ tz: 'Europe/London', label: 'London' },
		{ tz: 'Europe/Berlin', label: 'Berlin' },
		{ tz: 'Asia/Shanghai', label: 'Shanghai' },
		{ tz: 'Asia/Tokyo', label: 'Tokyo' }
	];

	interface ZoneRow {
		label: string;
		time: string;
		date: string;
		/** Fractional hour of day 0..24 for the day-strip marker. */
		hourOfDay: number;
		dayDelta: number;
		isLocal: boolean;
	}

	function zoneRows(epochMs: number): ZoneRow[] {
		const d = new Date(epochMs);
		const zones = [{ tz: localTz, label: `${localTz.split('/').pop()?.replace(/_/g, ' ')} (local)` },
			...ZONES.filter((z) => z.tz !== localTz)];
		const isoDay = (tz: string) =>
			new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
		const localDay = isoDay(localTz);
		return zones.map((z, i) => {
			const parts = new Intl.DateTimeFormat('en-GB', {
				timeZone: z.tz,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
			}).formatToParts(d);
			const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
			const hour = Number(get('hour')) % 24;
			const minute = Number(get('minute'));
			const date = new Intl.DateTimeFormat('en-US', {
				timeZone: z.tz,
				weekday: 'short',
				month: 'short',
				day: 'numeric'
			}).format(d);
			const zoneDay = isoDay(z.tz);
			// ISO dates compare lexicographically, so this yields the day offset sign.
			const dayDelta = zoneDay === localDay ? 0 : zoneDay > localDay ? 1 : -1;
			return {
				label: z.label,
				time: `${get('hour')}:${get('minute')}:${get('second')}`,
				date,
				hourOfDay: hour + minute / 60,
				dayDelta,
				isLocal: i === 0
			};
		});
	}

	const zones = $derived(info ? zoneRows(info.epochMs) : []);

	const rows = $derived(
		info
			? ([
					['ISO 8601', info.iso],
					['UTC', info.utc],
					[tt('tsRelative'), info.relative],
					[tt('tsUnixS'), String(info.unixSeconds)],
					[tt('tsUnixMs'), String(info.unixMilliseconds)]
				] as Array<[string, string]>)
			: []
	);

	const output = $derived(
		info
			? [...rows.map(([k, v]) => `${k}: ${v}`), '', ...zones.map((z) => `${z.label}: ${z.date} ${z.time}`)].join('\n')
			: ''
	);

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (!info) return [];
		return [
			{ text: info.unit === 'seconds' ? 'unix · s' : info.unit === 'milliseconds' ? 'unix · ms' : info.unit, tone: 'accent' },
			{ text: 'valid', tone: 'ok' }
		];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('tsInput')}
		placeholder="1700000000 · 1700000000000 · 2026-07-20T12:00:00Z"
		{badge}
		rows={2}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = String(Math.floor(now / 1000)))}
	/>
	<p class="font-mono text-xs text-dim">
		{tt('tsNow')} <button
			type="button"
			class="text-accent hover:underline"
			onclick={() => (input = String(Math.floor(now / 1000)))}
			title={tt('tsNowT')}>{Math.floor(now / 1000)}</button
		>
	</p>

	{#if info}
		<div class="overflow-hidden rounded-lg border border-line">
			<table class="w-full font-mono text-sm">
				<tbody>
					{#each rows as [key, val] (key)}
						<tr class="border-b border-line/60 bg-surface">
							<th scope="row" class="py-1.5 pr-4 pl-3 text-left font-normal whitespace-nowrap text-dim">{key}</th>
							<td class="py-1.5 pr-3 break-all">{val}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Timezone comparison with a 24h day-strip per zone -->
		<div>
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('tsZones')}</span>
			<div class="overflow-hidden rounded-lg border border-line">
				{#each zones as z (z.label)}
					<div
						class="grid grid-cols-[minmax(7rem,1fr)_auto_minmax(6rem,2fr)] items-center gap-3 border-b border-line/60 px-3 py-2 last:border-0
							{z.isLocal ? 'bg-surface-2/60' : 'bg-surface'}"
					>
						<span class="truncate text-sm {z.isLocal ? 'font-medium' : 'text-dim'}">{z.label}</span>
						<span class="text-right font-mono text-sm tabular-nums">
							{z.time}
							<span class="ml-1 text-[11px] text-dim">{z.date}</span>
							{#if z.dayDelta !== 0}
								<span class="ml-1 rounded border border-line px-1 text-[10px] text-warn">{z.dayDelta > 0 ? '+1d' : '−1d'}</span>
							{/if}
						</span>
						<!-- Day strip: 24h bar, night dimmed, marker at the zone's local time -->
						<div class="relative hidden h-2 rounded-full bg-surface-2 sm:block" aria-hidden="true">
							<div class="absolute inset-y-0 rounded-l-full bg-line/40" style="left: 0; width: {(7 / 24) * 100}%"></div>
							<div class="absolute inset-y-0 rounded-r-full bg-line/40" style="left: {(21 / 24) * 100}%; right: 0"></div>
							<div
								class="absolute top-1/2 h-3 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
								style="left: {(z.hourOfDay / 24) * 100}%"
							></div>
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-1.5 text-[11px] text-dim/70">
				{tt('tsNote')}
			</p>
		</div>
	{/if}

	<OutputPanel value={output} filename="timestamp.txt" shareState={input.trim() === '' ? null : { input }} />
</div>

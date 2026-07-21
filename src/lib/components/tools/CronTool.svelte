<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import { parseCron, nextRuns } from '$lib/tools/cron';
	import { formatRelative } from '$lib/tools/timestamp';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let now = $state(Date.now());

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 30_000);
		return () => clearInterval(t);
	});

	const result = $derived(input.trim() === '' ? null : parseCron(input));
	const cron = $derived(result?.ok ? result.value : null);
	const runs = $derived(cron ? nextRuns(cron, now, 5) : []);

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const fmt = new Intl.DateTimeFormat(undefined, {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	$effect(() => {
		currentResult.text = cron
			? `${cron.description}\n\nNext runs (${timezone}):\n${runs.map((r) => new Date(r).toISOString()).join('\n')}`
			: '';
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!cron) return [{ text: 'invalid', tone: 'err' }];
		return [{ text: 'cron', tone: 'accent' }, { text: 'valid', tone: 'ok' }];
	});

	const PRESETS: Array<[string, string]> = [
		['*/15 * * * *', 'every 15 min'],
		['0 * * * *', 'hourly'],
		['0 3 * * *', 'daily 03:00'],
		['30 9 * * 1-5', 'weekdays 09:30'],
		['0 0 1 * *', 'monthly'],
		['@weekly', 'weekly']
	];
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('cronInput')}
		placeholder="*/15 9-17 * * 1-5"
		{badge}
		rows={1}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = '30 9 * * 1-5')}
	/>
	<div class="flex flex-wrap gap-1.5">
		{#each PRESETS as [expr, label] (expr)}
			<button
				type="button"
				class="rounded-md border border-line px-2 py-1 font-mono text-xs text-dim transition-colors duration-120 hover:border-accent/50 hover:text-fg"
				onclick={() => (input = expr)}
				title={label}>{expr}</button
			>
		{/each}
	</div>

	{#if cron}
		<p class="rounded-lg border border-line bg-surface px-4 py-3 text-sm">
			{cron.description}
			<span class="text-dim"> — {tt('cronEvalIn')} {timezone}</span>
		</p>

		<div class="grid grid-cols-1 gap-2 sm:grid-cols-5">
			{#each cron.fields as field (field.name)}
				<div class="rounded-lg border border-line bg-surface px-3 py-2">
					<span class="block text-[11px] tracking-wide text-dim uppercase">{field.name}</span>
					<span class="mt-0.5 block font-mono text-lg text-accent">{field.raw}</span>
					<span class="block truncate font-mono text-[11px] text-dim" title={field.any ? 'every value' : field.values.join(', ')}>
						{field.any
							? 'every value'
							: field.values.length > 6
								? `${field.values.slice(0, 6).join(',')}… (${field.values.length})`
								: field.values.join(', ')}
					</span>
					<!-- Coverage strip: which part of the field's range is selected -->
					<div class="mt-1.5 flex h-1 gap-px overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
						{#each Array.from({ length: 24 }, (_, i) => i) as slot (slot)}
							{@const lo = field.min + ((field.max - field.min + 1) * slot) / 24}
							{@const hi = field.min + ((field.max - field.min + 1) * (slot + 1)) / 24}
							<div
								class="grow {field.values.some((v) => v >= lo && v < hi) ? 'bg-accent/70' : ''}"
							></div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<div>
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('cronNext')}</span>
			<ol class="overflow-hidden rounded-lg border border-line">
				{#each runs as run, i (run)}
					<li class="flex items-center justify-between gap-3 border-b border-line/60 bg-surface px-4 py-2.5 last:border-0">
						<span class="flex items-center gap-3">
							<span class="font-mono text-xs text-dim">#{i + 1}</span>
							<span class="font-mono text-sm">{fmt.format(new Date(run))}</span>
						</span>
						<span class="font-mono text-xs text-dim">{formatRelative(run - now)}</span>
					</li>
				{:else}
					<li class="px-4 py-3 text-sm text-dim">{tt('cronNone')}</li>
				{/each}
			</ol>
		</div>
	{/if}
</div>

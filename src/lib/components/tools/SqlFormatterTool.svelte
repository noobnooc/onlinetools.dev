<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { formatSql, minifySql, SQL_DIALECTS, type SqlDialect } from '$lib/tools/sqlformat';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let mode = $state<'format' | 'minify'>('format');
	let dialect = $state<SqlDialect>('sql');
	let keywordCase = $state<'upper' | 'lower' | 'preserve'>('upper');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.mode === 'format' || s.mode === 'minify') mode = s.mode;
		if (SQL_DIALECTS.some((d) => d.value === s.dialect)) dialect = s.dialect as SqlDialect;
	});

	const result = $derived.by(() => {
		if (input.trim() === '') return null;
		return mode === 'format'
			? formatSql(input, { dialect, keywordCase, indent: 2 })
			: minifySql(input);
	});
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		return result?.ok
			? [{ text: 'SQL', tone: 'accent' }, { text: 'ok', tone: 'ok' }]
			: [{ text: 'error', tone: 'err' }];
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={mode}
			label={tt('mode')}
			options={[
				{ value: 'format', label: tt('fmtFormat') },
				{ value: 'minify', label: tt('fmtMinify') }
			]}
		/>
		{#if mode === 'format'}
			<div class="flex items-center gap-2 text-dim">
				{tt('sqlDialect')}
				<select
					bind:value={dialect}
					class="rounded-lg border border-line bg-surface-2 px-2 py-1.5 text-sm text-fg focus:border-accent"
				>
					{#each SQL_DIALECTS as d (d.value)}
						<option value={d.value}>{d.label}</option>
					{/each}
				</select>
			</div>
			<Segmented
				bind:value={keywordCase}
				label={tt('sqlKeywords')}
				options={[
					{ value: 'upper', label: 'SELECT' },
					{ value: 'lower', label: 'select' },
					{ value: 'preserve', label: tt('sqlKeep') }
				]}
			/>
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={tt('sqlInput')}
		placeholder="select id, name from users where active = true order by name"
		{badge}
		rows={9}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				"select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = true and u.created_at > '2026-01-01' group by u.id, u.name having count(o.id) > 3 order by orders desc limit 20")}
	/>
	<OutputPanel
		value={output}
		label="Output · SQL"
		filename={mode === 'minify' ? 'query.min.sql' : 'query.sql'}
		shareState={input.trim() === '' ? null : { input, mode, dialect }}
	/>
</div>

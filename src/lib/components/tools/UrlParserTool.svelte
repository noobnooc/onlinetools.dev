<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import EmptyState from '../EmptyState.svelte';
	import { parseUrl } from '$lib/tools/url';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const result = $derived(input.trim() === '' ? null : parseUrl(input));
	const url = $derived(result?.ok ? result.value : null);

	const parts = $derived(
		url
			? ([
					['Protocol', url.protocol],
					['Host', url.host],
					['Hostname', url.hostname],
					['Port', url.port || '(default)'],
					['Path', url.pathname],
					['Fragment', url.hash || '(none)'],
					['Origin', url.origin]
				] as Array<[string, string]>)
			: []
	);

	const output = $derived(
		url
			? [...parts.map(([k, v]) => `${k}: ${v}`), '', 'Query parameters:', ...url.params.map((p) => `  ${p.key} = ${p.value}`)].join('\n')
			: ''
	);

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!url) return [{ text: 'invalid URL', tone: 'err' }];
		return [
			{ text: 'URL', tone: 'accent' },
			{ text: `${url.params.length} param${url.params.length === 1 ? '' : 's'}` },
			{ text: 'valid', tone: 'ok' }
		];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="URL"
		placeholder="https://example.com/path?query=value#fragment"
		{badge}
		rows={3}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input =
				'https://shop.example.com:8443/products/search?q=mechanical%20keyboard&sort=price&tag=hotswap&tag=rgb&page=2#reviews')}
	/>
	<OutputPanel value={output} filename="url-parts.txt" shareState={input.trim() === '' ? null : { input }}>
		{#if url}
			<table class="w-full font-mono text-sm">
				<tbody>
					{#each parts as [key, val] (key)}
						<tr class="border-b border-line/50">
							<th scope="row" class="py-1.5 pr-4 text-left font-normal whitespace-nowrap text-dim">{key}</th>
							<td class="py-1.5 break-all">{val}</td>
						</tr>
					{/each}
					{#if url.params.length > 0}
						<tr><td colspan="2" class="pt-3 pb-1 text-xs tracking-wide text-dim uppercase">Query parameters</td></tr>
						{#each url.params as p, i (i)}
							<tr class="border-b border-line/50 last:border-0">
								<th scope="row" class="py-1.5 pr-4 text-left font-normal break-all text-accent">{p.key}</th>
								<td class="py-1.5 break-all">{p.value}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		{:else}
			<EmptyState hint="URL components appear here" />
		{/if}
	</OutputPanel>
</div>

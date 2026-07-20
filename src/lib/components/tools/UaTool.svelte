<script lang="ts">
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import { parseUserAgent } from '$lib/tools/useragent';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { Globe, Cpu, MonitorSmartphone, Cog } from 'lucide-svelte';

	let input = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
	});

	const result = $derived(input.trim() === '' ? null : parseUserAgent(input));
	const ua = $derived(result?.ok ? result.value : null);

	const output = $derived(
		ua
			? `Browser: ${ua.browser.name} ${ua.browser.version}\nEngine: ${ua.engine.name} ${ua.engine.version}\nOS: ${ua.os.name} ${ua.os.version}\nDevice: ${ua.device.type} ${ua.device.vendor} ${ua.device.model}\nCPU: ${ua.cpu.architecture}`
			: ''
	);

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!ua) return [{ text: 'unrecognized', tone: 'err' }];
		return [{ text: 'User-Agent', tone: 'accent' }, { text: ua.browser.name, tone: 'ok' }];
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label="User-Agent string"
		placeholder="Mozilla/5.0 (…) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
		{badge}
		rows={3}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = navigator.userAgent)}
	/>
	{#if ua}
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each [
				{ icon: Globe, label: 'Browser', main: ua.browser.name, sub: ua.browser.version },
				{ icon: Cog, label: 'Engine', main: ua.engine.name, sub: ua.engine.version },
				{ icon: MonitorSmartphone, label: 'Operating system', main: ua.os.name, sub: ua.os.version },
				{ icon: Cpu, label: 'Device', main: ua.device.type, sub: `${ua.device.vendor} ${ua.device.model} · ${ua.cpu.architecture}` }
			] as card (card.label)}
				{@const Icon = card.icon}
				<div class="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3">
					<span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-dim">
						<Icon size={15} />
					</span>
					<div class="min-w-0">
						<span class="block text-[11px] tracking-wide text-dim uppercase">{card.label}</span>
						<span class="block truncate text-sm font-medium">{card.main}</span>
						<span class="block truncate font-mono text-xs text-dim">{card.sub}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<OutputPanel value={output} filename="user-agent.txt" shareState={input.trim() === '' ? null : { input }} />
	<p class="text-xs text-dim">
		The “Sample” button inserts your own browser's User-Agent. Use feature detection, not UA sniffing,
		for runtime decisions.
	</p>
</div>

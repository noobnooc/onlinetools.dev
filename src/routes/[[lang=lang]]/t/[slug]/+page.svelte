<script lang="ts">
	import ToolShell from '$lib/components/ToolShell.svelte';
	import { TOOL_COMPONENTS } from '$lib/components/tools';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const loader = $derived(TOOL_COMPONENTS[data.tool.slug]);
</script>

{#key data.tool.slug}
	<ToolShell tool={data.tool} content={data.content}>
		{#await loader()}
			<div class="flex min-h-40 items-center justify-center rounded-lg border border-line bg-surface">
				<span class="font-mono text-sm text-dim/60">loading…</span>
			</div>
		{:then module}
			{@const ToolComponent = module.default}
			<ToolComponent />
		{/await}
	</ToolShell>
{/key}

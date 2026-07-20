<script lang="ts">
	import ToolShell from '$lib/components/ToolShell.svelte';
	import { TOOL_COMPONENTS } from '$lib/components/tools';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const ToolComponent = $derived(TOOL_COMPONENTS[data.tool.slug]);
</script>

{#key data.tool.slug}
	<ToolShell tool={data.tool} content={data.content}>
		<ToolComponent />
	</ToolShell>
{/key}

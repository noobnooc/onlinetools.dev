<script lang="ts">
	import type { ToolMeta } from '$lib/tools/registry';

	interface Props {
		tool: ToolMeta;
	}

	let { tool }: Props = $props();
</script>

<a
	href="/t/{tool.slug}"
	class="group block rounded-lg border border-line bg-surface p-3 transition-colors duration-120 hover:border-accent/50"
>
	<span class="block text-sm font-medium group-hover:text-accent">{tool.name}</span>
	<span class="mt-0.5 block text-xs leading-relaxed text-dim">{tool.description}</span>
</a>

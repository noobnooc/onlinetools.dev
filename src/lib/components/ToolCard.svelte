<script lang="ts">
	import type { ToolMeta } from '$lib/tools/registry';
	import { iconFor } from '$lib/tools/icons';
	import { lt, lp } from '$lib/i18n';
	import { ArrowRight } from 'lucide-svelte';

	interface Props {
		tool: ToolMeta;
	}

	let { tool }: Props = $props();

	const Icon = $derived(iconFor(tool.slug));
</script>

<a
	href={lp(`/t/${tool.slug}`)}
	class="group flex items-start gap-3 rounded-(--radius-lg) border border-line bg-surface p-3 transition-all duration-120 hover:-translate-y-px hover:border-accent/50 hover:shadow-md hover:shadow-black/5"
>
	<span
		class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-dim transition-colors duration-120 group-hover:border-accent/40 group-hover:text-accent"
	>
		<Icon size={15} />
	</span>
	<span class="min-w-0 grow">
		<span class="flex items-center gap-1 text-sm font-medium">
			<span class="truncate">{lt(tool).name}</span>
			<ArrowRight
				size={12}
				class="shrink-0 -translate-x-1 text-accent opacity-0 transition-all duration-120 group-hover:translate-x-0 group-hover:opacity-100"
			/>
		</span>
		<span class="mt-0.5 block text-xs leading-relaxed text-dim">{lt(tool).description}</span>
	</span>
</a>

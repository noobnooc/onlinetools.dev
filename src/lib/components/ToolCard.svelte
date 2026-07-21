<script lang="ts">
	import type { ToolMeta } from '$lib/tools/registry';
	import { iconFor } from '$lib/tools/icons';
	import { isFavorite } from '$lib/state/favorites.svelte';
	import { lt, lp } from '$lib/i18n';
	import FavoriteButton from './FavoriteButton.svelte';
	import { ArrowRight } from 'lucide-svelte';

	interface Props {
		tool: ToolMeta;
	}

	let { tool }: Props = $props();

	const Icon = $derived(iconFor(tool.slug));
	const active = $derived(isFavorite(tool.slug));
</script>

<div class="group relative transition-transform duration-120 hover:-translate-y-px">
	<a
		href={lp(`/t/${tool.slug}`)}
		class="flex items-start gap-3 rounded-(--radius-lg) border border-line bg-surface p-3 transition-all duration-120 group-hover:border-accent/50 group-hover:shadow-md group-hover:shadow-black/5"
	>
		<span
			class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-dim transition-colors duration-120 group-hover:border-accent/40 group-hover:text-accent"
		>
			<Icon size={15} />
		</span>
		<span class="min-w-0 grow">
			<span class="flex items-center gap-1 pe-5 text-sm font-medium">
				<span class="truncate">{lt(tool).name}</span>
				<ArrowRight
					size={12}
					class="shrink-0 -translate-x-1 text-accent opacity-0 transition-all duration-120 group-hover:translate-x-0 group-hover:opacity-100"
				/>
			</span>
			<span class="mt-0.5 block text-xs leading-relaxed text-dim">{lt(tool).description}</span>
		</span>
	</a>
	<FavoriteButton
		slug={tool.slug}
		size={13}
		class="absolute top-2.5 right-2.5 h-6 w-6 rounded-md {active
			? ''
			: 'opacity-0 group-hover:opacity-100 pointer-coarse:opacity-100 focus-visible:opacity-100'}"
	/>
</div>

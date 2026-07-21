<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { isFavorite, toggleFavorite } from '$lib/state/favorites.svelte';
	import { t } from '$lib/i18n';

	interface Props {
		slug: string;
		size?: number;
		class?: string;
	}

	let { slug, size = 14, class: cls = '' }: Props = $props();

	const active = $derived(isFavorite(slug));
</script>

<button
	type="button"
	onclick={() => toggleFavorite(slug)}
	aria-pressed={active}
	aria-label={active ? t('favoriteRemove') : t('favoriteAdd')}
	title={active ? t('favoriteRemove') : t('favoriteAdd')}
	class="flex shrink-0 items-center justify-center transition-colors duration-120 {active
		? 'text-accent'
		: 'text-dim hover:text-accent'} {cls}"
>
	<Star {size} class={active ? 'fill-current' : ''} />
</button>

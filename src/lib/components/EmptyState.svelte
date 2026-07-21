<script lang="ts">
	import { SquareDashed } from 'lucide-svelte';
	import { t } from '$lib/i18n';

	/** Quiet output-area placeholder shown before a tool has anything to say. */
	interface Props {
		hint?: string;
	}

	let { hint }: Props = $props();
</script>

<div class="flex min-h-20 flex-col items-center justify-center gap-2 py-4 select-none">
	<span
		class="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-line text-dim/50"
		aria-hidden="true"
	>
		<SquareDashed size={16} />
	</span>
	<p class="font-mono text-xs text-dim/60">{hint ?? t('emptyHint')}</p>
</div>

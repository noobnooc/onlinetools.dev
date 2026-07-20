<script lang="ts">
	/**
	 * Keycap — the one way keyboard hints are rendered site-wide.
	 * The inset bottom shadow gives it a subtle physical "key" edge.
	 */
	interface Props {
		keys: string;
		/** Slightly larger variant for dialogs. */
		size?: 'sm' | 'md';
	}

	let { keys, size = 'sm' }: Props = $props();
</script>

<kbd
	class="inline-block rounded-[5px] border border-line bg-surface-2 font-mono leading-none text-dim
		{size === 'sm' ? 'px-1.5 py-[3px] text-[11px]' : 'px-2 py-1 text-xs'}"
	style="box-shadow: inset 0 -1.5px 0 var(--border)"
>{keys}</kbd>

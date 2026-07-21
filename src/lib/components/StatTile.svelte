<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		hint?: string;
	}

	let { label, value, hint }: Props = $props();
</script>

<div class="rounded-lg border border-line bg-surface px-3 py-2.5">
	<span class="block text-[11px] tracking-wide text-dim uppercase">{label}</span>
	<span class="mt-0.5 block font-mono text-lg font-medium tabular-nums">{value}</span>
	{#if hint}<span class="block text-[11px] text-dim/70">{hint}</span>{/if}
</div>

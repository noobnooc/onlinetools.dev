<script lang="ts">
	/**
	 * Technical-drawing corner markers (the Attio-style "+" registration
	 * marks). Place inside a `relative` container.
	 */
</script>

{#each ['-top-[7px] -left-[7px]', '-top-[7px] -right-[7px]', '-bottom-[7px] -left-[7px]', '-bottom-[7px] -right-[7px]'] as pos (pos)}
	<span
		class="pointer-events-none absolute {pos} font-mono text-sm leading-none text-dim/40 select-none"
		aria-hidden="true">+</span
	>
{/each}

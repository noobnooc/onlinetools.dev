<script lang="ts">
	/** Uppercase section label with an accent tick — one consistent section voice. */
	interface Props {
		text: string;
		id?: string;
	}

	let { text, id }: Props = $props();
</script>

<span {id} class="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-dim uppercase">
	<span class="inline-block h-3 w-[3px] rounded-full bg-accent" aria-hidden="true"></span>
	{text}
</span>

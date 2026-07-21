<script lang="ts" generics="T extends string">
	import { tick } from 'svelte';

	/**
	 * Segmented control — the one way small enumerations are picked site-wide.
	 * A bordered pill; the active option is a raised gray segment. Options can
	 * be plain text or visual glyphs (mono) with a tooltip carrying the words.
	 */
	interface SegmentedOption<T extends string = string> {
		value: T;
		label: string;
		/** Tooltip / accessible name — required when the label is a glyph. */
		title?: string;
		/** Render the label in the mono font (glyphs like `,` `⇥` `··`). */
		mono?: boolean;
	}

	interface Props {
		options: Array<SegmentedOption<T>>;
		value: T;
		/** Accessible name of the group. */
		label: string;
	}

	let { options, value = $bindable(), label }: Props = $props();

	let root = $state<HTMLElement | null>(null);

	async function select(v: T) {
		value = v;
		await tick();
		root?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
	}

	function onkeydown(e: KeyboardEvent) {
		const dir =
			e.key === 'ArrowRight' || e.key === 'ArrowDown'
				? 1
				: e.key === 'ArrowLeft' || e.key === 'ArrowUp'
					? -1
					: 0;
		if (dir === 0) return;
		e.preventDefault();
		const idx = options.findIndex((o) => o.value === value);
		void select(options[(idx + dir + options.length) % options.length].value);
	}
</script>

<div
	bind:this={root}
	role="radiogroup"
	aria-label={label}
	class="inline-flex flex-wrap items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5"
>
	{#each options as opt (opt.value)}
		{@const active = value === opt.value}
		<button
			type="button"
			role="radio"
			aria-checked={active}
			aria-label={opt.title}
			title={opt.title}
			tabindex={active ? 0 : -1}
			{onkeydown}
			onclick={() => select(opt.value)}
			class="rounded-[6px] px-2.5 py-1 text-[12.5px] whitespace-nowrap transition-colors duration-120
				{opt.mono ? 'font-mono' : ''}
				{active ? 'bg-surface-2 font-medium text-fg' : 'text-dim hover:text-fg'}"
		>{opt.label}</button>
	{/each}
</div>

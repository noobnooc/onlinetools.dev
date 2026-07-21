<script lang="ts">
	import { t } from '$lib/i18n';

	/**
	 * The "live input" — the site-wide signature element. A small badge on the
	 * input's top edge reports the detected content type, size and validity in
	 * real time. Errors annotate inline (line:column), never in a dialog.
	 */
	export interface BadgeSegment {
		text: string;
		tone?: 'ok' | 'err' | 'warn' | 'dim' | 'accent';
	}

	interface Props {
		value: string;
		label: string;
		placeholder?: string;
		badge?: BadgeSegment[];
		error?: { message: string; line?: number; column?: number } | null;
		rows?: number;
		spellcheck?: boolean;
		onsample?: (() => void) | null;
		id?: string;
	}

	let {
		value = $bindable(),
		label,
		placeholder = '',
		badge = [],
		error = null,
		rows = 8,
		spellcheck = false,
		onsample = null,
		id = 'input-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
	}: Props = $props();

	const toneClass: Record<string, string> = {
		ok: 'text-ok',
		err: 'text-err',
		warn: 'text-warn',
		dim: 'text-dim',
		accent: 'text-accent'
	};
</script>

<div class="group relative">
	<div class="mb-1.5 flex items-baseline justify-between gap-2">
		<label for={id} class="text-xs font-medium tracking-wide text-dim uppercase">{label}</label>
		{#if onsample}
			<button
				type="button"
				class="text-xs text-dim transition-colors duration-120 hover:text-fg"
				onclick={onsample}>{t('sample')}</button
			>
		{/if}
	</div>
	<div class="relative">
		<textarea
			{id}
			bind:value
			{placeholder}
			{rows}
			{spellcheck}
			autocapitalize="off"
			autocomplete="off"
			class="w-full resize-y rounded-lg border bg-surface-2 px-3 py-2.5 font-mono text-sm leading-relaxed text-fg placeholder:text-dim/60 focus:border-accent
				{error ? 'border-err/60' : 'border-line'}"
		></textarea>
		{#if badge.length > 0}
			<div
				data-testid="input-badge"
				class="pointer-events-none absolute -top-2.5 right-3 flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11px] leading-4"
			>
				{#each badge as seg, i (i)}
					{#if i > 0}<span class="text-dim/50">·</span>{/if}
					<span class={toneClass[seg.tone ?? 'dim']}>{seg.text}</span>
				{/each}
			</div>
		{/if}
	</div>
	{#if error}
		<p class="mt-1.5 font-mono text-xs text-err" role="alert">
			{#if error.line !== undefined}
				<span class="opacity-70">{t('line')} {error.line}{error.column !== undefined ? `:${error.column}` : ''} —</span>
			{/if}
			{error.message}
		</p>
	{/if}
</div>

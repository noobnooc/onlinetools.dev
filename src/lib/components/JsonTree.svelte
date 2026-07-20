<script lang="ts">
	import JsonTree from './JsonTree.svelte';
	import { copyText } from '$lib/utils/format';
	import { ChevronRight, Copy } from 'lucide-svelte';

	interface Props {
		value: unknown;
		/** JSONPath of this node, e.g. "$.store.book[0]". */
		path?: string;
		keyLabel?: string | null;
		depth?: number;
	}

	let { value, path = '$', keyLabel = null, depth = 0 }: Props = $props();

	// svelte-ignore state_referenced_locally — the initial depth decides the default fold state
	let open = $state(depth < 2);
	let copied = $state(false);

	const isObject = $derived(value !== null && typeof value === 'object' && !Array.isArray(value));
	const isArray = $derived(Array.isArray(value));
	const entries = $derived.by((): Array<[string, unknown, string]> => {
		if (isArray) {
			return (value as unknown[]).map((v, i) => [String(i), v, `${path}[${i}]`]);
		}
		if (isObject) {
			return Object.entries(value as Record<string, unknown>).map(([k, v]) => [
				k,
				v,
				/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? `${path}.${k}` : `${path}[${JSON.stringify(k)}]`
			]);
		}
		return [];
	});

	async function copyPath(e: MouseEvent) {
		e.stopPropagation();
		if (await copyText(path)) {
			copied = true;
			setTimeout(() => (copied = false), 1200);
		}
	}

	function preview(v: unknown): string {
		if (typeof v === 'string') return JSON.stringify(v.length > 60 ? v.slice(0, 60) + '…' : v);
		return JSON.stringify(v);
	}
</script>

<div class="font-mono text-[13px] leading-6" style="padding-left: {depth === 0 ? 0 : 14}px">
	{#if isObject || isArray}
		<button
			type="button"
			class="group/node flex w-full items-center gap-1 rounded-sm text-left hover:bg-surface-2/60"
			onclick={() => (open = !open)}
			aria-expanded={open}
		>
			<ChevronRight
				size={12}
				class="shrink-0 text-dim transition-transform duration-120 {open ? 'rotate-90' : ''}"
			/>
			{#if keyLabel !== null}<span class="text-accent">{keyLabel}</span><span class="text-dim">:</span>{/if}
			<span class="text-dim">{isArray ? `[${entries.length}]` : `{${entries.length}}`}</span>
			<span
				role="button"
				tabindex="-1"
				class="ml-1 hidden items-center gap-1 text-[11px] text-dim/70 group-hover/node:inline-flex hover:text-fg"
				onclick={copyPath}
				onkeydown={(e) => e.key === 'Enter' && copyPath(e as unknown as MouseEvent)}
				title="Copy path {path}"
			>
				{#if copied}<span class="text-ok">copied</span>{:else}<Copy size={11} /> {path}{/if}
			</span>
		</button>
		{#if open}
			{#each entries as [k, v, childPath] (childPath)}
				<JsonTree value={v} path={childPath} keyLabel={isArray ? null : k} depth={depth + 1} />
			{/each}
		{/if}
	{:else}
		<div class="group/leaf flex items-baseline gap-1 rounded-sm pl-4 hover:bg-surface-2/60">
			{#if keyLabel !== null}<span class="text-accent">{keyLabel}</span><span class="text-dim">:</span>{/if}
			<span
				class={typeof value === 'string'
					? 'text-ok/90 break-all'
					: value === null
						? 'text-dim italic'
						: 'text-warn/90'}>{preview(value)}</span
			>
			<button
				type="button"
				class="hidden items-center gap-1 text-[11px] text-dim/70 group-hover/leaf:inline-flex hover:text-fg"
				onclick={copyPath}
				title="Copy path {path}"
			>
				{#if copied}<span class="text-ok">copied</span>{:else}<Copy size={11} /> {path}{/if}
			</button>
		</div>
	{/if}
</div>

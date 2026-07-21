<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { goto } from '$app/navigation';
	import { palette, getRecentTools, pushRecentTool } from '$lib/state/app.svelte';
	import { favorites, isFavorite } from '$lib/state/favorites.svelte';
	import { searchTools, TOOLS, TOOL_BY_SLUG, type ToolMeta } from '$lib/tools/registry';
	import { detect, type Detection } from '$lib/detect/detectors';
	import { encodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';
	import { t, lt, lp, locale } from '$lib/i18n';
	import { iconFor } from '$lib/tools/icons';
	import Kbd from './Kbd.svelte';
	import { Search, CornerDownLeft, Star, Zap } from 'lucide-svelte';

	interface Entry {
		kind: 'tool' | 'action';
		tool: ToolMeta;
		label: string;
		hint?: string;
		/** Content to preload into the tool (verb-style direct execution). */
		payload?: string;
	}

	let query = $state('');
	let selected = $state(0);
	let inputEl = $state<HTMLInputElement | null>(null);
	let listEl = $state<HTMLUListElement | null>(null);

	/** Keep the keyboard selection visible inside the scrolling list. */
	function scrollSelectedIntoView() {
		requestAnimationFrame(() => {
			listEl
				?.querySelector('[aria-selected="true"]')
				?.scrollIntoView({ block: 'nearest' });
		});
	}

	$effect(() => {
		if (palette.open) {
			query = palette.initialQuery;
			selected = 0;
			// Focus after the dialog content mounts.
			queueMicrotask(() => inputEl?.focus());
		}
	});

	const VERBS = /^(decode|encode|format|parse|convert|hash|diff|test)\s+/i;

	function detectionEntries(q: string): Entry[] {
		const candidates: Array<{ text: string; detections: Detection[] }> = [];
		const trimmed = q.trim();
		if (trimmed.length >= 4) {
			candidates.push({ text: trimmed, detections: detect(trimmed) });
			const stripped = trimmed.replace(VERBS, '');
			if (stripped !== trimmed) candidates.push({ text: stripped, detections: detect(stripped) });
		}
		const out: Entry[] = [];
		for (const { text, detections } of candidates) {
			for (const d of detections.slice(0, 2)) {
				for (const action of d.actions.slice(0, 1)) {
					const tool = TOOL_BY_SLUG.get(action.tool);
					if (!tool || out.some((e) => e.tool.slug === tool.slug)) continue;
					if (text.length > MAX_SHARED_INPUT) continue;
					out.push({
						kind: 'action',
						tool,
						label: `${action.label} ${d.label}`,
						hint: text.length > 40 ? text.slice(0, 40) + '…' : text,
						payload: text
					});
				}
			}
		}
		return out;
	}

	const entries = $derived.by((): Entry[] => {
		const actions = detectionEntries(query);
		let tools: ToolMeta[];
		if (query.trim() === '') {
			const favs = favorites.slugs
				.map((s) => TOOL_BY_SLUG.get(s))
				.filter((t): t is ToolMeta => t !== undefined);
			const recent = getRecentTools()
				.map((s) => TOOL_BY_SLUG.get(s))
				.filter((t): t is ToolMeta => t !== undefined && !favs.includes(t));
			const rest = TOOLS.filter((t) => !favs.includes(t) && !recent.includes(t));
			tools = [...favs, ...recent, ...rest];
		} else {
			tools = searchTools(query.trim().replace(VERBS, '').length > 0 ? query : query);
			// If the query looks like pure content (no tool matched), still show all-tool fallback.
			if (tools.length === 0 && actions.length === 0) tools = [];
		}
		// Localized names also match: merge tools whose translated name
		// contains the query (searchTools only knows the English fields).
		if (locale() !== 'en' && query.trim() !== '') {
			const q = query.trim().toLowerCase();
			for (const candidate of TOOLS) {
				if (!tools.includes(candidate) && lt(candidate).name.toLowerCase().includes(q)) {
					tools = [...tools, candidate];
				}
			}
		}
		const toolEntries: Entry[] = tools.map((tool) => ({
			kind: 'tool',
			tool,
			label: lt(tool).name,
			hint: lt(tool).description
		}));
		return [...actions, ...toolEntries].slice(0, 12);
	});

	$effect(() => {
		void entries;
		if (selected >= entries.length) selected = Math.max(0, entries.length - 1);
	});

	function run(entry: Entry) {
		palette.open = false;
		pushRecentTool(entry.tool.slug);
		const hash = entry.payload ? '#s=' + encodeState({ input: entry.payload }) : '';
		void goto(`${lp(`/t/${entry.tool.slug}`)}${hash}`);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selected = Math.min(selected + 1, entries.length - 1);
			scrollSelectedIntoView();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selected = Math.max(selected - 1, 0);
			scrollSelectedIntoView();
		} else if (e.key === 'Enter' && entries[selected]) {
			e.preventDefault();
			run(entries[selected]);
		}
	}
</script>

<Dialog.Root bind:open={palette.open}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/50" />
		<Dialog.Content
			class="fixed top-[15vh] left-1/2 z-50 w-[min(90vw,560px)] -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-surface shadow-xl shadow-black/20"
			onOpenAutoFocus={(e: Event) => {
				e.preventDefault();
				inputEl?.focus();
			}}
		>
			<Dialog.Title class="sr-only">Search tools</Dialog.Title>
			<Dialog.Description class="sr-only"
				>Type to search tools, or paste content to act on it directly.</Dialog.Description
			>
			<div class="flex items-center gap-2 border-b border-line px-3">
				<Search size={15} class="shrink-0 text-dim" />
				<input
					bind:this={inputEl}
					bind:value={query}
					{onkeydown}
					type="text"
					placeholder={t('palettePlaceholder')}
					class="bare w-full bg-transparent py-3 font-mono text-sm outline-none placeholder:text-dim/60"
					autocomplete="off"
					spellcheck="false"
				/>
			</div>
			<ul bind:this={listEl} class="max-h-[50vh] overflow-y-auto p-1.5" role="listbox" aria-label="Results">
				{#each entries as entry, i (entry.kind + entry.tool.slug + (entry.payload ?? ''))}
					{@const Icon = entry.kind === 'action' ? Zap : iconFor(entry.tool.slug)}
					<li role="option" aria-selected={i === selected}>
						<button
							type="button"
							class="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left transition-colors duration-120
								{i === selected ? 'bg-surface-2' : 'hover:bg-surface-2/60'}"
							onclick={() => run(entry)}
							onmousemove={() => (selected = i)}
						>
							<span class="flex min-w-0 items-center gap-2.5">
								<span
									class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line text-dim
										{entry.kind === 'action' ? 'border-accent/40 text-accent' : ''}"
								>
									<Icon size={13} />
								</span>
								<span class="flex min-w-0 flex-col">
									<span class="flex min-w-0 items-center gap-1.5">
										<span class="truncate text-sm {entry.kind === 'action' ? 'text-accent' : ''}">
											{entry.label}
										</span>
										{#if entry.kind === 'tool' && isFavorite(entry.tool.slug)}
											<Star size={10} class="shrink-0 fill-current text-accent" aria-hidden="true" />
										{/if}
									</span>
									{#if entry.hint}
										<span class="truncate font-mono text-xs text-dim">{entry.hint}</span>
									{/if}
								</span>
							</span>
							{#if i === selected}
								<CornerDownLeft size={13} class="shrink-0 text-dim" />
							{/if}
						</button>
					</li>
				{:else}
					<li class="px-2.5 py-6 text-center text-sm text-dim">{t('noMatch')}</li>
				{/each}
			</ul>
			<div class="flex items-center gap-4 border-t border-line px-3 py-2 font-mono text-[11px] text-dim/70">
				<span class="flex items-center gap-1.5"><Kbd keys="↑↓" /> {t('navigate')}</span>
				<span class="flex items-center gap-1.5"><Kbd keys="↵" /> {t('open')}</span>
				<span class="flex items-center gap-1.5"><Kbd keys="esc" /> {t('close')}</span>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

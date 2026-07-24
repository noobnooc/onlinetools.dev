<script lang="ts">
	import { goto } from '$app/navigation';
	import { detect, syntheticDetection } from '$lib/detect/detectors';
	import { rankTools, PASTE_MIN } from '$lib/detect/recommend';
	import { EXTENSION_FORMATS } from '$lib/detect/formats';
	import { pushRecentTool, openPalette } from '$lib/state/app.svelte';
	import { setPendingFile, setPendingState } from '$lib/state/handoff';
	import { encodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';
	import { TOOL_BY_SLUG, type ToolMeta } from '$lib/tools/registry';
	import { iconFor } from '$lib/tools/icons';
	import { t, lt, lp } from '$lib/i18n';
	import Kbd from './Kbd.svelte';
	import PlusCorners from './PlusCorners.svelte';
	import { ArrowRight, Search, X } from 'lucide-svelte';

	/**
	 * Paste-first hero. The same confidence-scored detection engine that powers
	 * the global Smart Paste popup, promoted to the homepage's centerpiece: an
	 * always-visible box that live-classifies whatever you type, paste or drop
	 * and routes it — with its content — to the exact tool on Enter. This is the
	 * site's identity ("paste anything"), made tangible rather than described.
	 */

	const TEXT_FILE_MAX = 2_000_000;
	const MAX_SUGGESTIONS = 6;
	/** Shown when content is text but nothing matched a specific format. */
	const FALLBACK_TEXT_TOOLS = ['word-counter', 'case-converter', 'sort-lines', 'diff-checker'];

	/** One-tap demos so a first-time visitor with nothing to paste still gets the "aha". */
	const SAMPLES: Array<{ label: string; value: string }> = [
		{
			label: 'JWT',
			value:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
		},
		{ label: '1721822400', value: '1721822400' },
		{ label: '{ JSON }', value: '{"user":{"name":"Ada","roles":["admin","dev"]}}' },
		{ label: '#3ECF8E', value: '#3ECF8E' },
		{ label: '0 9 * * 1-5', value: '0 9 * * 1-5' },
		{ label: 'UUID', value: '9b2e4f6a-1c3d-4e5f-8a7b-2c1d0e9f8a7b' }
	];

	let value = $state('');
	let file = $state<File | null>(null);
	let selected = $state(0);
	let dragging = $state(false);
	let el = $state<HTMLTextAreaElement | null>(null);

	const hasContent = $derived(value.trim() !== '' || file !== null);
	const isImage = $derived(file !== null);

	const detections = $derived(
		file ? [syntheticDetection('image', 'Image', 1)] : detect(value)
	);

	const ranked = $derived(
		hasContent
			? rankTools(detections, { baselineText: !file })
					.filter((r) => r.score >= PASTE_MIN)
					.slice(0, MAX_SUGGESTIONS)
			: []
	);

	const fallbackTools = $derived(
		hasContent && ranked.length === 0 && !file
			? (FALLBACK_TEXT_TOOLS.map((s) => TOOL_BY_SLUG.get(s)).filter(Boolean) as ToolMeta[])
			: []
	);

	interface Item {
		slug: string;
		action?: string;
		suggested: boolean;
	}

	const items = $derived<Item[]>(
		ranked.length
			? ranked.map((r) => ({ slug: r.slug, action: r.action, suggested: r.suggested }))
			: fallbackTools.map((tl) => ({ slug: tl.slug, suggested: false }))
	);

	const topLabel = $derived(
		detections.length
			? detections.reduce((a, b) => (b.confidence > a.confidence ? b : a)).label
			: ''
	);

	// Reset the highlighted row whenever the input changes.
	$effect(() => {
		value;
		file;
		selected = 0;
	});

	// Grow the textarea with its content, capped so the results stay in view.
	$effect(() => {
		value;
		if (el) {
			el.style.height = 'auto';
			el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
		}
	});

	// Object URL for the dropped/pasted image preview, revoked on change.
	let previewUrl = $state('');
	$effect(() => {
		if (file) {
			const url = URL.createObjectURL(file);
			previewUrl = url;
			return () => URL.revokeObjectURL(url);
		}
		previewUrl = '';
	});

	function toolName(slug: string): string {
		const m = TOOL_BY_SLUG.get(slug);
		return m ? lt(m).name : slug;
	}

	function run(slug: string) {
		const payloadFile = file;
		const text = value;
		pushRecentTool(slug);
		if (payloadFile) {
			setPendingFile(payloadFile);
			void goto(lp(`/t/${slug}`));
		} else if (text.length <= MAX_SHARED_INPUT) {
			void goto(`${lp(`/t/${slug}`)}#s=${encodeState({ input: text })}`);
		} else {
			setPendingState({ input: text });
			void goto(lp(`/t/${slug}`));
		}
	}

	function clear() {
		value = '';
		file = null;
		selected = 0;
		el?.focus();
	}

	function setSample(v: string) {
		file = null;
		value = v;
		selected = 0;
		el?.focus();
	}

	async function offerFile(f: File) {
		if (f.type.startsWith('image/') || /\.svg$/i.test(f.name)) {
			value = '';
			file = f;
			selected = 0;
			return;
		}
		const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
		const hint = EXTENSION_FORMATS[ext];
		if (!hint || f.size > TEXT_FILE_MAX) return;
		const text = await f.text();
		if (text.trim() === '') return;
		file = null;
		value = text;
	}

	function onpaste(e: ClipboardEvent) {
		const f = [...(e.clipboardData?.items ?? [])].find((i) => i.kind === 'file')?.getAsFile();
		if (f) {
			e.preventDefault();
			void offerFile(f);
		}
		// Text falls through to the textarea's native paste (bound to `value`).
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey && items.length) {
			e.preventDefault();
			run((items[selected] ?? items[0]).slug);
		} else if (e.key === 'ArrowDown' && items.length) {
			e.preventDefault();
			selected = Math.min(selected + 1, items.length - 1);
		} else if (e.key === 'ArrowUp' && items.length) {
			e.preventDefault();
			selected = Math.max(selected - 1, 0);
		} else if (e.key === 'Escape' && hasContent) {
			e.preventDefault();
			clear();
		}
	}

	function ondrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const f = e.dataTransfer?.files?.[0];
		const text = e.dataTransfer?.getData('text/plain') ?? '';
		if (f) void offerFile(f);
		else if (text) {
			file = null;
			value = text;
		}
	}

	function heroFocus(node: HTMLTextAreaElement) {
		// Autofocus on pointer devices only — never pop the keyboard on mobile.
		try {
			if (matchMedia('(pointer: fine)').matches) node.focus();
		} catch {
			// matchMedia unavailable — skip autofocus rather than throw.
		}
	}
</script>

<div
	class="relative rounded-(--radius-lg) border bg-surface shadow-lg shadow-black/5 transition-colors duration-120 {dragging
		? 'border-accent'
		: 'border-line'}"
	ondragover={(e) => {
		e.preventDefault();
		dragging = true;
	}}
	ondragleave={() => (dragging = false)}
	{ondrop}
	role="group"
	aria-label={t('smartPaste')}
>
	<PlusCorners />

	{#if isImage}
		<!-- Dropped / pasted image: show a preview instead of the text box. -->
		<div class="flex items-center gap-3 p-4">
			{#if previewUrl}
				<img
					src={previewUrl}
					alt=""
					class="h-16 w-16 shrink-0 rounded-md border border-line object-cover"
				/>
			{/if}
			<div class="min-w-0">
				<div class="truncate text-sm font-medium">{file?.name}</div>
				<div class="font-mono text-xs text-dim">
					{t('detected')} <span class="text-accent">{topLabel}</span>
				</div>
			</div>
			<button
				type="button"
				onclick={clear}
				class="ml-auto flex h-7 w-7 items-center justify-center rounded-md border border-line text-dim transition-colors duration-120 hover:border-accent/40 hover:text-fg"
				aria-label={t('clearHint')}
			>
				<X size={14} />
			</button>
		</div>
	{:else}
		<div class="relative">
			<textarea
				bind:this={el}
				bind:value
				{onpaste}
				{onkeydown}
				use:heroFocus
				spellcheck="false"
				autocapitalize="off"
				rows="3"
				aria-label={t('pasteHeroPlaceholder')}
				placeholder={t('pasteHeroPlaceholder')}
				class="block max-h-80 w-full resize-none bg-transparent px-4 pt-4 pb-3 font-mono text-[13px] leading-6 text-fg outline-none placeholder:text-dim/70"
			></textarea>
			{#if hasContent}
				<button
					type="button"
					onclick={clear}
					class="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-md text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
					aria-label={t('clearHint')}
				>
					<X size={13} />
				</button>
			{/if}
		</div>
	{/if}

	<!-- Results / hints strip -->
	{#if !hasContent}
		<div class="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-line px-4 py-3">
			<span class="font-mono text-[11px] text-dim">{t('tryLabel')}</span>
			{#each SAMPLES as s (s.label)}
				<button
					type="button"
					onclick={() => setSample(s.value)}
					class="rounded-md border border-line bg-surface-2/60 px-2 py-0.5 font-mono text-[11px] text-dim transition-colors duration-120 hover:border-accent/50 hover:text-accent"
				>
					{s.label}
				</button>
			{/each}
		</div>
	{:else}
		<div class="border-t border-line">
			<div class="flex items-center justify-between px-4 pt-2.5 pb-1.5">
				<span class="flex items-center gap-2 font-mono text-[11px] text-dim">
					<span
						class="inline-block h-1.5 w-1.5 rounded-full {ranked.length
							? 'bg-ok'
							: 'bg-dim/50'}"
						aria-hidden="true"
					></span>
					{#if ranked.length}
						{t('detected')} <span class="text-accent">{topLabel}</span>
					{:else}
						{t('plainText')}
					{/if}
					{#if !isImage}
						<span class="text-dim/50">· {value.length.toLocaleString()} {t('chars')}</span>
					{/if}
				</span>
			</div>

			<ul class="px-1.5 pb-1.5">
				{#each items as item, i (item.slug + (item.action ?? ''))}
					{@const Icon = iconFor(item.slug)}
					<li>
						<button
							type="button"
							onclick={() => run(item.slug)}
							onmousemove={() => (selected = i)}
							class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-120 {i ===
							selected
								? 'bg-surface-2'
								: 'hover:bg-surface-2/60'}"
						>
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-dim"
							>
								<Icon size={13} />
							</span>
							<span class="min-w-0 grow truncate">
								{#if item.action}
									<span class="font-medium">{item.action}</span>
									<span class="text-dim">— {toolName(item.slug)}</span>
								{:else}
									{toolName(item.slug)}
								{/if}
							</span>
							{#if item.suggested}
								<span
									class="shrink-0 rounded-sm border border-accent/40 bg-accent/10 px-1 py-px font-mono text-[10px] text-accent"
									>{t('suggested')}</span
								>
							{/if}
							{#if i === selected}
								<span class="shrink-0 font-mono text-[11px] text-dim">↵</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>

			<div
				class="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line px-4 py-2 font-mono text-[10px] text-dim/80"
			>
				{#if fallbackTools.length}
					<button
						type="button"
						onclick={() => openPalette(value.slice(0, 64))}
						class="flex items-center gap-1.5 text-dim transition-colors duration-120 hover:text-accent"
					>
						<Search size={11} /> {t('noMatchHint')} <ArrowRight size={10} />
					</button>
				{:else}
					<span class="flex items-center gap-1.5"><Kbd keys="↵" /> {t('runHint')}</span>
					<span class="flex items-center gap-1.5"><Kbd keys="⇧↵" /> {t('newlineHint')}</span>
					<span class="flex items-center gap-1.5"><Kbd keys="esc" /> {t('clearHint')}</span>
					<button
						type="button"
						onclick={() => openPalette()}
						class="flex items-center gap-1.5 transition-colors duration-120 hover:text-accent"
					>
						<Kbd keys="⌘K" /> {t('searchTools')}
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>

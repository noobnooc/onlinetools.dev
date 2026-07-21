<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { beautifyCode, minifyCss, minifyHtml, minifyJs, type CodeLang } from '$lib/tools/codeformat';
	import type { ToolResult } from '$lib/tools/types';
	import { byteLength, formatBytes } from '$lib/utils/format';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	interface Props {
		lang: CodeLang;
		inputLabel: string;
		placeholder: string;
		sample: string;
		filenameBase: string;
		ext: string;
	}

	let { lang, inputLabel, placeholder, sample, filenameBase, ext }: Props = $props();

	let input = $state('');
	let mode = $state<'format' | 'minify'>('format');
	let indent = $state<'2' | '4'>('2');
	/** Async minify (terser) result; null while computing. */
	let asyncResult = $state<ToolResult | null>(null);

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.mode === 'format' || s.mode === 'minify') mode = s.mode;
	});

	const syncResult = $derived.by(() => {
		if (input.trim() === '') return null;
		if (mode === 'format') return beautifyCode(lang, input, Number(indent));
		if (lang === 'css') return minifyCss(input);
		if (lang === 'html') return minifyHtml(input);
		return undefined; // js minify is async
	});

	$effect(() => {
		if (syncResult !== undefined) {
			asyncResult = null;
			return;
		}
		let cancelled = false;
		const src = input;
		const timer = setTimeout(() => {
			void minifyJs(src).then((r) => {
				if (!cancelled) asyncResult = r;
			});
		}, 250);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	const result = $derived(syncResult === undefined ? asyncResult : syncResult);
	const output = $derived(result?.ok ? result.value : '');

	$effect(() => {
		currentResult.text = output;
	});

	const savings = $derived.by(() => {
		if (mode !== 'minify' || !result?.ok || input.trim() === '') return null;
		const before = byteLength(input);
		const after = byteLength(result.value);
		if (before === 0) return null;
		return { before, after, pct: Math.round((1 - after / before) * 100) };
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (result === null) return [{ text: '…', tone: 'dim' }];
		if (!result.ok) return [{ text: 'error', tone: 'err' }];
		const segs: BadgeSegment[] = [{ text: lang.toUpperCase(), tone: 'accent' }];
		if (savings) segs.push({ text: `−${Math.max(0, savings.pct)}%`, tone: 'ok' });
		return segs;
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={mode}
			label={tt('mode')}
			options={[
				{ value: 'format', label: tt('fmtFormat') },
				{ value: 'minify', label: tt('fmtMinify') }
			]}
		/>
		{#if mode === 'format'}
			<Segmented
				bind:value={indent}
				label={tt('jfIndentation')}
				options={[
					{ value: '2', label: tt('jfSp2') },
					{ value: '4', label: tt('jfSp4') }
				]}
			/>
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={inputLabel}
		{placeholder}
		{badge}
		rows={9}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = sample)}
	/>
	{#if savings}
		<p class="font-mono text-xs text-dim">
			{formatBytes(savings.before)} → {formatBytes(savings.after)}
			<span class={savings.pct >= 0 ? 'text-ok' : 'text-warn'}>
				({savings.pct >= 0 ? '−' : '+'}{Math.abs(savings.pct)}%)
			</span>
		</p>
	{/if}
	<OutputPanel
		value={output}
		label="Output · {lang.toUpperCase()}"
		filename={mode === 'minify' ? `${filenameBase}.min.${ext}` : `${filenameBase}.${ext}`}
		shareState={input.trim() === '' ? null : { input, mode }}
	/>
</div>

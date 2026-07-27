<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { markdownToHtml, htmlToMarkdown, markdownStats } from '$lib/tools/markdown';
	import DOMPurify from 'dompurify';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let direction = $state<'to-html' | 'to-md'>('to-html');
	let view = $state<'preview' | 'source'>('preview');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.direction === 'to-html' || s.direction === 'to-md') direction = s.direction;
	});

	const result = $derived.by(() => {
		if (input.trim() === '') return null;
		return direction === 'to-html' ? markdownToHtml(input) : htmlToMarkdown(input);
	});
	const output = $derived(result?.ok ? result.value : '');

	/**
	 * Preview HTML is always sanitized — share links can carry hostile markup.
	 * DOMPurify's defaults stop scripts but still allow forms, inputs and inline
	 * styles, which is enough to render a convincing credential-harvesting page
	 * from a `#s=` link. Markdown never legitimately produces any of them, so
	 * they are dropped outright.
	 */
	const previewHtml = $derived(
		direction === 'to-html' && result?.ok
			? DOMPurify.sanitize(result.value, {
					FORBID_TAGS: ['form', 'input', 'button', 'select', 'textarea', 'style'],
					FORBID_ATTR: ['style', 'action', 'formaction', 'target', 'ping']
				})
			: ''
	);

	const stats = $derived(direction === 'to-html' && input.trim() !== '' ? markdownStats(input) : null);

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (input.trim() === '') return [];
		if (!result?.ok) return [{ text: 'error', tone: 'err' }];
		if (stats) {
			return [
				{ text: 'Markdown', tone: 'accent' },
				{ text: `${stats.words} ${tt('wcWords').toLowerCase()}`, tone: 'dim' }
			];
		}
		return [{ text: 'HTML', tone: 'accent' }];
	});

	const SAMPLE = `# Release notes\n\nShipped in **v2.4**:\n\n- Faster \`diff\` engine\n- [Share links](https://example.com/docs) survive refreshes\n- ~~Legacy exporter~~ removed\n\n> Upgrade with \`npm i tool@latest\`\n\n\`\`\`js\nconsole.log('hello');\n\`\`\``;
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-4 text-sm">
		<Segmented
			bind:value={direction}
			label={tt('direction')}
			options={[
				{ value: 'to-html', label: 'Markdown → HTML' },
				{ value: 'to-md', label: 'HTML → Markdown' }
			]}
		/>
		{#if direction === 'to-html'}
			<Segmented
				bind:value={view}
				label={tt('mode')}
				options={[
					{ value: 'preview', label: tt('mdPreview') },
					{ value: 'source', label: 'HTML' }
				]}
			/>
		{/if}
	</div>
	<InputArea
		bind:value={input}
		label={direction === 'to-html' ? 'Markdown' : 'HTML'}
		placeholder={direction === 'to-html' ? '# Heading\n\nSome **bold** text…' : '<h1>Heading</h1><p>Some <strong>bold</strong> text…</p>'}
		{badge}
		rows={9}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() =>
			(input = direction === 'to-html' ? SAMPLE : '<h2>Notes</h2><p>Some <em>emphasis</em>, a <a href="https://example.com">link</a> and:</p><ul><li>one</li><li>two</li></ul>')}
	/>

	{#if direction === 'to-html' && view === 'preview' && previewHtml !== ''}
		<div>
			<span class="mb-1.5 block text-xs font-medium tracking-wide text-dim uppercase">{tt('mdPreview')}</span>
			<div class="prose-preview overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 text-sm leading-relaxed">
				<!-- eslint-disable-next-line svelte/no-at-html-tags — sanitized above -->
				{@html previewHtml}
			</div>
		</div>
	{/if}

	<OutputPanel
		value={output}
		label={direction === 'to-html' ? 'Output · HTML' : 'Output · Markdown'}
		filename={direction === 'to-html' ? 'document.html' : 'document.md'}
		shareState={input.trim() === '' ? null : { input, direction }}
	/>
	<p class="text-xs text-dim">{tt('mdNote')}</p>
</div>

<style>
	.prose-preview :global(h1),
	.prose-preview :global(h2),
	.prose-preview :global(h3) {
		font-weight: 600;
		margin: 0.8em 0 0.4em;
	}
	.prose-preview :global(h1) {
		font-size: 1.4em;
	}
	.prose-preview :global(h2) {
		font-size: 1.2em;
	}
	.prose-preview :global(p),
	.prose-preview :global(ul),
	.prose-preview :global(ol),
	.prose-preview :global(blockquote),
	.prose-preview :global(pre),
	.prose-preview :global(table) {
		margin: 0.5em 0;
	}
	.prose-preview :global(ul) {
		list-style: disc;
		padding-left: 1.4em;
	}
	.prose-preview :global(ol) {
		list-style: decimal;
		padding-left: 1.4em;
	}
	.prose-preview :global(a) {
		color: var(--accent);
		text-decoration: underline;
	}
	.prose-preview :global(code) {
		font-family: var(--font-mono, monospace);
		font-size: 0.9em;
		background: var(--surface-2, rgba(128, 128, 128, 0.12));
		padding: 0.1em 0.35em;
		border-radius: 4px;
	}
	.prose-preview :global(pre) {
		background: var(--surface-2, rgba(128, 128, 128, 0.12));
		padding: 0.7em 0.9em;
		border-radius: 8px;
		overflow-x: auto;
	}
	.prose-preview :global(pre code) {
		background: none;
		padding: 0;
	}
	.prose-preview :global(blockquote) {
		border-left: 3px solid var(--line, #444);
		padding-left: 0.9em;
		color: var(--text-dim, inherit);
	}
	.prose-preview :global(table) {
		border-collapse: collapse;
	}
	.prose-preview :global(th),
	.prose-preview :global(td) {
		border: 1px solid var(--line, #444);
		padding: 0.3em 0.6em;
	}
	.prose-preview :global(hr) {
		border: none;
		border-top: 1px solid var(--line, #444);
		margin: 1em 0;
	}
</style>

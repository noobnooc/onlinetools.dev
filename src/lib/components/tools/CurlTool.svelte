<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import Segmented from '../Segmented.svelte';
	import { convertCurl, CURL_TARGETS, type CurlTarget, type CurlWarning, type CurlWarningCode } from '$lib/tools/curl';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';

	let input = $state('');
	let target = $state<CurlTarget>('fetch');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (CURL_TARGETS.includes(s.to as CurlTarget)) target = s.to as CurlTarget;
		// A pasted command often carries a token; don't leave it in the address bar.
		const r = s.input ? convertCurl(s.input, 'fetch') : null;
		if (r?.ok && r.value.hasSecrets && location.hash) {
			history.replaceState(history.state, '', location.pathname + location.search);
		}
	});

	const result = $derived(input.trim() === '' ? null : convertCurl(input, target));
	const conv = $derived(result?.ok ? result.value : null);
	const output = $derived(conv?.code ?? '');

	$effect(() => {
		currentResult.text = output;
	});

	const TARGETS: Record<CurlTarget, { label: string; lang: string; file: string }> = {
		fetch: { label: 'fetch', lang: 'JavaScript (fetch)', file: 'request.mjs' },
		axios: { label: 'axios', lang: 'JavaScript (axios)', file: 'request.mjs' },
		python: { label: 'Python', lang: 'Python (requests)', file: 'request.py' },
		go: { label: 'Go', lang: 'Go (net/http)', file: 'main.go' }
	};

	const WARNINGS: Record<CurlWarningCode, (d: string) => string> = {
		unknownOption: (d) => tt('curlWarnUnknownOption', { d }),
		unsupportedOption: (d) => tt('curlWarnUnsupportedOption', { d }),
		noScheme: () => tt('curlWarnNoScheme'),
		multipleUrls: (d) => tt('curlWarnMultipleUrls', { d }),
		stdin: () => tt('curlWarnStdin'),
		cookieFile: (d) => tt('curlWarnCookieFile', { d }),
		headerFile: (d) => tt('curlWarnHeaderFile', { d }),
		passwordPrompt: () => tt('curlWarnPasswordPrompt'),
		trailing: () => tt('curlWarnTrailing'),
		browserHeaders: (d) => tt('curlWarnBrowserHeaders', { d }),
		fetchProxy: () => tt('curlWarnFetchProxy'),
		fetchInsecure: () => tt('curlWarnFetchInsecure')
	};
	const warningText = (w: CurlWarning) => WARNINGS[w.code](w.detail ?? '');

	const badge = $derived.by((): BadgeSegment[] => {
		if (!conv) return [];
		let host = '';
		try {
			host = new URL(conv.request.url).host;
		} catch {
			// curl takes URLs that URL() rejects (globs, spaces); the badge just omits the host.
		}
		return [{ text: conv.request.method, tone: 'accent' }, ...(host ? [{ text: host }] : [])];
	});

	const SAMPLE = `curl 'https://api.example.com/v1/orders?expand=items' \\
  -X POST \\
  -H 'Authorization: Bearer sk_test_123' \\
  -H 'Content-Type: application/json' \\
  --data-raw '{"customer":"cus_42","items":[{"sku":"TSHIRT-M","qty":2}],"note":"Leave at the door"}' \\
  --max-time 10 \\
  --compressed`;
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('curlInput')}
		placeholder={"curl 'https://api.example.com/items' -H 'Accept: application/json'"}
		{badge}
		rows={7}
		error={result && !result.ok ? { message: result.error, line: result.line, column: result.column } : null}
		onsample={() => (input = SAMPLE)}
	/>

	<div class="flex flex-wrap items-center gap-3">
		<Segmented
			label={tt('curlTarget')}
			bind:value={target}
			options={CURL_TARGETS.map((t) => ({ value: t, label: TARGETS[t].label }))}
		/>
	</div>

	{#if conv && conv.warnings.length}
		<ul class="space-y-1 text-sm text-warn" aria-live="polite">
			{#each conv.warnings as w (w.code + (w.detail ?? ''))}<li>⚠ {warningText(w)}</li>{/each}
		</ul>
	{/if}

	<OutputPanel
		value={output}
		label={TARGETS[target].lang}
		filename={TARGETS[target].file}
		shareState={conv && !conv.hasSecrets ? { input, to: target } : null}
		emptyHint={tt('curlEmpty')}
	/>

	<p class="text-xs text-dim">
		{conv?.hasSecrets ? tt('curlSecretsNote') + ' ' : ''}{tt('curlPrivacy')}
	</p>
</div>

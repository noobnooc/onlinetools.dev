<script lang="ts">
	import { tt } from '$lib/i18n';
	import CodeFormatBase from './CodeFormatBase.svelte';
</script>

<CodeFormatBase
	lang="html"
	inputLabel={tt('htmlInput')}
	placeholder={'<div><p>hello</p></div>'}
	sample={'<!doctype html><html><head><title>Demo</title></head><body><nav class="top"><a href="/">Home</a><a href="/docs">Docs</a></nav><main><h1>Hello</h1><p>Some <strong>markup</strong> worth reading.</p><!-- todo: hero image --></main></body></html>'}
	filenameBase="page"
	ext="html"
/>

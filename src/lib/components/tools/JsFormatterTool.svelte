<script lang="ts">
	import { tt } from '$lib/i18n';
	import CodeFormatBase from './CodeFormatBase.svelte';
</script>

<CodeFormatBase
	lang="js"
	inputLabel={tt('jsInput')}
	placeholder={'function add(a, b) { return a + b; }'}
	sample={"function debounce(fn, wait) {\n  let timer = null;\n  return function debounced(...args) {\n    if (timer !== null) clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      fn.apply(this, args);\n    }, wait);\n  };\n}\n\nconst onResize = debounce(() => console.log('resized', window.innerWidth), 200);\nwindow.addEventListener('resize', onResize);"}
	filenameBase="script"
	ext="js"
/>

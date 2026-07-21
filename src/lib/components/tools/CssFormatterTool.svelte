<script lang="ts">
	import { tt } from '$lib/i18n';
	import CodeFormatBase from './CodeFormatBase.svelte';
</script>

<CodeFormatBase
	lang="css"
	inputLabel={tt('cssInput')}
	placeholder={'a { color: red; }'}
	sample={'/* buttons */\n.btn, .btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 8px; }\n.btn-primary { background: #4c8dff; color: white; }\n@media (max-width: 640px) { .btn { width: 100%; justify-content: center; } }'}
	filenameBase="styles"
	ext="css"
/>

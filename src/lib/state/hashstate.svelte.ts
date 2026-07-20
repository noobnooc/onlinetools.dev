import { decodeState } from './urlstate';

/**
 * Apply shared state from the URL fragment on mount AND on hash changes, so
 * same-document navigations (Smart Paste / palette targeting the current tool)
 * also restore state. Must be called during component init.
 */
export function initFromHash(apply: (s: Record<string, string>) => void) {
	$effect(() => {
		const read = () => {
			const s = decodeState(location.hash);
			if (s) apply(s);
		};
		read();
		window.addEventListener('hashchange', read);
		return () => window.removeEventListener('hashchange', read);
	});
}

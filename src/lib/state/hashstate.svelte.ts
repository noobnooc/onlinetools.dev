import { decodeState } from './urlstate';
import { takePendingState } from './handoff';

/**
 * Apply shared state from the URL fragment on mount AND on hash changes, so
 * same-document navigations (Smart Paste / palette targeting the current tool)
 * also restore state. Content too large for the fragment arrives through the
 * in-memory handoff store instead. Must be called during component init.
 */
export function initFromHash(apply: (s: Record<string, string>) => void) {
	$effect(() => {
		const read = () => {
			const s = decodeState(location.hash);
			if (s) apply(s);
		};
		const pending = takePendingState();
		if (pending) apply(pending);
		else read();
		window.addEventListener('hashchange', read);
		return () => window.removeEventListener('hashchange', read);
	});
}

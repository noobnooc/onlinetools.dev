/**
 * Favorite tools — stored only in this browser's localStorage, never uploaded.
 * The reactive list starts empty (SSR-safe) and hydrates via initFavorites().
 */

const FAVORITES_KEY = 'ot:favorites';

function readStored(): string[] {
	try {
		const raw = localStorage.getItem(FAVORITES_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
	} catch {
		return [];
	}
}

/** Favorited tool slugs, newest first. */
export const favorites = $state<{ slugs: string[] }>({ slugs: [] });

let initialized = false;

/**
 * Hydrate from localStorage and follow changes made in other tabs.
 * Called client-side after mount so hydration matches the server render.
 */
export function initFavorites() {
	if (initialized || typeof localStorage === 'undefined') return;
	initialized = true;
	favorites.slugs = readStored();
	if (typeof addEventListener === 'function') {
		addEventListener('storage', (e) => {
			if (e.key === FAVORITES_KEY) favorites.slugs = readStored();
		});
	}
}

export function isFavorite(slug: string): boolean {
	return favorites.slugs.includes(slug);
}

export function toggleFavorite(slug: string) {
	favorites.slugs = isFavorite(slug)
		? favorites.slugs.filter((s) => s !== slug)
		: [slug, ...favorites.slugs];
	try {
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slugs));
	} catch {
		// Storage unavailable (private mode) — favorites last for this visit only.
	}
}

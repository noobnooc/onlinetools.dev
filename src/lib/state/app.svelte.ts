/** Shared UI state (Svelte 5 runes modules). */

export const palette = $state({ open: false, initialQuery: '' });

export function openPalette(query = '') {
	palette.initialQuery = query;
	palette.open = true;
}

export const shortcutHelp = $state({ open: false });

/** Current tool result, kept for the global ⌘⇧C "copy result" shortcut. */
export const currentResult = $state({ text: '' });

const RECENT_KEY = 'ot:recent';
const MAX_RECENT = 6;

export function getRecentTools(): string[] {
	try {
		const raw = localStorage.getItem(RECENT_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
	} catch {
		return [];
	}
}

export function pushRecentTool(slug: string) {
	try {
		const list = [slug, ...getRecentTools().filter((s) => s !== slug)].slice(0, MAX_RECENT);
		localStorage.setItem(RECENT_KEY, JSON.stringify(list));
	} catch {
		// Storage unavailable (private mode) — recents are best-effort.
	}
}

export type Theme = 'dark' | 'light';
/** User preference: an explicit theme, or follow the operating system. */
export type ThemePref = Theme | 'system';

/**
 * Stored preference. "system" is represented by the absence of a stored
 * value, which is exactly what the pre-paint script in app.html reads.
 */
export function getThemePref(): ThemePref {
	try {
		const t = localStorage.getItem('theme');
		return t === 'dark' || t === 'light' ? t : 'system';
	} catch {
		return 'system';
	}
}

export function setThemePref(pref: ThemePref) {
	try {
		if (pref === 'system') localStorage.removeItem('theme');
		else localStorage.setItem('theme', pref);
	} catch {
		// Best-effort persistence only.
	}
	const dark =
		pref === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches : pref === 'dark';
	document.documentElement.classList.toggle('dark', dark);
}

import { beforeEach, describe, expect, it } from 'vitest';
import { favorites, initFavorites, isFavorite, toggleFavorite } from './favorites.svelte';

function stubStorage(initial: Record<string, string> = {}) {
	const store = new Map(Object.entries(initial));
	globalThis.localStorage = {
		getItem: (k: string) => store.get(k) ?? null,
		setItem: (k: string, v: string) => void store.set(k, v),
		removeItem: (k: string) => void store.delete(k),
		clear: () => store.clear(),
		key: (i: number) => [...store.keys()][i] ?? null,
		get length() {
			return store.size;
		}
	} as Storage;
	return store;
}

describe('favorites', () => {
	beforeEach(() => {
		stubStorage();
		favorites.slugs = [];
	});

	it('toggles a slug on and off', () => {
		toggleFavorite('json-formatter');
		expect(isFavorite('json-formatter')).toBe(true);
		toggleFavorite('json-formatter');
		expect(isFavorite('json-formatter')).toBe(false);
	});

	it('keeps newest favorites first', () => {
		toggleFavorite('a');
		toggleFavorite('b');
		expect(favorites.slugs).toEqual(['b', 'a']);
	});

	it('persists to localStorage', () => {
		const store = stubStorage();
		toggleFavorite('jwt-decoder');
		expect(JSON.parse(store.get('ot:favorites')!)).toEqual(['jwt-decoder']);
	});

	it('initFavorites ignores malformed stored values', () => {
		stubStorage({ 'ot:favorites': '{"not":"an array"}' });
		initFavorites();
		expect(favorites.slugs).toEqual([]);
	});
});

/*
 * onlinetools.dev service worker.
 * - Hashed immutable assets (/_app/immutable/*): cache-first, forever.
 * - Pages & other same-origin GETs: network-first with cache fallback,
 *   so every tool you have opened keeps working offline.
 */
const VERSION = 'v1';
const RUNTIME = `runtime-${VERSION}`;
const IMMUTABLE = `immutable-${VERSION}`;

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys.filter((k) => k !== RUNTIME && k !== IMMUTABLE).map((k) => caches.delete(k))
			);
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;
	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	if (url.pathname.startsWith('/_app/immutable/')) {
		event.respondWith(
			(async () => {
				const cache = await caches.open(IMMUTABLE);
				const hit = await cache.match(request);
				if (hit) return hit;
				const res = await fetch(request);
				if (res.ok) cache.put(request, res.clone());
				return res;
			})()
		);
		return;
	}

	event.respondWith(
		(async () => {
			const cache = await caches.open(RUNTIME);
			try {
				const res = await fetch(request);
				if (res.ok && (res.type === 'basic' || res.type === 'default')) {
					cache.put(request, res.clone());
				}
				return res;
			} catch {
				const hit = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
				if (hit) return hit;
				if (request.mode === 'navigate') {
					const home = await cache.match('/');
					if (home) return home;
				}
				throw new Error('offline and not cached');
			}
		})()
	);
});

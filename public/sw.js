// Network-only service worker: installability and Add to Home Screen do not
// need an offline cache, and caching API/auth/SSE would be unsafe. Anything
// under /api or /_next passes straight through to the browser.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);
	if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) return;
	event.respondWith(fetch(event.request));
});

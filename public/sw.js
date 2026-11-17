// Źródło: child-train@b881e09:public/sw.js (powłoka offline: nawigacje najpierw z sieci, zasoby z pamięci podręcznej).
// Zmiany: nazwa pamięci podręcznej, ikona SVG w powłoce i limit czasu nawigacji przy słabym zasięgu.
//
// Działanie offline wersji z GitHub Pages. Plik dist/index.html jest samodzielny i działa także
// z file://, ale service worker wymaga HTTPS albo localhost.
const CACHE_PREFIX = "child-bath-shell-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
// Przy bardzo słabym zasięgu dziecko nie czeka: po tym czasie pokazujemy zapisaną powłokę.
const NAVIGATION_TIMEOUT_MS = 4000;

const scopeUrl = (path) => new URL(path, self.registration.scope).href;
const SHELL_URLS = [
  scopeUrl("./"),
  scopeUrl("index.html"),
  scopeUrl("manifest.json"),
  scopeUrl("icons/icon-192.png"),
  scopeUrl("icons/icon-512.png"),
  scopeUrl("icons/maskable-512.png"),
  scopeUrl("icons/apple-touch-icon.png"),
  scopeUrl("icons/bath-icon.svg"),
];
const INDEX_URL = scopeUrl("index.html");
const START_URL = scopeUrl("./");

async function cacheResponse(cache, request, response) {
  if (!response?.ok || response.type === "opaque") return;
  try {
    await cache.put(request, response.clone());
  } catch {
    // Brak miejsca nie może zablokować aplikacji, która działa online.
  }
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const required = await fetch(START_URL, { cache: "reload" });
      if (!required.ok) throw new Error("Nie udało się zapisać powłoki aplikacji.");
      await cacheResponse(cache, START_URL, required);

      // HTML to cała aplikacja; pozostałe pliki są opcjonalne, żeby brak ikony
      // albo manifestu nie zablokował nowego service workera.
      await Promise.all(
        SHELL_URLS.filter((url) => url !== START_URL).map(async (url) => {
          try {
            const response = await fetch(url, { cache: "reload" });
            await cacheResponse(cache, url, response);
          } catch {
            // Kolejna wizyta online uzupełni brakujące pliki.
          }
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.href.startsWith(self.registration.scope)) {
    return;
  }

  const refresh = fetch(request).then(async (response) => {
    const cache = await caches.open(CACHE_NAME);
    await cacheResponse(cache, request, response);
    return response;
  });
  // Odświeżenie w tle rejestrujemy, póki zdarzenie fetch jest jeszcze obsługiwane.
  event.waitUntil(refresh.then(() => undefined).catch(() => undefined));

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (request.mode === "navigate") {
        try {
          return await withTimeout(refresh, NAVIGATION_TIMEOUT_MS);
        } catch {
          const cached =
            (await cache.match(request)) ?? (await cache.match(START_URL)) ?? (await cache.match(INDEX_URL));
          if (cached) return cached;
          try {
            return await refresh;
          } catch {
            return Response.error();
          }
        }
      }

      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        return await refresh;
      } catch {
        return (await cache.match(request)) ?? Response.error();
      }
    })(),
  );
});

// Źródło: child-train@b881e09:src/main.tsx (rejestracja service workera ścieżką względną).
// Zmiany: tylko zbudowana wersja w bezpiecznym kontekście; serwer deweloperski działa bez pamięci podręcznej.

/**
 * Rejestruje service workera, który przechowuje powłokę aplikacji do pracy offline.
 * Działa tylko w wersji zbudowanej, serwowanej przez HTTPS albo localhost. Plik dist/index.html
 * otwarty z dysku (file://) jest samodzielny i service workera nie potrzebuje.
 */
export function registerServiceWorker(): void {
  if (import.meta.env.DEV || !("serviceWorker" in navigator)) return;
  if (!window.isSecureContext || !window.location.protocol.startsWith("http")) return;

  const register = () => {
    // Ścieżka względna działa pod /child-bath/ na GitHub Pages i w podglądzie lokalnym.
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Bez service workera aplikacja nadal działa online, a dist/index.html także offline.
    });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}

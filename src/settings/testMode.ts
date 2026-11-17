/**
 * Tryb testowy włącza parametr ?test=1. Dziecko go nie widzi i nie może go włączyć z interfejsu.
 * W Fazie 1 pokazuje ramki stref ekranu; kolejne fazy dodają tu parametry testowe (seed, ease, ritual…).
 */
export function isTestMode(search: string = window.location.search): boolean {
  return new URLSearchParams(search).get("test") === "1";
}

# PHASE-03: podsumowanie implementacji

Plany 03-01, 03-02 i 03-03 są zaimplementowane w głównym katalogu projektu. **Automatyczna weryfikacja lokalna przeszła; faza czeka na GitHub Actions i przegląd na urządzeniu.**

## Co działa

| Wymaganie | Realizacja i dowód |
|---|---|
| REQ-19 · klawiatura | Po rozpoczęciu kąpieli pole jest fokusowalne. Strzałki przesuwają pędzel o 0,07, a Spacja i Enter prowadzą zygzakiem. Fokus ma obrys 4 px i widoczny pierścień narzędzia. Klawiatura i dotyk używają tego samego stemplowania. `keyboard-brush` i `controls` (cały rytuał bez myszy). |
| REQ-20 · zapowiedź | Pierwsze i każde kolejne zwierzątko czeka w lewej wnęce. „Dalej” lub Enter uruchamia `arriving`, a po kąpieli `reward` i `to_bench` kończą się nowym `door_waiting`. `bath-reducer`, `bath` i `controls`. |
| REQ-21 · brak kolejkowania | Zatrzask rozpoznaje przytrzymanie i autorepeat, ignoruje dodatkowe kliknięcie z klawiatury i blokuje wejście przez 600 ms po zmianie fazy. Niedostępny przycisk pozostaje w DOM z `aria-disabled`. `latch` i `controls`. |
| REQ-22 · jeden przycisk | `?test=1&oneButton=1` udostępnia jeden klawisz Enter: zaczyna kąpiel, a potem uruchamia po jednym pasie trwającym około 1,2 s × tempo. Ruch nie przyjmuje następnych naciśnięć ani nie zapisuje ich na później. `auto-stroke`, `bath-session` i `controls` (6–8 naciśnięć w trybie zwykłej łatwości). |
| REQ-23 · duży cel | „Dalej” i klawisz Enter mają na dotyku 74 px wysokości i `min(280px, 72vw)` szerokości. `controls` i `layout` sprawdzają rozmiary, fokus i bezpieczne marginesy. |
| REQ-24 · komunikaty | Jeden region `aria-live="polite"` ogłasza czekanie, wejście, krok, ukończenie i odejście. Pudełko ma polską instrukcję sterowania. `controls`. |
| REQ-25 · ograniczony ruch | Zmiana preferencji systemu działa bez przeładowania. Bez animacji ciągłych i przesuwania zwierzątka, bez dryfu cząsteczek; najwyżej sześć jednocześnie. Reszta warstwy znika od razu. `controls` i `particles`. |

## Ustalenia i granice

- W trybie jednoprzyciskowym promień może zostać poszerzony, żeby pasy pokryły również wysoką, wąską maskę. Canvas zawsze przycina rysowanie do sylwetki. Siatka pokazuje rzeczywisty postęp; po przekroczeniu progu w trakcie pasa gaśnięcie warstwy czeka na jego zakończenie.
- Pudełko wchodzi do kolejności Tab po wejściu zwierzątka. „Dalej” nie znika ani nie zmienia węzła przy zmianie fazy; jeśli fokus był na pudełku po zakończeniu kąpieli, wraca do sterowania zapowiedzią.
- Wnęka i `to_bench` to zaślepki. Docelowe miejsca zapowiedzi, ławeczka, runda i ustawienia rodzica zostają w Fazach 6, 8 i 10. Robocze ustawienia nie są jeszcze zapisywane.

## Weryfikacja

- `npm run typecheck` oraz `npm run build`: sukces.
- `CI=1 PLAYWRIGHT_PREBUILT=1 npm test`: **112 zaliczonych, 1 pominięty** (wielodotyk na desktopie), bez zmiany gotowego `dist/`.
- Lokalne zrzuty z Chromium: `artifacts/phase-03/zapowiedz-pion.png` (360 × 640), `artifacts/phase-03/zapowiedz-poziom.png` (640 × 360) i `artifacts/phase-03/jeden-przycisk-pion.png` (360 × 640).
- [ ] Potwierdzić zielony przebieg GitHub Actions dla zmian Fazy 3.
- [ ] Na fizycznym telefonie i laptopie sprawdzić zasięg kciuka, kolejność fokusu, szybkie naciśnięcia i łagodny ruch. Na telefonie sprawdzić komunikaty w TalkBack lub VoiceOver.

# Plany faz: Mała łazienka (child-bath)

Szczegółowe plany implementacji 12 faz z `planning/ROADMAP.md`. Każdy plik opisuje jedną fazę i jej plany wykonania NN-MM. **Jeden plan to jedna gałąź i jeden PR:** przygotowuje go agent AI, a sprawdza autor.

| Faza | Plik | Plany | Wymagania | Zależy od |
|---|---|---|---|---|
| 1. Fundamenty | [PHASE-01.md](PHASE-01.md) | 3 | REQ-01–07, REQ-76 | — |
| 2. Silnik kąpieli | [PHASE-02.md](PHASE-02.md) | 3 | REQ-10–18 | 1 |
| 3. Sterowanie i przejścia | [PHASE-03.md](PHASE-03.md) | 3 | REQ-19–25 | 2 |
| 4. Postacie | [PHASE-04.md](PHASE-04.md) | 4 | REQ-29, REQ-33–38 | 2 |
| 5. Menażeria | [PHASE-05.md](PHASE-05.md) | 4 | REQ-30–32 | 4 |
| 6. Świat | [PHASE-06.md](PHASE-06.md) | 4 | REQ-39–45 | 2 |
| 7. Rytuał i narracja | [PHASE-07.md](PHASE-07.md) | 4 | REQ-46–51 | 3, 4, 6 |
| 8. Runda i nagroda | [PHASE-08.md](PHASE-08.md) | 3 | REQ-09, REQ-52–59 | 7 |
| 9. Rozszerzona interakcja | [PHASE-09.md](PHASE-09.md) | 2 | REQ-26–28 | 8 |
| 10. Panel rodzica | [PHASE-10.md](PHASE-10.md) | 4 | REQ-60–70 | 9 |
| 11. Dane na urządzeniu | [PHASE-11.md](PHASE-11.md) | 3 | REQ-71–75 | 10 |
| 12. Szlif i wydanie 1.0 | [PHASE-12.md](PHASE-12.md) | 3 | REQ-08, REQ-77–79 | 5, 11 |

## Jak czytać plik fazy

- **Nagłówek YAML:** identyfikator, zależności, wymagania REQ, doprecyzowania DP i lista planów.
- **Sekcje:** Cel → Wynik fazy → Kontekst → Zakres → Projekt techniczny → Plany → Weryfikacja → Kryteria sukcesu → Ryzyka → Przekazanie.
- **Plan NN-MM:** fala (plany z tej samej fali można robić równolegle), zależności, wymagania, informacja, czy plan wymaga udziału autora („autonomiczny: nie”).
- **Zadanie:** nazwa · pliki · działanie · „Gotowe gdy” (warunek sprawdzalny).
- **Must-haves planu:** zachowania, pliki i połączenia, które agent sprawdza przed oddaniem PR (odpowiednik `must_haves` z GSD).

## Definition of Done (każdy plan)

1. `npm run typecheck`, `npm run build` i `npm test` przechodzą lokalnie i w CI.
2. Zasady spokoju (REQ-08):
   - pojawienia i zniknięcia trwają ≥ 0,5 s, pętle ≥ 1,2 s;
   - brak błysków, bańki nigdy nie pękają;
   - animujemy tylko `transform` i `opacity`.
3. Brak dźwięku i zapytań sieciowych. Nowe zależności runtime są zabronione; nowe devDependencies tylko za zgodą autora.
4. Teksty po polsku; dziecko nie musi niczego czytać.
5. Działa bez przewijania na 360 × 640 (pion), 640 × 360 (poziom) i 1280 × 800.
6. Przeniesiony kod ma komentarz źródła (`// Źródło: child-train@<sha>:src/…` albo `// Źródło: child-page@<sha>:js/…`) i wpis w `SOURCES.md`.
7. Opis PR zawiera podsumowanie: co zrobiono, odchylenia od planu, pokryte REQ, zrzuty z telefonu (odpowiednik `SUMMARY.md` w GSD).
8. Po scaleniu aktualizujemy tabelę postępu w `planning/ROADMAP.md`.

## Konwencje

- **Gałęzie i commity:** gałąź `phase-NN/NN-MM-krotka-nazwa`; commity `feat(NN-MM): …`, `test(NN-MM): …`, `docs(NN-MM): …`.
- **Testy** (Playwright, jak w child-train):
  - `tests/unit/*.spec.ts`: czyste moduły importowane w Playwright Test bez przeglądarki (projekt `unit`);
  - `tests/e2e/*.spec.ts`: Chromium w projektach `phone` (Pixel 7), `small` (360 × 640, dotyk) i `desktop` (1280 × 800);
  - `tests/visual/*.spec.ts`: zrzuty referencyjne zatwierdzane przez autora.
- **Tryb testowy:** parametry URL działają tylko z `?test=1`: `seed`, `ease`, `ritual`, `oneButton`, `extended`, `rounds`, `pace`, `scenery`, `still` (zamraża animacje do zrzutów), `gallery`. Haki `window.__bath.*` istnieją tylko w tym trybie i nie są widoczne w UI.
- **Zaczepienia testów:** `data-phase`, `data-step`, `data-animal`, `data-bench`, `data-progress`, `data-seed`, `data-scenery`, `data-time-of-day`, `data-weather`, `data-season`.
- **Losowość:** tylko przez `src/random.ts` z ziarnem sesji. `Math.random` w kodzie aplikacji jest zabroniony (test statyczny od Fazy 2).
- **Stałe czasowe:** w jednym miejscu (`src/timing.ts`), zawsze mnożone przez tempo; przy ograniczonym ruchu tylko tam, gdzie wskazuje plan.

## Zmiany planu

- **Zmiana doprecyzowania DP:** poprawiamy fazy z polem „Doprecyzowania” wskazujące to DP oraz odpowiednie REQ w `PROJECT.md`.
- **Pilna praca między fazami:** faza dziesiętna w ROADMAP (np. 4.1) i plik `PHASE-04.1.md`.
- **Odkryty brak w planie:** agent opisuje go w PR jako „odchylenie”, a autor decyduje: poprawka w bieżącym planie albo nowy plan.

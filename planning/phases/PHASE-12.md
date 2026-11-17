---
phase: 12-szlif-wydanie
name: Szlif i wydanie 1.0
status: not-started
depends_on: [05-menazeria, 11-dane]
requirements: [REQ-08, REQ-77, REQ-78, REQ-79]
clarifications: []
plans: [12-01, 12-02, 12-03]
---

# PHASE-12: Szlif i wydanie 1.0

> **Cel:** aplikacja jest płynna i spokojna na telefonie, w pełni przetestowana i opublikowana jako v1.0, gotowa do pokazania dziecku.
> **Zależy od:** Fazy 5 i 11 · **Odblokowuje:** v1.0 (a potem poprawki v1.0.x po pierwszych sesjach dziecka) · **Plany:** 3 (fale: 12-01 ∥ 12-02 → 12-03)

## Wynik fazy

- Zmierzona i potwierdzona wydajność na telefonie referencyjnym: ≥ 55 kl./s przy pocieraniu, obsługa ruchu ≤ 2 ms.
- Automatyczny audyt spokoju (REQ-08) i lista kontrolna dostępności.
- Regresja wizualna: zrzuty referencyjne scenerii, menażerii i panelu.
- README w stylu child-train (opis UI i zasad stylu), `CHANGELOG.md`, `docs/RELEASE_CHECKLIST.md`, wersja w panelu.
- Wydanie v1.0.0 na GitHub Pages.

## Kontekst

- **Otwarte pytanie z `PROJECT.md` 4.3:** wybór telefonu referencyjnego, czyli pierwsze zadanie tej fazy.
- **Wzorce:** README child-train (sekcje: Purpose, Flow, Controls, Parent Controls, Home Page UI Reference, Privacy, Verification, Credits) i lista kontrolna wydania z child-page (`docs/RELEASE_CHECKLIST.md`, wersja w jednym pliku).
- **REQ-08** obowiązuje od Fazy 1; tutaj zamieniamy go w automatyczny audyt całej aplikacji.

## Zakres

**W zakresie:** wydajność, audyt spokoju i dostępności, regresja wizualna, dokumentacja, wydanie.
**Poza zakresem:** nowe funkcje; wszystko nowe trafia do v1.0.x albo v1.1 (`ROADMAP.md`, „Po v1.0”).

## Projekt techniczny

**Pomiar wydajności** (`?test=1&perf=1`):
- znaczniki `performance.now()` wokół obsługi ruchu wskaźnika;
- rejestr znaczników czasu klatek rAF podczas syntetycznego pocierania (10 s);
- wynik zapisywany w `window.__bath.perf`.

**Budżety:**

| Metryka | Budżet |
|---|---|
| mediana klatek przy pocieraniu (telefon referencyjny) | ≥ 55 kl./s |
| 95. percentyl czasu klatki | ≤ 25 ms |
| obsługa jednego zdarzenia ruchu | ≤ 2 ms |
| `getImageData` w gorącej ścieżce | 0 wywołań |
| węzły cząsteczek | ≤ 28 (≤ 6 przy ograniczonym ruchu) |
| rozmiar `dist/index.html` | informacyjnie, bez limitu; raport w PR |

**Audyt spokoju** (`tests/e2e/calm.spec.ts`, cała runda na sztucznym zegarze):
1. Każda animacja z `document.getAnimations()` o nieskończonej liczbie powtórzeń trwa ≥ 1200 ms. Wyjątek: elementy z `data-calm="finger"` (efekty pod palcem).
2. Każde pojawienie się i zniknięcie (`opacity` w animacjach i przejściach) trwa ≥ 500 ms, z wyjątkiem ograniczonego ruchu (wtedy natychmiast).
3. Animacje dotyczą tylko `transform` i `opacity` (analiza keyframes i `transition-property`).
4. `MutationObserver`: element dodany do stref dziecka startuje z kryciem 0 albo należy do listy dozwolonych.
5. Bańki: żaden węzeł nie znika, gdy jego krycie przekracza 0,05.
6. Brak błysków: średnia jasność kolejnych zrzutów co 100 ms przy przejściach faz zmienia się o < 10%.
7. Przy `prefers-reduced-motion` nie ma animacji nieskończonych.

**Regresja wizualna** (`tests/visual/*.spec.ts`, `?test=1&still=1` zamraża animacje, `maxDiffPixelRatio: 0.01`):
- 6–8 scenerii × pion i poziom × dzień i noc;
- menażeria (z Fazy 5);
- panel rodzica: każda sekcja na telefonie;
- ekran odpoczynku i pożegnanie.

## Plany

### 12-01 · Wydajność na telefonie

**Fala 1** · zależy od: Fazy 5, 11 · wymagania: REQ-77 · autonomiczny: nie (pomiar na telefonie autora)

1. **Telefon referencyjny** · `planning/PROJECT.md` (4.3)
   - Działanie: autor wskazuje telefon (zalecany średni Android sprzed 3–4 lat); wpis do `PROJECT.md`.
   - Gotowe gdy: telefon jest zapisany jako punkt odniesienia budżetów.
2. **Instrumentacja** · `src/dev/perf.ts`
   - Działanie: pomiary z projektu technicznego, aktywne tylko z `?test=1&perf=1`.
   - Gotowe gdy: wynik pomiaru jest dostępny w `window.__bath.perf`.
3. **Pomiar i optymalizacja** · pliki według wyników
   - Działanie:
     - profil w DevTools (zdalnie z telefonu) i w Playwright z ograniczeniem CPU (CDP `Emulation.setCPUThrottlingRate`, wartość 4);
     - typowe działania: grupowanie stempli na klatkę, brak renderowania Reacta przy ruchu, `contain: layout paint` na scenie, memoizacja scenerii, limit DPR 2, ograniczenie `will-change`.
   - Gotowe gdy: budżety są spełnione na telefonie referencyjnym.
4. **Test budżetu** · `tests/e2e/perf.spec.ts`
   - Działanie: przy ograniczonym CPU obsługa ruchu ≤ 2 ms (mediana), brak `getImageData` w gorącej ścieżce (szpieg na prototypie). Test działa w CI jako ostrzeżenie, nie blokuje.
   - Gotowe gdy: wynik testu jest raportowany w CI.

**Must-haves:** zmierzone i spełnione budżety · raport pomiaru w opisie PR.

### 12-02 · Audyt spokoju i dostępności

**Fala 1** · zależy od: Fazy 5, 11 · wymagania: REQ-08 · autonomiczny: tak

1. **Audyt spokoju** · `tests/e2e/calm.spec.ts`
   - Działanie: siedem sprawdzeń z projektu technicznego dla pełnej rundy w trybie zwykłym, jednoprzyciskowym i rozszerzonym.
   - Gotowe gdy: audyt przechodzi bez wyjątków spoza listy dozwolonych.
2. **Poprawki** · pliki według wyników audytu
   - Działanie: wydłużenie zbyt krótkich przejść, zamiana właściwości innych niż `transform` i `opacity`, dodanie `data-calm="finger"` tam, gdzie efekt podąża za palcem.
   - Gotowe gdy: wszystkie znaleziska są poprawione albo uzasadnione w PR.
3. **Dostępność** · `docs/ACCESSIBILITY_CHECKLIST.md`
   - Działanie:
     - lista kontrolna: kontrast ≥ 4,5 : 1 w panelu, cele ≥ 44 px (≥ 74 px dla przycisku dziecka), fokus i kolejność tabulacji, jeden region `aria-live`, etykiety, ograniczony ruch, TalkBack i VoiceOver;
     - opcjonalnie `@axe-core/playwright` dla panelu, tylko za zgodą autora (nowa devDependency).
   - Gotowe gdy: lista jest odhaczona.

**Must-haves:** audyt spokoju w CI · lista dostępności odhaczona.

### 12-03 · Regresja wizualna, dokumentacja i wydanie

**Fala 2** · zależy od: 12-01, 12-02 · wymagania: REQ-78, REQ-79 · autonomiczny: nie (zatwierdzenie zrzutów i wydania przez autora)

1. **Zrzuty referencyjne** · `tests/visual/sceneries.spec.ts`, `tests/visual/parent.spec.ts`, `tests/visual/screens.spec.ts`
   - Działanie: zakres z projektu technicznego; zrzuty menażerii z Fazy 5 zostają.
   - Gotowe gdy: autor zatwierdza zrzuty, a CI je porównuje.
2. **README** · `README.md`
   - Działanie: w stylu child-train:
     - cel, przebieg rundy, sterowanie (pocieranie, klawiatura, jeden przycisk, tryb rozszerzony);
     - panel rodzica, zestawy, dane na urządzeniu i prywatność;
     - opis UI: anatomia ekranu, klasy stanu, kontrakt motywu, kolejność warstw, układ responsywny, słownik ruchu;
     - zasady stylu, uruchomienie, budowanie, weryfikacja, źródła i licencje fontów.
   - Gotowe gdy: README pozwala nowej osobie (albo agentowi) rozwijać aplikację bez łamania zasad.
3. **Wersja i zmiany** · `src/version.ts`, `CHANGELOG.md`
   - Działanie: wersja 1.0.0 w jednym pliku, widoczna w panelu („O aplikacji”); `CHANGELOG.md` z opisem v1.0.0.
   - Gotowe gdy: wersja w panelu zgadza się z tagiem.
4. **Lista kontrolna wydania** · `docs/RELEASE_CHECKLIST.md`
   - Działanie: punkty listy:
     - CI zielone, audyt spokoju i zrzuty zatwierdzone;
     - przegląd na Android Chrome i iPhone Safari;
     - instalacja PWA, tryb samolotowy, `dist/index.html` z dysku;
     - sesja 4 rund we wszystkich trybach sterowania;
     - test zero-network; kopia ustawień w obie strony;
     - tag `v1.0.0`, GitHub Release z opisem, Pages zaktualizowane.
   - Gotowe gdy: lista jest odhaczona w PR wydania.
5. **Wydanie** · tag i GitHub Release
   - Działanie: tag `v1.0.0`, notatki wydania; aktualizacja `planning/ROADMAP.md` (sekcja kamieni milowych po wydaniu, zgodnie z GSD).
   - Gotowe gdy: v1.0.0 działa na GitHub Pages.

**Must-haves:** zrzuty referencyjne w CI · README z opisem UI i zasad stylu · v1.0.0 opublikowane.

## Weryfikacja fazy

- **Automatycznie:** całe CI (unit, e2e, visual, calm, perf jako ostrzeżenie).
- **Przegląd autora: próba generalna przed pokazaniem dziecku:**
  - [ ] Pełna sesja 4 rund na telefonie referencyjnym, płynnie.
  - [ ] Wieczorem, przy przyciemnionym ekranie: nic nie razi ani nie zaskakuje.
  - [ ] Każdy tryb sterowania działa od początku do końca.
  - [ ] Ustawienia z zestawu „Żabka i pieski” zostają po ponownym uruchomieniu.
  - [ ] Ekran odpoczynku pojawia się po limicie i po rundach.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | ≥ 55 kl./s przy pocieraniu na telefonie referencyjnym | pomiar z `perf=1` na telefonie + `perf.spec.ts` |
| 2 | Brak pojawień < 0,5 s, pętli < 1,2 s, pękających baniek i błysków | `calm.spec.ts` |
| 3 | Wszystkie testy i zrzuty zielone w CI | `checks.yml` |
| 4 | README z opisem UI i stylu; v1.0 na Pages | przegląd README + lista kontrolna wydania |

## Ryzyka i pułapki

- **Niestabilne testy wizualne:** zamrożone animacje (`still=1`), stałe ziarno, osadzone fonty, jedna wersja Chromium w CI.
- **Pomiar wydajności w CI różni się od telefonu:** w CI tylko ostrzeżenie; decyzję podejmujemy na podstawie pomiaru na telefonie referencyjnym.
- **Pokusa dodawania funkcji przed wydaniem:** wszystko nowe trafia do v1.0.x albo v1.1.

## Przekazanie

- Po v1.0: obserwacja pierwszych sesji dziecka, a potem faza 13 (poprawki v1.0.x) z ciągłą numeracją w ROADMAP.
- Pomysły z sekcji „Po v1.0” w ROADMAP czekają na decyzję autora.

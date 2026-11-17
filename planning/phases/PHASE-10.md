---
phase: 10-panel-rodzica
name: Panel rodzica
status: not-started
depends_on: [09-rozszerzona-interakcja]
requirements: [REQ-60, REQ-61, REQ-62, REQ-63, REQ-64, REQ-65, REQ-66, REQ-67, REQ-68, REQ-69, REQ-70]
clarifications: [DP-3, DP-7]
plans: [10-01, 10-02, 10-03, 10-04]
---

# PHASE-10: Panel rodzica

> **Cel:** rodzic za bramką konfiguruje wszystkie ustawienia v1.0, w tym wagi częstości z podglądem udziału, rytuał i dzienny limit, oraz korzysta z gotowych zestawów.
> **Zależy od:** Faza 9 · **Odblokowuje:** Fazę 11 · **Plany:** 4 (fale: 10-01 → 10-02 ∥ 10-03 → 10-04)

## Wynik fazy

- Magazyn ustawień (kontekst React z reducerem) z sanityzacją. W tej fazie trzymany w pamięci; zapis dochodzi w Fazie 11.
- Bramka: przytrzymanie znaku marki przez 3 s, przycisk ⚙ albo Esc, a potem zadanie na dodawanie.
- Pasek wartości dla rodzica, nagłówek z klepsydrą, tytuł z imieniem i stopka z dedykacją.
- Panel ze wszystkimi ustawieniami z `PROJECT.md` 9.2 i 8 gotowymi zestawami.
- Dzienny licznik czasu (w pamięci) z klepsydrą, przygaszeniem sceny i wejściem do odpoczynku.

## Kontekst

- **Źródła z child-train:**
  - `src/components/ParentModal.tsx` (bramka i zmienne zadanie), `src/components/ParentValueStrip.tsx`;
  - `src/components/JourneyOptions.tsx` (pola dozwolonych treści, planer), `src/journeyPresets.ts` (`presetConflicts`, `presetSettings`);
  - `src/hooks/useModalFocus.ts`, `src/hooks/useActivePlaytime.ts`.
- **DP-3:** reguły rytuału własnego, z walidacją na żywo.
- **DP-7:** dzienny limit jak w child-page: liczy tylko widoczny czas, rodzic może wyzerować dzisiejszy licznik; po upływie limitu bieżące zwierzątko zostaje dokończone.
- **Reguły z child-train:**
  - zmiany planera obowiązują od następnej rundy, a „Nowa kąpiel” zaczyna od razu;
  - „Wszystko losowo” czyści tylko przypięcia;
  - zestaw nigdy nie włącza wykluczonych treści i nie zmienia imienia, wykluczeń, wag ani limitów.

## Zakres

**W zakresie:** magazyn ustawień, bramka, pasek wartości, nagłówek, panel, zestawy, licznik w pamięci, usunięcie haków `?test=1` z obsługi ustawień (zostają tylko do testów).
**Poza zakresem:** zapis, kopia ustawień, statystyki i usuwanie danych (Faza 11; tutaj sekcja „Dane” jako zaślepka).

## Projekt techniczny

```ts
// src/settings/store.tsx
export const SettingsContext: React.Context<{ settings: BathSettings; dispatch: (a: SettingsAction) => void }>;
export type SettingsAction =
  | { type: "set"; patch: Partial<BathSettings> }
  | { type: "applyPreset"; presetId: string }
  | { type: "pinNextRound"; slot: 0 | 1 | 2; animal: Slot<string> }
  | { type: "allRandom" }
  | { type: "newBath" };
export function sanitizeSettings(s: unknown): BathSettings; // minima pul, reguły DP-3, zakresy liczb, nieznane id pomijane

// src/settings/presets.ts (wzór: journeyPresets.ts)
export interface BathPreset { id: string; name: string; description: string; settings: Pick<BathSettings, "planner" | "ritual" | "pace" | "weatherOverride" | "timeOverride" | "seasonOverride"> }
export function presetConflicts(p: BathPreset, s: BathSettings): string[]; // nazwy wykluczonych zwierząt i scenerii
```

**Bramka:**
- przytrzymanie znaku marki przez 3 s wypełnia wokół niego subtelny pierścień (bez liczb); puszczenie przerywa;
- zadanie: a + b, gdzie a i b są z przedziału 3–9, zmienia się przy każdym otwarciu i po błędzie;
- odpowiedź wpisujemy na dużej klawiaturze numerycznej (0–9, ⌫, OK);
- po błędzie: „Spróbuj jeszcze raz.”, bez ujawniania wyniku; Esc zamyka okno.

**Panel** (`<dialog>` na pełny ekran telefonu, nagłówek „Dla rodziców” i ✕, sekcje jako `<details>`, zmiany działają od razu):

| # | Sekcja | Zawartość |
|---|---|---|
| 1 | Dziecko | imię w dopełniaczu z podglądem tytułu „Mała łazienka {imię}” |
| 2 | Zwierzątka | 5 grup z przełącznikiem grupy, pola wyboru, waga 1× / 2× / 3× przy każdym, szybkie ustawienie wagi dla grupy, podgląd udziału, ostrzeżenie o niewykonalności, „Włącz wszystkie” |
| 3 | Miejsca i ślady | scenerie (min. 2), ślady zabawy (min. 2), „Włącz wszystkie” |
| 4 | Plan następnej rundy | 3 sloty zwierzątek, sceneria, 3 ślady; „Wszystko losowo”, „Nowa kąpiel” |
| 5 | Kąpiel | rytuał: Krótki / Klasyczny / Z namydlaniem / Pełne SPA / Własny (pola wyboru kroków z komunikatami DP-3); łatwość: Łatwa / Zwykła / Dokładna |
| 6 | Sterowanie i ekran | tryb jednoprzyciskowy, rozszerzona interakcja, zdanie narracji, sekwencja kroków |
| 7 | Rytm | tempo 1,45× / 1,2× / 1× / 0,8×; odpoczynek co N rund (1–8) i „Pora na odpoczynek teraz”; dzienny limit (minuty albo bez limitu) i „Wyzeruj dzisiejszy licznik” |
| 8 | Atmosfera | pogoda, pora dnia, pora roku: automatycznie albo stała wartość |
| 9 | Gotowe zestawy | 8 zestawów z opisem, „Użyj zestawu”, wyjaśnienie konfliktu |
| 10 | Dane | zaślepka dla Fazy 11 |
| — | O aplikacji | wersja, dedykacja „Z myślą o Arturze”, licencja MIT |

**Podgląd udziału:** `calibrateWeights().shares` z Fazy 8, np. „Żabka ≈ 8% kąpieli, pieski razem ≈ 27%”.
- Przy celu niewykonalnym: „Przy tak małej liczbie zwierzątek {Imię} nie może pojawiać się aż tak często.”
- Liczby widzi tylko rodzic, nigdy dziecko.

**Dzienny licznik** (`src/hooks/useDailyPlaytime.ts`; w tej fazie w pamięci):
- liczy widoczny czas zabawy (tik co 1 s, przerwy dłuższe niż 2 s nie są doliczane);
- od 80% limitu klasa `.time-near-limit` przygasza scenę do 86% krycia (1,2 s);
- przy 100% wywołuje `requestRest('limit')` (Faza 8);
- klepsydra w nagłówku pokazuje ubywający piasek, bez liczb.

## Plany

### 10-01 · Bramka, pasek wartości, nagłówek i szkielet panelu

**Fala 1** · zależy od: Faza 9 · wymagania: REQ-60, REQ-61, REQ-62 · autonomiczny: tak

1. **Magazyn ustawień** · `src/settings/store.tsx`, `src/settings/sanitize.ts`
   - Działanie: kontekst, reducer akcji, `sanitizeSettings`; komponenty czytają ustawienia z kontekstu zamiast z parametrów URL.
   - Gotowe gdy: parametry `?test=1` tylko nadpisują wartości początkowe.
2. **Bramka** · `src/components/ParentGate.tsx`, `src/hooks/useModalFocus.ts`
   - Działanie: port z child-train, reguły z projektu technicznego.
   - Gotowe gdy: bramka działa z przytrzymania, ⚙ i Esc, a wynik nigdy nie jest ujawniany.
3. **Nagłówek i pasek** · `src/components/TopBar.tsx`, `src/components/ParentValueStrip.tsx`
   - Działanie:
     - znak marki (bańka), klepsydra (gdy ustawiono limit), ikona „Zawsze bez dźwięku”, ⚙;
     - pasek „Bez dźwięku · Bez reklam · Bez internetu · Nic nie wychodzi z urządzenia”, zwijany do pigułki „Dla rodziców”.
   - Gotowe gdy: nagłówek mieści się na 360 px.
4. **Tytuł i stopka** · `src/App.tsx`
   - Działanie:
     - „Mała łazienka {imię}” w nagłówku, w `document.title` i w etykietach ARIA;
     - stopka z dedykacją „Z myślą o Arturze” widoczna, gdy jest miejsce (poziom, laptop, wysokość ≥ 700 px), a zawsze w sekcji „O aplikacji”.
   - Gotowe gdy: zmiana imienia od razu zmienia wszystkie trzy miejsca.
5. **Szkielet panelu** · `src/components/ParentPanel.tsx`
   - Działanie: `<dialog>` z sekcjami z tabeli (początkowo puste); przywracanie fokusu po zamknięciu.
   - Gotowe gdy: Enter i Esc w panelu nie sterują zabawą.

**Must-haves:** bramka przed każdym wejściem do panelu · magazyn ustawień jako jedno źródło prawdy.

### 10-02 · Treści: imię, wykluczenia, planer, wagi

**Fala 2** · zależy od: 10-01 · wymagania: REQ-62, REQ-63, REQ-64, REQ-65 · autonomiczny: tak

1. **Sekcja „Dziecko”** · `src/components/parent/ChildSection.tsx`
   - Działanie: imię w dopełniaczu, z podpowiedzią „np. Mai, Artura”; pusty tekst przywraca „dziecka”.
   - Gotowe gdy: podgląd tytułu aktualizuje się na żywo.
2. **Sekcja „Zwierzątka”** · `src/components/parent/AnimalsSection.tsx`
   - Działanie:
     - grupy z przełącznikiem, pola wyboru, wagi, szybkie wagi grupy, podgląd udziału, ostrzeżenie;
     - minimum 4 dozwolone zwierzątka: ostatnich pól nie da się odznaczyć, z wyjaśnieniem dlaczego;
     - przycisk wykluczenia samego T-Rexa (DP-5).
   - Gotowe gdy: zmiana wag od razu zmienia podgląd udziału.
3. **Sekcja „Miejsca i ślady”** · `src/components/parent/PlacesSection.tsx`
   - Działanie: scenerie i ślady z minimami 2.
   - Gotowe gdy: minima są egzekwowane.
4. **Planer** · `src/components/parent/PlannerSection.tsx`
   - Działanie:
     - sloty z opcjami tylko z dozwolonych treści i „Losowo”; przypięcie wykluczonego elementu zamienia się na „Losowo”;
     - „Wszystko losowo”;
     - „Nowa kąpiel” zaczyna od razu, zachowując imię, ustawienia i liczniki.
   - Gotowe gdy: przypięcia trafiają do następnej rundy (`planRound` z Fazy 8).

**Must-haves:** minima pul egzekwowane · podgląd udziału i ostrzeżenie dla wag · zmiany planera od następnej rundy.

### 10-03 · Kąpiel, sterowanie, rytm i atmosfera

**Fala 2** · zależy od: 10-01 · wymagania: REQ-66, REQ-67, REQ-68, REQ-69 · autonomiczny: tak

1. **Sekcja „Kąpiel”** · `src/components/parent/BathSection.tsx`
   - Działanie:
     - gotowe rytuały oraz „Własny” z polami wyboru kroków;
     - komunikaty DP-3 na żywo, np. „Namydlanie wymaga płukania”; niepoprawnej kombinacji nie da się zapisać;
     - łatwość mycia (szerokość gąbki i próg 80 / 90 / 95%).
   - Gotowe gdy: wszystkie 10 poprawnych kombinacji da się ustawić, a żadnej niepoprawnej.
2. **Sekcja „Sterowanie i ekran”** · `src/components/parent/ControlsSection.tsx`
   - Działanie: cztery przełączniki; zmiana trybu sterowania zaczyna działać od następnego kroku.
   - Gotowe gdy: przełączniki działają bez przeładowania strony.
3. **Sekcja „Rytm”** · `src/components/parent/RhythmSection.tsx`, `src/hooks/useDailyPlaytime.ts`
   - Działanie:
     - tempo: zmiana zachowuje postęp bieżącego przejścia (jak w child-train);
     - odpoczynek co N rund i „Pora na odpoczynek teraz” (`requestRest('manual')`, przejście 1,2 s);
     - dzienny limit (minuty albo bez limitu), licznik w pamięci, klepsydra, przygaszenie od 80%, „Wyzeruj dzisiejszy licznik”.
   - Gotowe gdy: upływ limitu w trakcie kąpieli kończy się odpoczynkiem dopiero po ławeczce (DP-7).
4. **Sekcja „Atmosfera”** · `src/components/parent/AtmosphereSection.tsx`
   - Działanie: pogoda, pora dnia i pora roku: automatycznie albo stała wartość; zmiana działa od razu, z łagodnym przejściem.
   - Gotowe gdy: stała wartość blokuje zegar świata (Faza 6).

**Must-haves:** walidacja DP-3 w UI · limit nie przerywa kąpieli · przejęcie ekranu odpoczynku przez bramkę (wyjście z `resting`).

### 10-04 · Gotowe zestawy i testy panelu

**Fala 3** · zależy od: 10-02, 10-03 · wymagania: REQ-70 · autonomiczny: tak

1. **Zestawy** · `src/settings/presets.ts`, `src/components/parent/PresetsSection.tsx`
   - Działanie: 8 zestawów z `PROJECT.md` 9.3: Wieczorna kąpiel, Żabka i pieski, Błotny dzień, Dinozaury w spa, Ciepła balia, Letni pomost, Kocie SPA, Losowa kąpiel.
     - Zestaw wypełnia planer, rytuał, tempo i atmosferę.
     - Nie zmienia imienia, wykluczeń, wag ani limitów.
     - Przy konflikcie wymienia wykluczone elementy, a przycisk jest nieaktywny.
   - Gotowe gdy: każdy zestaw działa z domyślnymi ustawieniami.
2. **Wybudzanie** · `src/components/RestScreen.tsx`
   - Działanie: ekran odpoczynku ma przycisk ⚙, który otwiera bramkę; po jej przejściu zabawa wraca do `door_waiting`; hak `wake()` zostaje tylko w trybie testowym.
   - Gotowe gdy: dziecko nie może samo zamknąć ekranu odpoczynku.
3. **Testy** · `tests/e2e/parent.spec.ts`, `tests/unit/presets.spec.ts`, `tests/unit/sanitize.spec.ts`
   - Działanie:
     - bramka: przytrzymanie 3 s, ⚙ i Esc; błędna odpowiedź zmienia zadanie i nie pokazuje wyniku;
     - każde ustawienie z sekcji 9.2 ma test działania;
     - minima pul i reguły DP-3;
     - zestawy i ich konflikty; limit: przygaszenie od 80% i odpoczynek po ławeczce (sztuczny zegar `page.clock`);
     - imię w tytule, w `document.title` i w ARIA.
   - Gotowe gdy: testy przechodzą we wszystkich projektach przeglądarkowych.

**Must-haves:** 8 zestawów z wykrywaniem konfliktów · pełne pokrycie ustawień testami.

## Weryfikacja fazy

- **Automatycznie:** testy `parent.spec.ts`, `presets` i `sanitize`.
- **Przegląd autora na telefonie:**
  - [ ] Bramka jest prosta dla dorosłego i trudna dla 3-latka.
  - [ ] Panel jest czytelny na telefonie, a sekcje nie przytłaczają.
  - [ ] Podgląd udziału wag jest zrozumiały.
  - [ ] Zestaw „Żabka i pieski” od razu ustawia zabawę.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | Panel otwierany przytrzymaniem, ⚙ lub Esc po poprawnym wyniku; wynik nie jest ujawniany | `parent.spec.ts` |
| 2 | Każde ustawienie działa i ma test, łącznie z rytuałem własnym | `parent.spec.ts`, `sanitize.spec.ts` |
| 3 | Wagi pojedynczo i grupowo z podglądem udziału | `parent.spec.ts` + przegląd |
| 4 | Limit przygasza scenę od 80% i kończy się odpoczynkiem; reset za bramką | `parent.spec.ts` z `page.clock` |
| 5 | Zestaw nie zmienia wykluczeń i wag; konflikt jest opisany | `presets.spec.ts`, `parent.spec.ts` |

## Ryzyka i pułapki

- **Rozbudowany panel na telefonie:** zwijane sekcje, krótkie opisy, rozsądne wartości domyślne.
- **Konflikt Enter i Esc między panelem a zabawą:** przy otwartym panelu zabawa nie dostaje zdarzeń klawiatury.
- **Zmiana tempa w trakcie przejścia:** przeliczenie pozostałego czasu bez cofania postępu (wzór child-train).

## Przekazanie

- Faza 11 zapisuje ustawienia z magazynu, przenosi dzienny licznik do pamięci urządzenia i wypełnia sekcję „Dane”.
- Faza 12 obejmuje panel zrzutami referencyjnymi i audytem dostępności.

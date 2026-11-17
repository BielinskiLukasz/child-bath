---
phase: 08-runda-nagroda
name: Runda i nagroda
status: not-started
depends_on: [07-rytual-narracja]
requirements: [REQ-09, REQ-52, REQ-53, REQ-54, REQ-55, REQ-56, REQ-57, REQ-58, REQ-59]
clarifications: [DP-1, DP-7]
plans: [08-01, 08-02, 08-03]
---

# PHASE-08: Runda i nagroda

> **Cel:** działa pełna pętla zabawy: zapowiedź, kąpiel z ozdobą, ławeczka zapełniana 1 → 2 → 3, pożegnanie i „Pora na odpoczynek”, z losowaniem z ziarnem i wagami częstości.
> **Zależy od:** Faza 7 · **Odblokowuje:** Fazę 9 · **Plany:** 3 (fale: 08-01 ∥ 08-02 → 08-03)

## Wynik fazy

- `src/random.ts` w pełnej wersji: ziarno sesji, worki, ważone losowanie bez zwracania, kalibracja wag.
- Planer rundy: 3 różne zwierzątka, przypięcia rezerwowane przed losowaniem, ślady i towarzysze.
- Ozdoby (11) na kotwicach z Fazy 4 i nagroda bez rozmyć: iskierki, „oddychanie”, reakcja.
- Ławeczka, pożegnanie z zapowiedzią nowej rundy, zmiana rundy i scenerii, ekran „Pora na odpoczynek”.
- Wejście dla dziennego limitu (`requestRest`), które Faza 10 podłączy do licznika.

## Kontekst

- **Decyzje:** D-08 (runda i ławeczka), D-10 (wagi), D-17 (ozdoby i towarzysze).
- **DP-1:** umyte zwierzątko samo siada na ławeczce, a na „Dalej” czeka następne.
- **DP-7:** po upływie limitu bieżące zwierzątko zostaje dokończone i siada na ławeczce.
- **Analiza wag** w `kapiel-zaba-3x.md`: reguła „bez powtórzeń” zniekształca proste ważenie, więc potrzebna jest korekta.
- **Przykład skali** z `PROJECT.md` 8.7: przy 36 zwierzątkach Żabka z wagą 3× to ≈ 7,9% kąpieli.

## Zakres

**W zakresie:** losowanie, planer, ozdoby, nagroda, ławeczka, pożegnanie, zmiana rundy, odpoczynek, wejście dla limitu.
**Poza zakresem:** bramka i budzenie z odpoczynku (Faza 10; do tego czasu `window.__bath.wake()` z `?test=1`), licznik limitu (Fazy 10–11), wybór ozdoby przez dziecko (Faza 9).

## Projekt techniczny

```ts
// src/random.ts
export function createRng(seed: number): Rng;                    // mulberry32 (z Fazy 2)
export function fork(rng: Rng, label: string): Rng;              // niezależne strumienie: zwierzęta, ślady, ozdoby, sceneria
export function createBag<T>(items: T[], rng: Rng): { next(exclude?: T): T };
export function weightedSampleWithoutReplacement<T>(items: T[], w: number[], k: number, rng: Rng): T[];
export function calibrateWeights(target: number[], k: 3): { weights: number[]; feasible: boolean; shares: number[] };

// src/round/planRound.ts
export interface RoundPlan {
  animals: [string, string, string];
  dirt: [DirtKind, DirtKind, DirtKind];
  scenery: SceneryId;
  companions: CompanionId[];
}
export function planRound(input: {
  allowedAnimals: string[]; weights: Record<string, 1 | 2 | 3>;
  pinned: [Slot<string>, Slot<string>, Slot<string>];
  prevLast?: string; rng: Rng; /* ślady, scenerie i przypięcia jak w BathSettings */
}): RoundPlan;
```

**Kalibracja wag:**
- Cel: udział zwierzątka *i* w kąpielach jest proporcjonalny do jego wagi, czyli π*ᵢ* = 3·w*ᵢ*/Σw (π*ᵢ* to prawdopodobieństwo, że zwierzątko trafi do rundy).
- Jeśli któreś π*ᵢ* > 1, cel jest niewykonalny: `feasible: false`, a panel w Fazie 10 pokazuje ostrzeżenie.
- Algorytm:
  - dokładne prawdopodobieństwa obecności liczymy, przechodząc wszystkie uporządkowane trójki (przy 36 zwierzątkach to 42 840 trójek);
  - iteracja punktu stałego: w′*ᵢ* ← w′*ᵢ* · (π*ᵢ* / π̂*ᵢ*)^0,5, aż błąd spadnie poniżej 1e-4 albo minie 50 iteracji;
  - wynik trzymamy w cache według zestawu wag.
- Reguła „pierwsze ≠ ostatnie z poprzedniej rundy” daje niewielkie odchylenie; sprawdza je symulacja (±1 pp).

**Ozdoby** (worek; filtr pory roku i macierzy zgodności z Fazy 4):

| id | Ozdoba | Kotwica | Kiedy |
|---|---|---|---|
| `wreath_flowers` | wianek z kwiatów | `headTop` | wiosna, lato |
| `wreath_leaves` | wianek z liści | `headTop` | jesień |
| `bow` | kokardka | `earLeft` / `earRight` | zawsze |
| `crown` | korona | `headTop` | zawsze |
| `party_hat` | czapeczka | `headTop` | zawsze |
| `towel_turban` | turban z ręcznika | `headTop` | zawsze |
| `flower` | kwiatek | `earLeft` | zawsze |
| `bow_tie` | muszka | `neck` | zawsze |
| `star` | gwiazdka | `brow` | zawsze |
| `straw_hat` | słomkowy kapelusz | `headTop` | lato |
| `pompom_hat` | czapka z pomponem | `headTop` | zima |

**Przebieg rundy** (fazy jak w `PROJECT.md` 12.5):

| Faza | Czas (× tempo) | Co się dzieje |
|---|---|---|
| `door_waiting` | do „Dalej” | następne zwierzątko czeka w miejscu zapowiedzi |
| `arriving` | 0,8 s | wejście do balii, szalik na haczyk |
| kroki rytuału | — | Fazy 2 i 7 |
| `reward` | 2,5 s | ozdoba, iskierki, „oddychanie”, reakcja |
| `to_bench` | 1,0 s | przejście na miejsce 1, 2 albo 3, szlafrok, szalik na szyję |
| `farewell` | 6 s, potem czekanie | trójka macha; w zapowiedzi stoi pierwsze zwierzątko nowej rundy |
| `round_change` | ≥ 1,2 s | trójka odchodzi, sceneria przenika, pora roku +1 |
| `resting` | do bramki | ekran z księżycem (przejście 1,2 s) |

## Plany

### 08-01 · Losowanie i planer rundy

**Fala 1** · zależy od: Faza 7 · wymagania: REQ-54, REQ-58, REQ-59 · autonomiczny: tak

1. **Rozbudowa RNG** · `src/random.ts`
   - Działanie: `fork`, `createBag`, `weightedSampleWithoutReplacement`, `calibrateWeights`.
   - Gotowe gdy: dla tego samego ziarna wyniki są identyczne.
2. **Planer** · `src/round/planRound.ts`
   - Działanie:
     - przypięcia rezerwowane są pierwsze, więc losowanie nie „podbiera” zwierzątka przypiętego dalej;
     - wolne sloty: ważone losowanie bez zwracania z dozwolonych minus przypięte; w slocie 1 bez `prevLast`;
     - ślady z worka, sceneria przez `pickScenery` (Faza 6), 1–2 towarzyszy.
   - Gotowe gdy: plan ma zawsze 3 różne zwierzątka.
3. **Testy** · `tests/unit/round-plan.spec.ts`, `tests/unit/weights.spec.ts`
   - Działanie:
     - 10 000 rund na wielu ziarnach: brak powtórzeń w rundzie i na styku rund;
     - udziały zgodne z wagami (±1 pp) dla scenariuszy: wszystkie 1×; Żabka 3×; Żabka 3× i pieski 2×; 12 dozwolonych z Żabką 3×;
     - przypięcia zawsze trafiają do swoich slotów;
     - przy 4 dozwolonych i wadze 3× cel jest niewykonalny (`feasible: false`).
   - Gotowe gdy: testy przechodzą.

**Must-haves:** losowanie z ziarnem poza reducerem · wagi z korektą · przypięcia rezerwowane przed losowaniem.

### 08-02 · Ozdoby i nagroda

**Fala 1** · zależy od: Faza 7 · wymagania: REQ-52, REQ-53 · autonomiczny: nie (przegląd ozdób przez autora)

1. **Ozdoby** · `src/decor/decor.tsx`, `src/decor/pickDecor.ts`
   - Działanie:
     - 11 płaskich SVG z tabeli, rysowanych na kotwicy w skali zwierzątka;
     - worek z filtrem pory roku i macierzy zgodności.
   - Gotowe gdy: każda ozdoba wygląda dobrze na każdym zgodnym zwierzątku (galeria `?test=1&gallery=decor`).
2. **Nagroda** · `src/components/Reward.tsx`
   - Działanie:
     - 5–7 kremowych iskierek o 4 ramionach pojawia się przez 0,6 s, dryfuje i znika do 2,5 s;
     - zwierzątko „oddycha” (skala 1 → 1,03, 2,4 s) i wykonuje reakcję ze swojej listy;
     - bez filtrów, rozmyć i cieni.
   - Gotowe gdy: nagroda przechodzi audyt spokoju (czasy ≥ 0,5 s).
3. **Testy** · `tests/unit/decor.spec.ts`
   - Działanie: każda ozdoba ma kotwicę u co najmniej 80% zwierzątek; worek nie powtarza ozdoby, zanim nie wyczerpie puli; ozdoby sezonowe pojawiają się tylko w swojej porze roku.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** ≥ 10 ozdób z worka · nagroda bez rozmyć i cieni.

### 08-03 · Ławeczka, pożegnanie, zmiana rundy i odpoczynek

**Fala 2** · zależy od: 08-01, 08-02 · wymagania: REQ-09, REQ-55, REQ-56, REQ-57 · autonomiczny: nie (przegląd całej pętli na telefonie)

1. **Ławeczka** · `src/components/Bench.tsx`, `src/game.ts`
   - Działanie:
     - miejsca z `layout.bench` scenerii (Faza 6), kolejno od lewej (1 → 2 → 3);
     - przejście 1,0 s ze skalą do ≈ 0,45;
     - na ławeczce szlafrok w jednym z kolorów ręczników, ozdoba zostaje, szalik wraca na szyję.
   - Gotowe gdy: `data-bench` rośnie 0 → 1 → 2 → 3.
2. **Pożegnanie i nowa runda** · `src/components/Farewell.tsx`, `src/game.ts`
   - Działanie:
     - po trzecim zwierzątku trójka macha (`armWave`, 6 s), a w zapowiedzi stoi pierwsze zwierzątko nowej rundy;
     - po „Dalej”: `round_change` (trójka odchodzi, sceneria przenika, pora roku +1), a potem od razu `arriving`.
   - Gotowe gdy: jedno „Dalej” zmienia rundę i scenerię.
3. **Odpoczynek** · `src/components/RestScreen.tsx`, `src/game.ts`
   - Działanie:
     - port `RestScreen` z child-train: księżyc i zwierzątka z ławeczki śpiące w szlafrokach (nastrój `dozing`);
     - wejście po pożegnaniu w N-tej rundzie (`roundsBeforeRest`, domyślnie 4; w testach `?test=1&rounds=1`);
     - `requestRest(reason: "rounds" | "limit" | "manual")`; przy `limit` w trakcie kąpieli najpierw kończy się `to_bench` (DP-7);
     - wyjście tylko przez bramkę (do Fazy 10 hak `window.__bath.wake()`).
   - Gotowe gdy: dziecko nie może zamknąć ekranu odpoczynku.
4. **Testy E2E** · `tests/e2e/round.spec.ts`
   - Działanie:
     - pełna runda z `?test=1&ease=easy` i syntetycznymi pociągnięciami, kolejność ławeczki 1 → 2 → 3;
     - pożegnanie → „Dalej” → nowa sceneria (`data-scenery` się zmienia);
     - przy `rounds=1` odpoczynek po pierwszym pożegnaniu;
     - `requestRest('limit')` w trakcie kąpieli: odpoczynek dopiero po `to_bench`;
     - REQ-09: tekst w `#scene`, `#narration` i `#action` nie zawiera cyfr ani słów „punkt”, „wynik”, „błąd”.
   - Gotowe gdy: testy przechodzą we wszystkich projektach przeglądarkowych.

**Must-haves:** pełna pętla bez punktów i porażek · odpoczynek zamyka tylko bramka · limit nie przerywa kąpieli.

## Weryfikacja fazy

- **Automatycznie:** testy `round-plan`, `weights`, `decor` i `round.spec.ts`.
- **Przegląd autora na telefonie** (sesja 2 rund):
  - [ ] Rytm zabawy jest spokojny, a „Dalej” daje dziecku kontrolę.
  - [ ] Ławeczka czytelnie się zapełnia, a pożegnanie jest miłe i niezbyt długie.
  - [ ] Ozdoby pasują do zwierzątek.
  - [ ] Ekran odpoczynku jest kojący.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | Pełna runda z ozdobami i ławeczką 1 → 2 → 3 | `round.spec.ts` |
| 2 | Pożegnanie, zapowiedź nowej rundy i jedno „Dalej” zmienia rundę | `round.spec.ts` |
| 3 | Odpoczynek po N rundach, zamyka go tylko bramka; limit czeka na ławeczkę | `round.spec.ts` |
| 4 | 10 000 rund: brak powtórzeń, wagi ±1 pp, brak punktów i porażek | `round-plan.spec.ts`, `weights.spec.ts`, `round.spec.ts` |

## Ryzyka i pułapki

- **Wydajność kalibracji:** 42 840 trójek × do 50 iteracji to ≈ 2 mln operacji, poniżej 50 ms; liczymy tylko po zmianie wag, z cache.
- **Mała pula po wykluczeniach** (≥ 4 zwierzątka): planer zawsze ma z czego wybrać; niewykonalne wagi są sygnalizowane, nie ukrywane.
- **Długa runda dla małego dziecka:** czasy w `timing.ts` korygujemy po przeglądzie.

## Przekazanie

- Faza 9 wstawia fazę `choosing_decor` przed `reward` (tryb rozszerzony).
- Faza 10 podłącza bramkę (wyjście z odpoczynku), przypięcia planera, wagi z podglądem udziału (`calibrateWeights().shares`) i dzienny limit (`requestRest('limit')`).
- Faza 11 zlicza ukończone kąpiele (koniec `to_bench`) w statystykach.

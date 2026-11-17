---
phase: 02-silnik-kapieli
name: Silnik kąpieli
status: in-progress
depends_on: [01-fundamenty]
requirements: [REQ-10, REQ-11, REQ-12, REQ-13, REQ-14, REQ-15, REQ-16, REQ-17, REQ-18]
clarifications: []
plans: [02-01, 02-02, 02-03]
---

# PHASE-02: Silnik kąpieli

> **Cel:** dziecko może wyczyścić zwierzątko-szkic w trzech krokach, pocierając je palcem lub myszą, a kroki domykają się same po osiągnięciu progu.
> **Zależy od:** Faza 1 · **Odblokowuje:** Fazy 3, 4, 6 · **Plany:** 3 (fale: 02-01 → 02-02 → 02-03)

## Wynik fazy

- Czysty rdzeń mechaniki: siatka pokrycia, progi łatwości, typy kroków (zmywanie i nakładanie), reducer faz kąpieli.
- `BathStage` na scenie: zwierzątko-szkic, warstwa kroku w canvasie, narzędzie pod palcem, bańki, krople i strumień.
- Roboczy rytuał klasyczny (brud → piana → wilgoć) przechodzi od początku do końca, a po nim pojawia się nowe zwierzątko-szkic.
- Deterministyczne testy rdzenia i testy E2E pocierania.

## Kontekst

- **Mechanika z `kapiel`** (child-page, `js/kapiel.js`):
  - przestrzeń logiczna 256 × 336, proporcje 64 : 84;
  - `BRUSH = [0.11, 0.2, 0.17]`, średnica narzędzia min. 44 px CSS;
  - `REST_S = 0.5`, `IN_S = 0.7`;
  - pula 28 baniek (życie 1,6 s, nowa co 0,09 s);
  - warstwy przycinane do sylwetki (`source-atop`), zmywanie przez `destination-out`.
- **Zmiany względem `kapiel`** (`PROJECT.md` A1–A4):
  - postęp liczony siatką pokrycia zamiast `getImageData`;
  - jawny reducer faz;
  - zegar świadomy widoczności karty;
  - brak asynchronicznych obrazów.
- **Decyzje:** D-14 (rytuał), D-19 (łatwość).

## Zakres

**W zakresie:** rdzeń, reducer kroków, pocieranie, warstwy robocze, cząsteczki, zwierzątko-szkic, minimalny `random.ts`, `timing.ts`.
**Poza zakresem:**
- klawiatura, zapowiedź i „Dalej” (Faza 3);
- prawdziwe zwierzątka (Faza 4);
- źródła wody scenerii (Faza 6);
- namydlanie, czesanie i ślady zabawy (Faza 7).

## Projekt techniczny

| Plik | Odpowiedzialność |
|---|---|
| `src/bath/coverage.ts` | siatka pokrycia, stemplowanie odcinka, postęp |
| `src/bath/steps.ts` | definicje kroków, tryb, szerokość narzędzia, łatwość |
| `src/bath/layers.ts` | malowanie warstw roboczych (brud, piana, wilgoć) z ziarnem |
| `src/game.ts` | reducer faz kąpieli (wersja 1) |
| `src/timing.ts` | stałe czasowe (× tempo) |
| `src/random.ts` | `createRng(seed)` (mulberry32): `float`, `int`, `pick`; rozbudowa w Fazie 8 |
| `src/hooks/useBathClock.ts` | pętla rAF, `dt ≤ 50 ms`, pauza przy ukrytej karcie |
| `src/hooks/useScrub.ts` | zdarzenia wskaźnika → odcinki w przestrzeni logicznej |
| `src/components/BathStage.tsx`, `LayerCanvas.tsx`, `ToolCursor.tsx`, `Particles.tsx` | widok |
| `src/animals/sketch.ts` | zwierzątko-szkic i jego maska |

```ts
export const LW = 256, LH = 336;                 // jak w kapiel
export const GRID_COLS = 64, GRID_ROWS = 84;     // komórka = 4 × 4 jednostki logiczne
export interface CoverageGrid {
  cols: number; rows: number;
  inside: Uint8Array; done: Uint8Array;
  insideCount: number; doneCount: number;
}
export function createGrid(inside: Uint8Array): CoverageGrid;
export function stampSegment(g: CoverageGrid, x0: number, y0: number, x1: number, y1: number, r: number): number; // liczba nowych komórek
export function progress(g: CoverageGrid): number;                                                                // doneCount / insideCount

export type StepKind = "scrub" | "lather" | "rinse" | "dry" | "groom";
export interface StepDef { kind: StepKind; mode: "erase" | "apply"; brushFrac: number }
// scrub 0.11 erase · lather 0.14 apply · rinse 0.20 erase · dry 0.17 erase · groom 0.12 apply
export const STEPS: Record<StepKind, StepDef>;
export const EASE = {
  easy:    { brush: 1.3,  threshold: 0.8 },
  normal:  { brush: 1,    threshold: 0.9 },
  precise: { brush: 0.85, threshold: 0.95 },
} as const;
export function brushRadius(step: StepDef, ease: keyof typeof EASE, boxWidthCss: number): number; // jednostki logiczne; średnica ≥ 44 px CSS
```

**Reducer, wersja 1:**
- Przebieg: `stage_in` (0,7 s) → `scrubbing` → `stage_rest` (0,5 s; 0 s przy ograniczonym ruchu) → następny krok albo `reward` (zaślepka 2 s) → nowe zwierzątko-szkic.
- Akcje: `tick(dt)`, `progress(value)`, `layerReady`, `newAnimal(steps, seed)`.
- Akcja niepasująca do bieżącej fazy jest ignorowana, więc żadna faza nie nadpisuje innej.

## Plany

### 02-01 · Rdzeń: siatka pokrycia i kroki

**Fala 1** · zależy od: Faza 1 · wymagania: REQ-10, REQ-11, REQ-12, REQ-15, REQ-18 · autonomiczny: tak

1. **Siatka pokrycia** · `src/bath/coverage.ts`
   - Działanie:
     - stemplowanie kapsułą (odcinek z promieniem) po komórkach w prostokącie ograniczającym;
     - liczą się tylko komórki `inside`;
     - brak alokacji w gorącej ścieżce.
   - Gotowe gdy: odcinek przez środek sylwetki oznacza oczekiwane komórki, a postęp rośnie monotonicznie i nie przekracza 1.
2. **Kroki i łatwość** · `src/bath/steps.ts`, `src/timing.ts`
   - Działanie:
     - `STEPS`, `EASE`, `brushRadius()`;
     - zmywanie i nakładanie mierzone tą samą siatką (REQ-11);
     - stałe czasowe w jednym miejscu.
   - Gotowe gdy: średnica narzędzia ≥ 44 px CSS nawet w najmniejszym pudełku (160 px).
3. **Minimalny RNG** · `src/random.ts`
   - Działanie: mulberry32 z ziarnem; `float()`, `int(a, b)`, `pick(list)`.
   - Gotowe gdy: to samo ziarno daje ten sam ciąg liczb.
4. **Testy** · `tests/unit/coverage.spec.ts`, `tests/unit/steps.spec.ts`, `tests/unit/no-math-random.spec.ts`
   - Działanie: przypadki:
     - odcinek zerowej długości działa jak stempel;
     - odcinek poza sylwetką oznacza 0 komórek;
     - pełne pokrycie daje postęp 1;
     - progi 0,8 / 0,9 / 0,95;
     - brak `Math.random` w `src/` poza `random.ts`.
   - Gotowe gdy: testy przechodzą deterministycznie w projekcie `unit`.

**Must-haves:** rdzeń bez DOM i canvasu · deterministyczne testy · szerokość narzędzia zależna od kroku i łatwości.

### 02-02 · Reducer faz i zegar

**Fala 2** · zależy od: 02-01 · wymagania: REQ-12, REQ-17, REQ-18 · autonomiczny: tak

1. **Reducer kąpieli v1** · `src/game.ts`
   - Działanie:
     - stan `{ phase, stepIndex, steps, progress, phaseT, animalSeed }`;
     - przejścia i czasy jak w projekcie technicznym;
     - `stage_rest` = 0 s przy ograniczonym ruchu.
   - Gotowe gdy: reducer nie ma efektów ubocznych (tylko dane wejściowe i akcje).
2. **Zegar** · `src/hooks/useBathClock.ts`
   - Działanie:
     - pętla rAF, `dt = min(now − last, 50 ms)`, mnożnik tempa;
     - zatrzymanie przy `document.hidden` i wznowienie bez skoku czasu;
     - pętla staje, gdy nie trwa żadna faza czasowa ani nie żyją cząsteczki.
   - Gotowe gdy: przy ukrytej karcie `phaseT` się nie zmienia.
3. **Testy** · `tests/unit/bath-reducer.spec.ts`
   - Działanie: przypadki:
     - pełna sekwencja 3 kroków z syntetycznymi `tick`;
     - `progress` w fazie `stage_in` jest ignorowane;
     - odtworzenie tej samej listy akcji daje ten sam stan;
     - `pace = 1.45` wydłuża przejścia, ale nie zmienia progów.
   - Gotowe gdy: testy przechodzą bez przeglądarki.

**Must-haves:** czysty reducer · ukryta karta zatrzymuje czas · żadna faza nie nadpisuje innej.

### 02-03 · Widok: pocieranie, warstwy, narzędzie, cząsteczki

**Fala 3** · zależy od: 02-02 · wymagania: REQ-10, REQ-13, REQ-14, REQ-15, REQ-16, REQ-17 · autonomiczny: nie (przegląd na telefonie)

1. **Pudełko i układ** · `src/components/BathStage.tsx`
   - Działanie:
     - pudełko 64 : 84 w strefie sceny;
     - wysokość `h = clamp(min(sceneH · 0,96; sceneW · 0,96 · 84/64; 640), ≥ 160)` (wzór z `kapiel`), aktualizowana przez `ResizeObserver`;
     - atrybuty `data-phase`, `data-step`, `data-progress` (dwa miejsca po przecinku).
   - Gotowe gdy: pudełko mieści się w scenie w trzech rozdzielczościach.
2. **Warstwa kroku** · `src/components/LayerCanvas.tsx`, `src/bath/layers.ts`
   - Działanie:
     - rozmiar wewnętrzny canvasu `LW·dpr × LH·dpr` (dpr ≤ 2), skalowany CSS-em, więc obrót ekranu nie gubi treści;
     - warstwy przycięte do sylwetki: brud (plamy `#b78268`, `#9c7155`), piana (`#fffcf3`, `#f8f5e8` i drobny błysk), wilgoć (ciemniejszy odcień i kremowe kropelki);
     - `destination-out` przy zmywaniu, `source-over` przy nakładaniu; po progu reszta zanika (0,5 s).
   - Gotowe gdy: wygląd warstwy odpowiada postępowi w siatce.
3. **Pocieranie** · `src/hooks/useScrub.ts`
   - Działanie:
     - `pointerdown/move/up/cancel`, `lostpointercapture`, `setPointerCapture`;
     - `getCoalescedEvents()`, z pojedynczymi zdarzeniami jako zapasem;
     - mapa wskaźników (wiele palców), przeliczenie na współrzędne logiczne przez `getBoundingClientRect`, `touch-action: none`;
     - każdy odcinek → `stampSegment` + rysowanie na canvasie; `progress` wysyłany najwyżej raz na klatkę.
   - Gotowe gdy: ruch nie wywołuje ponownego renderowania Reacta (tylko refy).
4. **Narzędzie pod palcem** · `src/components/ToolCursor.tsx`
   - Działanie:
     - robocze, płaskie SVG gąbki, strumienia i ręcznika w miejscu wskaźnika;
     - przy myszy widoczne po najechaniu na pudełko;
     - znika w 0,5 s po puszczeniu.
   - Gotowe gdy: narzędzie jest dokładnie pod palcem.
5. **Cząsteczki** · `src/components/Particles.tsx`
   - Działanie:
     - pula 28 kółek SVG: bańki unoszą się (zmywanie), krople spadają, a strumień biegnie od góry do palca (spłukiwanie);
     - życie 1,6 s, nowa co 0,09 s;
     - animacja tylko przez `transform` i `opacity`.
   - Gotowe gdy: pula nigdy nie przekracza 28 węzłów.
6. **Zwierzątko-szkic** · `src/animals/sketch.ts`
   - Działanie:
     - koło, elipsa i uszy w stylu wycinanki;
     - `Path2D` sylwetki i maska `inside` liczona raz (`isPointInPath` w środkach komórek).
   - Gotowe gdy: interfejs (`path2d`, `inside`, render SVG) jest gotowy do podmiany w Fazie 4.
7. **Testy E2E** · `tests/e2e/bath.spec.ts`
   - Działanie:
     - przeciąganie myszą zygzakiem przechodzi 3 kroki;
     - dwa palce naraz (CDP `Input.dispatchTouchEvent`) zwiększają postęp szybciej niż jeden;
     - zmiana orientacji w połowie kroku (`setViewportSize`) nie zmienia `data-progress`;
     - ukryta karta (`visibilitychange`) wstrzymuje `stage_rest`.
   - Gotowe gdy: test przechodzi w projektach `phone`, `small` i `desktop`.

**Must-haves:** płynne pocieranie na telefonie · postęp przetrwa obrót · brak `getImageData` w obsłudze ruchu.

## Weryfikacja fazy

- **Automatycznie:** testy `coverage`, `steps`, `bath-reducer`, `no-math-random` i `bath.spec.ts` we wszystkich projektach.
- **Przegląd autora na telefonie:**
  - [ ] Pocieranie jednym i dwoma palcami jest płynne, narzędzie jest dokładnie pod palcem.
  - [ ] Kroki kończą się same, a reszta znika łagodnie.
  - [ ] Obrót telefonu w trakcie kroku nie gubi postępu.
  - [ ] Nic nie miga ani nie pojawia się nagle.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | Ścieranie pod narzędziem, także kilkoma palcami | `bath.spec.ts` (mysz, dotyk przez CDP) + przegląd |
| 2 | Próg 80/90/95% → zanik 0,5 s → następny krok | `bath-reducer.spec.ts`, `bath.spec.ts` z `?test=1&ease=…` |
| 3 | Obrót i ukryta karta nie psują postępu | `bath.spec.ts` |
| 4 | Deterministyczne testy rdzenia | `tests/unit/*` |

## Ryzyka i pułapki

- **Rozjazd warstwy i siatki:** obie korzystają z tych samych odcinków i tej samej szerokości narzędzia; test porównuje `data-progress` z wartością oczekiwaną dla znanej ścieżki.
- **Brak `getCoalescedEvents` w części przeglądarek:** zapas na pojedyncze zdarzenia.
- **Wysoki DPR spowalnia rysowanie:** limit dpr = 2.

## Przekazanie

- Faza 3 dodaje klawiaturę, zapowiedź i tryb jednoprzyciskowy do tego samego reducera.
- Faza 4 zastępuje `sketch.ts` prawdziwymi postaciami z tym samym interfejsem.
- Faza 6 zastępuje strumień źródłem wody scenerii.
- Faza 7 dodaje namydlanie, czesanie/głaskanie i ślady zabawy.

## Stan implementacji

- **Kod:** plany 02-01, 02-02 i 02-03 są zaimplementowane w głównym katalogu projektu. Podsumowanie, pokrycie testami i odchylenia: [PHASE-02-SUMMARY.md](PHASE-02-SUMMARY.md).
- **Czeka na formalne zamknięcie:** zielony przebieg GitHub Actions dla tych zmian oraz przegląd na fizycznym telefonie. Klawiatura, zapowiedź i przycisk „Dalej” pozostają w Fazie 3.

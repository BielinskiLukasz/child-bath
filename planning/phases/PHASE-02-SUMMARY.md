# PHASE-02: podsumowanie implementacji (opis PR)

> **Plany:** 02-01, 02-02, 02-03 · **Kod:** `child-bath/` · **Stan:** kod gotowy, nieuruchomiony (brak npm i przeglądarki w środowisku, w którym powstał).

## Co zrobiono

### 02-01 · Rdzeń: siatka pokrycia i kroki
- **`src/bath/coverage.ts`:** siatka 64 × 84 w przestrzeni 256 × 336, stemplowanie kapsułą, postęp; bez DOM i bez alokacji w gorącej ścieżce.
- **`src/bath/steps.ts`:** 5 kroków (zmywanie i nakładanie), szerokości z `kapiel` (`BRUSH`), łatwość 80 / 90 / 95%, narzędzie ≥ 44 px CSS.
- **`src/timing.ts`:** wszystkie stałe czasowe w jednym miejscu.
- **`src/random.ts`:** generator mulberry32 z ziarnem.
- **Testy:** `coverage`, `steps`, `random` (w tym zakaz `Math.random` poza `random.ts`).

### 02-02 · Reducer faz i zegar
- **`src/game.ts`:** czysty reducer `stage_in → scrubbing → stage_rest → (kolejny krok | reward) → done → newAnimal`. Akcje spoza fazy są ignorowane.
- **`src/hooks/useBathClock.ts`:** jedna pętla rAF z krokiem do 50 ms. Staje, gdy nic nie trwa, i przy ukrytej karcie; po powrocie rusza bez skoku czasu.
- **Testy:** `bath-reducer` (pełna sekwencja, ignorowane akcje, powtarzalność, tempo, ograniczony ruch).

### 02-03 · Widok
- **`BathStage.tsx`:** pudełko 64 : 84 (wzór rozmiaru z `kapiel`, `ResizeObserver`) i atrybuty `data-phase`, `data-step`, `data-progress`, `data-animal`.
- **Warstwa:** `LayerCanvas.tsx` i `layers.ts`; canvas o rozmiarze LW·DPR (DPR ≤ 2), przycinanie do sylwetki, `destination-out`.
- **Wejście i efekty:**
  - `useScrub.ts`: wiele palców, przechwycenie wskaźnika, zdarzenia scalone, ruch bez renderowania Reacta;
  - `ToolCursor.tsx`: narzędzie dokładnie pod palcem albo kursorem;
  - `Particles.tsx` z `particles.ts`: pula 28 kółek, tylko `transform` i `opacity`;
  - strumień wody w kroku spłukiwania.
- **Zwierzątko-szkic:** `sketch.ts` (geometria jako dane: SVG, `Path2D` i maska z jednego opisu) oraz `SketchAnimal.tsx`.
- **Testy e2e `bath.spec.ts`:** 3 kroki myszą i nowe zwierzątko; 2 palce przez CDP; obrót ekranu; ukryta karta; zero zapytań sieciowych.

## Pokryte wymagania

| REQ | Realizacja | Test |
|---|---|---|
| REQ-10 | warstwa przycięta do sylwetki, siatka pokrycia | `coverage`, `bath.spec` |
| REQ-11 | `StepMode` erase/apply, jedna siatka | `steps` |
| REQ-12 | progi łatwości, zanik 0,5 s (0 s przy ograniczonym ruchu) | `bath-reducer`, `bath.spec` |
| REQ-13 | `useScrub` (wiele palców, capture, `touch-action: none`) | `bath.spec` (mysz, 2 palce) |
| REQ-14 | `ToolCursor` | przegląd |
| REQ-15 | `brushRadius`, `toolDiameterCss` | `steps` |
| REQ-16 | `particles.ts`, `Particles.tsx`, strumień | przegląd |
| REQ-17 | logiczne współrzędne, `useBathClock` | `bath.spec` (obrót, ukryta karta) |
| REQ-18 | czyste moduły z testami | `coverage`, `steps`, `bath-reducer`, `random` |

## Odchylenia od planu

1. **Faza `done`:** dodatkowa faza po nagrodzie. Reducer nie losuje, więc nowe ziarno przychodzi w akcji `newAnimal` z komponentu.
2. **Zwierzątko pojawia się i znika płynnie:** zanika w ostatnich 0,7 s nagrody, a kolejne pojawia się razem z pierwszą warstwą. Zasada 1 (spokój) wymaga płynnej zmiany; w planie zmiana była natychmiastowa.
3. **Rysunek szkicu w osobnym pliku:** `SketchAnimal.tsx`, żeby `sketch.ts` został czystym modułem testowanym bez przeglądarki.
4. **Bez cząsteczek przy wycieraniu:** w kroku wycierania nie ma baniek (ręcznik nie pieni), a krople są tylko przy spłukiwaniu.
5. **`settings/testParams.ts` już w tej fazie:** parametry `seed`, `ease`, `pace` z `?test=1` (w planie od Fazy 3, ale testy Fazy 2 ich potrzebują).
6. **Korzeń `.little-world`** odzwierciedla fazę kąpieli (`data-phase`); test układu z Fazy 1 jest dostosowany.

## Do sprawdzenia przy pierwszym uruchomieniu

- `npm run typecheck`: kod nie był kompilowany, możliwe drobne błędy typów, zwłaszcza w typach React 19.
- `npm test`: test 2 palców (CDP) działa tylko w projektach `phone` i `small`. Próg „≥ 1,4 × jeden palec” może wymagać korekty.
- Telefon: płynność pocierania, czy narzędzie jest dokładnie pod palcem, łagodność zaniku warstw (lista w PHASE-02, „Weryfikacja fazy”).

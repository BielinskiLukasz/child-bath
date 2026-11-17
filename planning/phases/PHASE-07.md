---
phase: 07-rytual-narracja
name: Rytuał i narracja
status: not-started
depends_on: [03-sterowanie, 04-postacie, 06-swiat]
requirements: [REQ-46, REQ-47, REQ-48, REQ-49, REQ-50, REQ-51]
clarifications: [DP-3, DP-4]
plans: [07-01, 07-02, 07-03, 07-04]
---

# PHASE-07: Rytuał i narracja

> **Cel:** każda kąpiel ma swoją historię (ślad zabawy i zdanie narracji dla rodzica), rytuał wybrany z 5 kroków i widoczną sekwencję kroków.
> **Zależy od:** Fazy 3, 4, 6 · **Odblokowuje:** Fazę 8 · **Plany:** 4 (fale: 07-01 → 07-02 ∥ 07-03 → 07-04)

## Wynik fazy

- Model rytuału: 5 kroków, gotowe długości 2–5 i rytuał własny z regułami DP-3 (10 poprawnych kombinacji).
- Kroki namydlania (nakładanie) i czesania/głaskania (zależnie od okrywy).
- Łańcuch warstw: ślad zabawy → piana → wilgoć, z poprawnym zachowaniem dla każdej kombinacji.
- 5 śladów zabawy z fakturami i paletami.
- Zdania narracji z odmianą i rodzajem; pasek narracji i sekwencja piktogramów, oba z możliwością ukrycia.

## Kontekst

- **Decyzje:** D-02 (nauka kolejności), D-14 (5 kroków, domyślnie 3), D-16 (ślady), D-18 (zdania dla rodzica, dziecko nie musi czytać).
- **DP-3:**
  - stała kolejność kroków; wycieranie jest zawsze;
  - co najmniej jeden krok z wodą (zmywanie brudu albo płukanie);
  - namydlanie wymaga płukania; krok 5 jest opcjonalny i zawsze ostatni;
  - ślad zabawy znika w pierwszym kroku, który zmywa (zmywanie brudu albo płukanie).
- **DP-4:** czesanie dla futra i wełny, głaskanie dla piór, kolców, skóry, łusek i skorupy.
- **Wejście z poprzednich faz:** `STEPS` i `EASE` (Faza 2), `names.ts` i `okrywa` (Faza 4), narzędzia wody (Faza 6).

## Zakres

**W zakresie:** rytuały, nowe kroki, łańcuch warstw, ślady, narracja, pasek narracji, sekwencja kroków, przełączniki robocze.
**Poza zakresem:** przełączniki w panelu (Faza 10; tutaj `?test=1&ritual=…`), półeczka z narzędziami (Faza 9).

## Projekt techniczny

```ts
// src/bath/rituals.ts
export const STEP_ORDER: StepKind[] = ["scrub", "lather", "rinse", "dry", "groom"];
export const RITUAL_PRESETS = {
  short:   ["scrub", "dry"],
  classic: ["scrub", "rinse", "dry"],
  lather:  ["scrub", "lather", "rinse", "dry"],
  spa:     ["scrub", "lather", "rinse", "dry", "groom"],
} as const;
export type RitualError = "order" | "duplicate" | "noDry" | "noWater" | "latherNeedsRinse";
export function validateRitual(steps: StepKind[]): { ok: boolean; errors: RitualError[] };
export function allValidRituals(): StepKind[][];   // dokładnie 10
export function layerPlan(steps: StepKind[], coat: Okrywa, dirt: DirtKind): LayerSpec[]; // co pokazuje każdy krok
```

**Łańcuch warstw** (co dziecko widzi w każdym kroku):

| Rytuał | Krok 1 | Krok 2 | Krok 3 | Krok 4 | Krok 5 |
|---|---|---|---|---|---|
| Krótki | ślad (gąbka, bańki) | wilgoć (ręcznik) | — | — | — |
| Klasyczny | ślad (gąbka, bańki) | piana, która pojawia się sama (0,7 s), do spłukania | wilgoć | — | — |
| Z namydlaniem | ślad | piana nakładana gąbką z mydłem | spłukanie piany | wilgoć | — |
| Pełne SPA | ślad | namydlanie | spłukanie | wilgoć | czesanie / głaskanie |
| Własny: płukanie, wycieranie | ślad zmywany wodą | wilgoć | — | — | — |
| Własny: namydlanie, płukanie, wycieranie | piana nakładana na ślad | spłukanie piany razem ze śladem | wilgoć | — | — |

**Krok 5:**
- czesanie (futro, wełna): szczotka zostawia puszyste pasma w jaśniejszym odcieniu futra;
- głaskanie (pozostałe okrywy): dłoń zostawia kremowe łuki połysku, a zwierzątko mruży oczy (reakcja `squint`);
- oba kroki to nakładanie i mają tę samą siatkę postępu.

**Ślady zabawy** (`src/bath/dirt.ts`; generatory z ziarnem, przycinane do sylwetki):

| Ślad | Faktura | Kolory |
|---|---|---|
| Błotko (`mud`) | plamy o promieniu 6–26 | `#b78268`, `#9c7155` |
| Mech z listkami (`moss`) | kępki i obrócone elipsy listków | `#648a71`, `#94aa83` |
| Pyłek kwiatowy (`pollen`) | gęsty drobny pył (r 1,5–3) i jaśniejsze plamki | `#f7f2b5`, `#dfbc70` |
| Sok z jagód (`berry`) | kropki (r 3–7) i kilka smug | `--berry` |
| Piasek (`sand`) | ziarenka i jasne płaty | `#f5eedb`, `#dfbc70` |

**Narracja** (`src/copy/narration.ts`):
- Składnia szablonu: `{Imię}` (mianownik), `{Imię:dop}` (inny przypadek), `{m|f}` (forma według rodzaju).
- Zdania mają do 60 znaków, są spokojne i bez wykrzykników; wariant losowany z ziarnem, bez powtórzeń z rzędu.

| Ślad | Warianty (co najmniej 3) |
|---|---|
| błotko | „{Imię} {skakał\|skakała} po kałużach…” · „{Imię} {bawił się\|bawiła się} w błotku…” · „{Imię} {szukał\|szukała} dżdżownic w ogródku…” |
| mech | „{Imię} {turlał się\|turlała się} po leśnym mchu…” · „{Imię} {chował się\|chowała się} w paprociach…” · „{Imię} {zbierał\|zbierała} listki w lesie…” |
| pyłek | „{Imię} {wąchał\|wąchała} kwiatki na łące…” · „{Imię} {biegał\|biegała} wśród mleczy…” · „{Imię} {pomagał\|pomagała} pszczółkom…” |
| jagody | „{Imię} {zbierał\|zbierała} jagody…” · „{Imię} {jadł\|jadła} jagody prosto z krzaczka…” · „{Imię} {robił\|robiła} jagodowy deser…” |
| piasek | „{Imię} {budował\|budowała} zamek z piasku…” · „{Imię} {kopał\|kopała} dołki w piaskownicy…” · „{Imię} {turlał się\|turlała się} po plaży…” |

**Zdania wokół kąpieli:**
- zapowiedź: „Kto teraz? {Imię} czeka na kąpiel.”;
- po kąpieli, zależnie od okrywy: „{Imię} jest {czysty|czysta} i {puszysty|puszysta}.”, „{Imię} ma nastroszone piórka.” albo „{Imię} lśni czystością.”;
- ławeczka: „{Imię} odpoczywa na ławeczce.”;
- pożegnanie: „Wszyscy machają na pożegnanie.”

## Plany

### 07-01 · Model rytuału

**Fala 1** · zależy od: Fazy 3, 4, 6 · wymagania: REQ-46 · autonomiczny: tak

1. **Rytuały** · `src/bath/rituals.ts`
   - Działanie: `STEP_ORDER`, `RITUAL_PRESETS`, `validateRitual`, `allValidRituals`, `layerPlan`.
   - Gotowe gdy: `allValidRituals()` zwraca dokładnie 10 kombinacji o długości 2–5.
2. **Reducer** · `src/game.ts`
   - Działanie: kroki z bieżącego rytuału; nazwy kroków w komunikatach `aria-live`; `?test=1&ritual=short|classic|lather|spa|<lista>`.
   - Gotowe gdy: każdy gotowy rytuał przechodzi w reducerze od początku do końca.
3. **Sanityzacja ustawień** · `src/settings/sanitize.ts`
   - Działanie: niepoprawny rytuał zamieniamy na klasyczny i zapisujemy ostrzeżenie dla panelu (Faza 10).
   - Gotowe gdy: niepoprawnego rytuału nie da się uruchomić.
4. **Testy** · `tests/unit/rituals.spec.ts`
   - Działanie: wszystkie 32 podzbiory z wycieraniem lub bez: 10 poprawnych i błędy z właściwym kodem dla pozostałych; `layerPlan` dla każdej poprawnej kombinacji.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** dokładnie 10 poprawnych rytuałów · ślad zabawy zawsze znika w pierwszym kroku, który zmywa.

### 07-02 · Kroki namydlania i czesania/głaskania

**Fala 2** · zależy od: 07-01 · wymagania: REQ-46, REQ-47 · autonomiczny: nie (przegląd wyglądu przez autora)

1. **Namydlanie** · `src/bath/layers.ts`, `src/components/LayerCanvas.tsx`
   - Działanie: tryb nakładania; pod gąbką z mydłem rośnie kremowa piana (kółka wzdłuż odcinka); siatka liczy pokrycie.
   - Gotowe gdy: po progu cała sylwetka jest w pianie, gotowej do spłukania.
2. **Czesanie i głaskanie** · `src/bath/layers.ts`, `src/components/ToolCursor.tsx`
   - Działanie: narzędzie zależne od okrywy (szczotka albo dłoń); pasma futra albo łuki połysku; przy głaskaniu zwierzątko mruży oczy.
   - Gotowe gdy: Żabka, Żółwik i dinozaury dostają głaskanie, a ssaki z futrem i Owieczka czesanie.
3. **Łańcuch warstw** · `src/bath/layers.ts`
   - Działanie: implementacja `layerPlan`, m.in. automatyczna piana w rytuale klasycznym i ślad zmywany wodą bez kroku zmywania.
   - Gotowe gdy: zachowanie warstw zgadza się z tabelą łańcucha.

**Must-haves:** krok 5 zależny od okrywy · namydlanie i krok 5 mierzone tą samą siatką co zmywanie.

### 07-03 · Ślady zabawy i narracja

**Fala 2** · zależy od: 07-01 · wymagania: REQ-48, REQ-49 · autonomiczny: tak

1. **Ślady** · `src/bath/dirt.ts`
   - Działanie: 5 generatorów z tabeli, deterministycznych dla ziarna.
   - Gotowe gdy: każdy ślad jest rozpoznawalny w galerii (`?test=1&gallery=dirt`).
2. **Narracja** · `src/copy/narration.ts`
   - Działanie: szablony z tabel, parser `{…}`, odmiana z `names.ts`, wybór wariantu bez powtórzeń z rzędu.
   - Gotowe gdy: dla każdego zwierzątka i śladu powstaje poprawne zdanie.
3. **Testy** · `tests/unit/narration.spec.ts`
   - Działanie: 36 zwierzątek × 5 śladów × warianty:
     - zdania mają ≤ 60 znaków i nie zawierają `{` ani `}`;
     - forma czasownika zgadza się z rodzajem;
     - brak wykrzykników;
     - migawka zatwierdzona przez autora.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** każdy ślad ma ≥ 3 warianty · poprawna polszczyzna dla 36 zwierzątek.

### 07-04 · Pasek narracji i sekwencja kroków

**Fala 3** · zależy od: 07-02, 07-03 · wymagania: REQ-49, REQ-50, REQ-51 · autonomiczny: nie (przegląd układu na telefonie)

1. **Pasek narracji** · `src/components/Narration.tsx`
   - Działanie:
     - strefa `#narration`, DM Sans 17–18 px na telefonie, 1–2 linijki, kolor `var(--ink)`;
     - nowe zdanie przenika przez 0,6 s;
     - `aria-hidden="true"`, bo czytniki ekranu dostają treść z regionu `aria-live` (Faza 3).
   - Gotowe gdy: zdanie mieści się w dwóch linijkach na 360 px.
2. **Sekwencja kroków** · `src/components/StepStrip.tsx`
   - Działanie:
     - piktogramy narzędzi bieżącego rytuału (32–40 px): gąbka, gąbka z mydłem, źródło wody scenerii, ręcznik, szczotka albo dłoń;
     - bieżący piktogram „oddycha” (2,4 s), ukończone mają kremowe wypełnienie;
     - bez liczb i procentów.
   - Gotowe gdy: sekwencja zgadza się z rytuałem i scenerią.
3. **Przełączniki** · `src/settings/defaults.ts`, `src/settings/testParams.ts`
   - Działanie: `showNarration` i `showSteps` (domyślnie włączone); do Fazy 10 przez `?test=1`.
   - Gotowe gdy: ukrycie nie powoduje skoku układu (strefa zachowuje wysokość).
4. **Testy E2E** · `tests/e2e/ritual.spec.ts`
   - Działanie:
     - rytuały 2, 3, 4 i 5 kończą się przez syntetyczne pociągnięcia (`?test=1&ease=easy`);
     - krok 5 zależny od okrywy (Labrador vs Żabka);
     - narracja i sekwencja pojawiają się i dają się ukryć.
   - Gotowe gdy: testy przechodzą we wszystkich projektach przeglądarkowych.

**Must-haves:** narracja domyślnie widoczna, z możliwością ukrycia · sekwencja bez liczb i procentów.

## Weryfikacja fazy

- **Automatycznie:** testy `rituals`, `narration` i `ritual.spec.ts`.
- **Przegląd autora na telefonie:**
  - [ ] Każdy rytuał jest logiczny i uczy kolejności.
  - [ ] Ślady zabawy pasują do zdań i do siebie wzajemnie.
  - [ ] Zdania brzmią naturalnie, gdy czyta się je dziecku na głos.
  - [ ] Pasek narracji i sekwencja nie przytłaczają sceny.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | Rytuały 2–5 i poprawne rytuały własne; niepoprawnych nie da się ustawić | `rituals.spec.ts`, `ritual.spec.ts` |
| 2 | Krok 5 zależny od okrywy | `ritual.spec.ts` |
| 3 | 5 śladów i zdania zgodne ze śladem i zwierzątkiem | `narration.spec.ts` + galeria |
| 4 | Sekwencja z bieżącym krokiem, oba elementy można ukryć | `ritual.spec.ts` |

## Ryzyka i pułapki

- **Rytuał bez zmywania wygląda nielogicznie:** reguła „ślad znika w pierwszym kroku, który zmywa” jest jawna w `layerPlan` i testowana.
- **Długie imiona w zdaniach** (np. „Kotek brytyjski”): test długości obejmuje wszystkie kombinacje.
- **Za dużo tekstu na ekranie:** limit dwóch linijek i możliwość ukrycia.

## Przekazanie

- Faza 8 wywołuje narrację w zapowiedzi, nagrodzie, na ławeczce i przy pożegnaniu, a ślady zabawy przypisuje w planie rundy.
- Faza 9 umieszcza na półeczce narzędzia bieżącego rytuału.
- Faza 10 dodaje w panelu wybór rytuału z walidacją oraz przełączniki narracji i sekwencji.

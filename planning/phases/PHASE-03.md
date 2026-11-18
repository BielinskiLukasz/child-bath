---
phase: 03-sterowanie
name: Sterowanie i przejścia
status: in-progress
depends_on: [02-silnik-kapieli]
requirements: [REQ-19, REQ-20, REQ-21, REQ-22, REQ-23, REQ-24, REQ-25]
clarifications: [DP-1]
plans: [03-01, 03-02, 03-03]
---

# PHASE-03: Sterowanie i przejścia

> **Cel:** zabawę można prowadzić klawiaturą i w trybie jednoprzyciskowym, każde kolejne zwierzątko czeka w zapowiedzi na „Dalej”, a „bębnienie” niczego nie psuje.
> **Zależy od:** Faza 2 · **Odblokowuje:** Fazę 7 · **Plany:** 3 (fale: 03-01 ∥ 03-02 → 03-03)

## Wynik fazy

- **Klawiatura:** strzałki, Spacja i Enter prowadzą narzędzie; pierścień fokusu jest widoczny.
- **Zatrzask wejścia:** brak kolejkowania, autorepeat i podwójnych aktywacji.
- **Zapowiedź:** fazy `door_waiting` i `arriving` w reducerze, przycisk „Dalej” i zwierzątko czekające na skraju sceny (zaślepka miejsca do Fazy 6).
- **Tryb jednoprzyciskowy:** ustawienie; do Fazy 10 włączane przez `?test=1&oneButton=1`.
- **Dostępność:** jeden region `aria-live`, etykiety, obsługa ograniczonego ruchu.

## Kontekst

- **DP-1:** na „Dalej” czeka następne zwierzątko, a umyte samo siada na ławeczce. Ławeczka powstaje w Fazie 8; tutaj zaślepka `to_bench` (0,8 s).
- **Wzorce z child-train:**
  - klawisz Enter jest prawdziwym `<button>`, ma ≥ 74 px wysokości na dotyku i dostaje `aria-disabled` zamiast znikać z DOM;
  - kliknięcia z `event.detail === 0` są ignorowane;
  - nieaktywny rząd zaproszenia ma 45% krycia, a gotowy przycisk „oddycha” co 5 s.
- **Klawiatura z `kapiel`:** krok 0,07, zakres x 0,06–0,94 i y 0,05–0,95, zygzak z krokiem wiersza 0,1.

## Zakres

**W zakresie:** sterowanie, zapowiedź, tryb jednoprzyciskowy, dostępność, robocze ustawienia.
**Poza zakresem:** ławeczka i runda (Faza 8), półeczka i dotykalne bańki (Faza 9), przełączniki w panelu (Faza 10).

## Projekt techniczny

```ts
// src/input/latch.ts
export interface InputLatch {
  accept(e: KeyboardEvent | MouseEvent): boolean;
  phaseChanged(): void;
}
export function createInputLatch(o?: { cooldownMs?: number; now?: () => number }): InputLatch; // domyślnie 600 ms

// src/input/keyboardBrush.ts (ułamki pudełka)
export interface Brush { x: number; y: number; dir: 1 | -1 }
export function moveBrush(b: Brush, key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown"): Brush; // ±0,07 z ograniczeniem
export function zigzag(b: Brush): Brush;  // krok poziomy; na krawędzi wiersz niżej (0,1); na dole powrót na górę

// src/bath/autoStroke.ts
export interface Stroke { y: number; x0: number; x1: number }
export function planAutoStrokes(inside: Uint8Array, r: number): Stroke[]; // 6–8 poziomych pasów w obrębie sylwetki, od góry
export function strokePoint(s: Stroke, t: number): [number, number];      // t ∈ [0, 1], łagodne przyspieszenie i hamowanie
```

**Reguły zatrzasku:**
- odrzuć `e.repeat`;
- jedno naciśnięcie to jedna akcja: kolejne `keydown` tego samego klawisza są ignorowane do `keyup`;
- odrzuć `click` z `detail === 0` (Enter na przycisku obsługuje już `keydown`);
- odrzuć wszystko przez 600 ms po zmianie fazy.

**Mapa Enter:**

| Faza | Tryb zwykły | Tryb jednoprzyciskowy |
|---|---|---|
| `door_waiting` | „Dalej” | „Dalej” |
| `scrubbing`, fokus na pudełku | krok zygzaka | jeden automatyczny ruch (≈ 1,2 s × tempo) |
| `scrubbing`, fokus gdzie indziej | nic | jeden automatyczny ruch |
| pozostałe fazy | nic | nic |

Gdy otwarty jest panel rodzica (od Fazy 10), Enter należy do panelu.

**Komunikaty `aria-live`** (tylko dla czytników ekranu; imiona i rodzaj od Fazy 4, do tego czasu „Zwierzątko”):

| Moment | Tekst |
|---|---|
| zapowiedź | „{Imię} czeka na kąpiel. Naciśnij Dalej.” |
| wejście | „{Imię} wchodzi do kąpieli.” |
| krok | „Krok {n} z {m}: {nazwa kroku}.” |
| koniec kąpieli | „{Imię} jest {czysty/czysta}.” |

## Plany

### 03-01 · Klawiatura i zatrzask wejścia

**Fala 1** · zależy od: Faza 2 · wymagania: REQ-19, REQ-21 · autonomiczny: tak

1. **Zatrzask** · `src/input/latch.ts`, `tests/unit/latch.spec.ts`
   - Działanie: reguły jak wyżej; testy autorepeat, podwójnego `keydown`, `click.detail === 0` i cooldownu (sztuczny zegar `now`).
   - Gotowe gdy: 10 zdarzeń w 1 s daje dokładnie 1 akceptację.
2. **Pędzel klawiaturowy** · `src/input/keyboardBrush.ts`, `tests/unit/keyboard-brush.spec.ts`
   - Działanie: ruch strzałkami z ograniczeniem do zakresu; zygzak z zawinięciem.
   - Gotowe gdy: 200 kroków zygzaka nie wychodzi poza zakres i przechodzi przez całe pudełko.
3. **Integracja z pudełkiem** · `src/components/BathStage.tsx`
   - Działanie:
     - pudełko `tabIndex=0`, `role="application"`;
     - strzałki i zygzak stemplują odcinek tą samą funkcją co wskaźnik;
     - przy fokusie widać pierścień narzędzia, a obrys fokusu ma 4 px w `--ink` (kontrast ≥ 3 : 1).
   - Gotowe gdy: klawiatura i palec dają ten sam efekt na siatce.

**Must-haves:** jedna ścieżka stemplowania dla klawiatury i wskaźnika · autorepeat niczego nie przyspiesza.

### 03-02 · Zapowiedź, „Dalej” i tryb jednoprzyciskowy

**Fala 1** · zależy od: Faza 2 · wymagania: REQ-20, REQ-21, REQ-22, REQ-23 · autonomiczny: tak

1. **Fazy** · `src/game.ts`
   - Działanie:
     - stan początkowy `door_waiting`;
     - akcja `next` → `arriving` (0,8 s) → kroki → `reward`;
     - po nagrodzie `to_bench` (zaślepka 0,8 s: zwierzątko odsuwa się i łagodnie znika) → `door_waiting` z kolejnym zwierzątkiem;
     - `latch.phaseChanged()` przy każdej zmianie fazy.
   - Gotowe gdy: od uruchomienia każde zwierzątko czeka na „Dalej”.
2. **Miejsce zapowiedzi** · `src/components/DoorPreview.tsx`
   - Działanie: zwierzątko-szkic na skraju sceny (lewa krawędź w pionie, lewa strona w poziomie), które spokojnie „oddycha”. Pozycję dostarczy sceneria w Fazie 6.
   - Gotowe gdy: zwierzątko w zapowiedzi jest widoczne i nie zasłania pudełka.
3. **Przycisk „Dalej”** · `src/components/NextButton.tsx`
   - Działanie:
     - prawdziwy `<button>` w strefie akcji: „Dalej” i strzałka;
     - na dotyku wysokość ≥ 74 px i szerokość `min(280px, 72vw)`; przy wskaźniku 122 × 50 px;
     - poza `door_waiting`: `aria-disabled` i krycie 45%; gotowy przycisk „oddycha” co 5 s, pojawia się w ≥ 0,5 s;
     - globalny Enter w `door_waiting` działa jak „Dalej”.
   - Gotowe gdy: przycisk zostaje w DOM (fokus nie skacze) i reaguje tylko w `door_waiting`.
4. **Tryb jednoprzyciskowy** · `src/bath/autoStroke.ts`, `src/components/OneButtonKey.tsx`
   - Działanie:
     - duży klawisz „Enter ↵” z podpisem „Dotknij” (dotyk) albo „Naciśnij” (wzór child-train);
     - jedno naciśnięcie = jeden pas (≈ 1,2 s × tempo) stemplowany wzdłuż `strokePoint`;
     - naciśnięcia w trakcie ruchu są ignorowane;
     - w `door_waiting` ten sam klawisz działa jak „Dalej”.
   - Gotowe gdy: przy łatwości „Zwykła” krok kończy się po 6–8 naciśnięciach.
5. **Ustawienia robocze** · `src/settings/defaults.ts`, `src/settings/testParams.ts`
   - Działanie: domyślne `BathSettings` (`PROJECT.md` 12.4) i nadpisania z URL tylko przy `?test=1` (`oneButton`, `ease`, `pace`, `seed`).
   - Gotowe gdy: bez `?test=1` parametry URL są ignorowane.
6. **Testy** · `tests/unit/auto-stroke.spec.ts`
   - Działanie: pasy mieszczą się w sylwetce; 6–8 pasów pokrywa ≥ 90% komórek.
   - Gotowe gdy: test przechodzi dla szkicu i dla wąskiej sylwetki testowej.

**Must-haves:** każde zwierzątko czeka na „Dalej” · „Dalej” jest nieaktywne do końca przejścia · jedno naciśnięcie = jeden ruch.

### 03-03 · Dostępność, ograniczony ruch i testy sterowania

**Fala 2** · zależy od: 03-01, 03-02 · wymagania: REQ-23, REQ-24, REQ-25 · autonomiczny: tak

1. **Region `aria-live`** · `src/components/LiveRegion.tsx`, `src/copy/announce.ts`
   - Działanie:
     - jeden region `polite` (`.sr-only`) z komunikatami z tabeli;
     - etykieta pudełka: „{Imię} do kąpieli. Strzałki przesuwają gąbkę, Enter lub spacja myje dalej.”
   - Gotowe gdy: na stronie jest dokładnie jeden region `aria-live`.
2. **Ograniczony ruch** · `src/hooks/useReducedMotion.ts`, `src/styles/animations.css`
   - Działanie:
     - nasłuch `matchMedia('(prefers-reduced-motion: reduce)')`;
     - bez „oddychania” i dryfu cząsteczek, reszta warstwy znika natychmiast;
     - pod palcem najwyżej 6 cząsteczek, bez dryfu.
   - Gotowe gdy: zmiana ustawienia systemu działa bez przeładowania.
3. **Testy E2E** · `tests/e2e/controls.spec.ts`
   - Działanie:
     - samą klawiaturą (Tab, strzałki, Enter) przechodzimy 3 kroki;
     - w trybie jednoprzyciskowym krok kończy się po 6–8 naciśnięciach; przytrzymanie Enter daje 1 ruch, a 10 szybkich naciśnięć w 1 s też 1 ruch;
     - `door_waiting` → „Dalej” → `arriving`, a w innych fazach „Dalej” nic nie robi;
     - w projekcie `phone` przycisk ma ≥ 74 px wysokości;
     - `aria-live` zmienia treść w każdej fazie;
     - po `emulateMedia({ reducedMotion: 'reduce' })` `document.getAnimations()` nie zawiera animacji nieskończonych.
   - Gotowe gdy: test przechodzi we wszystkich projektach przeglądarkowych.

**Must-haves:** jeden region `aria-live` · ograniczony ruch wyłącza animacje ciągłe · testy sterowania w CI.

## Weryfikacja fazy

- **Automatycznie:** testy `latch`, `keyboard-brush`, `auto-stroke` i `controls.spec.ts`.
- **Przegląd autora na telefonie i laptopie:**
  - [ ] „Dalej” łatwo trafić kciukiem; gdy jest nieaktywne, wyraźnie przygasa.
  - [ ] „Bębnienie” palcem lub Enterem niczego nie przyspiesza.
  - [ ] Tryb jednoprzyciskowy: każdy ruch gąbki jest spokojny i przewidywalny.
  - [ ] TalkBack albo VoiceOver czyta komunikaty i etykietę pudełka.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | Wszystkie kroki samą klawiaturą | `controls.spec.ts` |
| 2 | Jeden przycisk: jedno naciśnięcie = jeden krok, autorepeat bez efektu | `latch.spec.ts`, `controls.spec.ts` |
| 3 | Każde zwierzątko czeka na „Dalej” (≥ 74 px), aktywne po przejściu | `controls.spec.ts` + przegląd |
| 4 | `aria-live` i ograniczony ruch | `controls.spec.ts`, TalkBack/VoiceOver |

## Ryzyka i pułapki

- **Podwójny Enter** (fokus na przycisku i globalny skrót): jedna ścieżka obsługi i zatrzask z `detail === 0`.
- **Wąskie sylwetki** (np. Diplodok w Fazie 5): pasy liczone z maski, a nie z prostokąta pudełka.
- **Fokus po zmianie fazy:** przycisk nie znika z DOM, więc fokus nie skacze.

## Przekazanie

- Faza 6 dostarcza miejsce zapowiedzi w każdej scenerii.
- Faza 8 zastępuje zaślepkę `to_bench` ławeczką i pożegnaniem.
- Faza 9 dodaje półeczkę w strefie akcji.
- Faza 10 dodaje przełącznik trybu jednoprzyciskowego w panelu.

## Stan implementacji

Kod i automatyczne testy lokalne planów 03-01–03-03 są gotowe w głównym katalogu projektu. [Podsumowanie Fazy 3](PHASE-03-SUMMARY.md) zawiera wyniki testów, odchylenia od planu i ścieżki do zrzutów. Do zamknięcia pozostaje przebieg GitHub Actions i próba na fizycznych urządzeniach.

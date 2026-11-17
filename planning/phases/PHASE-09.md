---
phase: 09-rozszerzona-interakcja
name: Rozszerzona interakcja
status: not-started
depends_on: [08-runda-nagroda]
requirements: [REQ-26, REQ-27, REQ-28]
clarifications: [DP-9]
plans: [09-01, 09-02]
---

# PHASE-09: Rozszerzona interakcja

> **Cel:** po włączeniu opcji dziecko samo sięga po narzędzia z półeczki, bawi się bańkami jak w `banki.js` i wybiera ozdobę.
> **Zależy od:** Faza 8 · **Odblokowuje:** Fazę 10 · **Plany:** 2 (fale: 09-01 ∥ 09-02)

## Wynik fazy

- Ustawienie `extendedTouch` (domyślnie wyłączone; do Fazy 10 przez `?test=1&extended=1`).
- Półeczka z narzędziami kroków rytuału w strefie akcji.
- Dotykalne bańki: duża dzieli się na dwie mniejsze, mała powoli się rozpływa; nic nie pęka nagle.
- Faza `choosing_decor`: wybór ozdoby z 2–3 propozycji, bez limitu czasu.

## Kontekst

- **Decyzje:** D-05 (rozszerzona interakcja jako opcja rodzica), D-26 (bańki jak w `banki.js`).
- **DP-9:**
  - bańki reagują poza sylwetką zwierzątka oraz między kąpielami (nagroda, zapowiedź, ławeczka);
  - przeciąganie po zwierzątku zawsze myje.
- **child-page, `js/banki.js`** (dokumentacja „Bańki Mydlane”):
  - trafienie, gdy odległość od środka < r + 8; wygrywa najbliższa bańka, która jeszcze nie zanika;
  - podział, gdy r > 1,2 · `MIN_R` (`MIN_R` = 14): na 2 bańki (promień 0,66 r; u nas zawsze 2, bez wariantu na 3);
  - dzieci dostają pchnięcie 14 px/s w różnych kierunkach; rodzic zanika przez 1,6 s z pulsem skali 8% (0,7 s);
  - mała bańka zanika przez 1,6 s; najwyżej 25 widocznych baniek; strefy zakazane wokół przycisków (+12 px).
- **Zasada „nic nie może się nie udać”:** niewłaściwe narzędzie wraca na miejsce bez sygnału błędu.

## Zakres

**W zakresie:** półeczka, wybór narzędzia, dotykalne bańki, wybór ozdoby.
**Poza zakresem:** przełącznik w panelu (Faza 10), statystyki interakcji (Faza 11 liczy tylko kąpiele).

## Projekt techniczny

**Półeczka** (`src/components/Shelf.tsx`):
- drewniana półka w strefie akcji z narzędziami bieżącego rytuału (gąbka, gąbka z mydłem, źródło wody scenerii, ręcznik, szczotka albo dłoń);
- każde narzędzie jest celem ≥ 64 px;
- narzędzie bieżącego kroku łagodnie „oddycha” (skala 1 → 1,06, 2,4 s).

**Zasady wyboru narzędzia:**

| Sytuacja | Zachowanie |
|---|---|
| dotknięcie właściwego narzędzia | narzędzie płynie do palca (0,6 s) i myje |
| dotknięcie innego narzędzia | narzędzie lekko się unosi i wraca na miejsce (0,8 s), bez sygnału błędu |
| pocieranie zwierzątka bez wybranego narzędzia | po 0,8 s pocierania właściwe narzędzie samo płynie z półeczki do palca |
| koniec kroku | narzędzie wraca na półeczkę, a następne zaczyna „oddychać” |

W rozszerzonym trybie „Dalej” zastępuje półeczkę tylko w fazie `door_waiting`; strefa akcji zachowuje stałą wysokość.

**Bańki:**

```ts
// src/world/bubbles.ts (czysta fizyka z banki.js, przeniesiona do TS)
export interface Bubble { id: number; x: number; y: number; r: number; vx: number; vy: number; age: number; fading: number | null }
export function hitTest(bubbles: Bubble[], x: number, y: number): Bubble | null;   // r + 8, najbliższa niezanikająca
export function touchBubble(b: Bubble, rng: Rng): Bubble[];                        // podział na 2 (0,66 r) albo zanik
export function step(bubbles: Bubble[], dt: number, bounds: Bounds, keepOut: Rect[]): Bubble[];
```

- Dotknięcie pustego miejsca sceny (poza zwierzątkiem i przyciskami) dmucha nową bańkę o promieniu 46–62 px (skalowanym do ekranu), która unosi się z prędkością 14–24 px/s i kołysze.
- Bańki znikają łagodnie u góry sceny i w strefach zakazanych.
- **Rozdział gestów:** dotyk wewnątrz sylwetki (maska `inside`) w fazie `scrubbing` myje; poza sylwetką i w innych fazach trafia do baniek.

**Wybór ozdoby:**
- faza `choosing_decor` między ostatnim krokiem a `reward`;
- 2–3 propozycje z worka (Faza 8) jako duże kremowe krążki (≥ 64 px) wokół zwierzątka, łagodnie się kołyszące;
- dotknięcie ozdoby: płynie do kotwicy (0,8 s), a potem nagroda;
- klawiatura: strzałki zmieniają podświetlenie, Enter zatwierdza;
- w trybie jednoprzyciskowym wybór jest pomijany (ozdoba losowa), żeby nie łamać zasady jednego przycisku;
- brak limitu czasu: zwierzątko czeka, aż dziecko wybierze.

## Plany

### 09-01 · Półeczka z narzędziami

**Fala 1** · zależy od: Faza 8 · wymagania: REQ-26 · autonomiczny: nie (przegląd układu na telefonie)

1. **Komponent półeczki** · `src/components/Shelf.tsx`, `src/styles/layout.css`
   - Działanie: półeczka w strefie akcji (phone-first), narzędzia z rytuału i scenerii, „oddychanie” bieżącego narzędzia.
   - Gotowe gdy: półeczka mieści się na 360 px bez przewijania.
2. **Logika wyboru** · `src/game.ts`, `src/components/ToolCursor.tsx`
   - Działanie: zasady z tabeli wyboru narzędzia, w tym automatyczne podanie narzędzia po 0,8 s pocierania.
   - Gotowe gdy: żadna ścieżka nie kończy się sygnałem błędu ani zablokowaniem kąpieli.
3. **Testy** · `tests/e2e/extended-shelf.spec.ts`
   - Działanie:
     - dotknięcie właściwego narzędzia → mycie działa;
     - dotknięcie innego → narzędzie wraca (`data-tool-state="returning"`), a krok trwa dalej;
     - pocieranie bez narzędzia → narzędzie przychodzi samo;
     - przy wyłączonej opcji półeczki nie ma.
   - Gotowe gdy: testy przechodzą w projektach `phone` i `small`.

**Must-haves:** niewłaściwe narzędzie wraca bez sygnału błędu · kąpiel zawsze da się dokończyć.

### 09-02 · Bańki i wybór ozdoby

**Fala 1** · zależy od: Faza 8 · wymagania: REQ-27, REQ-28 · autonomiczny: tak

1. **Fizyka baniek** · `src/world/bubbles.ts`, `tests/unit/bubbles.spec.ts`
   - Działanie: port logiki `banki.js` z komentarzem źródła; testy trafienia, podziału (2 dzieci, 0,66 r), zaniku małej bańki, limitu 25 i stref zakazanych.
   - Gotowe gdy: żadna bańka nie znika bez fazy zanikania.
2. **Warstwa baniek** · `src/components/BubbleField.tsx`
   - Działanie:
     - SVG z pulą węzłów, animacja tylko przez `transform` i `opacity`;
     - rozdział gestów z maską sylwetki; aktywna tylko przy `extendedTouch`.
   - Gotowe gdy: przeciąganie po zwierzątku myje, a dotyk obok bawi się bańkami.
3. **Wybór ozdoby** · `src/components/DecorChoice.tsx`, `src/game.ts`
   - Działanie: faza `choosing_decor` zgodnie z projektem; klawiatura; pominięcie w trybie jednoprzyciskowym.
   - Gotowe gdy: zwierzątko czeka bez limitu czasu.
4. **Testy** · `tests/e2e/extended-bubbles.spec.ts`
   - Działanie:
     - dotknięcie dużej bańki daje 2 mniejsze;
     - zanik trwa ≥ 0,5 s (krycie maleje stopniowo, węzeł nie znika od razu);
     - pocieranie zwierzątka nadal zwiększa `data-progress`;
     - `choosing_decor` po 30 s (sztuczny zegar `page.clock`) nadal czeka, a wybór ozdoby kończy fazę.
   - Gotowe gdy: testy przechodzą we wszystkich projektach przeglądarkowych.

**Must-haves:** bańki nigdy nie pękają nagle · wybór ozdoby bez presji czasu.

## Weryfikacja fazy

- **Automatycznie:** testy `bubbles`, `extended-shelf.spec.ts` i `extended-bubbles.spec.ts`.
- **Przegląd autora na telefonie:**
  - [ ] Sięganie po narzędzia jest intuicyjne, a pomyłka niczego nie psuje.
  - [ ] Bańki zachowują się jak w znanej dziecku aktywności „Bańki Mydlane”.
  - [ ] Wybór ozdoby jest czytelny, cele są duże.
  - [ ] Po wyłączeniu opcji wszystko działa jak wcześniej.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | Narzędzie z półeczki: kolejne „oddycha”, inne wraca | `extended-shelf.spec.ts` |
| 2 | Duża bańka dzieli się, mała rozpływa się przez 1,6 s; mycie działa | `bubbles.spec.ts`, `extended-bubbles.spec.ts` |
| 3 | Wybór ozdoby z 2–3 propozycji, cierpliwe czekanie | `extended-bubbles.spec.ts` |

## Ryzyka i pułapki

- **Konflikt gestów mycia i baniek:** jedno źródło prawdy (maska `inside`) i jasna reguła fazy.
- **Za dużo bodźców naraz:** limit 25 baniek, a w fazie `scrubbing` nowe bańki pojawiają się tylko z pocierania.
- **Półeczka zabiera miejsce na małym ekranie:** narzędzia tylko z bieżącego rytuału (2–5).

## Przekazanie

- Faza 10 dodaje przełącznik „Rozszerzona interakcja” w panelu.
- Faza 12 obejmuje bańki i wybór ozdoby audytem spokoju i zrzutami referencyjnymi.

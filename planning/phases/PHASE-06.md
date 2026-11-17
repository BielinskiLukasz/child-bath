---
phase: 06-swiat
name: Świat
status: not-started
depends_on: [02-silnik-kapieli]
requirements: [REQ-39, REQ-40, REQ-41, REQ-42, REQ-43, REQ-44, REQ-45]
clarifications: []
plans: [06-01, 06-02, 06-03, 06-04]
---

# PHASE-06: Świat

> **Cel:** 6–8 scenerii ze źródłami wody, ławeczką, miejscem zapowiedzi i cichymi towarzyszami ożywa dzięki silnikowi atmosfery z child-train.
> **Zależy od:** Faza 2 · **Odblokowuje:** Fazę 7 · **Plany:** 4 (fale: 06-01 → 06-02 ∥ 06-03 → 06-04)

## Wynik fazy

- Silnik atmosfery z child-train: 24-godzinny cykl dnia i nocy, pogoda, faza księżyca na sesję, 4 pory roku.
- Zegar świata napędzany aktywną zabawą, a nie odległością jak w pociągu.
- Co najmniej 6 scenerii (cel: 8), każda z ławeczką na 3 miejsca, miejscem zapowiedzi i źródłem wody.
- Trzy narzędzia wody do kroku płukania: prysznic, konewka, drewniany czerpak.
- Cisi towarzysze, wybór scenerii na rundę, przenikanie scenerii i przesuwanie pory roku.

## Kontekst

- **Źródła z child-train:**
  - silnik i atmosfera: `src/atmosphere.ts`, `src/atmosphere.css`, `src/components/Atmosphere.tsx`, `src/hooks/useAtmosphere.ts`;
  - rekwizyty w `src/components/illustration/Scenery.tsx`: `Pine`, `Tree`, `BirchTree`, `FruitTree`, `LavenderBush`, `Cottage`, `Sailboat`, `StoneBridge`, `Jetty`, trzciny, płoty, kwiaty;
  - zegar stacyjny z `Station.tsx`.
- **Kontrakt motywu:** `--sky-top`, `--sky-bottom`, `--ink`, `--muted`, `--accent`, `--ground`, `--window`, `--cloud`, pozycje słońca i księżyca, `--stars-opacity`, warstwy pogody, `--night-veil`, `--moon-phase-shift`, `--day-hour`, `--foliage-a/b`, `--pine-a/b`, `--hill-far/near`, `--blossom`.
- **Decyzje:** D-11 (osobny świat, styl i silnik z child-train), D-15 (scenerie), D-16 (źródła wody); D-08 (jedna sceneria na rundę).

## Zakres

**W zakresie:** atmosfera, zegar świata, scenerie, narzędzia wody, towarzysze, wybór scenerii, przenikanie, pory roku.
**Poza zakresem:** ławeczka z postaciami i logika rundy (Faza 8; tutaj tylko miejsca na scenie), ustawienia stałe w panelu (Faza 10; tutaj z `?test=1`).

## Projekt techniczny

**Zegar świata** (`src/world/worldClock.ts`):
- godzina startowa losowana z ziarna sesji (jak w child-train);
- czas symulowany płynie tylko przy widocznej karcie: 1 h symulacji na 2 min aktywnej zabawy;
- pogoda zmienia się przy zmianie rundy, z przejściem ≥ 8 s;
- pora roku przesuwa się o jedną co rundę, paleta przenika przez ≥ 3 s;
- ustawienia stałe blokują odpowiednią wartość;
- na `.little-world` ustawiamy `data-time-of-day`, `data-weather` i `data-season`.

```ts
export type SceneryId = "bathroom" | "garden" | "forest_spring" | "mountain_tub" | "jetty" | "lavender_spa" | "beach" | "winter_bath";
export type WaterSource = "shower" | "can" | "scoop";
export interface SceneSpot { x: number; y: number; scale: number }   // ułamki rozmiaru pudełka zwierzątka
export interface SceneLayout { door: SceneSpot; bench: [SceneSpot, SceneSpot, SceneSpot]; companions: SceneSpot[] }
export interface SceneryDef {
  id: SceneryId; name: string; water: WaterSource; indoor: boolean;
  seasons: Season[]; avoidWeather?: Weather[];
  layout: { portrait: SceneLayout; landscape: SceneLayout };
  Background: React.FC; Foreground?: React.FC;
}
```

**Układ:**
- Pudełko zwierzątka z Fazy 2 stoi w środku sceny.
- Sceneria jest rysowana na płótnie 1600 × 1000, z balią zakotwiczoną pod pudełkiem; w pionie przycinamy boki (`xMidYMid slice`).
- Ławeczka, miejsce zapowiedzi i towarzysze są pozycjonowani względem pudełka (ułamki jego rozmiaru), więc zawsze mieszczą się w kadrze.

**Narzędzia wody** (krok płukania; krople z puli cząsteczek):

| Źródło | Wygląd i zachowanie |
|---|---|
| `shower` | strumień od góry ekranu do palca (jak w `kapiel`) |
| `can` | konewka przechylona nad palcem, ukośny strumień |
| `scoop` | drewniany czerpak wylewa wodę tuż nad palcem |

**Scenerie:**

| Sceneria | Woda | Zapowiedź | Pory roku | Uwagi |
|---|---|---|---|---|
| Domowa łazienka | prysznic | drzwi | cały rok (zapas) | okno, zegar, wanna na nóżkach, haczyk na szalik |
| Ogród | konewka | furtka | wiosna, lato | balia, płot, kwiaty (`--blossom`) |
| Leśne źródełko | czerpak | zza paproci | wiosna–jesień | kamienie, mech, paprocie |
| Górska balia | czerpak | górska ścieżka | cały rok, zimą częściej | para nad wodą, góry z czapami śniegu |
| Pomost nad jeziorem | czerpak | brzeg jeziora | lato | `Jetty`, trzciny, `Sailboat`; bez śniegu |
| Lawendowe spa | prysznic | łukowe przejście | lato | lawenda, lampiony (`--lamp`) wieczorem |
| Plaża z piaskownicą (opcjonalnie) | konewka | spod parasola | lato | bez deszczu i śniegu |
| Zimowa łaźnia (opcjonalnie) | czerpak | ścieżka w śniegu | zima | ciepła balia, para |

## Plany

### 06-01 · Silnik atmosfery i okno

**Fala 1** · zależy od: Faza 2 · wymagania: REQ-41 · autonomiczny: tak

1. **Port silnika** · `src/world/atmosphere.ts`, `src/hooks/useAtmosphere.ts`, `src/components/Atmosphere.tsx`, `src/styles/atmosphere.css`
   - Działanie: port 1:1 z komentarzami źródła; zmienne CSS zapisywane na `.little-world` najwyżej 24 razy na sekundę.
   - Gotowe gdy: niebo, słońce, księżyc z fazą, gwiazdy, deszcz, śnieg i mgła działają na pustej scenie.
2. **Zegar świata** · `src/world/worldClock.ts`, `src/hooks/useWorldClock.ts`
   - Działanie: reguły z projektu technicznego.
   - Gotowe gdy: przy ukrytej karcie czas stoi, a faza księżyca nie zmienia się w trakcie sesji.
3. **Widok przez okno** · `src/components/illustration/WindowView.tsx`
   - Działanie: niebo i pogoda przycięte do okna (`clipPath`) w scenach wewnętrznych.
   - Gotowe gdy: deszcz i śnieg widać tylko w oknie.
4. **Kolor tekstu dzień/noc** · `src/styles/tokens.css`
   - Działanie: `--ink` i `--muted` przełączają się (nie mieszają) między dniem a nocą.
   - Gotowe gdy: kontrast tekstu ≥ 4,5 : 1 o każdej porze.
5. **Testy** · `tests/unit/world-clock.spec.ts`, `tests/e2e/atmosphere.spec.ts`
   - Działanie:
     - czas stoi przy ukrytej karcie; pora roku przesuwa się o jedną na rundę; ustawienia stałe działają;
     - port testów child-train: przejścia nieba, stała faza księżyca.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** silnik działa bez zmian w kontrakcie motywu · czas płynie tylko przy aktywnej zabawie.

### 06-02 · Łazienka, ogród, leśne źródełko

**Fala 2** · zależy od: 06-01 · wymagania: REQ-39, REQ-40, REQ-45 · autonomiczny: nie (przegląd stylu przez autora)

1. **Domowa łazienka** · `src/world/sceneries/bathroom.tsx`
   - Działanie:
     - wanna na nóżkach, kafelki `--tile-a`/`--tile-b`, okno z `WindowView`;
     - wieszak z haczykiem na szalik, drzwi jako miejsce zapowiedzi, ławeczka;
     - zegar ścienny ze wskazówkami `rotate(calc(var(--day-hour) * 30deg))` (port zegara stacyjnego).
   - Gotowe gdy: wskazówki zgadzają się z `--day-hour`.
2. **Ogród** · `src/world/sceneries/garden.tsx`
   - Działanie: balia, płot, kwiaty, furtka, konewka; kolory sezonowe ze zmiennych.
   - Gotowe gdy: zmiana pory roku przemalowuje ogród.
3. **Leśne źródełko** · `src/world/sceneries/forest-spring.tsx`
   - Działanie: kamienie, mech, paprocie (rekwizyty `Pine` i `Tree` z child-train), czerpak.
   - Gotowe gdy: sceneria mieści się w kadrze w trzech rozdzielczościach.
4. **Narzędzia wody** · `src/components/WaterTool.tsx`, `src/components/Particles.tsx`
   - Działanie: warianty `shower`, `can`, `scoop` dla kroku płukania.
   - Gotowe gdy: krok płukania używa źródła bieżącej scenerii.
5. **Rejestr scenerii** · `src/world/sceneries/index.ts`
   - Działanie: rejestr scenerii; `?test=1&scenery=…` wymusza scenerię.
   - Gotowe gdy: każdą scenerię da się otworzyć przez parametr.

**Must-haves:** trzy scenerie z ławeczką, zapowiedzią i źródłem wody · zegar zgodny z niebem.

### 06-03 · Górska balia, pomost, lawendowe spa (+ plaża, zimowa łaźnia)

**Fala 2** · zależy od: 06-01 · wymagania: REQ-39, REQ-40 · autonomiczny: nie (decyzja autora o scenach opcjonalnych)

1. **Trzy scenerie** · `src/world/sceneries/mountain-tub.tsx`, `jetty.tsx`, `lavender-spa.tsx`
   - Działanie: zgodnie z tabelą scenerii, z rekwizytami z child-train.
   - Gotowe gdy: wszystkie trzy przechodzą test układu.
2. **Scenerie opcjonalne** · `src/world/sceneries/beach.tsx`, `winter-bath.tsx`
   - Działanie: po przeglądzie sześciu scenerii autor decyduje, czy wchodzą do v1.0; jeśli nie, przechodzą do v1.1 (`ROADMAP.md`, „Po v1.0”).
   - Gotowe gdy: decyzja jest zapisana w opisie PR.

**Must-haves:** łącznie co najmniej 6 scenerii zgodnych ze stylem.

### 06-04 · Towarzysze, wybór scenerii i pory roku

**Fala 3** · zależy od: 06-02, 06-03 · wymagania: REQ-42, REQ-43, REQ-44 · autonomiczny: tak

1. **Towarzysze** · `src/world/companions.tsx`
   - Działanie: gumowa kaczuszka, drewniana łódeczka i gumowa żabka na brzegu balii; kołysanie 4–6 s; 1–2 losowane na rundę.
   - Gotowe gdy: towarzysze mieszczą się na brzegu balii w każdej scenerii.
2. **Wybór scenerii** · `src/world/pickScenery.ts`, `tests/unit/pick-scenery.spec.ts`
   - Działanie:
     - kandydaci: dozwolone ∩ pora roku ∩ pogoda (`avoidWeather`);
     - przypięcie rodzica ma pierwszeństwo;
     - worek bez powtórzeń z rzędu; zapas: domowa łazienka.
   - Gotowe gdy: test pokazuje brak powtórzeń z rzędu i poprawny zapas.
3. **Przenikanie i pora roku** · `src/components/SceneLayer.tsx`
   - Działanie:
     - zamontowane są tylko sceneria aktywna i wygasająca;
     - przenikanie ≥ 1,2 s × tempo; pora roku +1 na rundę;
     - do czasu Fazy 8 hak testowy `window.__bath.nextRound()` (tylko z `?test=1`).
   - Gotowe gdy: zmiana scenerii jest łagodna i bez migania.
4. **Testy** · `tests/e2e/world.spec.ts`
   - Działanie:
     - każda sceneria w trzech rozdzielczościach bez przewijania, z ławeczką i miejscem zapowiedzi w kadrze;
     - krok płukania używa źródła scenerii;
     - zegar zgodny z `--day-hour`;
     - przenikanie trwa ≥ 1,2 s, animacje towarzyszy ≥ 4 s.
   - Gotowe gdy: testy przechodzą we wszystkich projektach przeglądarkowych.

**Must-haves:** jedna sceneria na rundę · przenikanie ≥ 1,2 s · ustawienia stałe respektowane.

## Weryfikacja fazy

- **Automatycznie:** testy `world-clock`, `pick-scenery`, `atmosphere.spec.ts` i `world.spec.ts`.
- **Przegląd autora na telefonie:**
  - [ ] Każda sceneria wygląda jak strona z tej samej książeczki co pociąg.
  - [ ] Pion: balia, ławeczka i zapowiedź są w kadrze, nic się nie przewija.
  - [ ] Noc, deszcz i śnieg są czytelne i spokojne.
  - [ ] Prysznic, konewka i czerpak działają naturalnie pod palcem.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | ≥ 6 scenerii bez przewijania, z ławeczką i zapowiedzią | `world.spec.ts` |
| 2 | Płukanie używa źródła wody scenerii | `world.spec.ts` |
| 3 | Płynna atmosfera, pierwszeństwo ustawień stałych, przenikanie ≥ 1,2 s | `atmosphere.spec.ts`, `world-clock.spec.ts`, `world.spec.ts` |
| 4 | Zegar zgodny z godziną, łagodne kołysanie towarzyszy | `world.spec.ts` + przegląd |

## Ryzyka i pułapki

- **Wydajność SVG na telefonie:** montujemy tylko aktywną i wygasającą scenerię (jak w child-train) i memoizujemy sceny.
- **Przycięcie w pionie zasłania ważne elementy:** wszystkie elementy znaczące są pozycjonowane względem pudełka, nie płótna.
- **Za szybki upływ czasu symulowanego:** tempo zegara świata jest stałą w `timing.ts`, łatwą do korekty po przeglądzie.

## Przekazanie

- Faza 7 korzysta z narzędzi wody (krok płukania) i porannego lub wieczornego kontekstu (reakcja `yawn`).
- Faza 8 sadza zwierzątka na miejscach `layout.bench` i używa `layout.door`, przenikania oraz `nextRound`.
- Faza 10 podpina ustawienia stałe pogody, pory dnia i pory roku oraz przypięcie scenerii.

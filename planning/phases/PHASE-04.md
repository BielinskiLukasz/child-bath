---
phase: 04-postacie
name: Postacie
status: in-progress
depends_on: [02-silnik-kapieli]
requirements: [REQ-29, REQ-33, REQ-34, REQ-35, REQ-36, REQ-37, REQ-38]
clarifications: [DP-2, DP-4]
plans: [04-01, 04-02, 04-03, 04-04]
---

# PHASE-04: Postacie

> **Cel:** 20 zwierzątek z istniejących rodzin ma stany kąpieli, okrywy, wolne reakcje, poprawną odmianę imion i punkty zaczepienia ozdób. To 16 z child-train (w tym Labrador i Dachowiec) oraz Lew, Słoń, Panda i Koala z child-page.
> **Zależy od:** Faza 2 · **Odblokowuje:** Fazy 5 i 7 · **Plany:** 4 (fale: 04-01 → 04-02 → 04-03 → 04-04)

## Wynik fazy

- Model postaci jako dane: jeden frontalny szablon child-train (części sylwetki, okrywa, paleta, szalik, nastroje).
- Renderer SVG i maska (`Path2D` + siatka `inside`) z tych samych danych.
- 20 zwierzątek w pięciu grupach z panelu (grupy wypełni do końca Faza 5).
- Stany kąpieli, wygląd po kąpieli zależny od okrywy i co najmniej 8 typów wolnych reakcji.
- Odmiana imion, rodzaj gramatyczny, kotwice ozdób z macierzą zgodności.
- Galeria `?test=1&gallery=animals` do przeglądu i zrzutów.

## Kontekst

- **child-train, `src/components/illustration/Animal.tsx`:**
  - wspólny szablon: głowa (r ≈ 26–34), tułów, łapki, machająca łapka;
  - szalik w jednym z 4 tonów (`scarfFor`), nastroje `cheerful`, `curious`, `dozing`;
  - własne twarze (`CUSTOM_FACE`): sowa, kaczka, owca, żółw;
  - rejestracja w `AnimalKind`, `ALL_ANIMALS`, `FUR_COLORS`.
- **child-page, `js/animals.js`:** Lew, Słoń, Panda i Koala są tam w innym stylu. Przerysowujemy je w szablonie child-train, zachowując cechy: grzywę, uszy i trąbę, łaty pandy, duże uszy i nos koali.
- **Doprecyzowania:** DP-2 (Labrador zastępuje dawnego Pieska, Dachowiec dawnego Kotka), DP-4 (okrywa decyduje o kroku 5); zasady stylu z `PROJECT.md` 11.1.

## Zakres

**W zakresie:** model, renderer, maska, stany, reakcje, 20 zwierzątek, odmiana, kotwice, galeria.
**Poza zakresem:**
- 16 kolejnych zwierzątek (Faza 5);
- grafika ozdób (Faza 8; tutaj tylko kotwice i macierz zgodności);
- losowanie rund (Faza 8; tutaj prosty wybór z ziarnem bez powtórzeń z rzędu).

## Projekt techniczny

```ts
// src/animals/types.ts
export type Okrywa = "futro" | "welna" | "piora" | "kolce" | "skora" | "luski" | "skorupa";
export type Rodzaj = "m" | "f" | "n";
export type AnimalGroup = "wiejskie" | "dalekie" | "pieski" | "kotki" | "dinozaury";
export type PartId = "back" | "tail" | "body" | "paws" | "arm" | "head" | "ears" | "face" | "eyes" | "nose" | "cheeks" | "scarf" | "extra";
export type ColorRef = "fur" | "furDark" | "accent" | "blush" | "ink" | "cream" | `#${string}`;
export interface Shape {
  part: PartId; el: "circle" | "ellipse" | "rect" | "path";
  attrs: Record<string, number | string>; fill: ColorRef;
  silhouette?: boolean;                     // należy do maski
}
export type ReactionKind = "fluff" | "ruffle" | "tailWag" | "squint" | "smileClosed" | "yawn" | "stretch" | "pawSplash" | "wingFan" | "shine" | "shake" | "armWave";
export type AnchorKind = "headTop" | "earLeft" | "earRight" | "neck" | "brow";
export interface NameForms { mian: string; dop: string; cel: string; bier: string; narz: string; miejsc: string }
export interface AnimalDef {
  id: string; group: AnimalGroup; okrywa: Okrywa; rodzaj: Rodzaj; names: NameForms;
  palette: { fur: string; furDark: string; accent?: string };
  shapes: Shape[]; face: "shared" | "custom"; reactions: ReactionKind[];
  anchors: Record<AnchorKind, [number, number]>; scarf: 0 | 1 | 2 | 3;
}
```

- **Współrzędne:** viewBox `-32 -42 64 84` (jak w `kapiel`), skala do `LW × LH` ×4. Szablon child-train przeskalowujemy raz, w danych.
- **Maska:** kształty z `silhouette: true` → `Path2D` → siatka `inside` 64 × 84, liczona raz na zwierzątko i zapamiętywana.

**Stany:**

| Stan | Wygląd |
|---|---|
| przed kąpielą | szalik na haczyku, ślad zabawy na warstwie (Fazy 2 i 7) |
| mokry | futro przyciemnione o ≈ 15% w stronę `--ink`, kremowe kropelki |
| po kąpieli: futro, wełna | kępki wzdłuż obrysu (wełna bardziej puszysta niż futro) |
| po kąpieli: pióra | nastroszone piórka na głowie i piersi |
| po kąpieli: kolce, skóra, łuski, skorupa | kremowe łuki połysku |
| na ławeczce | szlafrok (jeden z 3 kolorów ręczników) albo turban, szalik z powrotem na szyi |

**Reakcje** (CSS, tylko `transform`/`opacity`, ≥ 1,2 s × tempo, `ease-in-out`, 1–2 powtórzenia):

| Reakcja | Ruch | Dla kogo |
|---|---|---|
| `fluff` | kępki: skala 1 → 1,06 | futro, wełna |
| `ruffle` | piórka unoszą się | pióra |
| `tailWag` | ogon ±12° | psy, Lisek, Wiewiórka, Kotki |
| `squint` | oczy → łuki (przenikanie 0,5 s) | wszyscy |
| `smileClosed` | oczy zamknięte, uśmiech | wszyscy |
| `yawn` | pyszczek się otwiera i zamyka | wieczorem (Faza 6) |
| `stretch` | tułów: skala Y 1,04 | ssaki |
| `pawSplash` | łapka ±10° i 2 krople | Żabka, Kaczuszka, Wydra |
| `wingFan` | skrzydła ±8° | ptaki |
| `shine` | połysk wędruje po skorupie lub łuskach | Żółwik, Słoń, dinozaury |
| `shake` | całe ciało ±4°, 3 wahnięcia w 1,8 s | psy |
| `armWave` | łapka macha | ławeczka, pożegnanie |

Przy ograniczonym ruchu zostają tylko zmiany wyrazu twarzy (`squint`, `smileClosed`) przez przenikanie 0,5 s.

## Plany

### 04-01 · Model postaci, renderer i maska

**Fala 1** · zależy od: Faza 2 · wymagania: REQ-33, REQ-34 · autonomiczny: tak

1. **Typy i szablon** · `src/animals/types.ts`, `src/animals/geometry/template.ts`
   - Działanie:
     - port szablonu child-train do danych: głowa, tułów, łapki, machająca łapka;
     - wspólna twarz: oczy `#3f4d40`, nos `#495043`, uśmiech, policzki `#cf9f89` (krycie 55%);
     - nastroje jako warianty części `eyes` i `face`; komentarz źródła.
   - Gotowe gdy: szablon renderuje się identycznie z child-train (porównanie zrzutów).
2. **Renderer** · `src/animals/render.tsx`
   - Działanie: `AnimalSvg({ def, state, mood, reaction })`; części jako `<g data-part>` do animacji; kolory z palety; bez konturów.
   - Gotowe gdy: wszystkie części mają `data-part`, a kolory pochodzą wyłącznie z palety.
3. **Maska** · `src/animals/mask.ts`
   - Działanie: `silhouettePath(def)` i `insideMask(def)` z cache per id; `BathStage` przyjmuje dowolną postać przez ten sam interfejs co `sketch.ts`.
   - Gotowe gdy: zwierzątko-szkic da się zastąpić postacią bez zmian w `BathStage`.
4. **Testy** · `tests/unit/animal-model.spec.ts`, `tests/e2e/animal-mask.spec.ts`
   - Działanie:
     - kształty mieszczą się w viewBoxie, kolory pochodzą z palety, `stroke` występuje tylko w dozwolonych częściach;
     - IoU maski i narysowanej sylwetki ≥ 0,97 (jednorazowy odczyt pikseli w teście jest dozwolony).
   - Gotowe gdy: testy przechodzą dla szablonu.

**Must-haves:** jedno źródło kształtu dla rysunku i maski · brak asynchronicznych obrazów.

### 04-02 · Stany kąpieli i reakcje

**Fala 2** · zależy od: 04-01 · wymagania: REQ-35, REQ-36 · autonomiczny: tak

1. **Okrywy** · `src/animals/coats.ts`
   - Działanie: wygląd po kąpieli zgodny z tabelą stanów; kępki generowane deterministycznie z punktów obrysu sylwetki.
   - Gotowe gdy: każda okrywa ma odrębny wygląd po kąpieli.
2. **Stany** · `src/animals/states.ts`, `src/animals/render.tsx`
   - Działanie: mokry, czysty, szalik zdjęty lub założony, szlafrok, turban.
   - Gotowe gdy: każdy stan da się włączyć w galerii.
3. **Reakcje** · `src/animals/reactions.ts`, `src/styles/animations.css`
   - Działanie:
     - animacje z tabeli reakcji;
     - `playReaction(kind)` z czasem × tempo;
     - nowa reakcja nie zaczyna się, zanim nie skończy się poprzednia.
   - Gotowe gdy: reakcje się nie nakładają.
4. **Testy** · `tests/unit/reactions.spec.ts`, `tests/e2e/reactions.spec.ts`
   - Działanie:
     - każda reakcja trwa ≥ 1,2 s i animuje tylko `transform`/`opacity` (analiza keyframes w CSS);
     - przy ograniczonym ruchu nie ma animacji ruchowych.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** wygląd po kąpieli zależy od okrywy · reakcje wolne i bez nakładania się.

### 04-03 · 20 zwierzątek

**Fala 3** · zależy od: 04-02 · wymagania: REQ-29, REQ-36 · autonomiczny: nie (przegląd galerii przez autora)

1. **Gatunki z child-train (16)** · `src/animals/species/*.ts`
   - Działanie:
     - Króliczek, Lisek, Miś, Jeżyk, Sówka, Wiewiórka, Dachowiec, Labrador, Żabka, Borsuk, Jelonek, Myszka, Kaczuszka, Owieczka, Prosiaczek, Żółwik;
     - sylwetki i kolory z child-train (`FUR_COLORS`); własne twarze Sówki, Kaczuszki, Owieczki i Żółwika;
     - Labrador: sylwetka dawnego Pieska z paletą z `dogs.js` (`#e8c27a`, `#f3dcab`, uszy `#c9a05a`).
   - Gotowe gdy: wszystkie 16 przechodzą test maski.
2. **Gatunki z child-page (4)** · `src/animals/species/*.ts`
   - Działanie: w szablonie child-train:
     - Lew z grzywą `#d9964a`;
     - Słoń `#b9c9dc` z dużymi uszami i trąbą;
     - Panda z łatami `#4a4560`;
     - Koala `#aeb4bf` z dużymi uszami i nosem.
   - Gotowe gdy: autor akceptuje ich spójność z rodziną child-train.
3. **Rejestr i cechy** · `src/animals/roster.ts`, `src/animals/traits.ts`
   - Działanie:
     - grupa, okrywa, reakcje (każde zwierzątko ≥ 2) i ton szalika;
     - Żabka: `pawSplash`, `squint`, `smileClosed`, `shine`;
     - Labrador: `tailWag`, `shake`, `stretch`, `smileClosed`.
   - Gotowe gdy: rejestr zawiera 20 unikalnych id.
4. **Galeria** · `src/dev/Gallery.tsx`
   - Działanie: pod `?test=1&gallery=animals` siatka zwierzątek w stanach: czysty, mokry, po kąpieli, w szlafroku, z reakcją.
   - Gotowe gdy: galeria działa na telefonie (przewijana tylko w trybie testowym).
5. **Integracja** · `BathStage.tsx`, `DoorPreview.tsx`
   - Działanie: prawdziwe zwierzątka zamiast szkicu; wybór z ziarnem bez powtórzeń z rzędu (do Fazy 8).
   - Gotowe gdy: kąpiel przechodzi dla losowego zwierzątka z 20.

**Must-haves:** 20 zwierzątek przechodzi kąpiel · Żabka i Labrador mają ≥ 3 reakcje · galeria zaakceptowana.

### 04-04 · Odmiana imion i kotwice ozdób

**Fala 4** · zależy od: 04-03 · wymagania: REQ-37, REQ-38 · autonomiczny: tak

1. **Imiona** · `src/animals/names.ts`
   - Działanie:
     - 6 przypadków i rodzaj dla każdego zwierzątka;
     - pomocnicy: `name(def, przypadek)`, `byGender(def, { m, f, n })`;
     - przykłady: Żabka, Żabki, Żabce, Żabkę, Żabką, Żabce (f); Miś, Misia, Misiowi, Misia, Misiem, Misiu (m); Lew, Lwa, Lwu, Lwa, Lwem, Lwie (m).
   - Gotowe gdy: każde zwierzątko ma komplet form.
2. **Kotwice** · `src/animals/anchors.ts`
   - Działanie:
     - `headTop`, `earLeft`, `earRight`, `neck`, `brow` dla 20 zwierzątek;
     - macierz zgodności dla 11 ozdób z Fazy 8 (np. bez czapeczki między uszami Króliczka).
   - Gotowe gdy: macierz nie ma luk.
3. **Testy** · `tests/unit/names.spec.ts`, `tests/unit/anchors.spec.ts`
   - Działanie:
     - tabela 20 × 6 form i rodzaj (migawka zatwierdzona przez autora);
     - komplet kotwic w viewBoxie; każda ozdoba ma przy każdym zwierzątku kotwicę albo jawne „brak”.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** poprawna odmiana dla 20 zwierzątek · kompletna macierz zgodności ozdób.

## Weryfikacja fazy

- **Automatycznie:** testy `animal-model`, `animal-mask`, `reactions`, `names` i `anchors`.
- **Przegląd autora w galerii na telefonie:**
  - [ ] Każde zwierzątko jest rozpoznawalne, a cała rodzina wygląda spójnie.
  - [ ] Nic nie wygląda jak naklejka, ikona ani sprite z gry.
  - [ ] Reakcje są spokojne, bez szarpnięć.
  - [ ] Odmiana imion w tabeli testu jest poprawna.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | 20 zwierzątek do wykąpania, maska zgodna z rysunkiem | `animal-mask.spec.ts`, `animals-bath.spec.ts` dla każdego id |
| 2 | Wygląd po kąpieli wg okrywy, szalik, szlafrok i turban | galeria + przegląd |
| 3 | Żabka i Labrador ≥ 3 reakcje, każda ≥ 1,2 s | `reactions.spec.ts`, `traits` |
| 4 | Odmiana i rodzaj dla 20 zwierzątek | `names.spec.ts` |

## Ryzyka i pułapki

- **Inny układ współrzędnych w child-train:** przeskalowanie raz, w danych; nigdy w rendererze.
- **Za dużo detali:** obowiązuje reguła child-train „nic mniejszego niż okno w oddali”; znaczenia najwyżej w skali kropek jelonka.
- **Pomyłki w odmianie:** tabela w teście, akceptowana przez autora.

## Przekazanie

- Faza 5 dopisuje gatunki według tego samego wzoru (lista kontrolna nowego zwierzątka w PHASE-05).
- Faza 7 używa `names.ts` (narracja) i `okrywa` (krok 5).
- Faza 8 rysuje ozdoby na kotwicach i korzysta z macierzy zgodności.

## Stan implementacji

Kod planów 04-01–04-04 znajduje się w głównym katalogu. [Podsumowanie Fazy 4](PHASE-04-SUMMARY.md) zawiera pokrycie wymagań, wyniki i ścieżki do zrzutów. Do formalnego zamknięcia pozostaje zielony przebieg GitHub Actions dla tych zmian i akceptacja autora po przeglądzie galerii i odmiany.

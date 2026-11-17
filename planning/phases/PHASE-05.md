---
phase: 05-menazeria
name: Menażeria
status: not-started
depends_on: [04-postacie]
requirements: [REQ-30, REQ-31, REQ-32]
clarifications: [DP-2, DP-5]
plans: [05-01, 05-02, 05-03, 05-04]
---

# PHASE-05: Menażeria

> **Cel:** dochodzi 16 zwierzątek: Kapibara, Pingwinek, Wydra, pięć dinozaurów (z łagodnym T-Rexem) oraz pozostałe rasy psów i kotów. Razem jest ich 36, spójnych stylistycznie.
> **Zależy od:** Faza 4 · **Odblokowuje:** Fazę 12 · **Plany:** 4 (fale: 05-01 ∥ 05-02 ∥ 05-03 → 05-04)

## Wynik fazy

- 16 nowych definicji w `src/animals/species/` z kompletem danych (lista kontrolna niżej).
- Rejestr 36 zwierzątek w grupach: Leśne i wiejskie 15, Z dalekich stron 6, Pieski 6, Kotki 4, Dinozaury 5.
- Zrzuty referencyjne całej menażerii zatwierdzone przez autora.

## Kontekst

- **DP-2:** psy pochodzą z rodziny `dogs.js` w child-page, którą dziecko zna z „Rasy Piesków” i „Psiej Myjni”. Pominięte rasy: Owczarek (z przodu podobny do Husky’ego) i Corgi (myli się z Liskiem).
- **DP-5:** T-Rex jest łagodny: bez widocznych zębów i ryku, z krótkimi machającymi łapkami, pastelowy, z ruchami tak wolnymi jak u innych. Rodzic jednym przyciskiem wyklucza grupę „Dinozaury” albo samego T-Rexa (przycisk powstaje w Fazie 10; tutaj tylko dane: `group` i możliwość wykluczenia pojedynczego id).
- **Wzór:** model, okrywy, reakcje, imiona i kotwice z Fazy 4.
- `dogs.js` rysuje psy z boku; przenosimy palety i cechy (uszy, ogon, znaczenia) do frontalnego szablonu.

## Lista kontrolna nowego zwierzątka

Każde z 16 zwierzątek musi mieć:

- [ ] geometrię w szablonie (kształty z `silhouette`, `data-part`);
- [ ] paletę z rodzin child-train (bez czystej bieli i czerni);
- [ ] okrywę i wygląd po kąpieli;
- [ ] co najmniej 2 reakcje (psy co najmniej 3);
- [ ] 6 form imienia i rodzaj;
- [ ] 5 kotwic i wiersz w macierzy zgodności ozdób;
- [ ] ton szalika;
- [ ] wpis w galerii;
- [ ] zielone testy maski (IoU ≥ 0,97), imion i kotwic.

## Palety i cechy (wartości robocze, ostateczne po przeglądzie)

**Zwierzęta z dalekich stron i wiejskie**

| Zwierzątko | Rodzaj | Futro / ciemniejsze | Okrywa | Cechy sylwetki | Reakcje |
|---|---|---|---|---|---|
| Kapibara | f | `#b78268` / `#9c7155` | futro | duży prostokątny pyszczek, małe uszy | `squint`, `smileClosed`, `stretch` |
| Pingwinek | m | `#3e5b4d`, brzuszek `#f5eedb`, dziobek `#f2b84b` | pióra | owalny tułów, skrzydełka | `wingFan`, `ruffle`, `smileClosed` |
| Wydra | f | `#9c7155`, pyszczek `#f3dcc4` | futro | smukła, małe uszy, wąsiki | `pawSplash`, `fluff`, `smileClosed` |

Kapibara i Wydra trafiają do grup zgodnie z `PROJECT.md` 8.1: Wydra do „Leśnych i wiejskich”, Kapibara i Pingwinek do „Z dalekich stron”.

**Psy** (z `dogs.js`; Labrador powstał w Fazie 4)

| Rasa | Futro / jaśniejsze / uszy | Uszy | Ogon | Znaczenia | Uwagi |
|---|---|---|---|---|---|
| Dalmatyńczyk | `#f8f5e8` / `#fffcf3` / `#4f4a66` | opadające | gruby | 7 łat `#4f4a66` | krem zamiast bieli z `dogs.js` |
| Jamnik | `#a8683f` / `#c58d62` / `#7d4a2b` | opadające | gruby | — | niski, wydłużony tułów |
| Pudel | `#f1e6d6` / `#fbf4ea` / `#e6d6bf` | pompony | pompon | loczki | okrywa jak wełna |
| Husky | `#8f98aa` / `#f6f4fa` / `#6f788c` | sterczące | zawinięty | maska na pyszczku | — |
| Buldog | `#e3b98c` / `#fbf1e4` / `#c08f63` | złożone | krótki | — | szeroka głowa, krótkie łapki |

**Koty** (Dachowiec powstał w Fazie 4)

| Rasa | Futro / jaśniejsze | Cechy | Okrywa |
|---|---|---|---|
| Kotek perski | `#e9dccb` / `#f5eedb` | płaski pyszczek, małe uszy, bardzo puszysty | futro (puszystość maksymalna) |
| Kotek syjamski | `#f3e6d3` / `#fbf4ea`, ciemne punkty `#6b5248` | ciemne uszy, pyszczek i łapki | futro |
| Kotek brytyjski | `#9aa4b1` / `#b7c4ce` | okrągłe policzki, małe zaokrąglone uszy | futro |

**Dinozaury** (okrywa: łuski, wszystkie m)

| Dinozaur | Kolor / dodatki | Cechy we frontalnym szablonie | Reakcje |
|---|---|---|---|
| Diplodok | `#a8bfaa` | długa szyja ku górze, mała głowa; mieści się w pudełku 64 : 84 | `shine`, `smileClosed`, `stretch` |
| Triceratops | `#d4a38c`, kryza `#dfbc70` | kryza za głową, 3 zaokrąglone różki (bez ostrych końców) | `shine`, `squint`, `smileClosed` |
| Stegozaur | `#94aa83`, płytki `#dfbc70` | zaokrąglone płytki za tułowiem | `shine`, `smileClosed`, `stretch` |
| Parazaurolof | `#a5bbae`, grzebień `#b78268` | długi, zaokrąglony grzebień do tyłu | `shine`, `squint`, `smileClosed` |
| T-Rex | `#b9c79d` | duża łagodna głowa, zamknięty uśmiech, krótkie łapki | `armWave`, `smileClosed`, `shine` |

## Plany

### 05-01 · Kapibara, Pingwinek, Wydra

**Fala 1** · zależy od: Faza 4 · wymagania: REQ-30 · autonomiczny: tak

1. **Definicje** · `src/animals/species/capybara.ts`, `penguin.ts`, `otter.ts`
   - Działanie: geometria, paleta, okrywa, reakcje i ton szalika według tabeli.
   - Gotowe gdy: lista kontrolna jest odhaczona dla wszystkich trzech.
2. **Imiona i kotwice** · `src/animals/names.ts`, `src/animals/anchors.ts`
   - Działanie: Kapibara, Kapibary, Kapibarze, Kapibarę, Kapibarą, Kapibarze (f); Pingwinek, Pingwinka, Pingwinkowi, Pingwinka, Pingwinkiem, Pingwinku (m); Wydra, Wydry, Wydrze, Wydrę, Wydrą, Wydrze (f).
   - Gotowe gdy: testy imion i kotwic obejmują nowe id.
3. **Galeria i testy** · `src/dev/Gallery.tsx`, testy z Fazy 4 rozszerzone o nowe id.
   - Gotowe gdy: testy maski, imion i kotwic przechodzą.

**Must-haves:** trzy zwierzątka przechodzą pełną kąpiel · lista kontrolna kompletna.

### 05-02 · Dinozaury

**Fala 1** · zależy od: Faza 4 · wymagania: REQ-31 · autonomiczny: nie (przegląd łagodności T-Rexa przez autora)

1. **Definicje** · `src/animals/species/diplodocus.ts`, `triceratops.ts`, `stegosaurus.ts`, `parasaurolophus.ts`, `trex.ts`
   - Działanie: geometria według tabeli; różki, płytki i grzebień zawsze zaokrąglone; okrywa łuski (po kąpieli połysk).
   - Gotowe gdy: wszystkie pięć mieści się w pudełku 64 : 84 i przechodzi test maski.
2. **Łagodny T-Rex** · `trex.ts`
   - Działanie, zgodnie z DP-5:
     - brak zębów i otwartej paszczy;
     - duże, łagodne oczy;
     - krótkie łapki machają (`armWave` ≥ 1,2 s);
     - pastelowy kolor i rozmiar taki jak u innych zwierzątek.
   - Gotowe gdy: autor akceptuje T-Rexa na telefonie.
3. **Imiona** · `src/animals/names.ts`
   - Działanie: Diplodok, Diplodoka, Diplodokowi, Diplodoka, Diplodokiem, Diplodoku; Triceratops, Triceratopsa, …, Triceratopsie; Stegozaur, …, Stegozaurze; Parazaurolof, …, Parazaurolofie; T-Rex, T-Reksa, T-Reksowi, T-Reksa, T-Reksem, T-Reksie (formy do akceptacji autora).
   - Gotowe gdy: testy imion obejmują dinozaury.
4. **Dane do wykluczeń** · `src/animals/roster.ts`
   - Działanie: `group: "dinozaury"`; każde id da się wykluczyć osobno.
   - Gotowe gdy: walidacja ustawień akceptuje wykluczenie grupy i samego T-Rexa.

**Must-haves:** pięć dinozaurów przechodzi kąpiel · T-Rex zaakceptowany jako łagodny.

### 05-03 · Rasy psów

**Fala 1** · zależy od: Faza 4 · wymagania: REQ-32 · autonomiczny: nie (przegląd rozpoznawalności przez autora)

1. **Definicje** · `src/animals/species/dalmatian.ts`, `dachshund.ts`, `poodle.ts`, `husky.ts`, `bulldog.ts`
   - Działanie:
     - palety i cechy z tabeli, przeniesione z bocznego widoku `dogs.js` do frontalnego szablonu;
     - Jamnik: niski, wydłużony tułów w granicach pudełka;
     - Pudel: okrywa jak wełna (pompony po kąpieli).
   - Gotowe gdy: wszystkie pięć przechodzi test maski.
2. **Reakcje psów** · `src/animals/traits.ts`
   - Działanie: każda rasa ma `tailWag`, `shake`, `stretch` i `smileClosed` (REQ-36).
   - Gotowe gdy: test cech potwierdza ≥ 3 reakcje dla 6 psów.
3. **Imiona** · `src/animals/names.ts`
   - Działanie: Dalmatyńczyk, Dalmatyńczyka, …; Jamnik, Jamnika, …; Pudel, Pudla, …; Buldog, Buldoga, …. Formy obcych nazw (Husky) sprawdzamy w słowniku PWN i zatwierdza je autor.
   - Gotowe gdy: testy imion obejmują psy.

**Must-haves:** 6 ras psów rozpoznawalnych z przodu · każda z ≥ 3 reakcjami.

### 05-04 · Rasy kotów, przegląd i zrzuty referencyjne

**Fala 2** · zależy od: 05-01, 05-02, 05-03 · wymagania: REQ-32 · autonomiczny: nie (zatwierdzenie zrzutów przez autora)

1. **Definicje kotów** · `src/animals/species/persian.ts`, `siamese.ts`, `british.ts`
   - Działanie: palety i cechy z tabeli; Kotek perski ma największą puszystość po kąpieli.
   - Gotowe gdy: wszystkie trzy przechodzą test maski.
2. **Imiona kotów** · `src/animals/names.ts`
   - Działanie: odmiana przymiotnikowa, np. Kotek perski, Kotka perskiego, Kotkowi perskiemu, Kotka perskiego, Kotkiem perskim, Kotku perskim.
   - Gotowe gdy: testy imion obejmują koty.
3. **Test rejestru** · `tests/unit/roster.spec.ts`
   - Działanie: 36 unikalnych id; liczebność grup 15 / 6 / 6 / 4 / 5; brak ogólnego Pieska i Kotka; każde zwierzątko ma komplet danych z listy kontrolnej.
   - Gotowe gdy: test przechodzi.
4. **Zrzuty referencyjne** · `tests/visual/menagerie.spec.ts`
   - Działanie: `toHaveScreenshot` galerii (`?test=1&gallery=animals&still=1`) dla każdej grupy w stanach: czysty, mokry, po kąpieli, w szlafroku.
   - Gotowe gdy: autor zatwierdza zrzuty, a pliki referencyjne są w repozytorium.

**Must-haves:** 36 zwierzątek w rejestrze · zatwierdzone zrzuty całej menażerii.

## Weryfikacja fazy

- **Automatycznie:** testy `roster`, `names`, `anchors`, `animal-mask` dla 36 id oraz `menagerie` (wizualny).
- **Przegląd autora w galerii na telefonie:**
  - [ ] Psy i koty da się rozróżnić z przodu bez podpisów.
  - [ ] T-Rex nie straszy: bez zębów, łagodny wyraz, wolne ruchy.
  - [ ] Dinozaury mieszczą się w kadrze i pasują do rodziny.
  - [ ] Odmiana nazw jest poprawna (zwłaszcza obce nazwy).

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | 16 nowych zwierząt z kompletem danych | lista kontrolna + `roster.spec.ts` + kąpiel w `bath.spec.ts` |
| 2 | Rasy rozpoznawalne z przodu, psy z ≥ 3 reakcjami | przegląd + `traits` |
| 3 | T-Rex łagodny | przegląd + lista DP-5 |
| 4 | Zatwierdzone zrzuty 36 zwierzątek | `menagerie.spec.ts` |

## Ryzyka i pułapki

- **Rasy z bocznego widoku tracą rozpoznawalność z przodu:** wyróżniamy je uszami, ogonem widocznym zza tułowia i znaczeniami.
- **Wysokie sylwetki dinozaurów** zmniejszają pole do pocierania: maska z danych i szerokość narzędzia z Fazy 2 obsługują wąskie kształty; sprawdzamy, czy tryb jednoprzyciskowy kończy krok w 6–8 ruchach.
- **Dalmatyńczyk w czystej bieli** łamałby zasady stylu: krem `#f8f5e8`.

## Przekazanie

- Faza 7 dostaje komplet imion i okryw dla 36 zwierzątek (narracja, krok 5).
- Faza 10 buduje wykluczenia grupowe na `group` i pojedyncze wykluczenie T-Rexa.
- Faza 12 utrzymuje zrzuty menażerii w regresji wizualnej.

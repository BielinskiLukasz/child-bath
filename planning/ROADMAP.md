# Roadmap: Mała łazienka (child-bath)

## Overview

Droga od pustego szkieletu do wersji 1.0 prowadzi przez cztery etapy:

1. **Fundament:** szkielet aplikacji i silnik kąpieli z pocieraniem.
2. **Trzy niezależne tory, częściowo równolegle:** sterowanie z zapowiedzią „Dalej”, postacie (36 zwierzątek) oraz świat ze sceneriami i atmosferą.
3. **Spięcie w pełne doświadczenie:** rytuał z 5 kroków i narracją, runda z ławeczką i odpoczynkiem, rozszerzona interakcja, panel rodzica i dane na urządzeniu (jak w child-page).
4. **Szlif i wydanie:** wydajność i spokój na telefonie, wydanie v1.0.

Dziecko zobaczy aplikację dopiero po Fazie 12, dlatego każda faza kończy się mierzalnymi kryteriami sprawdzanymi testami i przeglądem dorosłego na telefonie. Wymagania REQ-xx są zdefiniowane w `planning/PROJECT.md` (sekcja 13); wszystkie 79 jest przypisanych do faz.

**Konwencje:**
- **Format:** układ zgodny z szablonem GSD; etykiety pól (*Goal*, *Depends on*, *Requirements*, *Success Criteria*, *Plans*) zostają po angielsku dla zgodności z narzędziami GSD.
- **Szczegółowość:** „fine” (12 faz, 40 planów). Bez szacunków czasu.
- **Plany faz:** `planning/phases/PHASE-01.md` … `PHASE-12.md`. Każdy zawiera cel, kontekst, projekt techniczny, plany NN-MM z zadaniami (pliki, działanie, „Gotowe gdy”), weryfikację, kryteria sukcesu i ryzyka. Wspólne zasady i Definition of Done są w `planning/phases/README.md`. Podsumowanie wykonania planu trafia do opisu PR (odpowiednik `NN-MM-SUMMARY.md` w GSD). Katalog `planning/` odpowiada `.planning/` w GSD.
- **Każdy plan** ma w nagłówku pole `requirements` z identyfikatorami REQ. Każde wymaganie fazy musi wystąpić w co najmniej jednym planie.
- **Doprecyzowania DP-1…DP-9** z `PROJECT.md` (sekcja 4.2) są przyjęte. Fazy, których dotyczą, mają pole „Doprecyzowania”; jeśli autor zmieni któreś z nich, poprawiamy tylko wskazane fazy.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Fundamenty** - szkielet z child-train, phone-first, PWA i jeden plik HTML, zielone CI
- [ ] **Phase 2: Silnik kąpieli** - siatka pokrycia, warstwy kroków, pocieranie i automatyczne domykanie
- [ ] **Phase 3: Sterowanie i przejścia** - klawiatura, tryb jednoprzyciskowy, zapowiedź z „Dalej”, dostępność
- [ ] **Phase 4: Postacie** - szablon jako dane, 20 zwierzątek z child-train i child-page, stany, reakcje, odmiana
- [ ] **Phase 5: Menażeria** - Kapibara, Pingwinek, Wydra, 5 dinozaurów, rasy psów i kotów (razem 36)
- [ ] **Phase 6: Świat** - silnik atmosfery, 6–8 scenerii ze źródłami wody i ławeczką, cisi towarzysze
- [ ] **Phase 7: Rytuał i narracja** - 5 kroków, długości 2–5 i własny rytuał, ślady zabawy, narracja, sekwencja kroków
- [ ] **Phase 8: Runda i nagroda** - planer z ziarnem i wagami, ozdoby, ławeczka 1 → 2 → 3, pożegnanie, odpoczynek
- [ ] **Phase 9: Rozszerzona interakcja** - półeczka z narzędziami, bańki jak w `banki.js`, wybór ozdoby
- [ ] **Phase 10: Panel rodzica** - bramka, wszystkie ustawienia v1.0, wagi z podglądem udziału, zestawy, dzienny limit
- [ ] **Phase 11: Dane na urządzeniu** - jak w child-page: zapis, dzienny licznik, kopia ustawień JSON, statystyki
- [ ] **Phase 12: Szlif i wydanie 1.0** - wydajność, audyt spokoju, regresja wizualna, README, wydanie

## Phase Details

### Phase 1: Fundamenty
**Goal**: Pusty „pokój kąpielowy” działa na telefonie jako jeden plik HTML i instalowalna PWA, z typografią, paletą i ziarnem papieru z child-train, a CI pilnuje zasad od pierwszego dnia.
**Depends on**: Nothing (first phase)
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07, REQ-76
**Success Criteria** (what must be TRUE):
  1. `npm run build` tworzy `dist/index.html`, który otwarty z dysku działa bez sieci.
  2. Wersja z GitHub Pages (`/child-bath/`) instaluje się na telefonie i otwiera ponownie w trybie samolotowym.
  3. Na telefonie 360 × 640, w pionie i w poziomie, pusta scena wypełnia ekran bez przewijania i z bezpiecznymi marginesami.
  4. CI przy każdym PR uruchamia typecheck, build i Playwright, w tym testy „zero zapytań sieciowych” i „brak audio”, i kończy się sukcesem.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Szkielet z konfiguracji child-train (Vite 7, React 19, TS, Tailwind 4, singlefile, alias `@`, `base: "/child-bath/"`), licencja MIT, README startowe, adnotacje źródeł
- [ ] 01-02: Fundament wizualny phone-first: tokeny i paleta, podzbiory fontów (`tools/build-fonts.py`), ziarno papieru, strefy ekranu z `env(safe-area-inset-*)`
- [ ] 01-03: PWA i CI: manifest, ikony (`tools/generate-icons.py`), `sw.js` network-first, wdrożenie na Pages, testy offline, zero-network i braku audio

### Phase 2: Silnik kąpieli
**Goal**: Dziecko może wyczyścić zwierzątko-szkic w trzech krokach, pocierając je palcem lub myszą, a kroki domykają się same po osiągnięciu progu.
**Depends on**: Phase 1
**Requirements**: REQ-10, REQ-11, REQ-12, REQ-13, REQ-14, REQ-15, REQ-16, REQ-17, REQ-18
**Success Criteria** (what must be TRUE):
  1. Dziecko może zetrzeć warstwę palcem lub myszą dokładnie pod widocznym narzędziem, także kilkoma palcami naraz.
  2. Po osiągnięciu progu (80, 90 albo 95%) reszta warstwy znika w ciągu 0,5 s i zaczyna się następny krok.
  3. Obrót telefonu lub zmiana rozmiaru okna w połowie kroku nie zmienia postępu, a ukrycie karty zatrzymuje zabawę do powrotu.
  4. Testy jednostkowe siatki pokrycia, progów i przejść faz przechodzą deterministycznie.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Czysty rdzeń: siatka pokrycia, stemplowanie narzędzia po odcinku, progi łatwości, typy kroków (zmywanie i nakładanie) + testy
- [ ] 02-02: Reducer faz i `useBathClock` (widoczność karty, mnożnik tempa); maszyna stanów bez nadpisywania faz
- [ ] 02-03: `LayerCanvas` i `useScrub` (wiele palców, przechwycenie wskaźnika, zdarzenia scalone), narzędzie pod palcem, pula baniek i kropel, zwierzątko-szkic

### Phase 3: Sterowanie i przejścia
**Goal**: Zabawę można prowadzić klawiaturą i w trybie jednoprzyciskowym, każde kolejne zwierzątko czeka w zapowiedzi na „Dalej”, a „bębnienie” niczego nie psuje.
**Depends on**: Phase 2
**Requirements**: REQ-19, REQ-20, REQ-21, REQ-22, REQ-23, REQ-24, REQ-25
**Success Criteria** (what must be TRUE):
  1. Dziecko może ukończyć wszystkie kroki samą klawiaturą (strzałki, Spacja, Enter).
  2. W trybie jednoprzyciskowym każde naciśnięcie wykonuje dokładnie jeden spokojny krok, a przytrzymanie i autorepeat niczego nie przyspieszają.
  3. Każde kolejne zwierzątko, także pierwsze w sesji, czeka na skraju sceny i wchodzi dopiero po „Dalej” (≥ 74 px na dotyku) albo Enter; przycisk staje się aktywny dopiero po zakończeniu poprzedniego przejścia.
  4. Czytnik ekranu ogłasza zwierzątko, krok i przejścia, a przy `prefers-reduced-motion` znikają animacje ciągłe.
**Plans**: 3 plans
**Doprecyzowania**: DP-1

Plans:
- [ ] 03-01: Klawiatura (strzałki, zygzak, pierścień fokusu) i zatrzask wejścia (`event.repeat`, `event.detail === 0`, 600 ms po zmianie fazy)
- [ ] 03-02: Faza zapowiedzi z „Dalej” i Enter (miejsce zapowiedzi jako zaślepka do Fazy 6) + tryb jednoprzyciskowy (krok ok. 1,2 s, duży przycisk)
- [ ] 03-03: Region `aria-live`, etykiety, ograniczony ruch + testy Playwright sterowania (emulowany dotyk, klawiatura, jeden przycisk)

### Phase 4: Postacie
**Goal**: 20 zwierzątek z istniejących rodzin (16 z child-train, w tym Labrador i Dachowiec, oraz Lew, Słoń, Panda i Koala z child-page) ma stany kąpieli, okrywy, wolne reakcje, poprawną odmianę imion i punkty zaczepienia ozdób.
**Depends on**: Phase 2
**Requirements**: REQ-29, REQ-33, REQ-34, REQ-35, REQ-36, REQ-37, REQ-38
**Success Criteria** (what must be TRUE):
  1. Każde z 20 zwierzątek można wykąpać od brudnego do czystego, a maska sylwetki pokrywa się z rysunkiem.
  2. Wygląd po kąpieli zależy od okrywy (puszysty, nastroszony, lśniący); zwierzątko zdejmuje szalik na kąpiel i siada w szlafroku albo turbanie.
  3. Żabka i Labrador mają po co najmniej 3 reakcje, a każda reakcja trwa ≥ 1,2 s.
  4. Test tabelaryczny potwierdza poprawną odmianę imion i rodzaj czasowników dla wszystkich 20 zwierzątek.
**Plans**: 4 plans
**Doprecyzowania**: DP-2, DP-4

Plans:
- [ ] 04-01: Model postaci jako dane (geometria, grupa, okrywa, cechy) + renderer SVG i maska `Path2D`; port frontalnego szablonu child-train (szalik, nastroje)
- [ ] 04-02: Stany kąpieli (mokry, po kąpieli według okrywy, bez szalika, szlafrok, turban) + system reakcji (≥ 8 typów, wolne)
- [ ] 04-03: 20 zwierzątek: 16 z child-train (Piesek → Labrador, Kotek → Dachowiec) + Lew, Słoń, Panda, Koala; rozszerzone reakcje Żabki i Labradora
- [ ] 04-04: Odmiana imion i rodzaj (`names.ts`), punkty zaczepienia ozdób z macierzą zgodności, test tabelaryczny

### Phase 5: Menażeria
**Goal**: Dochodzi 16 zwierzątek: Kapibara, Pingwinek, Wydra, pięć dinozaurów (z łagodnym T-Rexem) oraz pozostałe rasy psów i kotów. Razem 36, spójnych stylistycznie.
**Depends on**: Phase 4
**Requirements**: REQ-30, REQ-31, REQ-32
**Success Criteria** (what must be TRUE):
  1. Każde z 16 nowych zwierząt przechodzi pełny rytuał i ma komplet: stany, okrywę, reakcje, odmianę i punkty zaczepienia.
  2. Rasy są rozpoznawalne z przodu po sylwetce i kolorze (psy według palet z `dogs.js`), a każda rasa psa ma ≥ 3 reakcje.
  3. T-Rex nie pokazuje zębów, nie ryczy i porusza się tak samo wolno jak inne zwierzątka.
  4. Autor zatwierdza zrzuty referencyjne całej menażerii (36 zwierzątek).
**Plans**: 4 plans
**Doprecyzowania**: DP-2, DP-5

Plans:
- [ ] 05-01: Kapibara, Pingwinek, Wydra
- [ ] 05-02: Dinozaury: Diplodok, Triceratops, Stegozaur, Parazaurolof i łagodny T-Rex
- [ ] 05-03: Rasy psów: Dalmatyńczyk, Jamnik, Pudel, Husky, Buldog (palety i cechy z `dogs.js`, widok frontalny)
- [ ] 05-04: Rasy kotów: perski, syjamski, brytyjski + przegląd stylu i zrzuty referencyjne całej menażerii

### Phase 6: Świat
**Goal**: 6–8 scenerii ze źródłami wody, ławeczką, miejscem zapowiedzi i cichymi towarzyszami ożywa dzięki silnikowi atmosfery z child-train.
**Depends on**: Phase 2
**Requirements**: REQ-39, REQ-40, REQ-41, REQ-42, REQ-43, REQ-44, REQ-45
**Success Criteria** (what must be TRUE):
  1. Co najmniej 6 scenerii działa na telefonie w pionie i w poziomie bez przewijania; każda ma ławeczkę z 3 miejscami i miejsce zapowiedzi.
  2. Krok płukania używa źródła wody danej scenerii (prysznic, konewka albo drewniany czerpak).
  3. Pora dnia, pogoda, faza księżyca i pora roku zmieniają się płynnie, a ustawienia stałe mają pierwszeństwo; sceneria zmienia się łagodnym przenikaniem (≥ 1,2 s).
  4. Zegar w domowej łazience pokazuje symulowaną godzinę, a towarzysze kołyszą się łagodnie.
**Plans**: 4 plans

Plans:
- [ ] 06-01: Port silnika atmosfery (`atmosphere.ts`, `Atmosphere.tsx`, `useAtmosphere`) + tokeny łazienki i widok przez okno
- [ ] 06-02: Domowa łazienka (okno, zegar, prysznic, drzwi), ogród (konewka, furtka), leśne źródełko (czerpak); w każdej ławeczka i miejsce zapowiedzi
- [ ] 06-03: Górska balia, pomost nad jeziorem, lawendowe spa (+ plaża i zimowa łaźnia, jeśli w zakresie)
- [ ] 06-04: Cisi towarzysze, wybór jednej scenerii na rundę według pory roku i pogody, przenikanie scenerii, przesuwanie pory roku co rundę

### Phase 7: Rytuał i narracja
**Goal**: Każda kąpiel ma swoją historię (ślad zabawy i zdanie narracji dla rodzica), rytuał wybrany z 5 kroków i widoczną sekwencję kroków.
**Depends on**: Phase 3, Phase 4, Phase 6
**Requirements**: REQ-46, REQ-47, REQ-48, REQ-49, REQ-50, REQ-51
**Success Criteria** (what must be TRUE):
  1. Rytuały 2, 3, 4 i 5 oraz każdy poprawny rytuał własny przechodzą od początku do końca; niepoprawnego zestawu kroków nie da się ustawić.
  2. Krok 5 to czesanie dla futra i wełny, a głaskanie dla piór, kolców, skóry, łusek i skorupy.
  3. Każdy z 5 śladów zabawy ma własną fakturę, a zdanie narracji pasuje do śladu i do zwierzątka (rodzaj, odmiana).
  4. Sekwencja piktogramów pokazuje bieżący krok, a rodzic może ukryć zarówno zdanie, jak i sekwencję.
**Plans**: 4 plans
**Doprecyzowania**: DP-3, DP-4

Plans:
- [ ] 07-01: Model rytuału: 5 kroków, długości 2–5, reguły własnego rytuału, pierwszy krok mycia zmywa brud + testy wszystkich 10 kombinacji
- [ ] 07-02: Kroki namydlania (nakładanie) i czesania/głaskania zależnie od okrywy
- [ ] 07-03: Ślady zabawy (faktury, palety) + szablony zdań narracji z odmianą i rodzajem
- [ ] 07-04: Pasek narracji i sekwencja kroków w układzie phone-first + przełączniki ukrycia

### Phase 8: Runda i nagroda
**Goal**: Działa pełna pętla zabawy: zapowiedź, kąpiel z ozdobą, ławeczka zapełniana 1 → 2 → 3, pożegnanie i „Pora na odpoczynek”, z losowaniem z ziarnem i wagami częstości.
**Depends on**: Phase 7
**Requirements**: REQ-09, REQ-52, REQ-53, REQ-54, REQ-55, REQ-56, REQ-57, REQ-58, REQ-59
**Success Criteria** (what must be TRUE):
  1. Dziecko może przejść całą rundę: trzy różne zwierzątka, a każde z ozdobą od razu dosiada się na ławeczkę (miejsca 1 → 2 → 3).
  2. Po trzecim zwierzątku cała trójka macha, na skraju sceny czeka pierwsze zwierzątko nowej rundy, a jedno „Dalej” zmienia rundę i scenerię.
  3. Po pożegnaniu w N-tej rundzie pojawia się ekran odpoczynku, który zamyka tylko bramka rodzica; sygnał końca limitu czeka, aż bieżące zwierzątko usiądzie na ławeczce.
  4. Symulacja 10 000 rund na wielu ziarnach nie ma powtórzeń w rundzie ani na styku rund, wagi dają zamierzony udział (±1 pp), a w całej pętli nie ma punktów, liczników ani stanów porażki.
**Plans**: 3 plans
**Doprecyzowania**: DP-1, DP-7

Plans:
- [ ] 08-01: Planer rundy z ziarnem: 3 różne zwierzątka, przypięcia, worki, wagi z korektą + testy rozkładu
- [ ] 08-02: Ozdoby (min. 10) z punktami zaczepienia + nagroda (iskierki, „oddychanie”, reakcja)
- [ ] 08-03: Ławeczka 1 → 2 → 3, pożegnanie z zapowiedzią nowej rundy, zmiana rundy i scenerii, ekran „Pora na odpoczynek” (z punktem zaczepienia dla dziennego limitu)

### Phase 9: Rozszerzona interakcja
**Goal**: Po włączeniu opcji dziecko samo sięga po narzędzia z półeczki, bawi się bańkami jak w `banki.js` i wybiera ozdobę.
**Depends on**: Phase 8
**Requirements**: REQ-26, REQ-27, REQ-28
**Success Criteria** (what must be TRUE):
  1. Dziecko może wziąć narzędzie z półeczki: kolejne narzędzie łagodnie „oddycha”, a inne po dotknięciu spokojnie wraca na miejsce.
  2. Dotknięta duża bańka dzieli się na dwie mniejsze, a mała rozpływa się przez 1,6 s; nic nie pęka nagle, a przeciąganie po zwierzątku nadal myje.
  3. Dziecko może wybrać ozdobę z 2–3 propozycji, a zanim wybierze, zwierzątko cierpliwie czeka.
**Plans**: 2 plans
**Doprecyzowania**: DP-9

Plans:
- [ ] 09-01: Półeczka z narzędziami kroków rytuału w układzie phone-first; „oddychanie” kolejnego narzędzia, spokojny powrót pozostałych
- [ ] 09-02: Bańki jak w `banki.js` (podział na dwie, rozpływanie, rozdzielenie od gestu mycia) + wybór ozdoby z 2–3 propozycji

### Phase 10: Panel rodzica
**Goal**: Rodzic za bramką konfiguruje wszystkie ustawienia v1.0, w tym wagi częstości z podglądem udziału, rytuał i dzienny limit, oraz korzysta z gotowych zestawów.
**Depends on**: Phase 9
**Requirements**: REQ-60, REQ-61, REQ-62, REQ-63, REQ-64, REQ-65, REQ-66, REQ-67, REQ-68, REQ-69, REQ-70
**Success Criteria** (what must be TRUE):
  1. Rodzic może otworzyć panel przytrzymaniem znaku marki, przyciskiem ⚙ lub klawiszem Esc po poprawnym wyniku zadania; po błędzie wynik nie jest ujawniany.
  2. Każde ustawienie z sekcji 9.2 `PROJECT.md` działa i ma test Playwright, w tym własny rytuał z regułami DP-3.
  3. Wagi można ustawić dla pojedynczego zwierzątka i dla całej grupy, a panel pokazuje przybliżony udział (np. Żabka 3× ≈ 8% przy 36 zwierzątkach).
  4. Dzienny limit przygasza scenę przez ostatnie 20% i kończy się ekranem odpoczynku; rodzic za bramką może wyzerować dzisiejszy licznik (w tej fazie licznik działa w pamięci, zapis z datą dochodzi w Fazie 11).
  5. Gotowy zestaw wypełnia planer, rytuał, tempo i atmosferę bez zmiany wykluczeń i wag, a konflikt jest opisany.
**Plans**: 4 plans
**Doprecyzowania**: DP-3, DP-7

Plans:
- [ ] 10-01: Bramka, pasek wartości, nagłówek (znak marki, klepsydra, ⚙), szkielet panelu (`<dialog>`, fokus)
- [ ] 10-02: Treści: imię i tytuł, stopka z dedykacją, wykluczenia w 5 grupach, planer następnej rundy, wagi z ustawieniem grupowym i podglądem udziału
- [ ] 10-03: Kąpiel i rytm: rytuał (długości i własne kroki), łatwość, przełączniki, tempo, atmosfera, odpoczynek, dzienny limit z zerowaniem licznika
- [ ] 10-04: Gotowe zestawy (8) z wykrywaniem konfliktów + komplet testów panelu

### Phase 11: Dane na urządzeniu
**Goal**: Jak w child-page: ustawienia i dzienny licznik przetrwają zamknięcie aplikacji, rodzic robi kopię ustawień w JSON i przegląda lokalne statystyki, a żadne dane nie opuszczają urządzenia.
**Depends on**: Phase 10
**Requirements**: REQ-71, REQ-72, REQ-73, REQ-74, REQ-75
**Success Criteria** (what must be TRUE):
  1. Po zamknięciu i ponownym otwarciu aplikacji ustawienia i dzisiejszy czas zabawy są zachowane (zapis domyślnie włączony), a następnego dnia licznik startuje od zera.
  2. „Zapisz ustawienia”, a potem „Wczytaj ustawienia” (z pliku albo z wklejonego tekstu) odtwarza konfigurację po potwierdzeniu; błędny plik niczego nie zmienia i pokazuje komunikat po polsku; plik nie zawiera imienia dziecka.
  3. Rodzic widzi czas zabawy, ukończone kąpiele i ranking zwierzątek z filtrami (sesja, dziś, 7 dni, 30 dni, cały czas), eksportuje je do JSON i może je wyzerować.
  4. Test zero-network potwierdza, że żadne dane nie opuszczają urządzenia, a błąd pamięci nie przerywa zabawy.
**Plans**: 3 plans
**Doprecyzowania**: DP-6, DP-8

Plans:
- [ ] 11-01: Warstwa zapisu (schemat, wersja, migracje, przełącznik zapamiętywania) + dzienny licznik z datą
- [ ] 11-02: Kopia ustawień jak w child-page (plik, tekst, walidacja, naprawa, potwierdzenie) + „Usuń wszystkie dane z urządzenia”
- [ ] 11-03: Statystyki na wzór `analytics.js` (agregaty z 90 dni, sumy, aktywny czas) + widok z filtrami, ranking, eksport JSON, zerowanie

### Phase 12: Szlif i wydanie 1.0
**Goal**: Aplikacja jest płynna i spokojna na telefonie, w pełni przetestowana i opublikowana jako v1.0, gotowa do pokazania dziecku.
**Depends on**: Phase 5, Phase 11
**Requirements**: REQ-08, REQ-77, REQ-78, REQ-79
**Success Criteria** (what must be TRUE):
  1. Pocieranie utrzymuje ≥ 55 kl./s na telefonie referencyjnym.
  2. Automatyczny audyt spokoju nie znajduje pojawień krótszych niż 0,5 s, pętli szybszych niż 1,2 s, pękających baniek ani błysków.
  3. Wszystkie testy Playwright i zrzuty referencyjne kończą się w CI sukcesem.
  4. README opisuje UI i zasady stylu, a v1.0 działa na GitHub Pages.
**Plans**: 3 plans

Plans:
- [ ] 12-01: Wydajność na telefonie: profilowanie, budżety, optymalizacje
- [ ] 12-02: Audyt spokoju i dostępności: automatyczny test animacji, lista kontrolna, poprawki
- [ ] 12-03: Regresja wizualna, README (opis UI i stylu), lista kontrolna wydania, wydanie v1.0

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

Zależności pozwalają też pracować równolegle (np. kilkoma agentami na osobnych gałęziach):

| Fala | Fazy | Warunek |
|---|---|---|
| 1 | 1 | — |
| 2 | 2 | po 1 |
| 3 | 3, 4, 6 | po 2 |
| 4 | 5, 7 | 5 po 4; 7 po 3, 4 i 6 |
| 5 | 8 | po 7 |
| 6 | 9 | po 8 |
| 7 | 10 | po 9 |
| 8 | 11 | po 10 |
| 9 | 12 | po 5 i 11 |

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Fundamenty | 0/3 | In progress (kod w `child-bath/`, czeka na weryfikację) | - |
| 2. Silnik kąpieli | 0/3 | Implementacja gotowa; do zamknięcia: GitHub Actions i przegląd na fizycznym telefonie | - |
| 3. Sterowanie i przejścia | 0/3 | Not started | - |
| 4. Postacie | 0/4 | Not started | - |
| 5. Menażeria | 0/4 | Not started | - |
| 6. Świat | 0/4 | Not started | - |
| 7. Rytuał i narracja | 0/4 | Not started | - |
| 8. Runda i nagroda | 0/3 | Not started | - |
| 9. Rozszerzona interakcja | 0/2 | Not started | - |
| 10. Panel rodzica | 0/4 | Not started | - |
| 11. Dane na urządzeniu | 0/3 | Not started | - |
| 12. Szlif i wydanie 1.0 | 0/3 | Not started | - |

## Pokrycie wymagań

| Faza | Wymagania | Liczba |
|---|---|---|
| 1. Fundamenty | REQ-01–REQ-07, REQ-76 | 8 |
| 2. Silnik kąpieli | REQ-10–REQ-18 | 9 |
| 3. Sterowanie i przejścia | REQ-19–REQ-25 | 7 |
| 4. Postacie | REQ-29, REQ-33–REQ-38 | 7 |
| 5. Menażeria | REQ-30–REQ-32 | 3 |
| 6. Świat | REQ-39–REQ-45 | 7 |
| 7. Rytuał i narracja | REQ-46–REQ-51 | 6 |
| 8. Runda i nagroda | REQ-09, REQ-52–REQ-59 | 9 |
| 9. Rozszerzona interakcja | REQ-26–REQ-28 | 3 |
| 10. Panel rodzica | REQ-60–REQ-70 | 11 |
| 11. Dane na urządzeniu | REQ-71–REQ-75 | 5 |
| 12. Szlif i wydanie 1.0 | REQ-08, REQ-77–REQ-79 | 4 |
| **Razem** | **każde wymaganie dokładnie raz** | **79 / 79** |

REQ-08 (spokój) jest weryfikowane w Fazie 12, ale obowiązuje od pierwszej linii kodu. Każdy plan uwzględnia je w swoich kryteriach.

## Po v1.0

- 📋 **v1.0.x: poprawki po pierwszych sesjach dziecka.** Obserwacje autora, korekty progów, rozmiarów i tempa. Kolejne fazy dostaną numery od 13 (numeracja ciągła, jak w GSD).
- 📋 **v1.1: pomysły do rozważenia.** Plaża i zimowa łaźnia (jeśli nie weszły do v1.0), kolejne rasy (np. Owczarek, Corgi) i dinozaury, waga 5× albo „ulubieniec w każdej rundzie” (jeśli nie trafią do v1.0), sezonowe ozdoby, kolejne gotowe zestawy.

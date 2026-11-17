# Mała łazienka: plan projektu (child-bath)

> **Status:** v0.3, po dwóch rundach wywiadu. Sprzeczności P1–P7 są rozstrzygnięte (sekcja 4.1). Zostało 9 doprecyzowań DP-1…DP-9 (sekcja 4.2): to moje propozycje szczegółów, których wywiad nie przesądził. Obowiązują, dopóki autor ich nie zmieni.
> **Repozytorium:** `child-bath` (publiczne, MIT) · **Aplikacja:** „Mała łazienka {dziecka}” · **Dedykacja w stopce:** „Z myślą o Arturze”
> **Źródła:** [child-page](https://github.com/BielinskiLukasz/child-page): mechanika aktywności [`kapiel`](https://github.com/BielinskiLukasz/child-page/blob/main/docs/activities/kapiel-zwierzatek.md), rodzina ras psów (`js/dogs.js`), bańki (`js/banki.js`), statystyki (`js/analytics.js`), kopia ustawień i dzienny limit · [child-train](https://github.com/BielinskiLukasz/child-train): styl, UI, panel rodzica, silnik atmosfery, stack · wywiad z autorem (listopad 2026).
> **Powiązane:** `planning/ROADMAP.md` (12 faz w stylu GSD z odwołaniami do wymagań REQ-xx z sekcji 13) · `planning/phases/` (szczegółowe plany faz `PHASE-01.md`…`PHASE-12.md` i wspólne zasady w `README.md`).

**Spis treści:** 1. Czym jest projekt · 2. Najważniejsza wartość · 3. Decyzje · 4. Rozstrzygnięcia i doprecyzowania · 5. Zasady · 6. Dziecko i kontekst · 7. Doświadczenie dziecka · 8. Różnorodność · 9. Panel rodzica · 10. Dane na urządzeniu · 11. Styl i UI · 12. Architektura · 13. Wymagania v1.0 · 14. Ograniczenia i poza zakresem · 15. Ryzyka · 16. Słownik · Załączniki A–B

---

## 1. Czym jest projekt

„Mała łazienka” to spokojna, cicha aplikacja PWA po polsku, projektowana **najpierw na telefon**. Powstaje dla 3-letniego dziecka autora, a jej kod jest publiczny na GitHubie (licencja MIT).

Dziecko kąpie zwierzątka w krótkim rytuale: zmywa ślady zabawy, spłukuje pianę i wyciera ręcznikiem, aż zwierzątko jest czyste i puszyste. Umyte zwierzątko dostaje ozdobę i dosiada się na ławeczkę obok balii. Po trzech kąpielach cała trójka macha na pożegnanie, a nowa runda zaczyna się w innej scenerii. Po kilku rundach przychodzi „Pora na odpoczynek”.

To **osobny świat**, bez fabularnych powiązań z pociągiem, ale w tym samym stylu graficznym i z tym samym silnikiem atmosfery co child-train. Mechanika pocierania pochodzi z aktywności `kapiel`, a rozwiązania dla rodzica (dzienny limit, kopia ustawień, statystyki) z child-page.

## 2. Najważniejsza wartość

**Przewidywalny, wyciszający rytuał, w którym 3-latek sam doprowadza zwierzątko od „brudnego po zabawie” do „czystego i puszystego”: bez dźwięku, bez pośpiechu i bez możliwości porażki.**

Gdy trzeba wybierać, ta wartość wygrywa z różnorodnością i liczbą funkcji.

## 3. Decyzje

| # | Temat | Decyzja | Źródło |
|---|---|---|---|
| D-01 | Cel i licencja | dla dziecka autora; publiczne repozytorium na licencji MIT. Kod z child-train (MIT) i child-page (zastrzeżony, ten sam właściciel) przenosimy swobodnie; przeniesione fragmenty child-page stają się dostępne na MIT | pyt. 1, Z8 |
| D-02 | Rola zabawy | spokojna zabawa „przyczyna → skutek”, wieczorny rytuał wyciszający, nauka kolejności czynności przy myciu | pyt. 2 |
| D-03 | Dziecko | 3 lata; ulubione zwierzątka: Żabka i Piesek; boi się nagłych i głośnych elementów; dobrze radzi sobie z pociągiem i child-page | pyt. 3 |
| D-04 | Urządzenia | telefon (priorytet), laptop lub komputer z klawiaturą | pyt. 4 |
| D-05 | Sterowanie | pocieranie palcem lub myszą + klawiatura (strzałki, Spacja, Enter); w opcjach rodzica tryb jednoprzyciskowy i rozszerzona interakcja dotykowa | pyt. 5 |
| D-06 | Wykonanie | implementuje agent AI, autor sprawdza zmiany; dziecko zobaczy dopiero efekt końcowy | pyt. 6 |
| D-07 | Zakres | od razu pełna wersja 1.0 | pyt. 7, 13 |
| D-08 | Runda | rundy po 3 zwierzątka w jednej scenerii; każde umyte zwierzątko od razu dosiada się na ławeczkę z boku (1 → 2 → 3); po trzecim pożegnanie; odpoczynek po kilku rundach; kolejne zwierzątko czeka na „Dalej” lub Enter | pyt. 8, 15, runda 2, DP-1 |
| D-09 | Zwierzątka | 36: baza 23 (16 z child-train oraz Lew, Słoń, Panda, Koala, Kapibara, Pingwinek, Wydra), w której ogólnego Pieska i Kotka zastępują rasy, + 5 dinozaurów + 6 ras psów + 4 rasy kotów | pyt. 9, runda 2, DP-2 |
| D-10 | Częstość | waga 1× / 2× / 3× przy każdym dozwolonym zwierzątku, domyślnie 1×; można wyróżnić kilka zwierząt naraz | pyt. 10, 20, runda 2 |
| D-11 | Świat | osobny świat; styl i pełny silnik atmosfery z child-train | pyt. 11, 16, Z2 |
| D-12 | Priorytety różnorodności | 1. zwierzątka i ich reakcje, 2. miejsca kąpieli, 3. etapy i narzędzia | pyt. 12 |
| D-13 | Panel rodzica | komplet ustawień z child-train + wagi częstości + łatwość mycia, wszystko w v1.0 | pyt. 13, 20 |
| D-14 | Rytuał | 5 kroków: zmywanie brudu, namydlanie, płukanie, wycieranie, czesanie/głaskanie; domyślnie klasyczne 3; rodzic wybiera długość 2 / 3 / 4 / 5 albo zaznacza kroki | pyt. 14, runda 2, DP-3, DP-4 |
| D-15 | Scenerie | 6–8 scenerii + pełny silnik atmosfery (24 h, pogoda, faza księżyca, 4 pory roku) | pyt. 16 |
| D-16 | Ślady i woda | ślady: błotko, mech z listkami, pyłek kwiatowy, sok z jagód, piasek; woda: prysznic, konewka, drewniany czerpak; narzędzie widoczne pod palcem | pyt. 17 |
| D-17 | Ozdoby | rozbudowana pula (wianki, kokardki, korony, czapeczki, turban z ręcznika…) + cisi towarzysze na brzegu balii | pyt. 18 |
| D-18 | Dźwięk i tekst | brak dźwięku; dziecko nie musi czytać; krótkie zdania dla rodzica na dole ekranu, domyślnie widoczne, ukrywane w panelu | pyt. 19, runda 2 |
| D-19 | Łatwość | szerokość gąbki + próg auto-domykania 80 / 90 / 95% | pyt. 20 |
| D-20 | Dane | jak w child-page: zapis w localStorage od razu (domyślnie), dzienny limit, kopia ustawień w JSON, lokalne anonimowe statystyki z eksportem i resetem; zero sieci | pyt. 21, runda 2, DP-6–DP-8 |
| D-21 | Technologia | stack child-train: React 19, TypeScript, Tailwind 4, Vite + singlefile, PWA, Playwright, GitHub Pages | pyt. 22, Z3 |
| D-22 | Planowanie | roadmapa w stylu GSD; każda faza dostanie własne pliki md | pyt. 22, Z11 |
| D-23 | Nazwy | repozytorium `child-bath`, tytuł „Mała łazienka {dziecka}”, dedykacja „Z myślą o Arturze” | Z9 |
| D-24 | child-page | aktywność `kapiel` zostaje bez zmian; „żabka 3×” to osobne zadanie (`kapiel-zaba-3x.md`) | Z10 |
| D-25 | Język | tylko polski | Z4 |
| D-26 | Bańki | w trybie rozszerzonym dotknięta bańka miękko rozpływa się albo dzieli na dwie mniejsze, jak w `banki.js`; nic nie pęka nagle | runda 2, DP-9 |

## 4. Rozstrzygnięcia i doprecyzowania

### 4.1 Rozstrzygnięcia z rundy 2

| Temat | Rozstrzygnięcie | Wymagania |
|---|---|---|
| P1 · Statystyki a „bez analityki” | lokalne, anonimowe statystyki tylko na urządzeniu: czas zabawy, ukończone kąpiele, ranking zwierzątek; eksport JSON i reset; zero sieci, jak w child-page | REQ-74 |
| P2 · Zapis ustawień | zapis w localStorage włączony od razu (domyślnie) + eksport i import JSON, jak w child-page | REQ-71, REQ-73 |
| P3 · Limit czasu | dzienny limit minut, jak w child-page (wynika z odpowiedzi o zapisie „dziennego limitu”); do tego odpoczynek co N rund | REQ-69, REQ-72 |
| P4 · Częstość | waga 1× / 2× / 3× przy każdym dozwolonym zwierzątku, domyślnie 1×; można wyróżnić kilka naraz (np. Żabka 3× i pieski 2×) | REQ-59, REQ-65 |
| P5 · Rytuał | dostępne wszystkie 5 kroków; domyślnie klasyczne 3; rodzic wybiera długość 2 / 3 / 4 / 5 albo zaznacza kroki | REQ-46, REQ-47, REQ-66 |
| P6 · Zwierzęta | baza 23 + 5 dinozaurów + 6 ras psów (w tym Dalmatyńczyk) + 4 rasy kotów; rasy zastępują ogólnego Pieska i Kotka, razem 36 | REQ-29–REQ-32 |
| P7 · Tekst | dziecko nie musi czytać (wszystko czytelne wizualnie); krótkie zdania dla rodzica na dole ekranu, domyślnie widoczne, ukrywane w panelu | REQ-05, REQ-49, REQ-50 |
| Ławeczka (nowe) | jedna sceneria na rundę, ławeczka z boku; każde umyte zwierzątko od razu dosiada się (1 → 2 → 3); po trzecim cała trójka macha na pożegnanie | REQ-43, REQ-55, REQ-56 |
| Bańki (nowe) | w trybie rozszerzonym dotknięta bańka miękko rozpływa się albo dzieli na dwie mniejsze, jak w `banki.js`; bez nagłego pęknięcia | REQ-27 |

### 4.2 Doprecyzowania DP-1…DP-9

To moje propozycje szczegółów, których wywiad nie przesądził. Dokument i roadmapa je przyjmują; każde można zmienić jednym zdaniem.

| # | Temat | Propozycja | Uzasadnienie | Wymagania |
|---|---|---|---|---|
| DP-1 | Kiedy czeka się na „Dalej” | Po nagrodzie umyte zwierzątko samo siada na ławeczce. Na „Dalej” lub Enter czeka **następne** zwierzątko, stojące na skraju sceny (w drzwiach łazienki, przy furtce ogrodu). Tak samo na początku sesji i po pożegnaniu, gdzie jedno naciśnięcie zaczyna nową rundę. | łączy odpowiedź 15 („zwierzątko czeka na przycisk”) z odpowiedzią o ławeczce („od razu dosiada się”); działa jak pociąg czekający na stacji | REQ-20, REQ-21, REQ-56 |
| DP-2 | Rasy zamiast ogólnych | Piesek z child-train staje się Labradorem, a Kotek Dachowcem (zachowują swoje sylwetki). Psy pochodzą z rodziny `dogs.js` w child-page, którą dziecko zna z „Rasy Piesków” i „Psiej Myjni”: Labrador, Dalmatyńczyk, Jamnik, Pudel, Husky, Buldog. Pominięte: Owczarek (z przodu podobny do Husky’ego) i Corgi (myli się z Liskiem). Koty: Dachowiec, perski, syjamski, brytyjski. | ciągłość z oboma projektami; rasy rozróżnialne we frontalnym szablonie | REQ-29, REQ-32 |
| DP-3 | Reguły własnego rytuału | Stała kolejność kroków. Wycieranie zawsze. Co najmniej jeden krok z wodą (zmywanie brudu albo płukanie). Namydlanie wymaga płukania. Czesanie/głaskanie opcjonalne, zawsze na końcu. Brud zmywa pierwszy krok mycia. | rytuał ma uczyć logicznej kolejności (D-02) | REQ-46, REQ-66 |
| DP-4 | Krok 5 a okrywa | Czesanie szczotką dla futra i wełny (puszyste pasma); głaskanie dla piór, kolców, skóry, łusek i skorupy (łagodny połysk, zmrużone oczy). | Żabka, Żółwik i dinozaury nie mają futerka | REQ-47 |
| DP-5 | Łagodny T-Rex | Bez widocznych zębów i ryku, z krótkimi machającymi łapkami, pastelowy, ruchy tak samo wolne jak u innych. Rodzic jednym przyciskiem wyklucza grupę „Dinozaury” albo samego T-Rexa. | dziecko boi się nagłych elementów | REQ-31 |
| DP-6 | Kopia ustawień bez imienia | Plik kopii ustawień nie zawiera imienia dziecka (jak w child-page: bez danych osobowych); import zachowuje bieżące imię. | plik może trafić poza urządzenie | REQ-73 |
| DP-7 | Dzienny limit | Jak w child-page: liczy tylko widoczny czas zabawy, zeruje się każdego dnia, a rodzic za bramką może wyzerować dzisiejszy licznik (zamiast „jednego przedłużenia” z child-train). Gdy limit minie w trakcie kąpieli, bieżące zwierzątko zostaje dokończone i siada na ławeczce; dopiero potem pojawia się ekran odpoczynku. | spójność z child-page; nie zostawiamy dziecka z brudnym zwierzątkiem | REQ-57, REQ-69, REQ-72 |
| DP-8 | Statystyki bez wyłącznika | Jak w child-page: zawsze zbierane lokalnie; rodzic może je wyeksportować i wyzerować. | spójność z child-page | REQ-74 |
| DP-9 | Bańki a mycie | W trybie rozszerzonym bańki reagują na dotyk poza sylwetką zwierzątka oraz między kąpielami (nagroda, zapowiedź); przeciąganie po zwierzątku zawsze myje. Duża bańka dzieli się na dwie mniejsze (promień 0,66), mała powoli się rozpływa (1,6 s). | brak konfliktu gestów | REQ-27 |

### 4.3 Otwarte, niepilne

- **Telefon referencyjny** do pomiarów wydajności (REQ-77): do wskazania przed Fazą 12.
- **Silniejsze wyróżnienie ulubieńca:** czy dodać wagę 5× albo opcję „ulubieniec w każdej rundzie”? Wyjaśnienie w sekcji 8.7. Do decyzji przed Fazą 10.

## 5. Zasady (nie łamać)

1. **Spokój ponad wszystko.** Dziecko boi się nagłych elementów, więc:
   - nic nie pojawia się ani nie znika szybciej niż w 0,5 s;
   - nie ma błysków, wstrząsów, skoków skali ani gwałtownych ruchów;
   - bańki nigdy nie pękają: dzielą się albo powoli rozpływają;
   - żadna pętla nie jest szybsza niż 1,2 s, z wyjątkiem efektów pod palcem dziecka.
2. **Bez dźwięku.** Aplikacja nie używa żadnego audio.
3. **Dziecko nie musi czytać.** Wszystko jest czytelne wizualnie. Krótkie zdania na dole ekranu są dla dorosłego czytającego obok i można je ukryć.
4. **Nic nie może się nie udać.** Nie ma punktów, odznak, porażek ani odliczania. Krok domyka się sam. Niewłaściwe narzędzie po prostu wraca na półeczkę, bez sygnału błędu.
5. **Dziecko decyduje o tempie.** Kolejne zwierzątko cierpliwie czeka na dotknięcie „Dalej” lub Enter.
6. **Jedna rzecz naraz.** Na ekranie jest jeden główny element ruchu: zwierzątko i narzędzie pod palcem.
7. **Prywatność.** Nic nie wychodzi z urządzenia. Ustawienia, dzienny licznik i anonimowe statystyki są zapisane tylko lokalnie; rodzic może je wyeksportować i usunąć.
8. **Offline.** Aplikacja działa z jednego pliku `dist/index.html` i jako instalowalna PWA.
9. **Styl child-train.** Każdy nowy element ma wyglądać jak strona z tej samej papierowej książeczki.
10. **Najpierw telefon.** Każdy ekran projektujemy najpierw na telefon w pionie.

## 6. Dziecko i kontekst użycia

- **Dziecko:** 3 lata. Ulubione zwierzątka to Żabka i Piesek: Żabka dostaje najbogatsze reakcje, a psów jest sześć ras, każda z co najmniej 3 reakcjami. Dziecko dobrze zna sterowanie z child-train (Enter) i z child-page (dotyk), a rasy psów z „Rasy Piesków” i „Psiej Myjni”.
- **Wrażliwość:** nagłe i głośne elementy. Stąd zasada 1, łagodny T-Rex (DP-5) i automatyczny audyt animacji (REQ-08).
- **Urządzenia:** telefon w pionie (priorytet), telefon w poziomie, laptop z myszą i klawiaturą.
- **Kontekst:** wieczorny rytuał (często przed prawdziwą kąpielą lub snem), zabawa pod opieką dorosłego, który może przeczytać zdanie narracji.
- **Proces:** implementuje agent AI, a autor przegląda zmiany. Dziecko zobaczy dopiero wersję 1.0, więc o jakości decydują testy automatyczne i przegląd dorosłego na telefonie po każdej fazie.

## 7. Doświadczenie dziecka

### 7.1 Runda

1. **Zapowiedź.** Na skraju sceny (w drzwiach łazienki, przy furtce ogrodu) czeka zwierzątko, a w strefie akcji jest przycisk „Dalej”. Tak zaczyna się każda kąpiel, także pierwsza w sesji (DP-1).
2. **Wejście.** Po „Dalej” lub Enter zwierzątko powoli wchodzi do balii (≥ 0,8 s) i wiesza szalik na haczyku. Na dole pojawia się zdanie narracji, np. „Żabka skakała po kałużach…”. Ślad zabawy na zwierzątku pasuje do zdania.
3. **Rytuał.** Kolejne kroki według ustawienia rodzica (7.2). W każdym kroku warstwa pojawia się (0,7 s), dziecko pociera, a przy progu reszta znika (0,5 s).
4. **Nagroda.** Zwierzątko dostaje ozdobę: losową albo, w trybie rozszerzonym, wybraną przez dziecko z 2–3 propozycji. Pojawiają się papierowe iskierki, zwierzątko spokojnie „oddycha” i reaguje. Wygląd po kąpieli zależy od okrywy (8.1).
5. **Ławeczka.** Umyte zwierzątko samo dosiada się na ławeczkę obok balii (miejsce 1, potem 2, potem 3), w szlafroku albo turbanie z ręcznika i z ozdobą. Na skraju sceny czeka już następne zwierzątko (krok 1).
6. **Pożegnanie.** Gdy na ławeczce usiądzie trzecie zwierzątko, cała trójka macha na pożegnanie, a na skraju sceny czeka pierwsze zwierzątko nowej rundy. Po „Dalej” trójka odchodzi, sceneria łagodnie się zmienia (przenikanie ≥ 1,2 s), pora roku przesuwa się o jedną i zaczyna się nowa runda.
7. **Odpoczynek.** Po pożegnaniu w N-tej rundzie (domyślnie 4) zamiast zapowiedzi pojawia się ekran „Pora na odpoczynek”: zwierzątka śpią w szlafrokach pod księżycem. Gdy minie dzienny limit, bieżące zwierzątko zostaje dokończone i siada na ławeczce, a potem pojawia się ten sam ekran (DP-7). Wybudza go tylko bramka rodzica.

### 7.2 Rytuał: 5 kroków

| # | Krok | Narzędzie | Mechanika | Co widać |
|---|---|---|---|---|
| 1 | Zmywanie brudu | gąbka | zmywanie | ślad zabawy (8.3) znika, spod palca unoszą się bańki |
| 2 | Namydlanie | gąbka z mydłem | nakładanie | pod palcem rośnie kremowa piana |
| 3 | Płukanie | źródło wody scenerii | zmywanie | strumień od góry do palca i spadające krople; znika piana (albo brud, gdy nie było kroku 1) |
| 4 | Wycieranie | ręcznik | zmywanie | znika wilgotny odcień i kropelki; okrywa puszy się albo lśni |
| 5 | Czesanie / głaskanie | szczotka / dłoń | nakładanie | czesanie: puszyste pasma (futro, wełna); głaskanie: łagodny połysk i zmrużone oczy (pióra, kolce, skóra, łuski, skorupa) |

| Rytuał | Kroki | Uwagi |
|---|---|---|
| Krótki (2) | 1 → 4 | na krótką zabawę |
| **Klasyczny (3, domyślny)** | 1 → 3 → 4 | jak w `kapiel`: piana do spłukania powstaje przy zmywaniu |
| Z namydlaniem (4) | 1 → 2 → 3 → 4 | osobne namydlanie przed płukaniem |
| Pełne SPA (5) | 1 → 2 → 3 → 4 → 5 | na końcu czesanie albo głaskanie |
| Własny | wybrane kroki | reguły DP-3 |

**Reguły własnego rytuału (DP-3):** kroki zawsze w kolejności 1–5; wycieranie zawsze; co najmniej jeden krok z wodą (zmywanie brudu albo płukanie); namydlanie wymaga płukania; krok 5 opcjonalny i zawsze ostatni; brud zmywa pierwszy krok mycia. Daje to 10 możliwych rytuałów o długości 2–5 kroków.

### 7.3 Sterowanie

| Tryb | Jak działa | Dostępność |
|---|---|---|
| Pocieranie | palec lub mysz; wiele palców naraz; narzędzie widoczne pod palcem | zawsze |
| Klawiatura | strzałki przesuwają narzędzie (krok 0,07 pola), Spacja i Enter prowadzą je zygzakiem; w zapowiedzi Enter działa jak „Dalej” | zawsze |
| Jeden przycisk | każde naciśnięcie Enter lub dużego przycisku (≥ 74 px) wykonuje jeden spokojny krok mycia (ok. 1,2 s); w zapowiedzi ten sam przycisk działa jak „Dalej” | opcja rodzica |
| Rozszerzona interakcja | półeczka z narzędziami kroków rytuału (dziecko samo bierze narzędzie, kolejne łagodnie „oddycha”); bańki dzielą się albo rozpływają pod palcem (DP-9); wybór ozdoby z 2–3 propozycji | opcja rodzica |

### 7.4 Odporność na „bębnienie”

- Jedno naciśnięcie to najwyżej jedna akcja. Przytrzymanie i autorepeat (`event.repeat`) są ignorowane.
- Kliknięcia z `event.detail === 0` są pomijane, żeby Enter na przycisku nie liczył się podwójnie (wzorzec z child-train).
- Przez 600 ms po każdej zmianie fazy wejście jest ignorowane.
- „Dalej” staje się aktywne dopiero, gdy poprzednie zwierzątko usiądzie na ławeczce.

### 7.5 Sekwencja kroków (nauka kolejności)

Pod zdaniem narracji jest rząd piktogramów narzędzi bieżącego rytuału, np. gąbka → konewka → ręcznik. Bieżący piktogram łagodnie „oddycha”, a ukończone mają kremowe wypełnienie. Nie ma procentów ani paska postępu. Rodzic może sekwencję ukryć.

### 7.6 Czasy (mnożone przez tempo)

| Zdarzenie | Czas |
|---|---|
| Wejście zwierzątka | ≥ 0,8 s |
| Pojawienie się warstwy kroku | 0,7 s |
| Zanik reszty po osiągnięciu progu | 0,5 s (natychmiast przy ograniczonym ruchu) |
| Nagroda (iskierki, reakcja) | ok. 2–3 s |
| Przejście na ławeczkę | 0,8–1,2 s |
| Aktywacja „Dalej” | gdy zwierzątko usiądzie na ławeczce |
| Pożegnanie | ok. 6 s, potem czekanie na „Dalej” |
| Zmiana scenerii | przenikanie ≥ 1,2 s |
| Bańki w trybie rozszerzonym | przy podziale bańka znika przez 1,6 s z pulsem skali 8% (0,7 s); mała bańka rozpływa się przez 1,6 s |

## 8. Różnorodność

Priorytety: **1. zwierzątka i ich reakcje → 2. miejsca kąpieli → 3. etapy i narzędzia.** Ślady zabawy, ozdoby, towarzysze i atmosfera też są w v1.0, ale w mniejszej głębi.

### 8.1 Zwierzątka (36)

| Grupa w panelu | Zwierzątka | Okrywa → wygląd po kąpieli |
|---|---|---|
| Leśne i wiejskie (15) | Króliczek, Lisek, Miś, Jeżyk, Sówka, Wiewiórka, Żabka, Borsuk, Jelonek, Myszka, Kaczuszka, Owieczka, Prosiaczek, Żółwik, Wydra | futro → puszyste; Owieczka: wełna → najbardziej puszysta; Sówka, Kaczuszka: pióra → nastroszone; Jeżyk: kolce → lśniące; Żabka, Prosiaczek: skóra → lśniąca; Żółwik: skorupa → lśniąca |
| Z dalekich stron (6) | Lew, Słoń, Panda, Koala, Kapibara, Pingwinek | futro → puszyste; Słoń: skóra → lśniący; Pingwinek: pióra → nastroszone |
| Pieski (6) | Labrador (dawny Piesek z child-train), Dalmatyńczyk, Jamnik, Pudel, Husky, Buldog | futro → puszyste; Pudel: loczki (jak wełna) → puszyste pompony |
| Kotki (4) | Dachowiec (dawny Kotek z child-train), Kotek perski, Kotek syjamski, Kotek brytyjski | futro → puszyste; perski najbardziej |
| Dinozaury (5) | Diplodok, Triceratops, Stegozaur, T-Rex, Parazaurolof | łuski → lśniące |

Zasady rysunku:
- Wszystkie 36 zwierzątek powstaje z jednego frontalnego szablonu child-train: okrągła głowa, mniejszy tułów, łapki, szalik. Gatunek i rasę rozpoznajemy po sylwetce i kolorze.
- Rasy psów korzystają z palet i cech rodziny `dogs.js` z child-page (uszy opadające, sterczące, złożone, pompony; ogony; łaty, maska), przerysowanych z widoku z boku na frontalny. Jamnik ma niski, wydłużony tułów.
- Drobne znaczenia (łaty dalmatyńczyka, maska husky’ego, ciemne uszy i pyszczek syjamczyka) są dozwolone w skali kropek jelonka i pasa borsuka z child-train.
- T-Rex jest łagodny (DP-5): bez widocznych zębów i ryku, z krótkimi machającymi łapkami, pastelowy.

**Reakcje** (min. 8 typów, każda ≥ 1,2 s, wyłączone przy ograniczonym ruchu):
- puszenie się, nastroszenie piórek;
- machanie ogonem;
- mrużenie oczu z zadowolenia;
- uśmiech z zamkniętymi oczami (gdy gąbka jest na brzuszku);
- ziewanie (wieczorem);
- przeciąganie się;
- plusk łapką;
- wachlowanie skrzydełkami;
- połysk skorupy lub łusek;
- powolne otrzepanie się;
- machanie krótkimi łapkami (T-Rex).

**Żabka** dostaje plusk łapką, mrużenie oczu, uśmiech i lśnienie. **Każda rasa psa** dostaje machanie ogonem, powolne otrzepanie, przeciąganie się i uśmiech.

### 8.2 Scenerie

Jedna sceneria na rundę. W każdej obok balii stoi ławeczka (albo jej odpowiednik: pień, kamień, deska pomostu), a następne zwierzątko czeka w stałym miejscu zapowiedzi.

| Sceneria | Źródło wody | Miejsce zapowiedzi | Kiedy w losowaniu |
|---|---|---|---|
| Domowa łazienka (okno, zegar, wanna na nóżkach) | prysznic | drzwi | cały rok (domyślna) |
| Ogród (balia, płot, kwiaty) | konewka | furtka | wiosna, lato |
| Leśne źródełko (kamienie, mech, paprocie) | drewniany czerpak | zza paproci | wiosna–jesień |
| Górska balia (drewniana balia, para, góry) | drewniany czerpak | górska ścieżka | cały rok, zimą częściej |
| Pomost nad jeziorem (trzciny, łódka) | drewniany czerpak | brzeg jeziora | lato |
| Lawendowe spa (lawenda, ręczniki, lampiony) | prysznic | łukowe przejście | lato, wieczór |
| *(propozycja)* Plaża z piaskownicą | konewka | spod parasola | lato |
| *(propozycja)* Zimowa łaźnia (ciepła balia w śniegu) | drewniany czerpak | ścieżka w śniegu | zima |

Sceneria przypięta przez rodzica ma pierwszeństwo przed porą roku.

### 8.3 Ślady zabawy i narracja

| Ślad | Faktura i kolory | Przykładowe zdanie |
|---|---|---|
| Błotko | brązowe plamy, `#b78268`, `#9c7155` | „Żabka skakała po kałużach…” / „Dalmatyńczyk skakał po kałużach…” |
| Mech z listkami | zielone kępki i listki, `#648a71`, `#94aa83` | „Miś turlał się po leśnym mchu…” |
| Pyłek kwiatowy | kremowo-żółty pył, `#f7f2b5`, `#dfbc70` | „Króliczek wąchał kwiatki na łące…” |
| Sok z jagód | stonowane fioletowe kropki (nowy token `--berry`) | „Lisek zbierał jagody…” |
| Piasek | ziarnisty beż, `#f5eedb`, `#dfbc70` | „T-Rex budował zamek z piasku…” |

Zasady narracji:
- zdania są krótkie (do ok. 60 znaków), spokojne, bez wykrzykników; są dla dorosłego, a dziecko nie musi ich czytać;
- każdy ślad ma co najmniej 3 warianty zdania;
- czasownik zgadza się z rodzajem gramatycznym zwierzątka, a imię jest odmieniane (REQ-37, REQ-49).

### 8.4 Narzędzia

| Krok | Narzędzie |
|---|---|
| Zmywanie brudu | gąbka |
| Namydlanie | gąbka z mydłem |
| Płukanie | źródło wody scenerii (prysznic, konewka, drewniany czerpak) |
| Wycieranie | ręcznik |
| Czesanie / głaskanie | szczotka / dłoń, zależnie od okrywy |

Narzędzie jest zawsze widoczne pod palcem albo kursorem. W trybie rozszerzonym leży na półeczce.

### 8.5 Ozdoby i cisi towarzysze

- **Ozdoby (min. 10):** wianek z kwiatów, wianek z liści, kokardka, korona, czapeczka, turban z ręcznika, kwiatek, muszka, gwiazdka; sezonowe: słomkowy kapelusz (lato) i czapka z pomponem (zima). Każdy gatunek ma punkty zaczepienia ozdób i macierz zgodności (np. bez czapeczki między uszami Króliczka, bez korony na kolcach Stegozaura).
- **Cisi towarzysze:** gumowa kaczuszka, drewniana łódeczka i gumowa żabka na brzegu balii. Kołyszą się łagodnie; na rundę losowane są 1–2.

### 8.6 Atmosfera

Przenosimy silnik z child-train:
- 24-godzinny cykl dnia i nocy;
- pogoda: bezchmurnie, deszcz, śnieg, mgła;
- faza księżyca stała dla sesji;
- 4 pory roku (cały rok mija w 4 rundy).

W scenach wewnętrznych niebo widać przez okno, w plenerze bezpośrednio. Wieczorem zapalają się ciepła lampa i lampiony. Zegar w domowej łazience pokazuje symulowaną godzinę.

### 8.7 Losowanie i wagi

- **Ziarno sesji:** zapewnia powtarzalność testów; jest dostępne jako `data-seed`.
- **Na rundę losujemy:**
  - scenerię (z worka, z ograniczeniami pór roku);
  - 3 różne zwierzątka (ważone; pierwsze ≠ ostatnie z poprzedniej rundy);
  - ślad zabawy dla każdego zwierzątka (z worka);
  - towarzyszy.
- **Wagi:** 1× / 2× / 3× przy każdym dozwolonym zwierzątku; udział zwierzątka ma być proporcjonalny do wagi. Reguły rundy (3 różne zwierzątka, brak powtórzeń na styku rund) zniekształcają prosty losowy wybór, dlatego `random.ts` koryguje wagi numerycznie (por. analiza w `kapiel-zaba-3x.md`).
- **Ograniczenie:** zwierzątko może wystąpić najwyżej raz na rundę, więc jego udział wynosi najwyżej 1/3. Gdy przy małej liczbie dozwolonych zwierzątek cel jest niewykonalny, panel pokazuje ostrzeżenie.
- **Skala puli:** przy 36 zwierzątkach pojedyncze zwierzątko pojawia się rzadko. Przykład dla sesji 4 rund (12 kąpieli):

| Ustawienie | Udział Żabki | Żabka w sesji (średnio) | Pieski razem w sesji |
|---|---|---|---|
| wszystkie 1× | 2,8% | 0,33 | 2,0 |
| Żabka 3× | 7,9% | 0,95 | 1,9 |
| Żabka 3×, wszystkie pieski 2× | 6,8% | 0,82 | 3,3 |

Żeby Żabka pojawiała się częściej, rodzic może ją przypiąć w planerze następnej rundy, użyć zestawu „Żabka i pieski” albo zawęzić listę dozwolonych zwierząt (przy 12 dozwolonych i wadze 3× Żabka to ok. 21% kąpieli). Silniejsze wyróżnienie to otwarte pytanie (4.3).

## 9. Panel rodzica

### 9.1 Bramka i pasek wartości

- **Wejście:** przytrzymanie znaku marki (bańki) przez 3 s, przycisk ⚙ albo `Escape`. Każde z nich otwiera zmienne zadanie na dodawanie; po błędnej odpowiedzi wynik nie jest ujawniany.
- **Okno:** natywny `<dialog>` z pułapką fokusu.
- **Pasek wartości:** „Bez dźwięku · Bez reklam · Bez internetu · Nic nie wychodzi z urządzenia”, zwijany do pigułki „Dla rodziców”.

### 9.2 Ustawienia v1.0

| Grupa | Ustawienie | Opcje | Domyślnie |
|---|---|---|---|
| Personalizacja | Imię dziecka (dopełniacz) | tekst | „dziecka” |
| Treści | Dozwolone zwierzątka | 36 pól w 5 grupach, przyciski grupowe, „Włącz wszystkie” | wszystkie (min. 4) |
| Treści | Dozwolone scenerie | 6–8 pól + „Włącz wszystkie” | wszystkie (min. 2) |
| Treści | Dozwolone ślady zabawy | 5 pól + „Włącz wszystkie” | wszystkie (min. 2) |
| Plan | Planer następnej rundy | 3 sloty zwierzątek, sceneria, ślady; „Losowo”, „Wszystko losowo”, „Nowa kąpiel” | Losowo |
| Plan | Częstość zwierzątek | 1× / 2× / 3× przy każdym, szybkie ustawienie dla grupy, podgląd udziału (np. „Żabka ≈ 8% kąpieli, pieski razem ≈ 27%”) | wszystkie 1× |
| Kąpiel | Rytuał | Krótki (2) / Klasyczny (3) / Z namydlaniem (4) / Pełne SPA (5) / Własny (zaznaczanie kroków wg DP-3) | Klasyczny |
| Kąpiel | Łatwość mycia | Łatwa (gąbka ×1,3, próg 80%) / Zwykła (×1, 90%) / Dokładna (×0,85, 95%) | Zwykła |
| Sterowanie | Tryb jednoprzyciskowy | włączony / wyłączony | wyłączony |
| Sterowanie | Rozszerzona interakcja | włączona / wyłączona | wyłączona |
| Rytm | Tempo | 1,45× / 1,2× / 1× / 0,8× | 1× |
| Atmosfera | Pogoda, pora dnia, pora roku | automatycznie / stała wartość | automatycznie |
| Ekran | Zdanie narracji | pokaż / ukryj | pokaż |
| Ekran | Sekwencja kroków | pokaż / ukryj | pokaż |
| Rytm | Odpoczynek | co N rund (1–8) / „Pora na odpoczynek” teraz | co 4 rundy |
| Rytm | Dzienny limit | minuty albo bez limitu; „Wyzeruj dzisiejszy licznik” (DP-7) | 20 min |
| Zestawy | Gotowe zestawy | lista + „Użyj zestawu” | — |
| Dane | Zapamiętywanie, kopia ustawień, statystyki, usuwanie danych | sekcja 10 | zapamiętywanie włączone |

Reguły przejęte z child-train:
- zmiany planu obowiązują od następnej rundy, a „Nowa kąpiel” zaczyna od razu;
- przypięcia są rezerwowane przed losowaniem;
- „Wszystko losowo” czyści tylko przypięcia;
- zestaw nigdy nie włącza wykluczonych treści i nie zmienia personalizacji, wykluczeń, wag ani limitów.

### 9.3 Gotowe zestawy

| Zestaw | Zwierzątka | Sceneria | Atmosfera | Rytuał i tempo |
|---|---|---|---|---|
| Wieczorna kąpiel | Sówka, Miś, Króliczek | Domowa łazienka | noc, bezchmurnie | Klasyczny, bardzo spokojne |
| Żabka i pieski | Żabka, Labrador, Dalmatyńczyk | Ogród | dzień, bezchmurnie | Klasyczny, zwykłe |
| Błotny dzień | Prosiaczek, Jamnik, Borsuk | Leśne źródełko | deszcz | Z namydlaniem, zwykłe |
| Dinozaury w spa | Diplodok, Triceratops, T-Rex | Lawendowe spa | wieczór | Klasyczny, spokojne |
| Ciepła balia | Kapibara, Pingwinek, Owieczka | Górska balia | zima, śnieg | Klasyczny, bardzo spokojne |
| Letni pomost | Kaczuszka, Wydra, Żółwik | Pomost nad jeziorem | lato, dzień | Krótki, zwykłe |
| Kocie SPA | Kotek perski, Kotek syjamski, Dachowiec | Lawendowe spa | wieczór | Pełne SPA, spokojne |
| Losowa kąpiel | z dozwolonych | Losowo | automatycznie | Klasyczny, zwykłe |

## 10. Dane na urządzeniu (jak w child-page)

- **Co jest zapisywane:** wyłącznie lokalnie (localStorage) ustawienia rodzica (w tym imię dziecka), dzisiejszy czas zabawy z datą oraz anonimowe statystyki. Nic nie opuszcza urządzenia.
- **Zapamiętywanie:** włączone od pierwszego uruchomienia; schemat z wersją i migracjami (`child-bath.settings`). Przełącznik „Zapamiętuj ustawienia na tym urządzeniu” jest domyślnie włączony; po wyłączeniu zapisane ustawienia są usuwane i działają tylko do zamknięcia strony, jak w child-train.
- **Dzienny limit (DP-7):**
  - minuty (domyślnie 20) albo bez limitu;
  - liczy się tylko widoczny czas zabawy; licznik zeruje się każdego dnia (`child-bath.playtime` z datą);
  - klepsydra bez liczb; przez ostatnie 20% scena delikatnie przygasa; po limicie pojawia się ekran z księżycem;
  - rodzic za bramką może wyzerować dzisiejszy licznik.
- **Kopia ustawień (DP-6):**
  - „Zapisz ustawienia” (plik JSON), „Skopiuj ustawienia” (tekst) i „Wczytaj ustawienia” (z pliku albo z wklejonego tekstu, bo iOS Safari ogranicza pobieranie);
  - plik zawiera tylko `format`, `version` i ustawienia, bez imienia dziecka, statystyk, czasu zabawy i danych urządzenia;
  - import najpierw sprawdza dane (maks. 100 KB): nieznane wpisy są pomijane, brakujące uzupełniane domyślnymi, a błędne wartości ignorowane;
  - zły format niczego nie zmienia i pokazuje komunikat po polsku; poprawny plik pyta „Zastąpić obecne ustawienia?”.
- **Statystyki (DP-8, na wzór `analytics.js` z child-page):**
  - przechowujemy tylko dzienne agregaty z ostatnich 90 dni i sumy od początku (`child-bath.stats`), bez historii zdarzeń, imion i danych urządzenia; identyfikator sesji istnieje tylko w pamięci;
  - mierzymy: sesje, aktywny czas (karta widoczna, a dotyk lub klawisz mniej niż 60 s temu), ukończone kąpiele i kąpiele każdego zwierzątka; rytuał i scenerię zliczamy pomocniczo;
  - widok w panelu: czas zabawy, ukończone kąpiele, ranking zwierzątek; filtry: ta sesja, dziś, 7 dni, 30 dni, cały czas;
  - eksport wszystkich agregatów do JSON (pobierz albo skopiuj) i „Wyzeruj statystyki” z potwierdzeniem;
  - statystyki są zawsze włączone, bez wyłącznika; błąd albo brak pamięci nigdy nie wpływa na zabawę.
- **Usuwanie:** „Usuń wszystkie dane z urządzenia” (ustawienia, licznik i statystyki), z potwierdzeniem.
- **Prywatność:** zapis, eksport i statystyki nie wykonują żadnych zapytań sieciowych; sprawdza to test.

## 11. Styl graficzny i UI (najpierw telefon)

### 11.1 Zasady z child-train

- Płaska papierowa wycinanka; cała grafika jako inline SVG, bez grafik rastrowych.
- Wypełnienia zamiast konturów, zaokrąglone końce linii.
- Bez rozmyć, cieni i filtrów; w całej scenie najwyżej kilka łagodnych gradientów.
- Ziarno papieru 12% nad całą sceną.
- Paleta stonowana i ciepła: czysta biel tylko na drobne błyski, czerń nigdy.
- Fraunces w tytule, DM Sans w interfejsie.

### 11.2 Efekty z `kapiel` w stylu child-train

| `kapiel` | Nowe rozwiązanie |
|---|---|
| Poświata `drop-shadow(#ffe08a)` | papierowe iskierki i spokojne „oddychanie” zwierzątka |
| Rozmyta aureola futra | kępki według okrywy (puszyste / nastroszone / lśniące) |
| Biała piana `#ffffff` | kremy `#fffcf3` i `#f8f5e8`; biel tylko jako błysk na bańce |
| Wilgoć `#7c8fb8` z kropelkami | ciemniejszy odcień futra z palety i kremowe kropelki |
| Bańki jako `div` | pula 28 kółek SVG bez filtrów; w trybie rozszerzonym zachowanie jak w `banki.js` |

### 11.3 Paleta kąpieli

| Rola | Kolory |
|---|---|
| Woda | `#a6c8c7`, `#c0d4cf` |
| Piana, bańki, para | `#fffcf3`, `#f8f5e8`, `#f5eedb` |
| Kafelki | `#a8bfaa` / `#f5eedb` |
| Drewno (balia, ławeczka, półeczka) | `#b78268`, `#9c7155` |
| Ręczniki i szlafroki | `#dfbc70`, `#a5bbae`, `#d4a38c` |
| Tekst i oczy | `#3f4d40`, `#3e5b4d` |
| Nowe tokeny | `--water`, `--foam`, `--tile-a`, `--tile-b`, `--lamp`, `--lavender`, `--berry`, każdy z kolorem zapasowym |

### 11.4 Układ na telefonie w pionie (od góry)

1. **Pasek górny:** znak marki (przytrzymanie 3 s), klepsydra (gdy ustawiono limit), przycisk ⚙ i mały tytuł „Mała łazienka {dziecka}” (Fraunces).
2. **Scena** (ok. 60% wysokości): sceneria; balia ze zwierzątkiem na środku (pudełko o proporcjach 64:84) i towarzyszami na brzegu; z boku ławeczka z miejscami 1–3 (mniejsze postacie); na skraju miejsce zapowiedzi.
3. **Narracja:** 1–2 linijki zdania i rząd piktogramów kroków.
4. **Strefa akcji:** przycisk „Dalej” (w zapowiedzi), półeczka z narzędziami (tryb rozszerzony) albo klawisz Enter (tryb jednoprzyciskowy), z marginesem `env(safe-area-inset-bottom)`.

W poziomie i na laptopie układ przypomina child-train: tytuł, szeroka scena z ławeczką obok balii i rząd zaproszenia u dołu. Strona nie przewija się w żadnym układzie.

### 11.5 Ruch

- Animujemy wyłącznie `transform` i `opacity`.
- Przy `.is-paused` (ukryta karta) wszystko staje.
- Przy ograniczonym ruchu znikają animacje ciągłe i reakcje ruchowe.
- Automatyczny audyt (REQ-08) sprawdza minimalne czasy pojawiania się i brak błysków.

## 12. Architektura techniczna

### 12.1 Stack (bez zmian względem child-train)

- React 19, TypeScript 5.9;
- Vite 7, Tailwind 4, `vite-plugin-singlefile`;
- Playwright do testów;
- skrypty Pythona do ikon i fontów;
- GitHub Actions i Pages (`base: "/child-bath/"`).

### 12.2 Struktura katalogów

```text
child-bath/
├─ public/                manifest.json, sw.js, icons/
├─ src/
│  ├─ App.tsx, main.tsx
│  ├─ game.ts             czysty reducer: zapowiedź, rytuał, ławeczka, pożegnanie, runda, ustawienia
│  ├─ random.ts           ziarno, worki, ważone losowanie z korektą
│  ├─ bath/               coverage.ts, steps.ts, rituals.ts (długości i reguły DP-3), dirt.ts, tools.ts
│  ├─ animals/            roster.ts (36, grupy), geometry/, coats.ts, traits.ts, names.ts, anchors.ts
│  ├─ world/              sceneries/, companions.ts, atmosphere.ts (port z child-train)
│  ├─ copy/               narration.ts (szablony zdań z odmianą)
│  ├─ storage/            settings.ts (schemat, migracje), playtime.ts, backup.ts, stats.ts
│  ├─ components/         BathStage, LayerCanvas, Bench, DoorPreview, NextButton, Shelf, Bubbles, Narration,
│  │                      StepStrip, ParentModal, ParentValueStrip, RestScreen, StatsView, illustration/
│  ├─ hooks/              useScrub, useBathClock, useAtmosphere, useDailyPlaytime, useModalFocus
│  └─ styles/             tokens, layout, animations, dialogs, responsive
├─ tests/                 bath, controls, random, animals, world, ritual, round, parent, storage, layout, calm, pwa
└─ tools/                 generate-icons.py, build-fonts.py
```

### 12.3 Decyzje architektoniczne

| # | Decyzja | Uzasadnienie |
|---|---|---|
| A1 | Postęp liczony siatką pokrycia w logicznych współrzędnych | deterministyczny i testowalny, bez `getImageData` w gorącej ścieżce |
| A2 | Warstwa kroku w canvasie 2D: `destination-out` przy zmywaniu, `source-over` przy nakładaniu | wydajność przy wielu pociągnięciach na telefonie |
| A3 | Czysty reducer; losowanie poza reducerem, przekazywane w akcjach | wzorzec child-train, powtarzalne testy |
| A4 | Zegar świadomy widoczności karty, z mnożnikiem tempa | pauza przy ukrytej karcie, poprawne liczenie limitu |
| A5 | Geometria postaci jako dane (SVG i `Path2D`) | jedno źródło kształtu dla 36 zwierzątek; maska bez asynchronicznych obrazów |
| A6 | Ważone losowanie z numeryczną korektą | zamierzone udziały mimo reguł rundy |
| A7 | Narracja z szablonów z rodzajem i odmianą imion | poprawna polszczyzna dla 36 zwierzątek |
| A8 | Lokalny zapis z wersjonowanym schematem i migracjami | konfiguracja przetrwa aktualizacje aplikacji |
| A9 | Automatyczny audyt spokoju w Playwright | wrażliwość dziecka na nagłe bodźce (REQ-08) |
| A10 | Przenoszenie kodu z adnotacją źródła: child-train (MIT) oraz child-page (zastrzeżony; przenosi właściciel, a po przeniesieniu fragment jest na MIT) | czytelna historia, zgoda właściciela (Z8) |
| A11 | Statystyki w jednym module na wzór `analytics.js`: tylko agregaty, zapis z opóźnieniem, odporność na błędy pamięci | prywatność; zero wpływu na zabawę |
| A12 | Kopia ustawień na wzór child-page: sprawdzenie i naprawa danych przed potwierdzeniem | odporność na uszkodzone pliki |

### 12.4 Model danych (szkic)

```ts
type Okrywa = "futro" | "welna" | "piora" | "kolce" | "skora" | "luski" | "skorupa";
type Rodzaj = "m" | "f" | "n";
type AnimalGroup = "wiejskie" | "dalekie" | "pieski" | "kotki" | "dinozaury";

interface AnimalDef {
  id: string;
  group: AnimalGroup;
  names: { mian: string; dop: string; cel: string; bier: string; narz: string; miejsc: string };
  rodzaj: Rodzaj;
  okrywa: Okrywa;                       // decyduje o kroku 5 i wyglądzie po kąpieli
  reactions: ReactionKind[];
  anchors: Record<AnchorKind, [number, number]>;
}

type StepKind = "scrub" | "lather" | "rinse" | "dry" | "groom";   // groom: czesanie albo głaskanie wg okrywy
type RitualPreset = "short" | "classic" | "lather" | "spa" | "custom";
type Slot<T> = T | "random";

interface BathSettings {
  childName: string;                    // dopełniacz, domyślnie "dziecka"
  allowedAnimals: string[];             // min. 4
  allowedSceneries: SceneryId[];        // min. 2
  allowedDirt: DirtKind[];              // min. 2
  planner: {
    animals: [Slot<string>, Slot<string>, Slot<string>];
    scenery: Slot<SceneryId>;
    dirt: [Slot<DirtKind>, Slot<DirtKind>, Slot<DirtKind>];
  };
  weights: Record<string, 1 | 2 | 3>;   // domyślnie 1
  ritual: { preset: RitualPreset; steps: StepKind[] };   // steps zgodne z regułami DP-3
  ease: "easy" | "normal" | "precise";  // progi 80 / 90 / 95%
  oneButton: boolean;
  extendedTouch: boolean;
  pace: 1.45 | 1.2 | 1 | 0.8;
  weatherOverride: "auto" | Weather;    // typy pogody i pory dnia z child-train
  timeOverride: "auto" | TimeOverride;
  seasonOverride: "auto" | Season;
  showNarration: boolean;               // domyślnie true
  showSteps: boolean;                   // domyślnie true
  roundsBeforeRest: number;             // domyślnie 4
  dailyLimitMin: number | null;         // domyślnie 20; null = bez limitu
  persist: boolean;                     // domyślnie true
}

type Phase =
  | "door_waiting" | "arriving" | "stage_in" | "scrubbing" | "stage_rest"
  | "choosing_decor" | "reward" | "to_bench" | "farewell" | "round_change" | "resting";
```

### 12.5 Maszyna stanów

```text
door_waiting ──(Dalej / Enter)──► arriving → [stage_in → scrubbing → stage_rest] × liczba kroków
  → (tryb rozszerzony: choosing_decor) → reward → to_bench

to_bench ─┬─► door_waiting                                    (na ławeczce 1 lub 2 zwierzątka)
          ├─► farewell ─┬─(Dalej / Enter)─► round_change → arriving    (koniec rundy)
          │             └─(po pożegnaniu)─► resting                    (ostatnia z N rund)
          └─► resting                                         (minął dzienny limit)

resting ──(bramka rodzica)──► door_waiting
```

Każde przejście to akcja z czasem z zegara świadomego widoczności. Żadna faza nie nadpisuje innej, co eliminuje wyścig `swap`/`wait` znany z `kapiel`. Atrybuty `data-phase`, `data-step`, `data-animal`, `data-bench`, `data-progress` i `data-seed` służą jako zaczepienia testów i CSS.

## 13. Wymagania v1.0 (REQ-xx)

Każde wymaganie jest przypisane do dokładnie jednej fazy w `planning/ROADMAP.md`; pokrycie wynosi 79/79. Numeracja jest stabilna: runda 2 zmieniła treść części wymagań, a nie ich numery.

### A. Platforma i zasady
- **REQ-01** Samodzielny `dist/index.html` działa offline (fonty, grafika i skrypty są osadzone).
- **REQ-02** Instalowalna PWA na GitHub Pages pod `/child-bath/` (manifest, ikony, service worker network-first).
- **REQ-03** Brak dźwięku: aplikacja nie używa żadnego audio, co sprawdza CI.
- **REQ-04** Brak zapytań sieciowych podczas zabawy, zapisu, eksportu i zbierania statystyk; brak zewnętrznych usług, reklam i ciasteczek.
- **REQ-05** Interfejs po polsku; dziecko nie musi czytać, bo wszystko jest czytelne wizualnie.
- **REQ-06** Najpierw telefon: pełna rozgrywka w pionie od 360 × 640 px bez przewijania; działa też w poziomie i na laptopie.
- **REQ-07** Licencja MIT; przeniesiony kod ma adnotację źródła (repozytorium i commit), a fragmenty z child-page przenosi ich właściciel (Z8).
- **REQ-08** Spokój:
  - pojawienia i zniknięcia trwają ≥ 0,5 s;
  - brak błysków i gwałtownych ruchów, bańki nigdy nie pękają nagle;
  - żadna pętla nie jest szybsza niż 1,2 s (poza efektami pod palcem).
- **REQ-09** Nic nie może się nie udać: brak punktów, odznak, porażek, odliczania i komunikatów o błędzie dla dziecka.

### B. Mechanika kąpieli
- **REQ-10** Warstwa kroku pokrywa sylwetkę zwierzątka; postęp jest liczony siatką pokrycia w logicznych współrzędnych.
- **REQ-11** Dwa typy kroków, zmywanie i nakładanie, mierzone tą samą siatką.
- **REQ-12** Krok domyka się sam po osiągnięciu progu łatwości (80 / 90 / 95%); reszta znika łagodnie (0,5 s, natychmiast przy ograniczonym ruchu).
- **REQ-13** Pocieranie palcem lub myszą, wiele palców naraz, przechwycenie wskaźnika, `touch-action: none`.
- **REQ-14** Narzędzie bieżącego kroku jest widoczne pod palcem lub kursorem.
- **REQ-15** Szerokość narzędzia zależy od kroku i łatwości, ale nigdy nie jest mniejsza niż 44 px CSS.
- **REQ-16** Bańki, krople i strumień wody podążają za palcem; pula ma maks. 28 elementów.
- **REQ-17** Postęp przetrwa obrót i zmianę rozmiaru; przy ukrytej karcie zabawa pauzuje.
- **REQ-18** Rdzeń mechaniki (siatka, progi, fazy) to czyste funkcje z deterministycznymi testami.

### C. Sterowanie i dostępność
- **REQ-19** Klawiatura: strzałki przesuwają narzędzie (krok 0,07), Spacja i Enter prowadzą je zygzakiem; pierścień fokusu jest widoczny.
- **REQ-20** Kolejne zwierzątko (także pierwsze w sesji i w rundzie) czeka na skraju sceny i wchodzi dopiero po dotknięciu „Dalej” albo naciśnięciu Enter.
- **REQ-21** Brak kolejkowania: przytrzymanie, autorepeat i „bębnienie” niczego nie pomijają; „Dalej” jest aktywne dopiero, gdy poprzednie zwierzątko usiądzie na ławeczce.
- **REQ-22** Tryb jednoprzyciskowy (opcja): każde naciśnięcie Enter lub dużego przycisku wykonuje jeden spokojny krok mycia (ok. 1,2 s).
- **REQ-23** Duży przycisk dotykowy ma ≥ 74 px wysokości; elementy dla dziecka mają ≥ 44 px.
- **REQ-24** Jeden region `aria-live` ogłasza zwierzątko, krok i przejścia; pudełko zwierzątka ma etykietę z imieniem.
- **REQ-25** Przy `prefers-reduced-motion` nie ma animacji ciągłych ani reakcji ruchowych; kolory nieba się zmieniają.
- **REQ-26** Rozszerzona interakcja (opcja): półeczka z narzędziami kroków rytuału. Kolejne narzędzie łagodnie „oddycha”, a inne po dotknięciu spokojnie wraca na miejsce, bez sygnału błędu.
- **REQ-27** Rozszerzona interakcja: bańki jak w `banki.js` z child-page.
  - Dotknięta duża bańka dzieli się na dwie mniejsze (promień 0,66), a mała powoli się rozpływa (1,6 s); nic nie pęka nagle.
  - Bańki reagują poza sylwetką zwierzątka i między kąpielami, a przeciąganie po zwierzątku zawsze myje.
- **REQ-28** Rozszerzona interakcja: dziecko wybiera ozdobę z 2–3 propozycji.

### D. Zwierzątka
- **REQ-29** 20 zwierzątek z istniejących rodzin: 16 z child-train (ogólny Piesek jako Labrador, ogólny Kotek jako Dachowiec) oraz Lew, Słoń, Panda i Koala z child-page, przerysowane w stylu child-train.
- **REQ-30** Kapibara, Pingwinek i Wydra, każde z kompletem: stany, okrywa, reakcje, odmiana, punkty zaczepienia.
- **REQ-31** 5 dinozaurów z kompletem jak w REQ-30: Diplodok, Triceratops, Stegozaur, Parazaurolof i łagodny T-Rex (bez widocznych zębów, ryku i gwałtownych ruchów).
- **REQ-32** Pozostałe rasy z kompletem jak w REQ-30: psy Dalmatyńczyk, Jamnik, Pudel, Husky i Buldog (palety i cechy z `dogs.js` w child-page) oraz Kotek perski, syjamski i brytyjski. Razem z Labradorem i Dachowcem daje to 6 psów i 4 koty.
- **REQ-33** Jeden frontalny szablon child-train (głowa, tułów, łapki, szalik); gatunek i rasa rozpoznawalne po sylwetce i kolorze; drobne znaczenia w skali kropek jelonka.
- **REQ-34** Geometria postaci jako dane, renderowana do SVG i do maski sylwetki, bez asynchronicznych obrazów.
- **REQ-35** Stany: brudny, mokry, po kąpieli (puszysty, nastroszony lub lśniący, zależnie od okrywy), bez szalika, w szlafroku albo turbanie.
- **REQ-36** Reakcje: min. 8 typów, wolne (≥ 1,2 s), przypisane do gatunków; Żabka i każda rasa psa mają po ≥ 3.
- **REQ-37** Polskie formy imion (przypadki) i rodzaj gramatyczny każdego z 36 zwierzątek.
- **REQ-38** Punkty zaczepienia ozdób i macierz zgodności ozdoba–gatunek.

### E. Świat
- **REQ-39** Min. 6 scenerii (cel: 8): domowa łazienka, ogród, leśne źródełko, górska balia, pomost nad jeziorem, lawendowe spa (+ plaża i zimowa łaźnia). W każdej jest ławeczka z 3 miejscami i miejsce zapowiedzi.
- **REQ-40** Źródło wody scenerii (prysznic, konewka albo drewniany czerpak) jest narzędziem kroku płukania.
- **REQ-41** Silnik atmosfery z child-train: 24-godzinny cykl dnia i nocy, pogoda (bezchmurnie, deszcz, śnieg, mgła), faza księżyca na sesję, 4 pory roku.
- **REQ-42** Pora roku przesuwa się co rundę (rok w 4 rundy); ustawienia stałe rodzica mają pierwszeństwo.
- **REQ-43** Jedna sceneria na rundę, dobrana do pory roku i pogody, chyba że rodzic ją przypiął; zmiana scenerii łagodnym przenikaniem (≥ 1,2 s).
- **REQ-44** Cisi towarzysze na brzegu balii (gumowa kaczuszka, drewniana łódeczka, gumowa żabka) kołyszą się łagodnie.
- **REQ-45** Zegar w domowej łazience pokazuje symulowaną godzinę.

### F. Rytuał, ślady zabawy i narracja
- **REQ-46** Pięć kroków rytuału: zmywanie brudu, namydlanie, płukanie, wycieranie, czesanie/głaskanie. Długości 2 / 3 (domyślnie) / 4 / 5 albo własny wybór kroków w stałej kolejności, z regułami spójności (DP-3).
- **REQ-47** Krok 5 zależy od okrywy: czesanie (futro, wełna) albo głaskanie (pióra, kolce, skóra, łuski, skorupa).
- **REQ-48** 5 śladów zabawy (błotko, mech z listkami, pyłek kwiatowy, sok z jagód, piasek) z własnymi fakturami i paletami.
- **REQ-49** Krótkie zdanie narracji dla rodzica na dole ekranu pasuje do śladu i zwierzątka (rodzaj, odmiana); min. 3 warianty na ślad; domyślnie widoczne.
- **REQ-50** Rodzic może ukryć zdanie narracji.
- **REQ-51** Sekwencja kroków: piktogramy narzędzi bieżącego rytuału z wyróżnionym bieżącym, bez procentów; rodzic może ją ukryć.

### G. Runda i nagroda
- **REQ-52** Min. 10 ozdób (m.in. wianki, kokardki, korony, czapeczki, turban z ręcznika), losowanych z worka.
- **REQ-53** Nagroda bez rozmyć i cieni: papierowe iskierki, spokojne „oddychanie” i reakcja zwierzątka.
- **REQ-54** Runda to 3 różne zwierzątka; pierwsze z nowej rundy różni się od ostatniego z poprzedniej.
- **REQ-55** Ławeczka obok balii: każde umyte zwierzątko od razu dosiada się (miejsca 1 → 2 → 3) w szlafroku albo turbanie, z ozdobą.
- **REQ-56** Po trzecim zwierzątku cała trójka macha na pożegnanie, a na skraju sceny czeka pierwsze zwierzątko nowej rundy; po „Dalej” trójka odchodzi i zaczyna się nowa runda.
- **REQ-57** „Pora na odpoczynek” pojawia się po pożegnaniu w N-tej rundzie albo po dziennym limicie (gdy bieżące zwierzątko usiądzie na ławeczce); wybudzenie tylko przez bramkę.
- **REQ-58** Losowanie z ziarnem sesji; plan rundy generowany poza reducerem; przypięcia rezerwowane przed losowaniem.
- **REQ-59** Wagi częstości dają zamierzony udział z korektą na reguły rundy; przy celach niewykonalnych rodzic widzi ostrzeżenie.

### H. Panel rodzica
- **REQ-60** Bramka: przytrzymanie znaku marki przez 3 s, przycisk ⚙ albo Esc otwiera zmienne zadanie na dodawanie; po błędzie wynik nie jest ujawniany.
- **REQ-61** Pasek wartości dla rodzica, zwijany do pigułki.
- **REQ-62** Imię w dopełniaczu trafia do tytułu „Mała łazienka {dziecka}”, tytułu karty i etykiet ARIA; w stopce jest dedykacja „Z myślą o Arturze”.
- **REQ-63** Wykluczenia: zwierzątka w 5 grupach z przyciskami grupowymi (min. 4), scenerie (min. 2), ślady (min. 2); „Włącz wszystkie”.
- **REQ-64** Planer następnej rundy: 3 sloty zwierzątek, sceneria, ślady; opcje „Losowo”, „Wszystko losowo”, „Nowa kąpiel”.
- **REQ-65** Wagi 1× / 2× / 3× przy każdym dozwolonym zwierzątku (domyślnie 1×), szybkie ustawienie dla grupy i podgląd przybliżonego udziału.
- **REQ-66** Rytuał (Krótki, Klasyczny, Z namydlaniem, Pełne SPA, Własny z zaznaczaniem kroków) i łatwość mycia (szerokość gąbki + próg 80 / 90 / 95%).
- **REQ-67** Przełączniki: tryb jednoprzyciskowy, rozszerzona interakcja, zdanie narracji, sekwencja kroków.
- **REQ-68** Tempo (1,45× / 1,2× / 1× / 0,8×) i atmosfera (pogoda, pora dnia, pora roku: automatycznie albo stała wartość).
- **REQ-69** Odpoczynek co N rund (domyślnie 4) i od razu. Dzienny limit minut jak w child-page (domyślnie 20 albo bez limitu): klepsydra bez liczb, przygaszenie sceny przez ostatnie 20% i zerowanie dzisiejszego licznika za bramką.
- **REQ-70** Min. 6 gotowych zestawów; zestaw nie zmienia wykluczeń, a konflikt jest wyjaśniony.

### I. Dane na urządzeniu
- **REQ-71** Ustawienia (w tym imię dziecka) zapisywane w localStorage od pierwszego uruchomienia; schemat z wersją i migracjami; przełącznik zapamiętywania (domyślnie włączony).
- **REQ-72** Dzienny licznik widocznego czasu zabawy, zapisany z datą i zerowany każdego dnia (jak w child-page).
- **REQ-73** Kopia ustawień jak w child-page:
  - zapis do pliku JSON albo skopiowanie tekstu; wczytanie z pliku albo z wklejonego tekstu;
  - walidacja (maks. 100 KB) i pytanie „Zastąpić obecne ustawienia?”;
  - plik bez imienia dziecka, statystyk i czasu zabawy.
- **REQ-74** Lokalne, anonimowe statystyki jak w child-page:
  - dzienne agregaty z 90 dni i sumy od początku;
  - czas zabawy, ukończone kąpiele, ranking zwierzątek; filtry: sesja, dziś, 7 dni, 30 dni, cały czas;
  - eksport JSON i „Wyzeruj statystyki” z potwierdzeniem.
- **REQ-75** Przycisk „Usuń wszystkie dane z urządzenia” z potwierdzeniem.

### J. Jakość i wydanie
- **REQ-76** CI: typecheck, build i Playwright przy każdym PR; wdrożenie na Pages z gałęzi `main`.
- **REQ-77** Wydajność: ≥ 55 kl./s przy pocieraniu na telefonie referencyjnym; obsługa ruchu ≤ 2 ms; bez odczytu pikseli w gorącej ścieżce.
- **REQ-78** Regresja wizualna: zrzuty referencyjne scenerii, zwierzątek i panelu.
- **REQ-79** README z opisem UI i zasad stylu, lista kontrolna wydania, v1.0 na GitHub Pages.

## 14. Ograniczenia i poza zakresem

**Ograniczenia:**
- stack i styl z child-train;
- bez dźwięku, offline, tylko polski;
- implementuje agent AI, autor przegląda zmiany;
- brak testów z dzieckiem przed v1.0, więc jakość zapewniają testy automatyczne i przegląd dorosłego na telefonie po każdej fazie.

**Poza zakresem v1.0:**
- dźwięk, inne języki, konta i synchronizacja;
- wysyłanie jakichkolwiek danych poza urządzenie;
- zmiany w child-page (`kapiel` zostaje bez zmian; „żabka 3×” to osobne zadanie);
- fabularne powiązania ze światem pociągu;
- kolejne rasy (np. Owczarek, Corgi) i dinozaury, minigry, edytor postaci, profile wielu dzieci.

## 15. Ryzyka

| Ryzyko | Wpływ | Działania |
|---|---|---|
| Szeroki zakres v1.0 bez testów z dzieckiem | problemy z użytecznością wykryte dopiero na końcu | małe plany GSD z kryteriami sukcesu; przegląd na telefonie po każdej fazie; łatwość mycia i tryby sterowania; poprawki v1.0.x po pierwszych sesjach dziecka |
| 36 zwierzątek w kilku stanach | koszt grafiki, niespójność | szablon i warianty z danych (A5), checklista stylu, zrzuty referencyjne (REQ-78) |
| Rasy z widoku z boku (`dogs.js`) we frontalnym szablonie | słaba rozpoznawalność | wybór ras rozróżnialnych z przodu (DP-2), przegląd zrzutów w Fazie 5 |
| T-Rex mimo łagodnego rysunku może niepokoić | niepokój dziecka | DP-5; rodzic wyklucza grupę albo samego T-Rexa jednym przyciskiem |
| Duża pula, więc ulubione zwierzątka pojawiają się rzadko | dziecko rzadko widzi Żabkę | wagi, przypięcia, zestaw „Żabka i pieski”, podgląd udziału (8.7), otwarte pytanie 4.3 |
| Odchylenia w pracy agenta AI | naruszenia stylu i zasad | PROJECT.md jako kontekst każdego planu; testy audytu spokoju i regresji wizualnej |
| Wydajność telefonu | zacinanie się pocierania | A1, A2, budżety z REQ-77, pomiar na telefonie referencyjnym |
| Nagłe bodźce mimo zasad | niepokój dziecka | REQ-08 i automatyczny audyt (A9) |
| Polszczyzna dla 36 zwierząt | błędy w narracji | A7 i test tabelaryczny wszystkich form |
| Migracje i uszkodzone dane | utrata ustawień | schemat z wersją, testy migracji, walidacja importu, kopia ustawień |
| Wiele trybów sterowania naraz | trudne przypadki brzegowe | macierz testów: pocieranie × klawiatura × jeden przycisk × rozszerzona interakcja |

## 16. Słownik

- **Runda:** trzy kolejne kąpiele w jednej scenerii zakończone pożegnaniem na ławeczce.
- **Zapowiedź:** moment, gdy następne zwierzątko czeka na skraju sceny na „Dalej” lub Enter.
- **Rytuał:** ustalona kolejność kroków kąpieli (Krótki, Klasyczny, Z namydlaniem, Pełne SPA, Własny).
- **Krok:** jeden etap rytuału z własną warstwą i narzędziem.
- **Warstwa:** to, co dziecko zmywa lub nakłada (canvas nad zwierzątkiem).
- **Siatka pokrycia:** logiczna siatka komórek wewnątrz sylwetki, z której liczony jest postęp kroku.
- **Ślad zabawy:** rodzaj zabrudzenia powiązany ze zdaniem narracji.
- **Okrywa:** futro, wełna, pióra, kolce, skóra, łuski albo skorupa; decyduje o kroku 5 i wyglądzie po kąpieli.
- **Grupa:** zestaw zwierzątek w panelu (Leśne i wiejskie, Z dalekich stron, Pieski, Kotki, Dinozaury).
- **Bramka rodzica:** przytrzymanie, ⚙ albo Esc, a potem zadanie na dodawanie.
- **Przypięcie:** wybór rodzica w slocie planera (zamiast „Losowo”).
- **Waga częstości:** 1×, 2× albo 3× przy zwierzątku; określa jego zamierzony udział w losowaniu.
- **Doprecyzowanie (DP):** moja propozycja szczegółu, którego wywiad nie przesądził; obowiązuje do zmiany przez autora.
- **GSD:** styl planowania „Get Shit Done”: fazy z celem, wymaganiami, kryteriami sukcesu i planami wykonania.

---

## Załącznik A. Parytet z `kapiel` (child-page)

| Element `kapiel` | W nowym projekcie |
|---|---|
| 3 etapy: błoto, piana z prysznicem, wilgoć z ręcznikiem | zachowane jako rytuał klasyczny (domyślny); dochodzą namydlanie i czesanie/głaskanie |
| `DONE_AT = 0.9`, sprawdzanie co 0,12 s | siatka pokrycia sprawdzana przy każdym odcinku; próg 80 / 90 / 95% zależny od łatwości |
| Maska 256 × 336, proporcje 64 : 84 | zachowane albo dopasowane do szablonu child-train |
| `BRUSH = [0.11, 0.2, 0.17]`, min. 44 px CSS | zachowane i pomnożone przez współczynnik łatwości |
| 28 baniek, życie 1,6 s, tylko dekoracja | zachowane; w trybie rozszerzonym bańki są dotykalne, jak w `banki.js` |
| Nowe zwierzątko automatycznie po 7 s | **zmienione:** umyte zwierzątko siada na ławeczce, a następne czeka na „Dalej” lub Enter |
| Poświata `drop-shadow`, rozmyta aureola | zastąpione iskierkami i kępkami według okrywy |
| Klawiatura: strzałki co 0,07, Enter/Spacja zygzakiem | zachowane, plus tryb jednoprzyciskowy |
| 6 akcesoriów | min. 10 ozdób, punkty zaczepienia, wybór przez dziecko w trybie rozszerzonym |
| 13 zwierząt z `animals.js`, `Rand.pickOne` bez powtórzeń | 36 zwierzątek w szablonie child-train; ziarno sesji, rundy po 3 różne zwierzątka, wagi z korektą |
| Brak obsługi błędu ładowania sylwetki | problem znika: maska powstaje z danych geometrii (A5) |
| Faza `swap` nadpisuje `wait` | problem znika: jawna maszyna stanów (12.5) |
| Brak testów automatycznych | zestawy Playwright i testy jednostkowe rdzenia |

## Załącznik B. Ponowne użycie kodu

Kod child-page jest zastrzeżony („all rights reserved”). Przenosi go właściciel, a po przeniesieniu do child-bath dany fragment jest dostępny na MIT (D-01, A10).

| Źródło | Plik(i) | Działanie |
|---|---|---|
| child-train | `src/atmosphere.ts`, `src/atmosphere.css`, `src/components/Atmosphere.tsx`, `src/hooks/useAtmosphere.ts` | port 1:1, potem adaptacja (okno, lampa, plener) |
| child-train | `src/hooks/useActivePlaytime.ts`, `src/hooks/useModalFocus.ts` | port; licznik rozszerzony o dzienny limit z datą |
| child-train | `src/hooks/useJourneyClock.ts` | adaptacja jako `useBathClock` |
| child-train | `src/components/ParentModal.tsx`, `JourneyOptions.tsx`, `ParentValueStrip.tsx`, `RestScreen.tsx` | adaptacja do ustawień kąpieli |
| child-train | `src/journeyPresets.ts` | wzorzec gotowych zestawów (`presetConflicts`, `presetSettings`) |
| child-train | `src/game.ts` | wzorzec reducera, planera z przypięciami i walidacji pul |
| child-train | `src/components/illustration/Animal.tsx` | port frontalnego szablonu do geometrii jako danych (A5) |
| child-train | `src/components/illustration/Scenery.tsx`, `Station.tsx`, `PlatformFarewell.tsx` | rekwizyty scenerii, zegar, wzorzec pożegnania na ławeczce |
| child-train | `src/styles/*.css`, `src/fonts.css`, `tools/*.py`, `playwright.config.ts`, `vite.config.ts`, `.github/workflows/deploy.yml`, `public/sw.js` | port z nową nazwą i ścieżką bazową |
| child-page | `js/kapiel.js` | mechanika (warstwy, progi, pędzel, bańki) przepisana do TypeScript (A1, A2) |
| child-page | `js/banki.js` | podział i rozpływanie baniek (REQ-27) |
| child-page | `js/dogs.js` | palety i cechy ras psów (uszy, ogony, łaty, maska) przeniesione do frontalnego szablonu |
| child-page | `js/analytics.js` | model statystyk: dzienne agregaty, 90 dni, sumy, aktywny czas, odporność na błędy |
| child-page | kopia ustawień i dzienny limit (opis w README) | wzorzec eksportu i importu z walidacją, dziennego licznika i ekranu z księżycem |

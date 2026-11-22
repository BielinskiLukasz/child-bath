# PHASE-06: podsumowanie implementacji

Kod planów 06-01–06-04 jest w głównym katalogu projektu. Faza przeszła weryfikację lokalną. Plaża i zimowa łaźnia pozostają opcjami do decyzji po obejrzeniu sześciu głównych scenerii. Pełna logika rund i sadzanie zwierzątek nie wchodzą w tę fazę.

## Zakres

| Wymaganie | Realizacja |
|---|---|
| REQ-39 | Domowa łazienka, ogród, leśne źródełko, górska balia, pomost nad jeziorem i lawendowe spa. Każda scena ma własne miejsce zapowiedzi, balię i ławkę lub jej odpowiednik z trzema miejscami. |
| REQ-40 | Płukanie używa prysznica, konewki albo drewnianego czerpaka z bieżącej scenerii. Kształt strumienia podąża za palcem, myszą lub narzędziem sterowanym automatycznie. Krople wykorzystują dotychczasową pulę. |
| REQ-41 | Palety, niebo, pogoda i ruch ciał niebieskich z child-train. Jedna godzina świata na dwie minuty aktywnej kąpieli; zegar stoi w zapowiedzi i przy ukrytej karcie. Faza księżyca pozostaje stała dla ziarna sesji. W łazience opady są przycięte do okna. |
| REQ-42 | Sezon przesuwa się o jedną porę roku na rundę; paleta przenika przez 3 s, pogoda przez 8 s. Ustawienia stałe mają pierwszeństwo. |
| REQ-43 | Losowanie na rundę z worka, z filtrem sezonu i pogody; przypięcie wygrywa z filtrami, a łazienka jest zapasowa. Bez powtórzeń, gdy jest dostępna alternatywa. Zamontowane są najwyżej dwie warstwy, sceneria przenika przez co najmniej 1,2 s. |
| REQ-44 | Jedna lub dwie dekoracje na brzegu balii: kaczuszka, drewniana łódeczka lub żabka. Kołyszą się przez 4,8–5,6 s na cykl. Ograniczony ruch wyłącza kołysanie i ruch pogody. |
| REQ-45 | Analogowy zegar łazienkowy czyta `--day-hour`; wskazówka minutowa wykonuje jeden obrót na godzinę symulacji. |

Scenerie używają płótna 1600 × 1000, a ważne obiekty osobnego planu pozycjonowanego względem pudełka kąpieli. Dzięki temu pion kadruje krajobraz, nie ławkę, balię ani zapowiedź. Górna i dolna strefa tekstu pozostają na jasnym papierze: ciemny tusz zmienia ton z dnia na noc, a kontrast jest testowany w całym cyklu.

## Przegląd

- Scena i stała atmosfera, np. `?test=1&scenery=lavender_spa&time=night&season=summer&weather=clear`. `&still=1` zatrzymuje pogodę i ukrywa ramki na potrzeby zrzutów.
- Bez `still=1` wywołaj w konsoli `window.__bath.nextRound()` w trybie testowym, aby obejrzeć przejście. W zwykłej grze hak jest niedostępny; automatyczne rundy są zakresem Fazy 8.
- Zrzuty w `artifacts/phase-06/`: `bathroom-pion.png`, `garden-pion.png`, `forest_spring-pion.png`, `mountain_tub-pion.png`, `jetty-pion.png`, `lavender_spa-pion.png` (360 × 640) i `bathroom-poziom.png` (640 × 360).

## Weryfikacja

- `npm run typecheck` oraz `npm run build`: sukces, bez nowych zależności i zasobów sieciowych.
- `CI=1 PLAYWRIGHT_PREBUILT=1 npm test -- --workers=3 --retries=0`: **321 zaliczonych, 1 celowo pominięty** (wielodotyk na desktopie). Wynik obejmuje próby 6 scenerii, trzy narzędzia płukania, pauzę, zimowe filtry, stałą fazę księżyca, kontrast, testy PWA, kąpiel 36 postaci i dotychczasowe referencje wizualne. Artefakt `dist/` nie zmienił się podczas testów.
- [ ] Potwierdzić zielone GitHub Actions dla tych zmian.
- [ ] Na fizycznym telefonie obejrzeć kompozycje, opady, przejścia i wszystkie wersje płukania. Zdecydować o plaży i zimowej łaźni.
# PHASE-02: podsumowanie implementacji

**Plany:** 02-01, 02-02, 02-03. Kod jest w głównym katalogu projektu. W zwykłej sesji działa klasyczny rytuał: zmycie brudu → spłukanie piany → wytarcie wilgoci. Po trzecim kroku kończy się kąpiel i pojawia następne zwierzątko-szkic.

## Co zostało sprawdzone

| Wymaganie | Realizacja i dowód |
|---|---|
| REQ-10 · maska i siatka | Kapsuła w przestrzeni logicznej 256 × 336 i siatka 64 × 84. `coverage.spec.ts` sprawdza geometrię; `bath-rendering.spec.ts` porównuje wynik znanego gestu z siatką i pikselami canvasu, także poza sylwetką. |
| REQ-11 · tryby | Ta sama kapsuła i siatka obsługują `destination-out` i `source-over`. `?test=1&layer=apply` uruchamia tylko próbę nakładania; zwykły rytuał się nie zmienia. Testy `bath-session` i `bath-rendering` sprawdzają oba zachowania. |
| REQ-12 · domknięcie | Reducer domyka krok przy 80/90/95%. Testy sprawdzają wartości tuż poniżej i na progu, zanik 0,5 s w tempie 1× oraz brak zaniku w trybie ograniczonego ruchu. Zygzak w `bath.spec.ts` przechodzi wszystkie trzy kroki. |
| REQ-13–15 · wejście i narzędzie | Mysz i wskaźniki dotykowe mają osobne gesty. Pula znaczników pokazuje narzędzie pod każdym aktywnym palcem; jego obrys pokrywa się ze śladem i ma średnicę co najmniej 44 px CSS. Testy mierzą położenie narzędzi i różnicę postępu między jednym i dwoma palcami. |
| REQ-16 · efekty | Pula ma 28 węzłów SVG, cząsteczki łagodnie się pojawiają i zanikają. Strumień od góry pudełka do punktu dotyku skaluje się przez `transform`. Testy obejmują geometrię strumienia, limit puli, ruch i wygaszanie cząsteczek. |
| REQ-17 · resize i pauza | Obrót nie zmienia bitmapy ani postępu i kończy rozpoczęty gest, żeby nie narysować odcinka z poprzedniego układu. Test z kontrolowanym zegarem potwierdza pauzę w trakcie `stage_rest` i wznowienie bez skoku czasu. |
| REQ-18 · czysty rdzeń | Weryfikacja siatki, kroków, reducera i RNG jest deterministyczna. Skan `random.spec.ts` wymusza brak `Math.random` poza modułem generatora. Canvas nie jest odczytywany podczas rozgrywki. |

## Ustalenia techniczne i granice fazy

- Stan `done` pozwala przekazać reducerowi nowe ziarno z komponentu zamiast losować w reducerze. Maska siatki jest obliczana analitycznie z tych samych kół i elips, co SVG i `Path2D`; nie potrzebuje canvasu ani asynchronicznych obrazów.
- Przy tempie 0,8× widoczny zanik nadal trwa co najmniej 0,5 s zgodnie z zasadą spokoju. Po puszczeniu palca narzędzie zanika; po zwolnieniu przycisku myszy zostaje pod kursorem, dopóki jest on nad pudełkiem. Przy wycieraniu nie powstają bańki ani krople.
- Nakładanie jest fundamentem renderera. Właściwe namydlanie, czesanie, kolejne rytuały i ślady zabawy pozostają w Fazie 7. Sterowanie klawiaturą i zapowiedź należą do Fazy 3, gotowe postacie do Fazy 4, a źródła wody do Fazy 6.

## Wynik lokalny

- `npm run typecheck` i `npm run build` przeszły w głównym katalogu projektu.
- `CI=1 PLAYWRIGHT_PREBUILT=1 npm test`: **90 zaliczonych, 1 pominięty, 0 błędów**. Pominięty jest test wielodotyku w projekcie `desktop`; przechodzi na obu profilach dotykowych. Testy nie zmieniły `dist/`.
- Zrzuty z emulacji Chromium w trybie `?test=1`: `artifacts/phase-02/pion.png` (360 × 640) i `artifacts/phase-02/poziom.png` (640 × 360). To lokalne materiały do przeglądu, nie test na fizycznym urządzeniu.

## Przed zamknięciem

- [ ] Potwierdzić zielony przebieg GitHub Actions dla tych zmian.
- [ ] Na fizycznym telefonie sprawdzić płynność jednego i dwóch palców, położenie narzędzi, obrót i łagodne przejścia. Emulacja w Chromium nie zastępuje tej próby.
- [ ] Po akceptacji odhaczyć plany 02-01–02-03 w ROADMAP.

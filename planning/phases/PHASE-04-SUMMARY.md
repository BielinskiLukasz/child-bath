# PHASE-04: podsumowanie implementacji

Plany 04-01–04-04 są zaimplementowane w głównym katalogu projektu. Lokalna weryfikacja automatyczna przeszła. Formalne zamknięcie wymaga uruchomienia CI dla tych zmian i akceptacji autora.

## Pokrycie wymagań

| Wymaganie | Realizacja i dowód |
|---|---|
| REQ-29 | 20 postaci w `src/animals/roster.ts`, w tym Labrador, Dachowiec, Lew, Słoń, Panda i Koala. `animals-bath.spec.ts` przechodzi cały rytuał dla każdego identyfikatora na trzech profilach Chromium. |
| REQ-33–34 | Wspólny frontalny szablon, palety i warianty oczu. Jeden opis geometrii zasila `AnimalSvg`, `Path2D` i maskę 64 × 84. `animal-mask.spec.ts` potwierdza IoU ≥ 0,97 dla całej rodziny i brak przecięcia obrysu widokiem. |
| REQ-35 | Brud i wilgoć są warstwami kąpieli. Mokry kolor jest ciemniejszy o 15%; po kąpieli pojawiają się kępki, piórka lub połysk, zależnie od okrywy. Szalik znika z szyi i trafia na haczyk; po kąpieli zwierzątko zakłada szlafrok lub turban i szalik. Galeria pokazuje siedem stanów. |
| REQ-36 | 12 typów reakcji, po 4 dla Żabki i Labradora. Tylko `transform` i `opacity`, pojedyncze odtworzenie, brak kolejki; co najmniej 1,2 s także przy najszybszym tempie. W trybie ograniczonego ruchu zostaje mimika. `reactions.spec.ts` sprawdza każdy rodzaj. |
| REQ-37 | 20 imion w sześciu przypadkach, rodzaj oraz funkcje `name` i `byGender`. Test tabelaryczny jest w `tests/unit/names.spec.ts`; komunikaty w grze i link „Wykąp” używają odpowiednich form. |
| REQ-38 | Pięć punktów na każdej postaci i pełna macierz 20 × 11. Każda ozdoba ma wskazaną kotwicę lub jawny brak. Galeria pokazuje kotwice i reguły zgodności; grafiki ozdób pozostają w Fazie 8. |

## Ustalenia

- Zachowano proporcje, palety i zasadnicze cechy child-train. To adaptacja, nie kopia piksel w piksel: kontury sylwetek i grube kreski łap zastąpiono pełnymi wycinankami, część zwierząt ma ogony do powolnych reakcji, a Labrador używa palety z `dogs.js`. Porównanie jest zapisane lokalnie do przeglądu.
- Bazowa maska jest liczona raz na definicję; szalik, szlafrok, turban i kępki po kąpieli nie są do mycia. Testy używają odczytu pikseli wyłącznie do sprawdzenia zgodności, nie w trakcie rozgrywki.
- Prosty wybór z ziarnem nie powtarza bezpośrednio poprzedniej postaci. Nie uruchamia jeszcze planera rund. Ławeczkę nadal zastępuje przejście `to_bench`, a ziewanie można obejrzeć w galerii; jego powiązanie z porą dnia należy do Fazy 6.
- Testowa galeria `?test=1&gallery=animals` i wybór `?test=1&animal=labrador` nie zmieniają zwykłej sesji. Galeria działa także z pojedynczego pliku HTML.

## Weryfikacja

- `npm run typecheck` i `npm run build`: sukces. Nie dodano zależności ani nowych zasobów sieciowych.
- `CI=1 PLAYWRIGHT_PREBUILT=1 npm test`: **192 zaliczone, 1 pominięty** (wielodotyk na desktopie), czysty artefakt `dist/` przez cały test.
- Zrzuty: `artifacts/phase-04/galeria.png`, `artifacts/phase-04/galeria-telefon.png`, `artifacts/phase-04/po-kapieli.png`, `artifacts/phase-04/zapowiedz.png`, `artifacts/phase-04/kapiel.png`, `artifacts/phase-04/porownanie-child-train.png`.
- [ ] Potwierdzić zielony przebieg GitHub Actions dla aktualnych zmian.
- [ ] Na telefonie zaakceptować rozpoznawalność, spójność i łagodność reakcji całej rodziny oraz tabelę odmiany imion.
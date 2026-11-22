# Źródła przeniesionego kodu

Każdy plik przeniesiony w całości lub w części z innego repozytorium ma na początku komentarz źródła w formacie `Źródło: <repozytorium>@<sha7>:<ścieżka>`. Pliki JSON nie mogą mieć komentarzy, więc opisuje je tylko ta tabela. Test `tests/unit/sources.spec.ts` sprawdza, czy każdy plik z komentarzem źródła ma tu swój wiersz.

## Repozytoria

| Repozytorium | Licencja | Commit |
|---|---|---|
| [child-train](https://github.com/BielinskiLukasz/child-train) | MIT, © 2026 Łukasz Bieliński | `b881e09` (`b881e09f119d22c5b34fda6215b732d58142491a`, 2026-11-03) |
| [child-page](https://github.com/BielinskiLukasz/child-page) | zastrzeżona; ten sam właściciel, przeniesione fragmenty przechodzą na MIT (D-01) | `e7a19ac` (`e7a19ac7fd79135483b85e844531a348cd3abdfd`, 2026-11-16) |

## Pliki

| Plik w child-bath | Źródło | Zmiany |
|---|---|---|
| `package.json` | child-train `package.json` | nazwa, opis, licencja, `engines`, skrypt `fonts`, `dev`/`preview` pod `/child-bath/`; deklarowane wersje zależności bez zmian |
| `tsconfig.json` | child-train `tsconfig.json` | alias `@/*`, typy `vite/client` |
| `vite.app.ts` | child-train `vite.config.ts` | względne ścieżki i licencje fontów w buildzie singlefile; dev i preview pod `/child-bath/` |
| `playwright.config.ts` | child-train `playwright.config.ts` | projekty `unit`, `phone`, `small`, `desktop`; serwer build + preview |
| `index.html` | child-train `index.html` | nazwy, ikona wanny w data URL; licencje fontów wkleja `vite.app.ts` |
| `.gitignore` | child-train `.gitignore` | generowane ikony PNG, raporty testów i lokalne klony referencyjne |
| `LICENSE` | child-train `LICENSE` | bez zmian (MIT, ten sam autor) |
| `src/main.tsx` | child-train `src/main.tsx` | rejestracja service workera przeniesiona do `src/pwa/` |
| `src/pwa/registerServiceWorker.ts` | child-train `src/main.tsx` | tylko zbudowana wersja w bezpiecznym kontekście |
| `src/index.css` | child-train `src/index.css` | własny zestaw plików stylów |
| `src/fonts.css` | child-train `src/fonts.css` | te same podzbiory Latin i Latin Extended, z adnotacją źródła |
| `src/styles/tokens.css` | child-train `src/styles/tokens.css` | kolory jako zmienne motywu, tokeny łazienki |
| `src/styles/layout.css` | child-train `src/styles/tokens.css` (`.little-world`, ziarno papieru) | siatka czterech stref, stały rozmiar kafla szumu |
| `src/assets/licenses/dm-sans.txt` | child-train `src/assets/licenses/dm-sans.txt` | bez zmian |
| `src/assets/licenses/fraunces.txt` | child-train `src/assets/licenses/fraunces.txt` | bez zmian |
| `public/manifest.json` | child-train `public/manifest.json` | nazwy, opis, `id`, kategorie, ikona SVG |
| `public/sw.js` | child-train `public/sw.js` | nazwa pamięci podręcznej, ikona SVG, limit czasu nawigacji (4 s) |
| `tools/generate-icons.py` | child-train `tools/generate-icons.py` | rysunek wanny, malowanie w obszarze kształtu, wariant maskable, pomijanie aktualnych plików |
| `tools/build-fonts.py` | child-train `tools/build-fonts.py` | `urllib` (z `curl` awaryjnie), ścieżki względem repozytorium, sprawdzenie wyniku, opcja `--from` |
| `.github/workflows/checks.yml` | child-train `.github/workflows/deploy.yml` | artefakt Pages z przetestowanego `dist/` i zależne wywołanie `deploy.yml` |
| `.github/workflows/deploy.yml` | child-train `.github/workflows/deploy.yml` | sam deploy w trybie `workflow_call`, bez własnego wyzwalacza `push` |
| `tests/e2e/pwa.spec.ts` | child-train `tests/pwa.spec.ts` | ścieżki pod `/child-bath/`, selektory stref, test manifestu i rozmiarów ikon |
| `src/bath/steps.ts` | child-page `js/kapiel.js` (`BRUSH`, min. 44 px, `DONE_AT`) | pięć kroków, tryb zmywania lub nakładania, łatwość 80 / 90 / 95% |
| `src/bath/layers.ts` | child-page `js/kapiel.js` (`drawLayer`, `erase`) | paleta child-train, losowanie z ziarnem, kropka dla pojedynczego dotyku |
| `src/bath/particles.ts` | child-page `js/kapiel.js` (pula baniek i kropli) | czysty moduł; ruch przez transform i opacity w `Particles.tsx` |
| `src/animals/sketch.ts` | child-page `js/kapiel.js` (viewBox, skala maski) i `js/animals.js` (sylwetka misia) | geometria jako dane: SVG, `Path2D` i maska siatki z jednego opisu |
| `src/animals/geometry/template.ts` | child-train `src/components/illustration/Animal.tsx` | frontalny korpus, twarz i warianty oczu jako dane w układzie kąpieli |
| `src/animals/species/woodland.ts` | child-train `src/components/illustration/Animal.tsx` | dziewięć leśnych sylwetek i ich palety |
| `src/animals/species/familiar.ts` | child-train `src/components/illustration/Animal.tsx`, child-page `js/dogs.js` | pozostałe siedem postaci; dawny Kotek to Dachowiec, a Piesek to Labrador z paletą rasową |
| `src/animals/species/visitors.ts` | child-page `js/animals.js` | Lew, Słoń, Panda i Koala przerysowani we wspólnym szablonie |
| `src/animals/species/dalmatian.ts` | child-page `js/dogs.js` | kremowe futro, opadające uszy i siedem łat w widoku frontalnym |
| `src/animals/species/dachshund.ts` | child-page `js/dogs.js` | niski tułów, długie uszy i paleta Jamnika w widoku frontalnym |
| `src/animals/species/poodle.ts` | child-page `js/dogs.js` | paleta i pompony Pudla w widoku frontalnym |
| `src/animals/species/husky.ts` | child-page `js/dogs.js` | paleta, stojące uszy, maska i zawinięty ogon w widoku frontalnym |
| `src/animals/species/bulldog.ts` | child-page `js/dogs.js` | paleta, złożone uszy i krótki ogon Buldoga w widoku frontalnym |
| `src/hooks/useBathClock.ts` | child-page `js/kapiel.js` (`frame`, `start`, `onVis`) | hook Reacta; `tick` zwraca, czy coś trwa, `wake()` budzi pętlę |
| `src/hooks/useScrub.ts` | child-page `js/kapiel.js` (`down`, `move`, `up`, `toLogical`) | hook Reacta, zdarzenia scalone, kursor myszy bez wciśnięcia |
| `src/input/keyboardBrush.ts` | child-page `js/kapiel.js` (`brushTo`, `onKey`) | czysta obsługa strzałek i zygzaka w logicznych współrzędnych |
| `src/components/NextButton.tsx` | child-train `src/App.tsx` (prawdziwy przycisk z `aria-disabled`) | „Dalej” dla zwierzątka czekającego na kąpiel |
| `src/components/OneButtonKey.tsx` | child-train `src/App.tsx` (Enter, Dotknij/Naciśnij) | wspólny klawisz zapowiedzi i jednego ruchu |
| `src/components/BathStage.tsx` | child-page `js/kapiel.js` (`layout`, `maybeSpawn`) | React, siatka pokrycia zamiast `getImageData`, jawny reducer faz |

## Pliki generowane

- `src/fonts.css`: wynik `tools/build-fonts.py`. Zawiera podzbiory fontów z Google Fonts albo kopię `src/fonts.css` z child-train (opcja `--from`). Fonty są na licencji SIL OFL 1.1.
- `public/icons/*.png`: wynik `tools/generate-icons.py`; nie trafiają do repozytorium.

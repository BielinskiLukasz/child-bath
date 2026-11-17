# PHASE-01: podsumowanie implementacji (opis PR)

> **Plany:** 01-01, 01-02, 01-03 · **Kod:** katalog `child-bath/` · **Stan:** kod gotowy, czeka na pierwsze uruchomienie i weryfikację autora.
> W środowisku, w którym powstał kod, nie da się uruchomić npm, Pythona ani przeglądarki. **Nic z poniższego nie zostało jeszcze zbudowane ani przetestowane.**

## Co zrobiono

### 01-01 · Szkielet projektu

- **Konfiguracja:** przeniesiona z child-train (`b881e09`) z przypiętymi wersjami: React 19.2.6, TypeScript 5.9.3, Vite ^7.3.7, Tailwind 4.1.17, `vite-plugin-singlefile` 2.3.0, Playwright ^1.64.1.
- **Skrypty:** `dev`, `build`, `preview`, `test`, `typecheck`, `icons`, `fonts`. Ikony generują się automatycznie przed `dev`, `build` i `test`.
- **Punkt wejścia:** `index.html` z `lang="pl"`, `viewport-fit=cover`, tytułem „Mała łazienka dziecka” i ikoną w data URL.
- **Aplikacja:** `App` z czterema strefami i atrybutem `data-phase="boot"`; ramki stref pojawiają się tylko z parametrem `?test=1`.
- **Dokumenty:** `LICENSE` (MIT), `README.md`, `SOURCES.md`. Każdy przeniesiony plik ma komentarz źródła.

### 01-02 · Fundament wizualny

- **Tokeny:** kolory child-train jako zmienne motywu oraz tokeny łazienki: woda, piana, kafelki, podłoga, drewno, ręczniki, lampa, lawenda, jagody.
- **Fonty:** `tools/build-fonts.py` pobiera je z Google Fonts albo kopiuje z klonu child-train. Licencje OFL leżą w `src/assets/licenses/` i są wklejane przy budowaniu do każdego `dist/index.html`.
- **Układ (najpierw telefon):**
  - siatka czterech stref na wysokości `100dvh`, bez przewijania;
  - marginesy `safe-area`;
  - warianty dla telefonu w poziomie i laptopa;
  - ziarno papieru o kryciu 12%.
- **Szkic sceny `PlaceholderTub`:** ściana, kafelki, podłoga z desek, wanna na nóżkach z pianą, ręcznik na haczyku.

### 01-03 · PWA, CI i testy strażnicze

- **PWA:**
  - `manifest.json`;
  - ikony SVG i generator PNG (192, 512, maskable 512, Apple 180);
  - `sw.js` z child-train, uzupełniony o limit czasu nawigacji.
- **CI:** `checks.yml` (typecheck, build, testy, raport przy błędzie) i `deploy.yml` (GitHub Pages).
- **Testy:**
  - e2e w projektach `phone`, `small` i `desktop`: `layout`, `pwa`, `offline-file`, `privacy`;
  - unit: `no-audio`, `sources`.

## Pokryte wymagania

| REQ | Realizacja | Test |
|---|---|---|
| REQ-01 | `vite-plugin-singlefile`, fonty jako data URL | `offline-file.spec.ts` |
| REQ-02 | manifest, `sw.js`, ikony, `deploy.yml` | `pwa.spec.ts` |
| REQ-03 | brak API dźwięku | `no-audio.spec.ts` |
| REQ-04 | brak zewnętrznych zasobów | `privacy.spec.ts`, `offline-file.spec.ts` |
| REQ-05 | `lang="pl"`, polskie teksty | `layout.spec.ts` |
| REQ-06 | strefy projektowane najpierw na telefon, bez przewijania | `layout.spec.ts` |
| REQ-07 | MIT, komentarze źródła, `SOURCES.md` | `sources.spec.ts` |
| REQ-76 | `checks.yml`, `deploy.yml` | CI |

## Odchylenia od planu

1. **Brak `package-lock.json`.** Bez npm nie da się go wygenerować. CI i wdrożenie używają `npm ci`, więc lockfile trzeba utworzyć (`npm install`) i zatwierdzić przed pierwszym pushem.
2. **`src/fonts.css` to zaślepka.** Fonty osadza `npm run fonts`. Do tego czasu działają fonty systemowe, a test `offline-file` kończy się błędem z podpowiedzią.
3. **Limit czasu w service workerze.** Plan mówił o limicie „jak w child-train”, ale service worker child-train go nie ma; ma go child-page. Dodałem 4 s dla nawigacji, a pozostałe zasoby nadal idą z pamięci podręcznej.
4. **Kolor tuszu `#384f40`.** To rzeczywista wartość z child-train. Plan podawał `#3f4d40`, którego child-train używa do oczu i detali; ten kolor zostaje jako `--shadow-ink`.
5. **Licencje fontów w jednym miejscu.** Teksty leżą w `src/assets/licenses/`, a `vite.config.ts` wkleja je do `<head>`. W child-train ich kopia była w `index.html`.
6. **Ziarno papieru** ma stały kafel 180 px (`background-size`), więc wygląda tak samo na telefonie i laptopie.
7. **Dodatki spoza planu:**
   - generator ikon pomija aktualne pliki (`--force` wymusza generowanie);
   - `build-fonts.py` ma opcję `--from`;
   - nowy test `sources.spec.ts`;
   - testy ziarna papieru i ramek stref.
8. **Serwer testów:** build + `vite preview` (zgodnie z PHASE-01) zamiast serwera deweloperskiego, którego używa child-train. Service worker rejestruje się tylko w zbudowanej wersji.

## Do zrobienia przez autora

1. Skopiuj katalog planu do repozytorium: `cp -r planning child-bath/` (linki w README wskazują `planning/`).
2. `cd child-bath && npm install`, potem zatwierdź `package-lock.json`.
3. `npm run fonts` (albo `npm run fonts -- --from ../child-train-repo`), potem zatwierdź `src/fonts.css`.
4. `npx playwright install chromium`, potem `npm run typecheck` i `npm test`.
5. Utwórz repozytorium `child-bath` na GitHubie, wypchnij `main` i ustaw Settings → Pages → Source: GitHub Actions.
6. Sprawdź aplikację na telefonie (lista kontrolna w PHASE-01, sekcja „Weryfikacja fazy”) i zaakceptuj proporcje stref (`?test=1`).

## Ryzyka pierwszego uruchomienia

- Kod nie był jeszcze kompilowany, więc pierwsze uruchomienie może ujawnić drobne błędy typów albo konfiguracji. Poprawki trafiają do tego samego PR.
- Test `pwa.spec.ts` przeniesiono z działającego zestawu child-train. Zachowanie service workera w Playwright zależy jednak od wersji Chromium.

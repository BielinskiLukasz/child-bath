---
phase: 01-fundamenty
name: Fundamenty
status: in-progress
depends_on: []
requirements: [REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07, REQ-76]
clarifications: []
plans: [01-01, 01-02, 01-03]
---

# PHASE-01: Fundamenty

> **Cel:** pusty „pokój kąpielowy” działa na telefonie jako jeden plik HTML i instalowalna PWA, w stylu child-train, a CI od pierwszego dnia pilnuje zasad (offline, zero sieci, brak audio).
> **Zależy od:** — · **Odblokowuje:** Fazę 2 · **Plany:** 3 (fale: 01-01 → 01-02 ∥ 01-03)

## Wynik fazy

- Repozytorium `child-bath` (MIT) z działającymi `npm run dev | build | preview | test | typecheck`.
- `dist/index.html`: samodzielny plik działający z dysku bez sieci.
- Strona na GitHub Pages pod `/child-bath/`, instalowalna jako PWA i działająca offline.
- Pusta scena projektowana najpierw na telefon, z czterema strefami (pasek górny, scena, narracja, strefa akcji) oraz paletą, fontami i ziarnem papieru.
- CI przy każdym PR (typecheck, build, testy strażnicze) i wdrożenie z gałęzi `main`.

## Kontekst

- **Decyzje:** D-01 (MIT), D-04 (telefon), D-21 (stack), D-23 (nazwy), D-25 (polski); zasady 2 i 7–10 z `PROJECT.md` (sekcja 5).
- **Źródła z child-train (`main`):**
  - konfiguracja: `package.json` (przypięte wersje), `vite.config.ts`, `tsconfig.json`, `playwright.config.ts`;
  - narzędzia i fonty: `tools/generate-icons.py`, `tools/build-fonts.py`, `src/fonts.css`, `src/assets/licenses/*`;
  - style: `src/styles/tokens.css`, `src/index.css`;
  - PWA i CI: `public/manifest.json`, `public/sw.js`, `.github/workflows/deploy.yml`, `tests/pwa.spec.ts`.

## Zakres

**W zakresie:** konfiguracja, fundament wizualny, PWA, CI, testy strażnicze.
**Poza zakresem:** mechanika (Faza 2), scenerie (Faza 6), panel rodzica (Faza 10).

## Projekt techniczny

- **Wersje jak w child-train:**
  - React 19.2.6, TypeScript 5.9.3;
  - Vite ^7.3.7, `@vitejs/plugin-react` 5.1.1, `vite-plugin-singlefile` 2.3.0;
  - Tailwind 4.1.17 (`@tailwindcss/vite`);
  - `@playwright/test` ^1.64.1.
- **`vite.config.ts`:** `base: "/child-bath/"`, alias `@` → `src`, wtyczki `react()`, `tailwindcss()`, `viteSingleFile()`.
- **Strefy ekranu** (`src/styles/layout.css`, siatka `.little-world`):

| Strefa | Element | Telefon w pionie | Poziom i laptop |
|---|---|---|---|
| Pasek górny | `header.top-bar` | auto (≈ 48 px) | auto |
| Scena | `main#scene` | `1fr` (≈ 60% wysokości) | `1fr` |
| Narracja | `section#narration` | auto, 1–2 linijki | auto |
| Strefa akcji | `footer#action` | ≥ 96 px + `env(safe-area-inset-bottom)` | ≥ 72 px |

- **Root:**
  - `height: 100dvh`, `overflow: hidden`, `overscroll-behavior: none`;
  - `-webkit-tap-highlight-color: transparent`, `user-select: none` w strefach dziecka;
  - ziarno papieru na `.little-world::after` (szum SVG, krycie 12%, `z-index: 10`, `pointer-events: none`).
- **Tokeny:** kolory child-train (papier `#f6f3e8`, tusz `#3f4d40`, akcent `#9c7155`) oraz nowe wartości robocze (każda z kolorem zapasowym w `var()`, ostateczne po przeglądzie stylu):
  - `--water: #a6c8c7`, `--foam: #fffcf3`;
  - `--tile-a: #a8bfaa`, `--tile-b: #f5eedb`;
  - `--lamp: #f7f2b5`, `--lavender: #b9a9c9`, `--berry: #8e6f8e`.
- **Playwright:**
  - projekty: `unit` (`tests/unit`, bez przeglądarki), `phone` (`devices['Pixel 7']`), `small` (360 × 640, `hasTouch`, `isMobile`), `desktop` (1280 × 800);
  - `webServer`: `npm run build && npm run preview -- --port 4173 --strictPort`;
  - `baseURL`: `http://localhost:4173/child-bath/`.

## Plany

### 01-01 · Szkielet projektu

**Fala 1** · zależy od: — · wymagania: REQ-05, REQ-07 · autonomiczny: tak

1. **Konfiguracja z child-train** · `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `.editorconfig`
   - Działanie:
     - skopiuj konfigurację i przypięte wersje; nazwa pakietu `child-bath`;
     - skrypty `dev`, `build`, `preview`, `test`, `typecheck`, `icons`, a `predev`/`prebuild`/`pretest` uruchamiają `npm run icons`;
     - `tsconfig` w trybie `strict` z aliasem `@/*`.
   - Gotowe gdy: `npm ci && npm run typecheck && npm run build` przechodzą.
2. **Punkt wejścia i strefy** · `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
   - Działanie:
     - `<html lang="pl">`, `viewport-fit=cover`, `theme-color`, tytuł „Mała łazienka dziecka”;
     - `App` renderuje `.little-world` z czterema strefami i `data-phase="boot"`.
   - Gotowe gdy: strona pokazuje cztery strefy (ramki pomocnicze tylko z `?test=1`).
3. **Licencja i źródła** · `LICENSE`, `README.md`, `SOURCES.md`
   - Działanie:
     - licencja MIT (2026, autor);
     - README startowe: cel, uruchomienie, zasady, linki do `planning/`;
     - `SOURCES.md`: tabela „plik w child-bath ← repozytorium, ścieżka, commit” i konwencja komentarza źródła.
   - Gotowe gdy: każdy skopiowany plik ma komentarz źródła i wpis w `SOURCES.md`.

**Must-haves:** typecheck i build bez błędów · `SOURCES.md` obejmuje wszystkie skopiowane pliki · `lang="pl"`.

### 01-02 · Fundament wizualny

**Fala 2** · zależy od: 01-01 · wymagania: REQ-05, REQ-06 · autonomiczny: nie (przegląd stylu przez autora)

1. **Tokeny i paleta** · `src/styles/tokens.css`
   - Działanie:
     - port tokenów child-train i tokeny łazienki z tabeli wyżej;
     - `--ink` i `--muted` jako zmienne, które w Fazie 6 przełącza pora dnia.
   - Gotowe gdy: żaden komponent nie używa literalnego koloru spoza tokenów (poza grafiką SVG).
2. **Fonty** · `tools/build-fonts.py`, `src/fonts.css`, `src/assets/licenses/`
   - Działanie:
     - podzbiory DM Sans i Fraunces z polskimi znakami (ąćęłńóśźż, ĄĆĘŁŃÓŚŹŻ, „”–…);
     - licencje OFL w repozytorium.
   - Gotowe gdy: `document.fonts.check('16px Fraunces')` zwraca `true` w `dist/index.html` bez sieci.
3. **Układ i ziarno papieru** · `src/styles/layout.css`, `src/styles/responsive.css`
   - Działanie:
     - siatka stref; warianty `@media (orientation: landscape)` i `(min-width: 900px)`;
     - ziarno papieru; brak przewijania.
   - Gotowe gdy: układ działa w trzech rozdzielczościach z Definition of Done.
4. **Szkic sceny** · `src/components/illustration/PlaceholderTub.tsx`
   - Działanie:
     - płaska balia i kafelki (wypełnienia i zaokrąglenia, bez konturów) do oceny proporcji;
     - tytuł Fraunces w pasku górnym.
   - Gotowe gdy: autor akceptuje proporcje stref na telefonie.
5. **Test układu** · `tests/e2e/layout.spec.ts`
   - Działanie: dla 360 × 640, 640 × 360 i 1280 × 800 sprawdź:
     - `scrollHeight ≤ innerHeight` i `scrollWidth ≤ innerWidth`;
     - wszystkie strefy są widoczne;
     - strefa akcji leży nad dolnym marginesem bezpieczeństwa.
   - Gotowe gdy: test przechodzi we wszystkich projektach przeglądarkowych.

**Must-haves:** brak przewijania w trzech rozdzielczościach · ziarno papieru nad sceną · fonty osadzone w `dist/index.html`.

### 01-03 · PWA, CI i testy strażnicze

**Fala 2** · zależy od: 01-01 · wymagania: REQ-01, REQ-02, REQ-03, REQ-04, REQ-76 · autonomiczny: nie (jednorazowe włączenie Pages)

1. **Manifest i ikony** · `public/manifest.json`, `public/icons/bath-icon.svg`, `public/icons/bath-maskable.svg`, `tools/generate-icons.py`
   - Działanie:
     - nazwa „Mała łazienka”, `short_name` „Łazienka”, `lang: "pl"`, `display: "standalone"`;
     - `start_url` i `scope` `./`, kolory `#f6f3e8`;
     - PNG 192, 512, maskable 512 i apple-touch 180 generowane przed `dev`/`build`/`test`.
   - Gotowe gdy: manifest przechodzi walidację w DevTools.
2. **Service worker** · `public/sw.js`, `src/main.tsx`
   - Działanie:
     - port strategii network-first z child-train (cache `child-bath-v1`, precache powłoki, manifestu i ikon);
     - rejestracja tylko dla `https:` i `localhost`, nie dla `file:`.
   - Gotowe gdy: ponowne otwarcie bez sieci serwuje powłokę z cache.
3. **CI i wdrożenie** · `.github/workflows/checks.yml`, `.github/workflows/deploy.yml`
   - Działanie:
     - checks (PR i push): `npm ci`, `npx playwright install --with-deps chromium`, `npm run typecheck`, `npm run build`, `npm test`;
     - deploy (push na `main`): build → `actions/upload-pages-artifact` (`dist`) → `actions/deploy-pages`;
     - autor jednorazowo ustawia Pages → Source: GitHub Actions.
   - Gotowe gdy: PR pokazuje zielone checks, a `main` publikuje stronę.
4. **Testy strażnicze** · `playwright.config.ts`, `tests/e2e/pwa.spec.ts`, `tests/e2e/offline-file.spec.ts`, `tests/e2e/privacy.spec.ts`, `tests/unit/no-audio.spec.ts`
   - Działanie:
     - **PWA:** manifest, rejestracja SW na `preview`, ponowne otwarcie po `context.setOffline(true)`;
     - **plik:** `dist/index.html` otwarty przez `file://` przy zablokowanych żądaniach innych niż `file:` renderuje strefy;
     - **prywatność:** podczas sesji żadne żądanie nie wychodzi poza `localhost` (`page.on('request')`);
     - **brak audio:** skan `src/` i `dist/index.html` nie znajduje `new Audio`, `AudioContext`, `<audio`, `<video`, `speechSynthesis` ani `navigator.vibrate`.
   - Gotowe gdy: wszystkie cztery testy działają w CI.

**Must-haves:** CI zielone na PR · Pages działa pod `/child-bath/` · test zero-network i test braku audio w CI.

## Weryfikacja fazy

- **Automatycznie:** `npm test` (unit i e2e), zielone CI na PR i na `main`.
- **Przegląd autora na telefonie:**
  - [ ] Android Chrome: „Zainstaluj aplikację”, otwarcie z ikony, tryb samolotowy → aplikacja się otwiera.
  - [ ] iPhone Safari: „Do ekranu początkowego”, to samo.
  - [ ] Pion i poziom: brak przewijania, strefy nie zachodzą na wycięcie ekranu.
  - [ ] `dist/index.html` otwarty z dysku działa bez sieci.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | `dist/index.html` z dysku działa bez sieci | `offline-file.spec.ts` |
| 2 | Pages instaluje się i działa offline | `pwa.spec.ts` + przegląd na telefonie |
| 3 | 360 × 640 w pionie i poziomie bez przewijania | `layout.spec.ts` |
| 4 | CI uruchamia typecheck, build i Playwright z testami zero-network i braku audio | `checks.yml`, `privacy.spec.ts`, `no-audio.spec.ts` |

## Ryzyka i pułapki

- **`base: "/child-bath/"` a `file://`:** singlefile osadza zasoby, więc ścieżka bazowa nie przeszkadza. Manifest i SW działają tylko przez HTTPS lub localhost, i tak ma być.
- **SW serwuje starą wersję:** strategia network-first z limitem czasu jak w child-train; przy zmianie zawartości precache zmieniamy nazwę cache.
- **iOS (`100dvh`, `safe-area`):** sprawdzamy na prawdziwym iPhonie w przeglądzie.

## Przekazanie

- Strefy `#scene`, `#narration`, `#action` i atrybut `data-phase` czekają na Fazy 2–3.
- Tokeny i fonty są gotowe dla Faz 4–7; konfiguracja Playwright obsługuje wszystkie kolejne testy.

## Stan implementacji

- **Kod:** katalog `child-bath/` (plany 01-01, 01-02 i 01-03). Podsumowanie, odchylenia od planu i kroki dla autora: [PHASE-01-SUMMARY.md](PHASE-01-SUMMARY.md).
- **Czeka na:**
  - `npm install` i zatwierdzenie `package-lock.json`;
  - osadzenie fontów (`npm run fonts`);
  - pierwsze uruchomienie testów;
  - włączenie GitHub Pages;
  - przegląd na telefonie.
- Do czasu tej weryfikacji plany zostają nieodhaczone w ROADMAP.

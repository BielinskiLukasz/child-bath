# PHASE-01: weryfikacja

> **Metoda:** przegląd statyczny kodu w `child-bath/` względem zadań i kryteriów z [PHASE-01.md](PHASE-01.md). Uruchomienie npm, testów i przeglądarki nie było możliwe.
> **Wynik:** kod Fazy 1 jest kompletny. Do zamknięcia fazy brakuje 4 kroków, które może wykonać tylko autor (sekcja „Braki”).

## Zadania planów

| Plan · zadanie | Stan | Dowód |
|---|---|---|
| 01-01.1 Konfiguracja z child-train | ✅ | `package.json` (te same wersje i skrypty), `vite.config.ts`, `tsconfig.json` (strict, `@/*`) |
| 01-01.2 Punkt wejścia i strefy | ✅ | `index.html` (`lang="pl"`, `viewport-fit=cover`), `App.tsx` (4 strefy, ramki z `?test=1`) |
| 01-01.3 Licencja i źródła | ✅ | `LICENSE` (MIT), `README.md`, `SOURCES.md`, komentarze źródła w 15 plikach |
| 01-02.1 Tokeny i paleta | ✅ | `src/styles/tokens.css` |
| 01-02.2 Fonty | ⚠️ narzędzie gotowe | `tools/build-fonts.py`; `src/fonts.css` jest zaślepką do czasu `npm run fonts` |
| 01-02.3 Układ i ziarno papieru | ✅ | `layout.css`, `responsive.css` (`100dvh`, safe-area, ziarno 12%) |
| 01-02.4 Szkic sceny | ✅ (czeka na akceptację autora) | `PlaceholderTub.tsx`, `scene.css` |
| 01-02.5 Test układu | ✅ | `tests/e2e/layout.spec.ts` (3 rozdzielczości, ziarno, tryb testowy) |
| 01-03.1 Manifest i ikony | ✅ | `public/manifest.json`, `icons/*.svg`, `tools/generate-icons.py` |
| 01-03.2 Service worker | ✅ | `public/sw.js`, `src/pwa/registerServiceWorker.ts` |
| 01-03.3 CI i wdrożenie | ⚠️ pliki gotowe | `checks.yml`, `deploy.yml`; wymagają `package-lock.json` i włączenia Pages |
| 01-03.4 Testy strażnicze | ✅ | `pwa`, `offline-file`, `privacy`, `no-audio` + `sources` |

## Wymagania

| REQ | Stan | Uwagi |
|---|---|---|
| REQ-01 | ⚠️ | zaliczone po osadzeniu fontów; do tego czasu test `offline-file` celowo kończy się błędem |
| REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07 | ✅ w kodzie | potwierdzi `npm test` |
| REQ-76 | ⚠️ | CI ruszy po zatwierdzeniu `package-lock.json` |

## Poprawki wprowadzone przy weryfikacji

- `tests/e2e/layout.spec.ts`: od Fazy 2 korzeń `.little-world` odzwierciedla fazę kąpieli, więc test akceptuje `boot`, `stage_in` i `scrubbing` zamiast samego `boot`.

## Braki (tylko autor)

1. `npm install`, potem zatwierdzenie `package-lock.json`.
2. `npm run fonts` (albo `-- --from ../child-train-repo`), potem zatwierdzenie `src/fonts.css`.
3. Skopiowanie `planning/` do `child-bath/` (README do niego linkuje).
4. Pierwsze `npm run typecheck` i `npm test`, włączenie GitHub Pages, przegląd na telefonie (lista w PHASE-01, „Weryfikacja fazy”).

Po tych krokach i zielonym CI odhacz plany 01-01–01-03 w `ROADMAP.md`.

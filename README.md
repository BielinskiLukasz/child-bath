# Mała łazienka (child-bath)

Spokojna, cicha aplikacja PWA po polsku dla małego dziecka. Dziecko kąpie zwierzątka w krótkim rytuale: zmywa ślady zabawy, spłukuje pianę i wyciera ręcznikiem, aż zwierzątko jest czyste i puszyste. **Zabawa pod opieką dorosłego.**

Aplikacja powstaje najpierw z myślą o telefonie. Działa offline, bez dźwięku, reklam i wysyłania danych. Styl i rozwiązania techniczne pochodzą z [child-train](https://github.com/BielinskiLukasz/child-train), a mechanika kąpieli z aktywności „Kąpiel Zwierzątek” w [child-page](https://github.com/BielinskiLukasz/child-page).

> **Stan: Faza 2 z 12 (silnik kąpieli).** Na scenie jest zwierzątko-szkic, które można wykąpać pocieraniem w trzech krokach (brud, piana, wilgoć); kroki domykają się same, a potem pojawia się kolejne zwierzątko. Parametry testowe: `?test=1&seed=7&ease=easy&pace=1.45`. Plan: [`planning/ROADMAP.md`](planning/ROADMAP.md), plany faz: [`planning/phases/`](planning/phases/README.md).

## Zasady

- **Spokój:** nic nie pojawia się ani nie znika szybciej niż w 0,5 s, żadna pętla nie jest szybsza niż 1,2 s, nie ma błysków.
- **Bez dźwięku i bez czytania:** dziecko nie musi niczego czytać.
- **Nic nie może się nie udać:** nie ma punktów, porażek ani odliczania.
- **Prywatność:** nic nie wychodzi z urządzenia.
- **Styl papierowej wycinanki** z child-train, **najpierw telefon**.

Pełna lista: [`planning/PROJECT.md`](planning/PROJECT.md), sekcja 5.

## Wymagania

- Node.js 20.19+ (zalecany 22) i npm.
- Python 3 (wystarczy biblioteka standardowa): generuje ikony PNG i osadza fonty. Na Windows polecenie `python3` może nazywać się `py` albo `python`.
- Do testów: Chromium dla Playwright (`npx playwright install chromium`).

## Pierwsze uruchomienie

```sh
npm ci
npm run dev        # http://localhost:5173/child-bath/
```

Fonty DM Sans i Fraunces są już osadzone w `src/fonts.css`. Do zwykłego uruchomienia ani do buildu nie trzeba ich generować. `npm run fonts` służy do odświeżenia podzbiorów; polecenie `npm run fonts -- --from ./child-train-repo` może użyć gotowych podzbiorów z lokalnego klonu.

Główny katalog to projekt `child-bath`, a jego plany są w `planning/`. Jeśli masz w nim `child-page-repo/` i `child-train-repo/`, służą wyłącznie jako materiały referencyjne i nie są potrzebne do uruchomienia aplikacji.

## Polecenia

| Polecenie | Co robi |
|---|---|
| `npm run dev` | serwer deweloperski (bez service workera) |
| `npm run build` | `dist/index.html` (jeden samodzielny plik) oraz manifest, service worker i ikony |
| `npm run preview` | podgląd `dist/` pod `/child-bath/` |
| `npm run typecheck` | sprawdzenie typów TypeScript |
| `npm test` | testy Playwright: build, podgląd i wszystkie projekty testowe |
| `npm run icons` | ikony PNG z `tools/generate-icons.py` (aktualne pliki pomija; `-- --force` wymusza generowanie) |
| `npm run fonts` | osadzenie fontów w `src/fonts.css` (`-- --from <klon child-train>` kopiuje gotowy plik) |

Przed `dev`, `build` i `test` ikony generują się automatycznie.

## Tryb testowy

Parametr `?test=1` (np. `http://localhost:5173/child-bath/?test=1`) pokazuje ramki i podpisy stref oraz przykładowe zdanie narracji i przycisk. Dziecko go nie widzi. Kolejne fazy dodadzą tu kolejne parametry testowe (`seed`, `ease`, `ritual`…), zob. [`planning/phases/README.md`](planning/phases/README.md).

## Offline i PWA

- `dist/index.html` zawiera cały kod, style i fonty. Działa otwarty prosto z dysku, bez internetu.
- Wersję z GitHub Pages można zainstalować jako aplikację (Android: „Zainstaluj aplikację”, iPhone: „Do ekranu początkowego”). Service worker zapisuje powłokę aplikacji, więc po pierwszej wizycie aplikacja otwiera się także w trybie samolotowym.
- Service worker działa tylko w zbudowanej wersji na HTTPS albo localhost. Plik otwarty z dysku (`file://`) go nie potrzebuje.

## Testy

Testy są w Playwright, jak w child-train. Serwer testowy buduje aplikację i serwuje `dist/` pod adresem `http://localhost:4173/child-bath/`.

| Projekt | Zakres |
|---|---|
| `unit` | czyste moduły i skany plików, bez przeglądarki (`tests/unit`) |
| `phone` | Pixel 7 (`tests/e2e`) |
| `small` | 360 × 640, dotyk (`tests/e2e`) |
| `desktop` | 1280 × 800 (`tests/e2e`) |

Testy strażnicze z Fazy 1 sprawdzają:

- układ bez przewijania;
- PWA offline;
- działanie `dist/index.html` otwartego z dysku;
- brak zapytań sieciowych;
- brak dźwięku;
- wpisy w `SOURCES.md`.

## Wdrożenie

PR i push na `main` uruchamiają jeden workflow: `.github/workflows/checks.yml`. PR przechodzi tylko typecheck, build i testy. Na `main` wdrożenie na GitHub Pages rusza dopiero, gdy te kroki się powiodą, i publikuje dokładnie ten `dist/`, który testował Playwright. Ręczne uruchomienie na `main` też przechodzi przez testy.

Jednorazowo ustaw Settings → Pages → Source: **GitHub Actions**. Zadanie `checks` korzysta z `.github/actions/setup-project`: Node.js 22, `npm ci` z pamięcią podręczną npm i sprawdzenie osadzonych fontów. CI nie generuje lockfile'a ani nie pobiera fontów z CDN.

- **Strona:** [bielinskilukasz.github.io/child-bath/](https://bielinskilukasz.github.io/child-bath/)
- **Weryfikacja fundamentów i lista kontrolna przed zamknięciem Fazy 1:** [`planning/phases/PHASE-01-VERIFICATION.md`](planning/phases/PHASE-01-VERIFICATION.md)

## Struktura

```text
child-bath/
├─ index.html              wejście Vite (nagłówek PWA, ikona)
├─ vite.app.ts             konfiguracja dev, build singlefile i preview
├─ public/                 manifest.json, sw.js, icons/*.svg (PNG generuje narzędzie)
├─ src/
│  ├─ main.tsx, App.tsx    montowanie aplikacji i cztery strefy ekranu
│  ├─ components/          illustration/PlaceholderTub.tsx (szkic łazienki z Fazy 1)
│  ├─ pwa/                 rejestracja service workera
│  ├─ settings/            tryb testowy
│  ├─ styles/              tokens, layout, scene, responsive
│  ├─ fonts.css            fonty osadzone jako data URL (generowane)
│  └─ assets/licenses/     licencje SIL OFL fontów
├─ tests/                  unit/ i e2e/ (Playwright)
├─ tools/                  generate-icons.py, build-fonts.py
└─ planning/               plan projektu (PROJECT, ROADMAP, phases)
```

## Prywatność

Aplikacja nie ma backendu, kont, reklam ani analityki i nie wysyła zapytań do zewnętrznych serwerów. Fonty i grafika są w pakiecie. Service worker przechowuje tylko powłokę aplikacji i ikony.

## Licencja i źródła

Kod jest na licencji MIT ([`LICENSE`](LICENSE)). Fonty DM Sans i Fraunces są na licencji SIL Open Font License 1.1 ([`src/assets/licenses/`](src/assets/licenses/)); teksty licencji trafiają do każdego zbudowanego pliku `dist/index.html`. Fragmenty przeniesione z child-train i child-page opisuje [`SOURCES.md`](SOURCES.md).

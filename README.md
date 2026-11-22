# Mała łazienka (child-bath)

Spokojna, cicha aplikacja PWA po polsku dla małego dziecka. Dziecko kąpie zwierzątka w krótkim rytuale: zmywa ślady zabawy, spłukuje pianę i wyciera ręcznikiem, aż zwierzątko jest czyste i puszyste. **Zabawa pod opieką dorosłego.**

Aplikacja powstaje najpierw z myślą o telefonie. Działa offline, bez dźwięku, reklam i wysyłania danych. Styl i rozwiązania techniczne pochodzą z [child-train](https://github.com/BielinskiLukasz/child-train), a mechanika kąpieli z aktywności „Kąpiel Zwierzątek” w [child-page](https://github.com/BielinskiLukasz/child-page).

> **Stan: Faza 5 z 12 (menażeria).** W kąpieli można spotkać 36 zwierzątek, w tym pięć łagodnych dinozaurów. Pierwsze i każde następne czeka na „Dalej” lub Enter. Plan: [`planning/ROADMAP.md`](planning/ROADMAP.md), [wyniki Fazy 5](planning/phases/PHASE-05-SUMMARY.md).

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

## Sterowanie

- **Dotyk lub mysz:** wybierz „Dalej” i pocieraj zwierzątko po pojawieniu się warstwy.
- **Klawiatura:** uruchom kąpiel Enterem. Gdy zwierzątko wejdzie, ustaw fokus na pudełku klawiszem Tab (lub Shift+Tab z przycisku „Dalej”). Strzałki przesuwają narzędzie; Spacja i Enter prowadzą zygzakiem.
- **Jeden przycisk:** dodaj `?test=1&oneButton=1`. Pierwsze naciśnięcie Entera lub dotknięcie przycisku rozpoczyna kąpiel; każde następne uruchamia jeden pas. Przytrzymanie i naciśnięcia w trakcie ruchu nie są kolejkowane.

## Tryb testowy

Parametr `?test=1` pokazuje ramki stref oraz przykładową narrację. Tylko wtedy można nadpisać `seed`, `ease` (`easy`, `normal`, `precise`), `pace` i `oneButton`. `?test=1&layer=apply` uruchamia próbę nakładania warstwy; w zwykłej zabawie nadal są trzy kroki klasyczne.

- **Galeria postaci:** `?test=1&gallery=animals`. Można filtrować pięć grup, porównać stany i ukryć podpisy. Wybierz postać, aby obejrzeć reakcje, odmianę i kotwice. `&group=dinozaury` otwiera konkretną grupę, a `&still=1` zatrzymuje ruch na potrzeby zrzutów.
- **Kąpiel konkretnego zwierzątka:** `?test=1&animal=labrador` albo przycisk „Wykąp” w galerii. W zwykłej grze wybór jest losowany z ziarnem, bez powtórzeń z rzędu.
- **Próba wykluczeń:** `?test=1&excludeAnimal=trex` wyklucza T-Reksa; `?test=1&excludeGroup=dinozaury` wyklucza całą grupę. Parametry można łączyć. Błędne wykluczenie albo pula mniejsza niż cztery postacie przywraca pełną listę. Panel rodzica dojdzie w Fazie 10.

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
| `visual` | porównanie 20 referencji galerii na Linuksie (`tests/visual`) |

Zrzuty pokazują każdą z pięciu grup w czterech stanach. Po zaakceptowanej zmianie rysunku można je odświeżyć przez `npm test -- --project=visual --update-snapshots=all` w Chromium na Linuksie.

Testy strażnicze z Fazy 1 sprawdzają:

- układ bez przewijania;
- PWA offline;
- działanie `dist/index.html` otwartego z dysku;
- brak zapytań sieciowych;
- brak dźwięku;
- wpisy w `SOURCES.md`.

## Wdrożenie

PR i push na `main` uruchamiają jeden przebieg: `.github/workflows/checks.yml`. PR przechodzi tylko typecheck, build i testy. Na `main` zadanie `deploy` czeka na udane `checks`, a potem publikuje dokładnie ten `dist/`, który testował Playwright. Ręczne uruchomienie `Checks` na `main` również przechodzi przez testy.

`.github/workflows/deploy.yml` jest wywoływany tylko przez `workflow_call`; nie uruchamia osobnego przebiegu po pushu. Przy synchronizacji plików trzeba **nadpisać ten plik na GitHubie**, ponieważ stara wersja zawierała drugi wyzwalacz `push`.

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
├─ tests/                  unit/, e2e/ i visual/ (Playwright)
├─ tools/                  generate-icons.py, build-fonts.py
└─ planning/               plan projektu (PROJECT, ROADMAP, phases)
```

## Prywatność

Aplikacja nie ma backendu, kont, reklam ani analityki i nie wysyła zapytań do zewnętrznych serwerów. Fonty i grafika są w pakiecie. Service worker przechowuje tylko powłokę aplikacji i ikony.

## Licencja i źródła

Kod jest na licencji MIT ([`LICENSE`](LICENSE)). Fonty DM Sans i Fraunces są na licencji SIL Open Font License 1.1 ([`src/assets/licenses/`](src/assets/licenses/)); teksty licencji trafiają do każdego zbudowanego pliku `dist/index.html`. Fragmenty przeniesione z child-train i child-page opisuje [`SOURCES.md`](SOURCES.md).

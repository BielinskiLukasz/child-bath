# PHASE-01: podsumowanie implementacji

Plany 01-01, 01-02 i 01-03 mają implementację w repozytorium `child-bath`. Stan automatycznej weryfikacji oraz czynności na fizycznym telefonie opisuje [PHASE-01-VERIFICATION.md](PHASE-01-VERIFICATION.md). Testy regresji istniejącej mechaniki Fazy 2 nadal należą do pełnego zestawu.

## Zakres

| Plan | Realizacja | Wymagania |
|---|---|---|
| 01-01 Szkielet | `package-lock.json`, skrypty projektu, Vite + singlefile, ścisły TypeScript, polski dokument, cztery strefy, MIT i mapa źródeł | REQ-05, REQ-07 |
| 01-02 Fundament wizualny | Paleta i tokeny, osadzone podzbiory DM Sans i Fraunces z licencjami SIL OFL, szkic wanny, ziarno papieru, układ bez przewijania i marginesy safe-area | REQ-05, REQ-06 |
| 01-03 PWA, CI i strażnicy | Samodzielny HTML, manifest i generowane ikony, service worker offline, Checks i deploy, Playwright dla układu, pliku offline, PWA, prywatności, braku audio i źródeł | REQ-01–04, REQ-76 |

## Ustalenia techniczne

- `vite-plugin-singlefile` sam ustawia `base` na `./`. Wydanie zachowuje względne odnośniki do plików PWA. Skrypty `dev` i `preview` używają `vite.pages.ts`, aby serwować właściwy manifest, service worker i ikony pod `/child-bath/`, tak jak na GitHub Pages. Plik `vite.config.ts` zachowuje konfigurację singlefile i osadzanie licencji OFL w HTML.
- `src/fonts.css` zawiera osadzone podzbiory Latin i Latin Extended, skopiowane z child-train. CI instaluje zależności przez `npm ci` i sprawdza osadzenie fontów — nie tworzy lockfile'a ani nie pobiera fontów.
- Service worker zachowuje istniejącą nazwę `child-bath-shell-v1`. Nawigacje idą najpierw do sieci z limitem 4 s i z powrotem do cache, a zasoby są zwracane z cache, jeśli tam są, i odświeżane w tle. Plik otwarty z dysku nie rejestruje workera.
- Stan `boot` na korzeniu to stan początkowy; po uruchomieniu pozostawionej mechaniki Fazy 2 atrybut pokazuje bieżący etap. W teście pełnej kąpieli zakończenie kroku jest potwierdzane przez następny `data-step` albo nowe zwierzątko, a nie przez obserwowanie krótkiej fazy przejściowej.
- Test pliku offline używa osobnej kopii samego `index.html`, bez manifestu i ikon w tym samym katalogu. Test PWA sprawdza typy odpowiedzi i potwierdza, że offline HTML zwraca service worker, a test układu obejmuje emulowane wcięcia w pionie i poziomie.

## Do zamknięcia fazy

Dołączyć poprawki do PR i potwierdzić zielone Checks. Autor sprawdza instalację z ekranu głównego i ponowne otwarcie w trybie samolotowym na Androidzie i iPhonie oraz akceptuje proporcje sceny z `?test=1`. ROADMAP zostaje otwarta do zakończenia tych kroków.

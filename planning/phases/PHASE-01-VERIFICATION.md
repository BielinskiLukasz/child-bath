# PHASE-01: weryfikacja

**Wynik:** implementacja fundamentów przechodzi lokalną weryfikację automatyczną. GitHub Pages jest już włączone i publiczna wersja działa offline w Chromium. Faza pozostaje otwarta do zielonego przebiegu Checks dla tych poprawek i przeglądu na fizycznych telefonach.

## Wyniki automatyczne

- `npm ci`, `npm run typecheck` i `npm run build` przeszły w `child-bath`.
- `CI=1 npm test`: **71 zaliczonych, 1 pominięty zgodnie z założeniem** (wielodotyk jest testowany w `phone` i `small`, nie w `desktop`). Bez błędów i bez powtórek.
- [Publiczna aplikacja](https://bielinskilukasz.github.io/child-bath/) zwróciła poprawne odpowiedzi dla HTML, manifestu, service workera i ikon. Chromium z emulacją Pixel 7 nie zgłosił błędów instalowalności; w nowej karcie w trybie offline stronę zwrócił service worker.

| Wymaganie | Co zostało potwierdzone |
|---|---|
| REQ-01 · pojedynczy HTML | Playwright otworzył sam `dist/index.html` z `file://`, bez plików obok i bez zewnętrznych żądań. Załadowały się DM Sans i Fraunces (także kursywa), podzbiory Latin i Latin Extended oraz teksty licencji. |
| REQ-02 · PWA | Poprawny manifest i wymiary ikon, aktywowany service worker, HTML i zasoby z cache bez dostępu do sieci pod `/child-bath/`. |
| REQ-03 · brak audio | Skan kodu i wydania nie znalazł API dźwięku, mediów, syntezy mowy ani wibracji. |
| REQ-04 · prywatność | Testy nie wykryły zapytań poza urządzenie podczas otwarcia i interakcji. |
| REQ-05 · polski | `lang="pl"`, właściwy tytuł, cztery strefy, ramki i przykładowa treść tylko z `?test=1`. |
| REQ-06 · telefon | Brak przewijania przy 360 × 640, 640 × 360 i 1280 × 800; ziarno nie blokuje dotyku. Z emulowanymi wcięciami tytuł i próbny przycisk pozostają w bezpiecznej strefie. |
| REQ-07 · źródła i MIT | Licencja, `SOURCES.md` i komentarze źródłowe, w tym pochodzenie osadzonych fontów. Test źródeł przeszedł. |
| REQ-76 · CI i deploy | Jeden workflow Checks uruchamia `npm ci`, typecheck, build i Playwright. Zadanie `deploy` zależy od `checks` i publikuje tylko przetestowany `dist/` z `main`. Potwierdzenie przebiegu po publikacji zmian wymaga GitHub Actions. |

## Stan GitHub Actions i kroki do zamknięcia

Dla wyjściowego `3cfe2b4`: [Deploy zakończył się sukcesem](https://github.com/BielinskiLukasz/child-bath/actions/runs/44087857917), a [Checks zatrzymał się w kroku Test](https://github.com/BielinskiLukasz/child-bath/actions/runs/44087858238). Poprawki ścieżki podglądu i testów zostały zweryfikowane lokalnie; nie publikowano zmian ani nie modyfikowano ustawień GitHub.

- [ ] Dołączyć poprawki (w tym `package-lock.json` i `src/fonts.css`) do PR; potwierdzić zielone Checks na GitHubie i wdrożenie po scaleniu.
- [ ] Android Chrome: zainstalować z menu, uruchomić z ikony i otworzyć ponownie w trybie samolotowym.
- [ ] iPhone Safari: dodać do ekranu początkowego, uruchomić z ikony i otworzyć ponownie w trybie samolotowym.
- [ ] Na telefonach sprawdzić pion i poziom oraz zaakceptować proporcje sceny (`?test=1`).
- [ ] Po weryfikacji odhaczyć plany 01-01–01-03 i Fazę 1 w ROADMAP.

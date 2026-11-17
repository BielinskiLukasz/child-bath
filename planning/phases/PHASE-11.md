---
phase: 11-dane
name: Dane na urządzeniu
status: not-started
depends_on: [10-panel-rodzica]
requirements: [REQ-71, REQ-72, REQ-73, REQ-74, REQ-75]
clarifications: [DP-6, DP-8]
plans: [11-01, 11-02, 11-03]
---

# PHASE-11: Dane na urządzeniu

> **Cel:** jak w child-page: ustawienia i dzienny licznik przetrwają zamknięcie aplikacji, rodzic robi kopię ustawień w JSON i przegląda lokalne statystyki, a żadne dane nie opuszczają urządzenia.
> **Zależy od:** Faza 10 · **Odblokowuje:** Fazę 12 · **Plany:** 3 (fale: 11-01 → 11-02 ∥ 11-03)

## Wynik fazy

- Warstwa zapisu w localStorage: schemat z wersją, migracje, odporność na błędy, przełącznik zapamiętywania.
- Dzienny licznik zapisany z datą i zerowany każdego dnia.
- Kopia ustawień: zapis do pliku, kopiowanie jako tekst, wczytanie z pliku lub wklejonego tekstu, z walidacją i potwierdzeniem.
- Anonimowe statystyki (dzienne agregaty) z widokiem w panelu, eksportem JSON i zerowaniem.
- Przycisk „Usuń wszystkie dane z urządzenia”.

## Kontekst

- **Decyzje:** D-20 i rozstrzygnięcia P1–P3 z `PROJECT.md` 4.1. Zapis jest włączony od razu.
- **DP-6:** kopia ustawień bez imienia dziecka; import zachowuje bieżące imię.
- **DP-8:** statystyki zawsze zbierane lokalnie, bez wyłącznika; rodzic może je wyeksportować i wyzerować.
- **Wzorce z child-page:**
  - `js/analytics.js`: dzienne agregaty z 90 dni i sumy od początku; aktywny czas = karta widoczna i dotyk lub klawisz mniej niż 60 s temu; zapis co 5 s; każda awaria jest połykana, więc nie wpływa na zabawę;
  - „Kopia ustawień” z README: „Zapisz ustawienia”, „Skopiuj ustawienia”, „Wczytaj ustawienia”; limit 100 KB; nieznane wpisy pomijane, brakujące uzupełniane; „Zastąpić obecne ustawienia?”; błędy po polsku; zero sieci.

## Zakres

**W zakresie:** zapis, migracje, licznik, kopia ustawień, statystyki, usuwanie danych, sekcja „Dane” w panelu.
**Poza zakresem:** synchronizacja i konta (poza v1.0), statystyki interakcji poza kąpielami.

## Projekt techniczny

| Klucz localStorage | Zawartość |
|---|---|
| `child-bath.settings` | `{ schema: 1, settings: BathSettings }`; obecny tylko przy `persist: true` |
| `child-bath.playtime` | `{ date: "RRRR-MM-DD", ms: number }` |
| `child-bath.stats` | `{ v: 1, days: { "RRRR-MM-DD": Bucket }, total: Bucket, nDays: number }` |

```ts
// src/storage/safeStorage.ts: try/catch i zapas w pamięci (tryb prywatny Safari, brak miejsca)
export function read<T>(key: string): T | null;
export function write(key: string, value: unknown): boolean;
export function remove(key: string): void;

// src/storage/settings.ts
export function loadSettings(): BathSettings;           // migrate() → sanitizeSettings() z Fazy 10
export function saveSettings(s: BathSettings): void;     // zapis z opóźnieniem 500 ms; flush przy pagehide i ukryciu karty
export function migrate(raw: unknown): BathSettings;     // schema 0 → 1 itd.; nieznane pola pomijane

// src/storage/backup.ts
export function exportSettings(s: BathSettings): string; // { format: "child-bath-settings", version: 1, settings } bez childName
export function parseBackup(text: string): { ok: true; settings: Partial<BathSettings> } | { ok: false; error: BackupError };
export type BackupError = "tooLarge" | "notJson" | "wrongFormat" | "unsupportedVersion";

// src/storage/stats.ts (wzór: analytics.js)
export interface Bucket { sessions: number; activeMs: number; idleMs: number; baths: number; byAnimal: Record<string, number>; byRitual: Record<string, number>; byScenery: Record<string, number> }
export function recordSessionStart(): void;
export function recordActive(ms: number, active: boolean): void;
export function recordBath(animalId: string, ritual: string, scenery: SceneryId): void;  // koniec to_bench
export function query(range: "session" | "today" | "7d" | "30d" | "all"): Bucket;
export function exportStats(): string;
export function resetStats(): void;
```

**Komunikaty dla rodzica:**

| Sytuacja | Tekst |
|---|---|
| plik za duży | „Plik jest za duży (maks. 100 KB).” |
| niepoprawny JSON | „Nie udało się odczytać pliku.” |
| obcy format | „To nie jest plik ustawień Małej łazienki.” |
| nowsza wersja | „Ten plik pochodzi z nowszej wersji aplikacji.” |
| potwierdzenie importu | „Zastąpić obecne ustawienia?” |
| usuwanie wszystkiego | „Usunąć wszystkie dane z tego urządzenia? Ustawienia wrócą do domyślnych.” |

## Plany

### 11-01 · Warstwa zapisu i dzienny licznik

**Fala 1** · zależy od: Faza 10 · wymagania: REQ-71, REQ-72 · autonomiczny: tak

1. **Bezpieczny magazyn** · `src/storage/safeStorage.ts`
   - Działanie: try/catch; zapas w pamięci, gdy localStorage jest niedostępny.
   - Gotowe gdy: wyjątek z localStorage nigdy nie przerywa zabawy.
2. **Zapis ustawień** · `src/storage/settings.ts`, `src/settings/store.tsx`
   - Działanie:
     - wczytanie przy starcie i zapis z opóźnieniem po każdej zmianie;
     - przełącznik „Zapamiętuj ustawienia na tym urządzeniu” (domyślnie włączony); wyłączenie usuwa `child-bath.settings` i przechodzi w tryb sesji.
   - Gotowe gdy: po przeładowaniu ustawienia są zachowane.
3. **Migracje** · `src/storage/migrations.ts`
   - Działanie: `migrate()` z testem przejścia ze sztucznego schematu 0; uszkodzone dane dają ustawienia domyślne, bez błędu.
   - Gotowe gdy: uszkodzony wpis nie blokuje startu.
4. **Dzienny licznik** · `src/storage/playtime.ts`, `src/hooks/useDailyPlaytime.ts`
   - Działanie:
     - przeniesienie licznika z Fazy 10 do `child-bath.playtime`;
     - przy innej dacie licznik startuje od zera;
     - „Wyzeruj dzisiejszy licznik” ustawia `ms = 0`.
   - Gotowe gdy: licznik przetrwa przeładowanie i zeruje się następnego dnia.
5. **Testy** · `tests/unit/storage.spec.ts`, `tests/e2e/storage.spec.ts`
   - Działanie:
     - migracje i sanityzacja;
     - przeładowanie zachowuje ustawienia, a wyłączony zapis je usuwa;
     - zmiana dnia (`page.clock`) zeruje licznik;
     - uszkodzony JSON w localStorage → ustawienia domyślne.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** zapis domyślnie włączony · licznik z datą · awaria magazynu nie wpływa na zabawę.

### 11-02 · Kopia ustawień i usuwanie danych

**Fala 2** · zależy od: 11-01 · wymagania: REQ-73, REQ-75 · autonomiczny: tak

1. **Eksport** · `src/storage/backup.ts`, `src/components/parent/DataSection.tsx`
   - Działanie:
     - „Zapisz ustawienia” pobiera plik `mala-lazienka-ustawienia-RRRR-MM-DD.json` (Blob i `a[download]`);
     - „Skopiuj ustawienia” kopiuje tekst do schowka;
     - plik zawiera tylko `format`, `version` i ustawienia, bez imienia, statystyk i licznika.
   - Gotowe gdy: wyeksportowany plik nie zawiera `childName`.
2. **Import** · `src/storage/backup.ts`, `DataSection.tsx`
   - Działanie:
     - „Wczytaj ustawienia” z pliku (`accept=".json"`) albo z wklejonego tekstu (iOS Safari ogranicza pobieranie);
     - walidacja (100 KB, format, wersja), sanityzacja (nieznane id pomijane, brakujące wartości domyślne);
     - potwierdzenie „Zastąpić obecne ustawienia?”, a po imporcie bieżące imię zostaje.
   - Gotowe gdy: błędny plik niczego nie zmienia i pokazuje komunikat po polsku.
3. **Usuwanie danych** · `DataSection.tsx`
   - Działanie: „Usuń wszystkie dane z urządzenia” usuwa klucze `child-bath.*` i przywraca domyślne ustawienia w pamięci; zabawa trwa dalej.
   - Gotowe gdy: po przeładowaniu aplikacja startuje jak przy pierwszym uruchomieniu.
4. **Testy** · `tests/unit/backup.spec.ts`, `tests/e2e/backup.spec.ts`
   - Działanie:
     - eksport, a potem import przywraca identyczne ustawienia (poza imieniem);
     - cztery typy błędów; anulowanie potwierdzenia niczego nie zmienia;
     - wklejony tekst działa tak samo jak plik.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** kopia ustawień bez danych osobowych · import zawsze z potwierdzeniem · pełne usunięcie danych.

### 11-03 · Statystyki

**Fala 2** · zależy od: 11-01 · wymagania: REQ-74 · autonomiczny: tak

1. **Moduł statystyk** · `src/storage/stats.ts`
   - Działanie:
     - port modelu `analytics.js`: koszyki dzienne z 90 dni, suma od początku, liczba dni;
     - sesja kończy się po zamknięciu albo po 30 minutach ukrycia karty; identyfikator sesji tylko w pamięci;
     - aktywny czas: karta widoczna i interakcja mniej niż 60 s temu; zapis co 5 s i przy ukryciu karty;
     - nieznane pola przy wczytaniu są odrzucane.
   - Gotowe gdy: uszkodzone statystyki są odbudowywane bez błędu.
2. **Zbieranie** · `src/game.ts`, `src/App.tsx`
   - Działanie: `recordBath` na końcu `to_bench`, start sesji przy uruchomieniu, aktywny czas z zegara widoczności.
   - Gotowe gdy: ukończona kąpiel zwiększa licznik dokładnie o 1.
3. **Widok w panelu** · `src/components/parent/StatsView.tsx`
   - Działanie:
     - filtry: ta sesja, dziś, 7 dni, 30 dni, cały czas;
     - czas zabawy (minuty), ukończone kąpiele, ranking 10 najczęściej kąpanych zwierzątek z miniaturami;
     - „Eksportuj statystyki” (plik albo schowek) i „Wyzeruj statystyki” z potwierdzeniem.
   - Gotowe gdy: liczby są widoczne tylko w panelu, nigdy w strefach dziecka.
4. **Testy** · `tests/unit/stats.spec.ts`, `tests/e2e/stats.spec.ts`
   - Działanie:
     - agregacja, usuwanie dni starszych niż 90, odporność na uszkodzony JSON;
     - kąpiel → wzrost licznika i rankingu; zerowanie; eksport;
     - test zero-network podczas kąpieli, eksportu, importu i usuwania danych.
   - Gotowe gdy: testy przechodzą.

**Must-haves:** tylko agregaty, bez historii zdarzeń · statystyki widoczne wyłącznie dla rodzica · zero sieci.

## Weryfikacja fazy

- **Automatycznie:** testy `storage`, `backup`, `stats` (unit i e2e) i test zero-network.
- **Przegląd autora na telefonie:**
  - [ ] Ustawienia zostają po zamknięciu i ponownym otwarciu PWA.
  - [ ] Kopia ustawień działa na Androidzie (plik) i iPhonie (wklejenie tekstu).
  - [ ] Statystyki są czytelne i pokazują ulubione zwierzątka dziecka.
  - [ ] „Usuń wszystkie dane” przywraca stan jak przy pierwszym uruchomieniu.

## Kryteria sukcesu → sprawdzenie

| # | Kryterium (ROADMAP) | Jak sprawdzamy |
|---|---|---|
| 1 | Ustawienia i dzisiejszy czas zostają po ponownym otwarciu; następnego dnia licznik od zera | `storage.spec.ts` z `page.clock` |
| 2 | Zapis i wczytanie kopii odtwarza ustawienia; błędny plik nic nie zmienia; bez imienia | `backup.spec.ts` |
| 3 | Statystyki z filtrami, eksport i zerowanie | `stats.spec.ts` |
| 4 | Zero sieci; błąd magazynu nie przerywa zabawy | test zero-network + `storage.spec.ts` |

## Ryzyka i pułapki

- **Tryb prywatny Safari i brak miejsca:** `safeStorage` z zapasem w pamięci; aplikacja działa dalej, tylko bez zapisu.
- **Zmiana schematu w przyszłości:** numer schematu i migracje od pierwszej wersji.
- **Duży plik statystyk:** tylko agregaty z 90 dni, a mapy mają ograniczoną liczbę kluczy (jak w `analytics.js`).

## Przekazanie

- Faza 12 obejmuje sekcję „Dane” i „Statystyki” zrzutami referencyjnymi i listą kontrolną wydania (sprawdzenie zero sieci).

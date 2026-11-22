# PHASE-05: podsumowanie implementacji

Kod planów 05-01–05-04 jest w głównym katalogu projektu. Lokalna weryfikacja automatyczna przeszła. Do zamknięcia fazy pozostały GitHub Actions dla tych zmian i akceptacja autora na telefonie.

## Zakres

| Wymaganie | Realizacja i dowód |
|---|---|
| REQ-30 | Kapibara, Pingwinek i Wydra mają odrębne sylwetki, palety i stany kąpieli. `animals-bath.spec.ts` potwierdza ich pełną kąpiel. |
| REQ-31 | Diplodok, Triceratops, Stegozaur, Parazaurolof i T-Rex mają łuski i dopasowane maski. T-Rex ma pastelową paletę, zamknięty uśmiech bez zębów i krótkie, powoli machające łapki. `menagerie-controls.spec.ts` sprawdza każdy krok wszystkich pięciu w maksymalnie ośmiu ruchach automatycznych. |
| REQ-32 | Doszły Dalmatyńczyk, Jamnik, Pudel, Husky, Buldog oraz kotki: perski, syjamski i brytyjski. Każdy z sześciu psów ma cztery reakcje. Dalmatyńczyk ma siedem łat na kremowym tle, Pudel większe pompony, a kotek perski najgęstsze kępki spośród kotów. `roster.spec.ts` sprawdza palety, cechy i odrębność sylwetek. |

Rejestr liczy 36 postaci: 15 leśnych i wiejskich, 6 z dalekich stron, 6 psów, 4 koty i 5 dinozaurów. Testy obejmują komplet sześciu form imienia, rodzaj oraz macierz 36 × 11 ozdób z pięcioma kotwicami na postać. Zgodnie z [Wielkim słownikiem ortograficznym PWN](https://sjp.pwn.pl/so/husky;4442379.html) „Husky” pozostaje nieodmienne.

Walidacja wykluczeń grupowych i indywidualnych pilnuje minimalnej puli czterech postaci. T-Rexa lub całą grupę dinozaurów można wykluczyć testowo przez `?test=1&excludeAnimal=trex` albo `?test=1&excludeGroup=dinozaury`. Oba wykluczenia obowiązują przy pierwszym i kolejnych losowaniach. Panel rodzica i zapis ustawień nie są częścią tej fazy.

## Przegląd

- Otwórz `?test=1&gallery=animals`. Filtr grup i przełącznik „Pokaż podpisy postaci” pozwalają porównać rasy bez podpowiedzi. `&group=dinozaury&animal=trex` wybiera dinozaury i podgląd T-Reksa.
- **Referencje:** `tests/visual/__screenshots__/`, 20 PNG z pięciu grup w stanach bez szalika, mokrym, po kąpieli i w szlafroku. Przykłady: [psy](../../tests/visual/__screenshots__/pieski-clean.png), [koty po kąpieli](../../tests/visual/__screenshots__/kotki-washed.png), [dinozaury](../../tests/visual/__screenshots__/dinozaury-clean.png).
- **Podgląd mobilny:** `artifacts/phase-05/trex-telefon.png` i `artifacts/phase-05/diplodok-kapiel.png` (emulacja Chromium 360 × 640).

## Wyniki

- `npm run typecheck` i `npm run build`: sukces, bez dodawania zależności ani zewnętrznych zasobów.
- `CI=1 PLAYWRIGHT_PREBUILT=1 npm test`: **271 zaliczonych, 1 pominięty** (wielodotyk na desktopie). Zaliczone są wszystkie 36 pełnych kąpieli na trzech profilach Chromium, IoU ≥ 0,97, kontrole bez sieci oraz porównanie 20 referencji bez ich aktualizacji. Artefakt `dist/` nie zmienił się podczas testów.
- [ ] Potwierdzić zielony przebieg GitHub Actions dla aktualnych zmian.
- [ ] Na fizycznym telefonie zaakceptować rozpoznawalność ras bez podpisów, łagodność T-Reksa, odmianę nazw i zrzuty galerii.
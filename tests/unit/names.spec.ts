import { expect, test } from "@playwright/test";
import { byGender, NAME_CASES, name } from "../../src/animals/names";
import { ANIMALS } from "../../src/animals/roster";

// Kolejność: rodzaj, mianownik, dopełniacz, celownik, biernik, narzędnik, miejscownik.
const EXPECTED = `m|Króliczek|Króliczka|Króliczkowi|Króliczka|Króliczkiem|Króliczku
m|Lisek|Liska|Liskowi|Liska|Liskiem|Lisku
m|Miś|Misia|Misiowi|Misia|Misiem|Misiu
m|Jeżyk|Jeżyka|Jeżykowi|Jeżyka|Jeżykiem|Jeżyku
f|Sówka|Sówki|Sówce|Sówkę|Sówką|Sówce
f|Wiewiórka|Wiewiórki|Wiewiórce|Wiewiórkę|Wiewiórką|Wiewiórce
m|Dachowiec|Dachowca|Dachowcowi|Dachowca|Dachowcem|Dachowcu
m|Labrador|Labradora|Labradorowi|Labradora|Labradorem|Labradorze
f|Żabka|Żabki|Żabce|Żabkę|Żabką|Żabce
m|Borsuk|Borsuka|Borsukowi|Borsuka|Borsukiem|Borsuku
m|Jelonek|Jelonka|Jelonkowi|Jelonka|Jelonkiem|Jelonku
f|Myszka|Myszki|Myszce|Myszkę|Myszką|Myszce
f|Kaczuszka|Kaczuszki|Kaczuszce|Kaczuszkę|Kaczuszką|Kaczuszce
f|Owieczka|Owieczki|Owieczce|Owieczkę|Owieczką|Owieczce
m|Prosiaczek|Prosiaczka|Prosiaczkowi|Prosiaczka|Prosiaczkiem|Prosiaczku
m|Żółwik|Żółwika|Żółwikowi|Żółwika|Żółwikiem|Żółwiku
m|Lew|Lwa|Lwu|Lwa|Lwem|Lwie
m|Słoń|Słonia|Słoniowi|Słonia|Słoniem|Słoniu
f|Panda|Pandy|Pandzie|Pandę|Pandą|Pandzie
m|Koala|Koali|Koali|Koalę|Koalą|Koali`;

test("odmiana 20 imion w sześciu przypadkach i zgodność rodzaju czasownika", () => {
  expect(ANIMALS.map((animal) => [animal.rodzaj, ...NAME_CASES.map((variant) => name(animal, variant))].join("|")).join("\n")).toBe(EXPECTED);
  for (const def of ANIMALS) {
    expect(byGender(def, { m: "skakał", f: "skakała", n: "skakało" })).toBe(def.rodzaj === "f" ? "skakała" : "skakał");
  }
  expect(byGender({ rodzaj: "n" }, { m: "czysty", f: "czysta", n: "czyste" })).toBe("czyste");
});
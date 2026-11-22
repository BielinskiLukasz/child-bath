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
m|Koala|Koali|Koali|Koalę|Koalą|Koali
f|Kapibara|Kapibary|Kapibarze|Kapibarę|Kapibarą|Kapibarze
m|Pingwinek|Pingwinka|Pingwinkowi|Pingwinka|Pingwinkiem|Pingwinku
f|Wydra|Wydry|Wydrze|Wydrę|Wydrą|Wydrze
m|Diplodok|Diplodoka|Diplodokowi|Diplodoka|Diplodokiem|Diplodoku
m|Triceratops|Triceratopsa|Triceratopsowi|Triceratopsa|Triceratopsem|Triceratopsie
m|Stegozaur|Stegozaura|Stegozaurowi|Stegozaura|Stegozaurem|Stegozaurze
m|Parazaurolof|Parazaurolofa|Parazaurolofowi|Parazaurolofa|Parazaurolofem|Parazaurolofie
m|T-Rex|T-Reksa|T-Reksowi|T-Reksa|T-Reksem|T-Reksie
m|Dalmatyńczyk|Dalmatyńczyka|Dalmatyńczykowi|Dalmatyńczyka|Dalmatyńczykiem|Dalmatyńczyku
m|Jamnik|Jamnika|Jamnikowi|Jamnika|Jamnikiem|Jamniku
m|Pudel|Pudla|Pudlowi|Pudla|Pudlem|Pudlu
m|Husky|Husky|Husky|Husky|Husky|Husky
m|Buldog|Buldoga|Buldogowi|Buldoga|Buldogiem|Buldogu
m|Kotek perski|Kotka perskiego|Kotkowi perskiemu|Kotka perskiego|Kotkiem perskim|Kotku perskim
m|Kotek syjamski|Kotka syjamskiego|Kotkowi syjamskiemu|Kotka syjamskiego|Kotkiem syjamskim|Kotku syjamskim
m|Kotek brytyjski|Kotka brytyjskiego|Kotkowi brytyjskiemu|Kotka brytyjskiego|Kotkiem brytyjskim|Kotku brytyjskim`;

test("odmiana 36 imion w sześciu przypadkach i zgodność rodzaju czasownika", () => {
  expect(ANIMALS.map((animal) => [animal.rodzaj, ...NAME_CASES.map((variant) => name(animal, variant))].join("|")).join("\n")).toBe(EXPECTED);
  for (const def of ANIMALS) {
    expect(byGender(def, { m: "skakał", f: "skakała", n: "skakało" })).toBe(def.rodzaj === "f" ? "skakała" : "skakał");
  }
  expect(byGender({ rodzaj: "n" }, { m: "czysty", f: "czysta", n: "czyste" })).toBe("czyste");
});
import type { AnimalDef, AnimalId, NameForms, Rodzaj } from "./types";

export const NAME_CASES = ["mian", "dop", "cel", "bier", "narz", "miejsc"] as const;
export type NameCase = (typeof NAME_CASES)[number];

type Entry = [Rodzaj, ...[string, string, string, string, string, string]];
const FORMS: Record<AnimalId, Entry> = {
  rabbit: ["m", "Króliczek", "Króliczka", "Króliczkowi", "Króliczka", "Króliczkiem", "Króliczku"],
  fox: ["m", "Lisek", "Liska", "Liskowi", "Liska", "Liskiem", "Lisku"],
  bear: ["m", "Miś", "Misia", "Misiowi", "Misia", "Misiem", "Misiu"],
  hedgehog: ["m", "Jeżyk", "Jeżyka", "Jeżykowi", "Jeżyka", "Jeżykiem", "Jeżyku"],
  owl: ["f", "Sówka", "Sówki", "Sówce", "Sówkę", "Sówką", "Sówce"],
  squirrel: ["f", "Wiewiórka", "Wiewiórki", "Wiewiórce", "Wiewiórkę", "Wiewiórką", "Wiewiórce"],
  dachowiec: ["m", "Dachowiec", "Dachowca", "Dachowcowi", "Dachowca", "Dachowcem", "Dachowcu"],
  labrador: ["m", "Labrador", "Labradora", "Labradorowi", "Labradora", "Labradorem", "Labradorze"],
  frog: ["f", "Żabka", "Żabki", "Żabce", "Żabkę", "Żabką", "Żabce"],
  badger: ["m", "Borsuk", "Borsuka", "Borsukowi", "Borsuka", "Borsukiem", "Borsuku"],
  deer: ["m", "Jelonek", "Jelonka", "Jelonkowi", "Jelonka", "Jelonkiem", "Jelonku"],
  mouse: ["f", "Myszka", "Myszki", "Myszce", "Myszkę", "Myszką", "Myszce"],
  duck: ["f", "Kaczuszka", "Kaczuszki", "Kaczuszce", "Kaczuszkę", "Kaczuszką", "Kaczuszce"],
  sheep: ["f", "Owieczka", "Owieczki", "Owieczce", "Owieczkę", "Owieczką", "Owieczce"],
  pig: ["m", "Prosiaczek", "Prosiaczka", "Prosiaczkowi", "Prosiaczka", "Prosiaczkiem", "Prosiaczku"],
  turtle: ["m", "Żółwik", "Żółwika", "Żółwikowi", "Żółwika", "Żółwikiem", "Żółwiku"],
  lion: ["m", "Lew", "Lwa", "Lwu", "Lwa", "Lwem", "Lwie"],
  elephant: ["m", "Słoń", "Słonia", "Słoniowi", "Słonia", "Słoniem", "Słoniu"],
  panda: ["f", "Panda", "Pandy", "Pandzie", "Pandę", "Pandą", "Pandzie"],
  koala: ["m", "Koala", "Koali", "Koali", "Koalę", "Koalą", "Koali"],
  capybara: ["f", "Kapibara", "Kapibary", "Kapibarze", "Kapibarę", "Kapibarą", "Kapibarze"],
  penguin: ["m", "Pingwinek", "Pingwinka", "Pingwinkowi", "Pingwinka", "Pingwinkiem", "Pingwinku"],
  otter: ["f", "Wydra", "Wydry", "Wydrze", "Wydrę", "Wydrą", "Wydrze"],
  diplodocus: ["m", "Diplodok", "Diplodoka", "Diplodokowi", "Diplodoka", "Diplodokiem", "Diplodoku"],
  triceratops: ["m", "Triceratops", "Triceratopsa", "Triceratopsowi", "Triceratopsa", "Triceratopsem", "Triceratopsie"],
  stegosaurus: ["m", "Stegozaur", "Stegozaura", "Stegozaurowi", "Stegozaura", "Stegozaurem", "Stegozaurze"],
  parasaurolophus: ["m", "Parazaurolof", "Parazaurolofa", "Parazaurolofowi", "Parazaurolofa", "Parazaurolofem", "Parazaurolofie"],
  trex: ["m", "T-Rex", "T-Reksa", "T-Reksowi", "T-Reksa", "T-Reksem", "T-Reksie"],
  dalmatian: ["m", "Dalmatyńczyk", "Dalmatyńczyka", "Dalmatyńczykowi", "Dalmatyńczyka", "Dalmatyńczykiem", "Dalmatyńczyku"],
  dachshund: ["m", "Jamnik", "Jamnika", "Jamnikowi", "Jamnika", "Jamnikiem", "Jamniku"],
  poodle: ["m", "Pudel", "Pudla", "Pudlowi", "Pudla", "Pudlem", "Pudlu"],
  // PWN, Wielki słownik ortograficzny: „husky (pies) ndm”.
  husky: ["m", "Husky", "Husky", "Husky", "Husky", "Husky", "Husky"],
  bulldog: ["m", "Buldog", "Buldoga", "Buldogowi", "Buldoga", "Buldogiem", "Buldogu"],
  persian: ["m", "Kotek perski", "Kotka perskiego", "Kotkowi perskiemu", "Kotka perskiego", "Kotkiem perskim", "Kotku perskim"],
  siamese: ["m", "Kotek syjamski", "Kotka syjamskiego", "Kotkowi syjamskiemu", "Kotka syjamskiego", "Kotkiem syjamskim", "Kotku syjamskim"],
  british: ["m", "Kotek brytyjski", "Kotka brytyjskiego", "Kotkowi brytyjskiemu", "Kotka brytyjskiego", "Kotkiem brytyjskim", "Kotku brytyjskim"],
};

export function grammarFor(id: AnimalId): { rodzaj: Rodzaj; names: NameForms } {
  const [rodzaj, mian, dop, cel, bier, narz, miejsc] = FORMS[id];
  return { rodzaj, names: { mian, dop, cel, bier, narz, miejsc } };
}

export function name(def: Pick<AnimalDef, "names">, nameCase: NameCase = "mian"): string {
  return def.names[nameCase];
}

export function byGender<T>(def: Pick<AnimalDef, "rodzaj">, variants: Record<Rodzaj, T>): T {
  return variants[def.rodzaj];
}
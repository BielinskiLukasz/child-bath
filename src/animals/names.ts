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
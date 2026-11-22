import type { AnimalDef, AnimalGroup, AnimalId, Okrywa, ReactionKind } from "./types";

type Traits = Pick<AnimalDef, "group" | "okrywa" | "reactions" | "scarf">;
const farm = (okrywa: Okrywa, scarf: Traits["scarf"], ...reactions: ReactionKind[]): Traits => ({ group: "wiejskie", okrywa, scarf, reactions });
const visitor = (okrywa: Okrywa, ...reactions: ReactionKind[]): Traits => ({ group: "dalekie", okrywa, scarf: 3, reactions });
const dino = (scarf: Traits["scarf"], ...reactions: ReactionKind[]): Traits => ({ group: "dinozaury", okrywa: "luski", scarf, reactions });
const dog = (scarf: Traits["scarf"], okrywa: Okrywa = "futro"): Traits => ({
  group: "pieski", okrywa, scarf, reactions: ["tailWag", "shake", "stretch", "smileClosed"],
});
const cat = (scarf: Traits["scarf"], ...reactions: ReactionKind[]): Traits => ({ group: "kotki", okrywa: "futro", scarf, reactions });

export const TRAITS: Record<AnimalId, Traits> = {
  rabbit: farm("futro", 0, "fluff", "squint", "armWave"),
  fox: farm("futro", 1, "tailWag", "fluff", "smileClosed"),
  bear: farm("futro", 3, "stretch", "fluff", "yawn", "smileClosed"),
  hedgehog: farm("kolce", 3, "shine", "squint"),
  owl: farm("piora", 3, "ruffle", "wingFan", "squint", "yawn"),
  squirrel: farm("futro", 1, "tailWag", "fluff", "squint"),
  dachowiec: { group: "kotki", okrywa: "futro", scarf: 3, reactions: ["tailWag", "stretch", "squint", "yawn"] },
  labrador: dog(3),
  frog: farm("skora", 0, "pawSplash", "squint", "smileClosed", "shine"),
  badger: farm("futro", 3, "fluff", "squint"),
  deer: farm("futro", 3, "stretch", "fluff", "smileClosed"),
  mouse: farm("futro", 2, "fluff", "armWave", "squint"),
  duck: farm("piora", 1, "wingFan", "ruffle", "pawSplash", "smileClosed"),
  sheep: farm("welna", 2, "fluff", "stretch", "smileClosed"),
  pig: farm("skora", 3, "shine", "squint", "smileClosed"),
  turtle: farm("skorupa", 0, "shine", "squint", "armWave"),
  lion: visitor("futro", "fluff", "tailWag", "squint", "yawn"),
  elephant: visitor("skora", "shine", "armWave", "smileClosed"),
  panda: visitor("futro", "fluff", "stretch", "smileClosed"),
  koala: visitor("futro", "fluff", "yawn", "squint"),
  capybara: visitor("futro", "squint", "smileClosed", "stretch"),
  penguin: { ...visitor("piora", "wingFan", "ruffle", "smileClosed"), scarf: 1 },
  otter: farm("futro", 1, "pawSplash", "fluff", "smileClosed"),
  diplodocus: dino(2, "shine", "smileClosed", "stretch"),
  triceratops: dino(1, "shine", "squint", "smileClosed"),
  stegosaurus: dino(3, "shine", "smileClosed", "stretch"),
  parasaurolophus: dino(2, "shine", "squint", "smileClosed"),
  trex: dino(1, "armWave", "smileClosed", "shine"),
  dalmatian: dog(2),
  dachshund: dog(0),
  poodle: dog(2, "welna"),
  husky: dog(1),
  bulldog: dog(3),
  persian: cat(2, "fluff", "squint", "smileClosed"),
  siamese: cat(1, "tailWag", "stretch", "squint"),
  british: cat(0, "fluff", "smileClosed", "yawn"),
};

export const ANIMAL_GROUPS: Record<AnimalGroup, string> = {
  wiejskie: "Leśne i wiejskie", dalekie: "Z dalekich stron", pieski: "Pieski", kotki: "Kotki", dinozaury: "Dinozaury",
};
export const isAnimalGroup = (value: unknown): value is AnimalGroup =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(ANIMAL_GROUPS, value);

export const COAT_LABELS: Record<Okrywa, string> = {
  futro: "Futro", welna: "Wełna", piora: "Pióra", kolce: "Kolce", skora: "Skóra", luski: "Łuski", skorupa: "Skorupa",
};

export const finishingAction = (coat: Okrywa): "comb" | "pet" => coat === "futro" || coat === "welna" ? "comb" : "pet";
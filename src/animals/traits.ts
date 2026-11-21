import type { AnimalDef, AnimalGroup, AnimalId, Okrywa, ReactionKind } from "./types";

type Traits = Pick<AnimalDef, "group" | "okrywa" | "reactions" | "scarf">;
const farm = (okrywa: Okrywa, scarf: Traits["scarf"], ...reactions: ReactionKind[]): Traits => ({ group: "wiejskie", okrywa, scarf, reactions });
const visitor = (okrywa: Okrywa, ...reactions: ReactionKind[]): Traits => ({ group: "dalekie", okrywa, scarf: 3, reactions });

export const TRAITS: Record<AnimalId, Traits> = {
  rabbit: farm("futro", 0, "fluff", "squint", "armWave"),
  fox: farm("futro", 1, "tailWag", "fluff", "smileClosed"),
  bear: farm("futro", 3, "stretch", "fluff", "yawn", "smileClosed"),
  hedgehog: farm("kolce", 3, "shine", "squint"),
  owl: farm("piora", 3, "ruffle", "wingFan", "squint", "yawn"),
  squirrel: farm("futro", 1, "tailWag", "fluff", "squint"),
  dachowiec: { group: "kotki", okrywa: "futro", scarf: 3, reactions: ["tailWag", "stretch", "squint", "yawn"] },
  labrador: { group: "pieski", okrywa: "futro", scarf: 3, reactions: ["tailWag", "shake", "stretch", "smileClosed"] },
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
};

export const ANIMAL_GROUPS: Record<AnimalGroup, string> = {
  wiejskie: "Leśne i wiejskie", dalekie: "Z dalekich stron", pieski: "Pieski", kotki: "Kotki", dinozaury: "Dinozaury",
};

export const COAT_LABELS: Record<Okrywa, string> = {
  futro: "Futro", welna: "Wełna", piora: "Pióra", kolce: "Kolce", skora: "Skóra", luski: "Łuski", skorupa: "Skorupa",
};

export const finishingAction = (coat: Okrywa): "comb" | "pet" => coat === "futro" || coat === "welna" ? "comb" : "pet";
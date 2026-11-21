import { createRng } from "../random";
import { grammarFor } from "./names";
import { familiar } from "./species/familiar";
import { visitors } from "./species/visitors";
import { woodland } from "./species/woodland";
import { TRAITS } from "./traits";
import { ANIMAL_IDS, type AnimalDef, type AnimalId, type AnimalRig } from "./types";

const RIGS: Record<AnimalId, AnimalRig> = { ...woodland, ...familiar, ...visitors };

export const ANIMALS: readonly AnimalDef[] = ANIMAL_IDS.map((id) => ({
  id, ...RIGS[id], ...grammarFor(id), ...TRAITS[id],
}));
export const ANIMALS_BY_ID = Object.fromEntries(ANIMALS.map((def) => [def.id, def])) as Readonly<Record<AnimalId, AnimalDef>>;

export function isAnimalId(value: string | null): value is AnimalId {
  return value !== null && Object.prototype.hasOwnProperty.call(ANIMALS_BY_ID, value);
}

/** A seeded draw from all eligible animals, avoiding a retry and immediate repetitions. */
export function pickAnimal(seed: number, previous?: AnimalId): AnimalDef {
  const offset = previous === undefined ? -1 : ANIMAL_IDS.indexOf(previous);
  const index = createRng(seed).int(0, ANIMALS.length - (offset < 0 ? 1 : 2));
  return ANIMALS[offset >= 0 && index >= offset ? index + 1 : index];
}
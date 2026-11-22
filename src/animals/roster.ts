import { createRng } from "../random";
import { grammarFor } from "./names";
import { british } from "./species/british";
import { bulldog } from "./species/bulldog";
import { capybara } from "./species/capybara";
import { dachshund } from "./species/dachshund";
import { dalmatian } from "./species/dalmatian";
import { diplodocus } from "./species/diplodocus";
import { familiar } from "./species/familiar";
import { husky } from "./species/husky";
import { otter } from "./species/otter";
import { parasaurolophus } from "./species/parasaurolophus";
import { penguin } from "./species/penguin";
import { persian } from "./species/persian";
import { poodle } from "./species/poodle";
import { siamese } from "./species/siamese";
import { stegosaurus } from "./species/stegosaurus";
import { trex } from "./species/trex";
import { triceratops } from "./species/triceratops";
import { visitors } from "./species/visitors";
import { woodland } from "./species/woodland";
import { TRAITS } from "./traits";
import { ANIMAL_IDS, type AnimalDef, type AnimalId, type AnimalRig } from "./types";

const RIGS: Record<AnimalId, AnimalRig> = {
  ...woodland, ...familiar, ...visitors,
  capybara, penguin, otter, diplodocus, triceratops, stegosaurus, parasaurolophus, trex,
  dalmatian, dachshund, poodle, husky, bulldog, persian, siamese, british,
};

export const ANIMALS: readonly AnimalDef[] = ANIMAL_IDS.map((id) => ({
  id, ...RIGS[id], ...grammarFor(id), ...TRAITS[id],
}));
export const ANIMALS_BY_ID = Object.fromEntries(ANIMALS.map((def) => [def.id, def])) as Readonly<Record<AnimalId, AnimalDef>>;

export function isAnimalId(value: string | null): value is AnimalId {
  return value !== null && Object.prototype.hasOwnProperty.call(ANIMALS_BY_ID, value);
}

/** A seeded draw from all eligible animals, avoiding a retry and immediate repetitions. */
export function pickAnimal(seed: number, previous?: AnimalId, allowed: readonly AnimalId[] = ANIMAL_IDS): AnimalDef {
  const eligible = ANIMALS.filter(({ id }) => id !== previous && allowed.includes(id));
  return createRng(seed).pick(eligible);
}
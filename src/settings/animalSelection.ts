import { ANIMALS, isAnimalId } from "../animals/roster";
import { isAnimalGroup } from "../animals/traits";
import type { AnimalId } from "../animals/types";

const MIN_ANIMALS = 4;
type SelectionError = "unknown-animal" | "unknown-group" | "too-few-animals";
type AnimalSelection = { valid: true; allowedAnimals: readonly AnimalId[] } | { valid: false; reason: SelectionError };

/** Validate a group and individual exclusion list before it is saved or used for a draw. */
export function validateAnimalExclusions(excludedAnimals: readonly string[], excludedGroups: readonly string[]): AnimalSelection {
  if (!excludedAnimals.every(isAnimalId)) return { valid: false, reason: "unknown-animal" };
  if (!excludedGroups.every(isAnimalGroup)) return { valid: false, reason: "unknown-group" };

  const allowedAnimals = ANIMALS.filter(({ id, group }) => !excludedAnimals.includes(id) && !excludedGroups.includes(group)).map(({ id }) => id);
  return allowedAnimals.length >= MIN_ANIMALS ? { valid: true, allowedAnimals } : { valid: false, reason: "too-few-animals" };
}
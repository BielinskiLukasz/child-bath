import type { BathPhase } from "../game";
import type { StepKind } from "../bath/steps";
import { decorAnchor } from "./anchors";
import type { AnimalDef, Hex } from "./types";

export const ANIMAL_STATES = ["scarf", "dirty", "clean", "wet", "washed", "robe", "turban"] as const;
export type AnimalState = (typeof ANIMAL_STATES)[number];

export const STATE_LABELS: Record<AnimalState, string> = {
  scarf: "W szaliku", dirty: "Przed kąpielą", clean: "Bez szalika", wet: "Po spłukaniu", washed: "Po kąpieli",
  robe: "W szlafroku", turban: "W turbanie",
};

export const SCARF_COLORS: readonly Hex[] = ["#a3b8a1", "#799fa3", "#b3a2bd", "#bf8869"];
const TOWELS: readonly Hex[] = ["#dfbc70", "#a5bbae", "#d4a38c"];
export const towelColor = (def: AnimalDef): Hex => TOWELS[def.scarf % TOWELS.length];

export function animalBathState(phase: BathPhase, step: StepKind, def: AnimalDef, turn: number): AnimalState {
  if (phase === "door_waiting" || phase === "arriving") return "scarf";
  if (phase === "reward") return "washed";
  if (phase === "to_bench") return turn % 2 === 0 && decorAnchor(def, "towel_turban") ? "turban" : "robe";
  return step === "rinse" || step === "dry" ? "wet" : step === "scrub" ? "dirty" : "clean";
}
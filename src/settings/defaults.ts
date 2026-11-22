import { ANIMAL_IDS, type AnimalId } from "../animals/types";
import { CLASSIC_STEPS, type EaseKey, type StepKind } from "../bath/steps";
import { SCENERY_IDS, type SceneryId } from "../world/scenery";
import type { Season, TimeOfDay, Weather } from "../world/atmosphere";

export const PACES = [1.45, 1.2, 1, 0.8] as const;
export type BathPace = (typeof PACES)[number];
type Slots = readonly [string, string, string];

/** Kontrakt ustawień z PROJECT.md 12.4. W Fazie 3 używamy tylko ustawień sterowania i rytuału roboczego. */
export interface BathSettings {
  childName: string;
  allowedAnimals: readonly AnimalId[];
  allowedSceneries: readonly SceneryId[];
  allowedDirt: readonly string[];
  planner: { animals: Slots; scenery: string; dirt: Slots };
  weights: Readonly<Record<string, 1 | 2 | 3>>;
  ritual: { preset: "short" | "classic" | "lather" | "spa" | "custom"; steps: readonly StepKind[] };
  ease: EaseKey;
  oneButton: boolean;
  extendedTouch: boolean;
  pace: BathPace;
  weatherOverride: "auto" | Weather;
  timeOverride: "auto" | TimeOfDay;
  seasonOverride: "auto" | Season;
  showNarration: boolean;
  showSteps: boolean;
  roundsBeforeRest: number;
  dailyLimitMin: number | null;
  persist: boolean;
}

export const DEFAULT_BATH_SETTINGS: Readonly<BathSettings> = {
  childName: "dziecka",
  allowedAnimals: ANIMAL_IDS, allowedSceneries: SCENERY_IDS, allowedDirt: [],
  planner: { animals: ["random", "random", "random"], scenery: "random", dirt: ["random", "random", "random"] },
  weights: {}, ritual: { preset: "classic", steps: CLASSIC_STEPS },
  ease: "normal", oneButton: false, extendedTouch: false, pace: 1,
  weatherOverride: "auto", timeOverride: "auto", seasonOverride: "auto",
  showNarration: true, showSteps: true, roundsBeforeRest: 4, dailyLimitMin: 20, persist: true,
};

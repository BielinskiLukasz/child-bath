import { isAnimalId } from "../animals/roster";
import type { AnimalId } from "../animals/types";
import { isEaseKey, type EaseKey, type StepKind } from "../bath/steps";
import { MAX_SEED, randomSeed } from "../random";
import { validateAnimalExclusions } from "./animalSelection";
import { DEFAULT_BATH_SETTINGS, PACES, type BathPace } from "./defaults";
import { isTestMode } from "./testMode";
import { SEASONS, TIMES_OF_DAY, WEATHER_TYPES } from "../world/atmosphere";
import { isSceneryId, type SceneryId } from "../world/scenery";
import type { WorldOverrides } from "../world/worldClock";

export interface SessionParams {
  seed: number;
  ease: EaseKey;
  pace: BathPace;
  steps: readonly StepKind[];
  oneButton: boolean;
  animal?: AnimalId;
  allowedAnimals: readonly AnimalId[];
  world?: WorldOverrides;
  scenery?: SceneryId;
  still?: boolean;
}

const APPLY_LAYER_TEST: readonly StepKind[] = ["lather"];

function worldOverrides(query: URLSearchParams): WorldOverrides | undefined {
  const time = TIMES_OF_DAY.find((value) => value === query.get("time"));
  const weather = WEATHER_TYPES.find((value) => value === query.get("weather"));
  const season = SEASONS.find((value) => value === query.get("season"));
  const hour = query.get("hour");
  const startHour = hour?.trim() && Number(hour) >= 0 && Number(hour) < 24 ? Number(hour) : undefined;
  return time || weather || season || startHour !== undefined ? { time, weather, season, hour: startHour } : undefined;
}

export function readSessionParams(search: string = window.location.search): SessionParams {
  const settings = DEFAULT_BATH_SETTINGS;
  const defaults: SessionParams = {
    seed: randomSeed(), ease: settings.ease, pace: settings.pace, steps: settings.ritual.steps, oneButton: settings.oneButton,
    allowedAnimals: settings.allowedAnimals,
  };
  if (!isTestMode(search)) return defaults;
  const query = new URLSearchParams(search);
  const seed = Number(query.get("seed"));
  const ease = query.get("ease");
  const pace = Number(query.get("pace"));
  const animal = query.get("animal");
  const excludedAnimals = query.getAll("excludeAnimal");
  const excludedGroups = query.getAll("excludeGroup");
  const selection = validateAnimalExclusions(excludedAnimals, excludedGroups);
  const allowedAnimals = selection.valid ? selection.allowedAnimals : defaults.allowedAnimals;
  const world = worldOverrides(query);
  const scenery = query.get("scenery");
  return {
    seed: Number.isInteger(seed) && seed > 0 && seed <= MAX_SEED ? seed : defaults.seed,
    ease: isEaseKey(ease) ? ease : defaults.ease,
    pace: PACES.find((value) => value === pace) ?? defaults.pace,
    steps: query.get("layer") === "apply" ? APPLY_LAYER_TEST : defaults.steps,
    oneButton: query.get("oneButton") === "1",
    allowedAnimals,
    ...(isAnimalId(animal) && allowedAnimals.includes(animal) ? { animal } : {}),
    ...(world ? { world } : {}),
    ...(isSceneryId(scenery) ? { scenery } : {}),
    ...(query.get("still") === "1" ? { still: true } : {}),
  };
}

import { isEaseKey, type EaseKey, type StepKind } from "../bath/steps";
import { MAX_SEED, randomSeed } from "../random";
import { DEFAULT_BATH_SETTINGS, PACES, type BathPace } from "./defaults";
import { isTestMode } from "./testMode";

export interface SessionParams {
  seed: number;
  ease: EaseKey;
  pace: BathPace;
  steps: readonly StepKind[];
  oneButton: boolean;
}

const APPLY_LAYER_TEST: readonly StepKind[] = ["lather"];

export function readSessionParams(search: string = window.location.search): SessionParams {
  const settings = DEFAULT_BATH_SETTINGS;
  const defaults: SessionParams = {
    seed: randomSeed(), ease: settings.ease, pace: settings.pace, steps: settings.ritual.steps, oneButton: settings.oneButton,
  };
  if (!isTestMode(search)) return defaults;
  const query = new URLSearchParams(search);
  const seed = Number(query.get("seed"));
  const ease = query.get("ease");
  const pace = Number(query.get("pace"));
  return {
    seed: Number.isInteger(seed) && seed > 0 && seed <= MAX_SEED ? seed : defaults.seed,
    ease: isEaseKey(ease) ? ease : defaults.ease,
    pace: PACES.find((value) => value === pace) ?? defaults.pace,
    steps: query.get("layer") === "apply" ? APPLY_LAYER_TEST : defaults.steps,
    oneButton: query.get("oneButton") === "1",
  };
}

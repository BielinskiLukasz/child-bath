import { CLASSIC_STEPS, isEaseKey, type EaseKey, type StepKind } from "../bath/steps";
import { MAX_SEED, randomSeed } from "../random";
import { isTestMode } from "./testMode";

export interface SessionParams {
  /** Ziarno sesji: kolejne zwierzątka i wzory warstw. */
  seed: number;
  ease: EaseKey;
  /** Mnożnik czasów przejść (1,45 / 1,2 / 1 / 0,8). */
  pace: number;
  steps: readonly StepKind[];
}

const PACES = [1.45, 1.2, 1, 0.8];
const APPLY_LAYER_TEST: readonly StepKind[] = ["lather"];

/** Bez ?test=1 obowiązuje rytuał klasyczny. layer=apply włącza tylko próbę silnika nakładania. */
export function readSessionParams(search: string = window.location.search): SessionParams {
  const defaults: SessionParams = { seed: randomSeed(), ease: "normal", pace: 1, steps: CLASSIC_STEPS };
  if (!isTestMode(search)) return defaults;
  const query = new URLSearchParams(search);
  const seed = Number(query.get("seed"));
  const ease = query.get("ease");
  const pace = Number(query.get("pace"));
  return {
    seed: Number.isInteger(seed) && seed > 0 && seed <= MAX_SEED ? seed : defaults.seed,
    ease: isEaseKey(ease) ? ease : defaults.ease,
    pace: PACES.includes(pace) ? pace : defaults.pace,
    steps: query.get("layer") === "apply" ? APPLY_LAYER_TEST : defaults.steps,
  };
}

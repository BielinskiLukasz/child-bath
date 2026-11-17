import { isEaseKey, type EaseKey } from "../bath/steps";
import { MAX_SEED, randomSeed } from "../random";
import { isTestMode } from "./testMode";

export interface SessionParams {
  /** Ziarno sesji: kolejne zwierzątka i wzory warstw. */
  seed: number;
  ease: EaseKey;
  /** Mnożnik czasów przejść (1,45 / 1,2 / 1 / 0,8). */
  pace: number;
}

const PACES = [1.45, 1.2, 1, 0.8];

/**
 * Parametry sesji. Bez ?test=1 zawsze wartości domyślne z losowym ziarnem; w trybie testowym
 * można je nadpisać: ?test=1&seed=7&ease=easy&pace=1.45. Od Fazy 10 domyślne ustawia rodzic.
 */
export function readSessionParams(search: string = window.location.search): SessionParams {
  const defaults: SessionParams = { seed: randomSeed(), ease: "normal", pace: 1 };
  if (!isTestMode(search)) return defaults;
  const query = new URLSearchParams(search);
  const seed = Number(query.get("seed"));
  const ease = query.get("ease");
  const pace = Number(query.get("pace"));
  return {
    seed: Number.isInteger(seed) && seed > 0 && seed <= MAX_SEED ? seed : defaults.seed,
    ease: isEaseKey(ease) ? ease : defaults.ease,
    pace: PACES.includes(pace) ? pace : defaults.pace,
  };
}

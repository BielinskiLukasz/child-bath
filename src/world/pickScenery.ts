import type { Rng } from "../random";
import type { Season, TimeOfDay, Weather } from "./atmosphere";
import { SCENERY_IDS, SCENERY_RULES, type SceneryId } from "./scenery";

export interface SceneDraw {
  allowed: readonly SceneryId[];
  season: Season;
  weather: Weather;
  time: TimeOfDay;
  pinned?: SceneryId;
  previous?: SceneryId;
  remaining?: readonly SceneryId[];
}

export function pickScenery(input: SceneDraw, rng: Rng): { id: SceneryId; remaining: SceneryId[] } {
  if (input.pinned) return { id: input.pinned, remaining: [...(input.remaining ?? SCENERY_IDS)] };
  const candidates = SCENERY_IDS.filter((id) => {
    const scene = SCENERY_RULES[id];
    return input.allowed.includes(id) && scene.seasons.includes(input.season) && !scene.avoidWeather?.includes(input.weather)
      && (!scene.times || scene.times.includes(input.time));
  });
  if (!candidates.length) return { id: "bathroom", remaining: [...(input.remaining ?? SCENERY_IDS)] };
  const alternatives = candidates.filter((id) => id !== input.previous);
  const eligible = alternatives.length ? alternatives : candidates;
  let remaining = [...(input.remaining ?? SCENERY_IDS)];
  let choices = eligible.filter((id) => remaining.includes(id));
  if (!choices.length) {
    remaining = [...SCENERY_IDS];
    choices = eligible;
  }
  const weighted = input.season === "winter" && choices.includes("mountain_tub") ? [...choices, "mountain_tub" as const] : choices;
  const id = rng.pick(weighted);
  return { id, remaining: remaining.filter((candidate) => candidate !== id) };
}
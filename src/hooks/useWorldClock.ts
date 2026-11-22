import { useCallback, useRef, useState } from "react";
import { createRng } from "../random";
import { TIMING, scaled } from "../timing";
import { timeOfDay } from "../world/atmosphere";
import { pickCompanions, type Companion } from "../world/companions";
import { pickScenery } from "../world/pickScenery";
import type { SceneryId } from "../world/scenery";
import { advanceWorldClock, createWorldClock, nextWorldRound, type WorldClock, type WorldOverrides } from "../world/worldClock";

export interface SceneRound { id: SceneryId; round: number; companions: readonly Companion[] }
interface View { current: SceneRound; outgoing?: SceneRound }
interface Options { seed: number; overrides?: WorldOverrides; allowed: readonly SceneryId[]; pinned?: SceneryId; pace: number }
interface State { clock: WorldClock; view: View; bag: readonly SceneryId[] }

function draw(options: Options, clock: WorldClock, previous?: State): State {
  const rng = createRng(options.seed ^ Math.imul(clock.round, 0x35fa2285));
  const { id, remaining } = pickScenery({
    allowed: options.allowed, pinned: options.pinned, previous: previous?.view.current.id, remaining: previous?.bag,
    season: clock.season, weather: clock.weather, time: timeOfDay(clock.hour),
  }, rng);
  return { clock, bag: remaining, view: { current: { id, round: clock.round, companions: pickCompanions(rng) }, outgoing: previous?.view.current } };
}

export function useWorldClock(options: Options) {
  const [initial] = useState(() => draw(options, createWorldClock(options.seed, options.overrides)));
  const state = useRef(initial);
  const [view, setView] = useState(initial.view);
  const fadeSeconds = Math.max(TIMING.sceneryFade, scaled(TIMING.sceneryFade, options.pace));
  const nextRound = useCallback(() => {
    if (state.current.view.outgoing) return false;
    state.current = draw(options, nextWorldRound(state.current.clock), state.current);
    setView(state.current.view);
    return true;
  }, [options]);

  const advance = useCallback((seconds: number, playing: boolean) => {
    const snapshot = state.current;
    snapshot.clock = advanceWorldClock(snapshot.clock, seconds, playing, !document.hidden);
    if (snapshot.view.outgoing && snapshot.clock.roundSeconds >= fadeSeconds) {
      snapshot.view = { current: snapshot.view.current };
      setView(snapshot.view);
    }
    return snapshot.clock;
  }, [fadeSeconds]);
  const read = useCallback(() => state.current.clock, []);
  return { view, nextRound, advance, read, fadeSeconds };
}
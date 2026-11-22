import { createRng } from "../random";
import { TIMING } from "../timing";
import type { AnimalDef, ReactionKind } from "./types";

export const REACTIONS = {
  fluff: { label: "Puszy futerko", seconds: 1.45 },
  ruffle: { label: "Stroszy piórka", seconds: 1.5 },
  tailWag: { label: "Porusza ogonkiem", seconds: 1.55 },
  squint: { label: "Mruży oczy", seconds: 1.5 },
  smileClosed: { label: "Uśmiecha się", seconds: 1.6 },
  yawn: { label: "Ziewa", seconds: 1.8 },
  stretch: { label: "Przeciąga się", seconds: 1.65 },
  pawSplash: { label: "Chlapie łapką", seconds: 1.6 },
  wingFan: { label: "Rozkłada skrzydła", seconds: 1.6 },
  shine: { label: "Łagodnie lśni", seconds: 1.65 },
  shake: { label: "Otrzepuje futerko", seconds: 1.8 },
  armWave: { label: "Macha łapką", seconds: 1.6 },
} as const satisfies Record<ReactionKind, { label: string; seconds: number }>;

export interface ReactionRun { kind: ReactionKind; seconds: number }
export const isFaceReaction = (kind: ReactionKind) => kind === "squint" || kind === "smileClosed";
export function reactionDuration(kind: ReactionKind, pace: number): number {
  return Math.max(TIMING.minReaction, REACTIONS[kind].seconds * pace);
}

export function rewardReaction(def: AnimalDef, seed: number, pace: number, reduced: boolean, evening = false): ReactionRun {
  const possible = reduced ? def.reactions.filter(isFaceReaction) : def.reactions.filter((kind) => evening || kind !== "yawn");
  const kind = possible.length ? createRng(seed ^ 0x6645ca81).pick(possible) : "squint";
  return { kind, seconds: reactionDuration(kind, pace) };
}

/** A single slot, advanced by the visibility-aware game clock. No pending queue. */
export function createReactionPlayer() {
  let left = 0;
  return {
    playReaction(kind: ReactionKind, pace = 1, reduced = false): ReactionRun | null {
      if (left > 0 || (reduced && !isFaceReaction(kind))) return null;
      left = reactionDuration(kind, pace);
      return { kind, seconds: left };
    },
    advance(dt: number): boolean {
      left = Math.max(0, left - dt);
      return left > 0;
    },
  };
}
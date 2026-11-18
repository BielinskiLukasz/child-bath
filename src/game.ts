import { EASE, type EaseKey, type StepKind } from "./bath/steps";
import { TIMING, fadeDuration, scaled } from "./timing";

/** Czysta maszyna faz. Czas i ziarno kolejnego zwierzątka przychodzą w akcjach. */
export type BathPhase = "door_waiting" | "arriving" | "stage_in" | "scrubbing" | "stage_rest" | "reward" | "to_bench";

export interface BathState {
  phase: BathPhase;
  steps: readonly StepKind[];
  stepIndex: number;
  progress: number;
  phaseT: number;
  layerReady: boolean;
  animalSeed: number;
  animalCount: number;
  threshold: number;
}

export type BathAction =
  | { type: "next" }
  | { type: "tick"; dt: number; pace: number; reduced: boolean; nextAnimalSeed: number }
  | { type: "progress"; value: number; finishStroke?: boolean }
  | { type: "layerReady" };

export function createBathState(steps: readonly StepKind[], seed: number, ease: EaseKey): BathState {
  if (steps.length === 0) throw new Error("Rytuał musi mieć co najmniej jeden krok.");
  return {
    phase: "door_waiting", steps: [...steps], stepIndex: 0, progress: 0, phaseT: 0,
    layerReady: false, animalSeed: seed, animalCount: 1, threshold: EASE[ease].threshold,
  };
}

export function currentStep(state: BathState): StepKind {
  return state.steps[state.stepIndex];
}

export function phaseDuration(phase: BathPhase, pace: number, reduced: boolean): number {
  switch (phase) {
    case "arriving": return fadeDuration(TIMING.arriving, pace);
    case "stage_in": return fadeDuration(TIMING.stageIn, pace);
    case "stage_rest": return reduced ? 0 : fadeDuration(TIMING.stageRest, pace);
    case "reward": return scaled(TIMING.reward, pace);
    case "to_bench": return fadeDuration(TIMING.toBench, pace);
    default: return Infinity;
  }
}

export function isTimed(state: BathState): boolean {
  if (state.phase === "stage_in") return state.layerReady;
  return state.phase !== "door_waiting" && state.phase !== "scrubbing";
}

function advance(state: BathState, nextAnimalSeed: number): BathState {
  switch (state.phase) {
    case "arriving": return { ...state, phase: "stage_in", phaseT: 0 };
    case "stage_in": return { ...state, phase: "scrubbing", phaseT: 0 };
    case "stage_rest":
      return state.stepIndex < state.steps.length - 1
        ? { ...state, phase: "stage_in", stepIndex: state.stepIndex + 1, progress: 0, phaseT: 0, layerReady: false }
        : { ...state, phase: "reward", phaseT: 0 };
    case "reward": return { ...state, phase: "to_bench", phaseT: 0 };
    case "to_bench":
      return {
        ...state, phase: "door_waiting", stepIndex: 0, progress: 0, phaseT: 0,
        layerReady: false, animalSeed: nextAnimalSeed, animalCount: state.animalCount + 1,
      };
    default: return state;
  }
}

export function bathReducer(state: BathState, action: BathAction): BathState {
  switch (action.type) {
    case "next":
      return state.phase === "door_waiting" ? { ...state, phase: "arriving", phaseT: 0 } : state;
    case "layerReady":
      return state.phase === "stage_in" && !state.layerReady ? { ...state, layerReady: true, phaseT: 0 } : state;
    case "progress": {
      if (state.phase !== "scrubbing" || !Number.isFinite(action.value)) return state;
      const value = Math.max(state.progress, Math.min(1, action.value));
      if (value >= state.threshold && action.finishStroke !== false) {
        return { ...state, progress: value, phase: "stage_rest", phaseT: 0 };
      }
      return value > state.progress ? { ...state, progress: value } : state;
    }
    case "tick": {
      if (!(action.dt > 0) || !Number.isFinite(action.dt) || !isTimed(state)) return state;
      const phaseT = state.phaseT + action.dt;
      return phaseT < phaseDuration(state.phase, action.pace, action.reduced)
        ? { ...state, phaseT }
        : advance(state, action.nextAnimalSeed);
    }
  }
}

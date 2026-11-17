/**
 * Reducer kąpieli, wersja 1 (PHASE-02, plan 02-02). Czysty: bez DOM, czasu systemowego i losowania.
 * Losowe ziarna przychodzą w akcjach (PROJECT.md, A3). Akcja niepasująca do bieżącej fazy jest
 * ignorowana, więc żadna faza nie nadpisuje innej (inaczej niż swap/wait w kapiel).
 *
 * stage_in (0,7 s, po layerReady) → scrubbing → stage_rest (0,5 s; 0 s przy ograniczonym ruchu)
 *   → następny krok albo reward (zaślepka 2 s) → done → newAnimal → stage_in.
 * Faza 3 dodaje zapowiedź i „Dalej”, Faza 8 ławeczkę i rundy.
 */
import { EASE, type EaseKey, type StepKind } from "./bath/steps";
import { TIMING, fadeDuration, scaled } from "./timing";

export type BathPhase = "stage_in" | "scrubbing" | "stage_rest" | "reward" | "done";

export interface BathState {
  phase: BathPhase;
  steps: readonly StepKind[];
  stepIndex: number;
  /** Postęp bieżącego kroku (0–1) z siatki pokrycia. */
  progress: number;
  /** Czas spędzony w bieżącej fazie (sekundy). */
  phaseT: number;
  /** Warstwa bieżącego kroku jest namalowana; dopiero wtedy biegnie stage_in. */
  layerReady: boolean;
  animalSeed: number;
  /** Numer zwierzątka w sesji (1, 2, 3…). */
  animalCount: number;
  /** Próg automatycznego domknięcia kroku z ustawienia łatwości. */
  threshold: number;
}

export type BathAction =
  | { type: "tick"; dt: number; pace: number; reduced: boolean }
  | { type: "progress"; value: number }
  | { type: "layerReady" }
  | { type: "newAnimal"; steps: readonly StepKind[]; seed: number; ease: EaseKey };

export function createBathState(steps: readonly StepKind[], seed: number, ease: EaseKey): BathState {
  if (steps.length === 0) throw new Error("Rytuał musi mieć co najmniej jeden krok.");
  return {
    phase: "stage_in",
    steps: [...steps],
    stepIndex: 0,
    progress: 0,
    phaseT: 0,
    layerReady: false,
    animalSeed: seed,
    animalCount: 1,
    threshold: EASE[ease].threshold,
  };
}

export function currentStep(state: BathState): StepKind {
  return state.steps[state.stepIndex];
}

/** Długość fazy w sekundach; fazy bez limitu czasu zwracają Infinity. */
export function phaseDuration(phase: BathPhase, pace: number, reduced: boolean): number {
  switch (phase) {
    case "stage_in":
      return fadeDuration(TIMING.stageIn, pace);
    case "stage_rest":
      return reduced ? 0 : fadeDuration(TIMING.stageRest, pace);
    case "reward":
      return scaled(TIMING.reward, pace);
    default:
      return Infinity;
  }
}

/** Czy zegar ma w tej chwili coś do odmierzania. */
export function isTimed(state: BathState): boolean {
  return state.phase === "stage_in" ? state.layerReady : state.phase === "stage_rest" || state.phase === "reward";
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function advance(state: BathState): BathState {
  switch (state.phase) {
    case "stage_in":
      return { ...state, phase: "scrubbing", phaseT: 0 };
    case "stage_rest":
      return state.stepIndex < state.steps.length - 1
        ? { ...state, phase: "stage_in", stepIndex: state.stepIndex + 1, progress: 0, phaseT: 0, layerReady: false }
        : { ...state, phase: "reward", phaseT: 0 };
    case "reward":
      return { ...state, phase: "done", phaseT: 0 };
    default:
      return state;
  }
}

export function bathReducer(state: BathState, action: BathAction): BathState {
  switch (action.type) {
    case "layerReady":
      return state.phase === "stage_in" && !state.layerReady ? { ...state, layerReady: true, phaseT: 0 } : state;

    case "progress": {
      if (state.phase !== "scrubbing" || !Number.isFinite(action.value)) return state;
      const value = clamp01(action.value);
      if (value <= state.progress) return state;
      if (value >= state.threshold) return { ...state, progress: value, phase: "stage_rest", phaseT: 0 };
      return { ...state, progress: value };
    }

    case "tick": {
      if (!(action.dt > 0) || !isTimed(state)) return state;
      const phaseT = state.phaseT + action.dt;
      if (phaseT < phaseDuration(state.phase, action.pace, action.reduced)) return { ...state, phaseT };
      return advance(state);
    }

    case "newAnimal":
      if (state.phase !== "done" || action.steps.length === 0) return state;
      return { ...createBathState(action.steps, action.seed, action.ease), animalCount: state.animalCount + 1 };

    default:
      return state;
  }
}

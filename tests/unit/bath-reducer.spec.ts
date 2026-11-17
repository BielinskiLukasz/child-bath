import { expect, test } from "@playwright/test";
import { CLASSIC_STEPS } from "../../src/bath/steps";
import { bathReducer, createBathState, type BathAction, type BathState } from "../../src/game";
import { TIMING } from "../../src/timing";

const tick = (dt: number, pace = 1, reduced = false): BathAction => ({ type: "tick", dt, pace, reduced });
const run = (state: BathState, actions: BathAction[]) => actions.reduce(bathReducer, state);
/** Tiki pokrywające dany czas z zapasem jednego tiku (bez kłopotów z sumowaniem 0,05). */
const ticksFor = (seconds: number, pace = 1, reduced = false, dt = 0.05) =>
  Array.from({ length: Math.ceil(seconds / dt) + 1 }, () => tick(dt, pace, reduced));

test("pełna sekwencja trzech kroków, nagroda i nowe zwierzątko", () => {
  let state = createBathState(CLASSIC_STEPS, 1, "normal");
  expect(state.phase).toBe("stage_in");

  // Bez namalowanej warstwy czas fazy stoi.
  state = run(state, ticksFor(2));
  expect(state).toMatchObject({ phase: "stage_in", phaseT: 0 });

  for (let index = 0; index < CLASSIC_STEPS.length; index++) {
    expect(state).toMatchObject({ phase: "stage_in", stepIndex: index, progress: 0 });
    state = bathReducer(state, { type: "layerReady" });
    state = run(state, ticksFor(TIMING.stageIn));
    expect(state.phase).toBe("scrubbing");

    state = bathReducer(state, { type: "progress", value: 0.5 });
    expect(state).toMatchObject({ phase: "scrubbing", progress: 0.5 });
    state = bathReducer(state, { type: "progress", value: 0.9 });
    expect(state.phase).toBe("stage_rest");
    state = run(state, ticksFor(TIMING.stageRest));
  }

  expect(state.phase).toBe("reward");
  state = run(state, ticksFor(TIMING.reward));
  expect(state.phase).toBe("done");

  state = bathReducer(state, { type: "newAnimal", steps: CLASSIC_STEPS, seed: 2, ease: "normal" });
  expect(state).toMatchObject({ phase: "stage_in", stepIndex: 0, animalSeed: 2, animalCount: 2, layerReady: false });
});

test("akcje niepasujące do fazy są ignorowane", () => {
  const start = createBathState(CLASSIC_STEPS, 1, "normal");
  expect(bathReducer(start, { type: "progress", value: 1 })).toBe(start);
  expect(bathReducer(start, { type: "newAnimal", steps: CLASSIC_STEPS, seed: 9, ease: "normal" })).toBe(start);

  const scrubbing = run(bathReducer(start, { type: "layerReady" }), ticksFor(TIMING.stageIn));
  expect(scrubbing.phase).toBe("scrubbing");
  expect(bathReducer(scrubbing, tick(5))).toBe(scrubbing);
  expect(bathReducer(scrubbing, { type: "layerReady" })).toBe(scrubbing);
  expect(bathReducer(scrubbing, { type: "progress", value: Number.NaN })).toBe(scrubbing);
});

test("odtworzenie tej samej listy akcji daje ten sam stan", () => {
  const actions: BathAction[] = [
    { type: "layerReady" },
    ...ticksFor(TIMING.stageIn),
    { type: "progress", value: 0.3 },
    { type: "progress", value: 0.95 },
    ...ticksFor(0.2),
  ];
  const a = run(createBathState(CLASSIC_STEPS, 5, "easy"), actions);
  const b = run(createBathState(CLASSIC_STEPS, 5, "easy"), actions);
  expect(a).toEqual(b);
});

test("tempo wydłuża przejścia, ale nie zmienia progu", () => {
  let state = bathReducer(createBathState(CLASSIC_STEPS, 1, "normal"), { type: "layerReady" });
  state = run(state, Array.from({ length: 15 }, () => tick(0.05, 1.45)));
  expect(state.phase).toBe("stage_in");
  state = run(state, Array.from({ length: 7 }, () => tick(0.05, 1.45)));
  expect(state.phase).toBe("scrubbing");
  expect(state.threshold).toBe(0.9);
  expect(bathReducer(state, { type: "progress", value: 0.89 }).phase).toBe("scrubbing");
});

test("łatwość ustala próg, a ograniczony ruch skraca zanik reszty do zera", () => {
  let state = createBathState(CLASSIC_STEPS, 1, "easy");
  state = run(bathReducer(state, { type: "layerReady" }), ticksFor(TIMING.stageIn));
  state = bathReducer(state, { type: "progress", value: 0.8 });
  expect(state.phase).toBe("stage_rest");
  state = bathReducer(state, tick(0.016, 1, true));
  expect(state).toMatchObject({ phase: "stage_in", stepIndex: 1 });
});

test("rytuał musi mieć co najmniej jeden krok", () => {
  expect(() => createBathState([], 1, "normal")).toThrow();
});

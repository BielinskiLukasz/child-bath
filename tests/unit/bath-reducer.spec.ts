import { expect, test } from "@playwright/test";
import { CLASSIC_STEPS, EASE, type EaseKey } from "../../src/bath/steps";
import { bathReducer, createBathState, phaseDuration, type BathAction, type BathState } from "../../src/game";
import { TIMING } from "../../src/timing";

const tick = (dt: number, pace = 1, reduced = false, nextAnimalSeed = 2): BathAction => ({ type: "tick", dt, pace, reduced, nextAnimalSeed, nextAnimalId: "frog" });
const run = (state: BathState, actions: BathAction[]) => actions.reduce(bathReducer, state);
const started = (state: BathState) => run(state, [{ type: "next" }, tick(TIMING.arriving)]);
const wash = (state: BathState) => run(state, [{ type: "layerReady" }, tick(TIMING.stageIn)]);

test("pierwsze i kolejne zwierzątko czekają, a nagroda i odejście nie przyjmują następnej akcji", () => {
  const waiting = createBathState(CLASSIC_STEPS, 1, "normal");
  expect(waiting.phase).toBe("door_waiting");
  expect(bathReducer(waiting, tick(10))).toBe(waiting);
  let state = bathReducer(waiting, { type: "next" });
  expect(state.phase).toBe("arriving");
  expect(bathReducer(state, { type: "next" })).toBe(state);
  state = bathReducer(state, tick(TIMING.arriving));
  expect(bathReducer(state, tick(5))).toBe(state); // Warstwa nie jest jeszcze gotowa.

  for (let index = 0; index < CLASSIC_STEPS.length; index++) {
    expect(state).toMatchObject({ phase: "stage_in", stepIndex: index, progress: 0 });
    state = wash(state);
    expect(state.phase).toBe("scrubbing");
    state = bathReducer(state, { type: "progress", value: 0.5 });
    expect(state).toMatchObject({ phase: "scrubbing", progress: 0.5 });
    state = bathReducer(state, { type: "progress", value: 0.9 });
    expect(state.phase).toBe("stage_rest");
    state = bathReducer(state, tick(TIMING.stageRest));
  }

  expect(state.phase).toBe("reward");
  expect(bathReducer(state, { type: "next" })).toBe(state);
  state = bathReducer(state, tick(TIMING.reward));
  expect(state.phase).toBe("to_bench");
  expect(bathReducer(state, { type: "next" })).toBe(state);
  state = bathReducer(state, tick(TIMING.toBench));
  expect(state).toMatchObject({ phase: "door_waiting", stepIndex: 0, animalSeed: 2, animalCount: 2, layerReady: false });
  expect(bathReducer(state, tick(10))).toBe(state);
});

test("akcje niepasujące do fazy są ignorowane", () => {
  const waiting = createBathState(CLASSIC_STEPS, 1, "normal");
  expect(bathReducer(waiting, { type: "layerReady" })).toBe(waiting);
  const start = started(waiting);
  expect(bathReducer(start, { type: "progress", value: 1 })).toBe(start);
  const scrubbing = wash(start);
  expect(bathReducer(scrubbing, tick(5))).toBe(scrubbing);
  expect(bathReducer(scrubbing, { type: "next" })).toBe(scrubbing);
  expect(bathReducer(scrubbing, { type: "layerReady" })).toBe(scrubbing);
  expect(bathReducer(scrubbing, { type: "progress", value: Number.NaN })).toBe(scrubbing);
});

test("odtworzenie tej samej listy akcji daje ten sam stan", () => {
  const actions: BathAction[] = [
    { type: "next" }, tick(TIMING.arriving), { type: "layerReady" }, tick(TIMING.stageIn),
    { type: "progress", value: 0.3 }, { type: "progress", value: 0.95 }, tick(0.2),
  ];
  const a = run(createBathState(CLASSIC_STEPS, 5, "easy"), actions);
  const b = run(createBathState(CLASSIC_STEPS, 5, "easy"), actions);
  expect(a).toEqual(b);
});

test("tempo wydłuża przejścia, ale nie zmienia progu", () => {
  let state = bathReducer(started(createBathState(CLASSIC_STEPS, 1, "normal")), { type: "layerReady" });
  state = run(state, Array.from({ length: 15 }, () => tick(0.05, 1.45)));
  expect(state.phase).toBe("stage_in");
  state = run(state, Array.from({ length: 7 }, () => tick(0.05, 1.45)));
  expect(state.phase).toBe("scrubbing");
  expect(state.threshold).toBe(0.9);
  expect(bathReducer(state, { type: "progress", value: 0.89 }).phase).toBe("scrubbing");
});

test("łatwość ustala próg, a ograniczony ruch skraca zanik reszty do zera", () => {
  const state = wash(started(createBathState(CLASSIC_STEPS, 1, "easy")));
  const rest = bathReducer(state, { type: "progress", value: 0.8 });
  expect(rest.phase).toBe("stage_rest");
  expect(bathReducer(rest, tick(0.016, 1, true))).toMatchObject({ phase: "stage_in", stepIndex: 1 });
});

for (const ease of Object.keys(EASE) as EaseKey[]) {
  test(`krok domyka się dopiero przy dokładnym progu ${EASE[ease].threshold * 100}% (${ease})`, () => {
    const threshold = EASE[ease].threshold;
    const state = wash(started(createBathState(["lather", "rinse"], 4, ease)));
    const almost = bathReducer(state, { type: "progress", value: threshold - 0.001 });
    expect(almost).toMatchObject({ phase: "scrubbing", stepIndex: 0 });
    expect(bathReducer(almost, { type: "progress", value: 0.1 })).toBe(almost);
    const rest = bathReducer(almost, { type: "progress", value: threshold });
    expect(rest).toMatchObject({ phase: "stage_rest", progress: threshold, phaseT: 0 });
    const fading = bathReducer(rest, tick(0.49));
    expect(fading.phase).toBe("stage_rest");
    expect(bathReducer(fading, tick(0.01))).toMatchObject({ phase: "stage_in", stepIndex: 1, progress: 0 });
  });
}

test("przy szybszym tempie zanik nie schodzi poniżej pół sekundy", () => {
  expect(phaseDuration("stage_rest", 0.8, false)).toBe(0.5);
  expect(phaseDuration("stage_rest", 1.45, false)).toBeCloseTo(0.725);
  expect(phaseDuration("stage_rest", 1.45, true)).toBe(0);
});

test("automatyczny pas zachowuje rzeczywisty postęp i kończy ruch przed zanikiem", () => {
  const playing = wash(started(createBathState(CLASSIC_STEPS, 1, "normal")));
  const moving = bathReducer(playing, { type: "progress", value: 0.94, finishStroke: false });
  expect(moving).toMatchObject({ phase: "scrubbing", progress: 0.94 });
  expect(bathReducer(moving, { type: "progress", value: 0.94, finishStroke: true })).toMatchObject({
    phase: "stage_rest", progress: 0.94,
  });
});

test("rytuał musi mieć co najmniej jeden krok", () => {
  expect(() => createBathState([], 1, "normal")).toThrow();
});

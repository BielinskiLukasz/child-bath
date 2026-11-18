import { expect, test } from "@playwright/test";
import { createPool, particleView, REDUCED_PARTICLE_LIMIT, spawn, stepPool } from "../../src/bath/particles";
import { createRng } from "../../src/random";
import { MAX_PARTICLES, TIMING } from "../../src/timing";

test("pula ma 28 miejsc, po końcu życia można użyć ich ponownie", () => {
  const pool = createPool();
  const rng = createRng(7);
  expect(pool).toHaveLength(MAX_PARTICLES);
  for (let i = 0; i < MAX_PARTICLES; i++) expect(spawn(pool, 128, 168, "bubble", rng)).toBe(true);
  expect(spawn(pool, 128, 168, "drop", rng)).toBe(false);
  expect(stepPool(pool, TIMING.particleLife)).toBe(0);
  expect(spawn(pool, 128, 168, "drop", rng)).toBe(true);
  expect(stepPool(pool, TIMING.particleFade)).toBe(1);
});

test("bańka łagodnie się unosi, kropla opada; obie od przezroczystości do przezroczystości", () => {
  const pool = createPool();
  const rng = createRng(7);
  spawn(pool, 128, 168, "bubble", rng);
  spawn(pool, 128, 168, "drop", rng);
  const [bubble, drop] = pool;
  expect(particleView(bubble)).toEqual({ x: 128, y: 168, opacity: 0 });
  expect(particleView(drop).opacity).toBe(0);
  stepPool(pool, TIMING.particleFade / 2);
  expect(particleView(bubble).opacity).toBeCloseTo(0.4);
  stepPool(pool, TIMING.particleFade / 2);
  expect(particleView(bubble).opacity).toBeCloseTo(0.8);
  expect(particleView(bubble).y).toBeLessThan(168);
  expect(particleView(drop).y).toBeGreaterThan(168);
  expect(particleView({ ...drop, age: TIMING.particleLife - TIMING.particleFade / 2 }).opacity).toBeCloseTo(0.4);
  expect(particleView({ ...drop, age: TIMING.particleLife }).opacity).toBe(0);
});

test("w ograniczonym ruchu zostaje maksymalnie sześć nieruchomych cząsteczek", () => {
  const pool = createPool();
  const rng = createRng(9);
  for (let i = 0; i < MAX_PARTICLES; i++) spawn(pool, 128, 168, "drop", rng);
  expect(stepPool(pool, 0.2, REDUCED_PARTICLE_LIMIT)).toBe(6);
  expect(spawn(pool, 128, 168, "bubble", rng, REDUCED_PARTICLE_LIMIT)).toBe(false);
  const part = particleView(pool[0], true);
  expect(part).toMatchObject({ x: 128, y: 168 });
  stepPool(pool, 0.3, REDUCED_PARTICLE_LIMIT);
  expect(particleView(pool[0], true)).toMatchObject({ x: 128, y: 168 });
  expect(particleView(pool[0], true).opacity).toBeGreaterThan(part.opacity);
});

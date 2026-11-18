import { expect, test } from "@playwright/test";
import { START_BRUSH, moveBrush, zigzag, type Brush } from "../../src/input/keyboardBrush";

test("strzałki przesuwają o 0,07 i nie wychodzą poza obszar", () => {
  expect(moveBrush(START_BRUSH, "ArrowLeft")).toEqual({ x: 0.43, y: 0.46, dir: 1 });
  expect(moveBrush(START_BRUSH, "ArrowDown")).toEqual({ x: 0.5, y: 0.53, dir: 1 });
  expect(moveBrush({ x: 0.91, y: 0.08, dir: -1 }, "ArrowRight").x).toBe(0.94);
  expect(moveBrush({ x: 0.91, y: 0.08, dir: -1 }, "ArrowUp").y).toBe(0.05);
});

test("200 ruchów prowadzi przez wszystkie pasy i zawija z dołu na górę", () => {
  const seen: Brush[] = [];
  let next = START_BRUSH;
  for (let i = 0; i < 200; i++) {
    next = zigzag(next);
    seen.push(next);
    expect(next.x).toBeGreaterThanOrEqual(0.06);
    expect(next.x).toBeLessThanOrEqual(0.94);
    expect(next.y).toBeGreaterThanOrEqual(0.05);
    expect(next.y).toBeLessThanOrEqual(0.95);
  }
  const ys = new Set(seen.map(({ y }) => y));
  expect([0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95].every((y) => ys.has(y))).toBe(true);
  expect(seen.some(({ x }) => x === 0.06)).toBe(true);
  expect(seen.some(({ x }) => x === 0.94)).toBe(true);
});

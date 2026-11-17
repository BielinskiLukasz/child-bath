import { expect, test } from "@playwright/test";
import { insideMask } from "../../src/animals/sketch";
import { createGrid, GRID_COLS, GRID_ROWS, LH, LW, progress, resetGrid, stampSegment } from "../../src/bath/coverage";

const fullMask = () => new Uint8Array(GRID_COLS * GRID_ROWS).fill(1);
const cell = (col: number, row: number) => row * GRID_COLS + col;

test("stempel zerowej długości oznacza koło komórek", () => {
  const grid = createGrid(fullMask());
  const added = stampSegment(grid, 128, 168, 128, 168, 10);
  // Koło o promieniu 10 jednostek to ok. π·10²/16 ≈ 20 komórek 4 × 4.
  expect(added).toBeGreaterThanOrEqual(12);
  expect(added).toBeLessThanOrEqual(28);
  expect(grid.doneCount).toBe(added);
});

test("odcinek przez środek oznacza komórki na swojej drodze, a nie dalej", () => {
  const grid = createGrid(fullMask());
  stampSegment(grid, 100, 168, 156, 168, 8);
  expect(grid.done[cell(32, 42)]).toBe(1);
  expect(grid.done[cell(25, 41)]).toBe(1);
  expect(grid.done[cell(32, 46)]).toBe(0);
  expect(grid.done[cell(45, 42)]).toBe(0);
});

test("odcinek poza sylwetką nie oznacza komórek", () => {
  const grid = createGrid(insideMask());
  expect(stampSegment(grid, 2, 2, 30, 2, 6)).toBe(0);
  expect(progress(grid)).toBe(0);
});

test("postęp rośnie monotonicznie, nie przekracza 1 i kończy na 1", () => {
  const grid = createGrid(insideMask());
  let previous = 0;
  for (let y = 0; y <= LH; y += 6) {
    stampSegment(grid, 0, y, LW, y, 8);
    const value = progress(grid);
    expect(value).toBeGreaterThanOrEqual(previous);
    expect(value).toBeLessThanOrEqual(1);
    previous = value;
  }
  expect(progress(grid)).toBe(1);
});

test("ponowne pocieranie nie liczy tych samych komórek drugi raz", () => {
  const grid = createGrid(fullMask());
  const first = stampSegment(grid, 40, 40, 200, 40, 12);
  expect(first).toBeGreaterThan(0);
  expect(stampSegment(grid, 40, 40, 200, 40, 12)).toBe(0);
});

test("promień zero niczego nie oznacza, reset zeruje postęp, pusta maska daje 1", () => {
  const grid = createGrid(fullMask());
  expect(stampSegment(grid, 10, 10, 50, 50, 0)).toBe(0);
  stampSegment(grid, 10, 10, 200, 300, 20);
  expect(progress(grid)).toBeGreaterThan(0);
  resetGrid(grid);
  expect(progress(grid)).toBe(0);
  expect(progress(createGrid(new Uint8Array(GRID_COLS * GRID_ROWS)))).toBe(1);
});

test("maska szkicu ma sensowną powierzchnię, a zła maska jest odrzucana", () => {
  const grid = createGrid(insideMask());
  // Głowa, tułów, uszy i łapki to ok. 1700 komórek z 5376.
  expect(grid.insideCount).toBeGreaterThan(1000);
  expect(grid.insideCount).toBeLessThan(GRID_COLS * GRID_ROWS * 0.7);
  expect(() => createGrid(new Uint8Array(10))).toThrow();
});

import { expect, test } from "@playwright/test";
import { insideMask } from "../../src/animals/sketch";
import { autoBrushRadius, planAutoStrokes, strokePoint } from "../../src/bath/autoStroke";
import { CELL, createGrid, GRID_COLS, GRID_ROWS, LH, LW, progress, stampSegment } from "../../src/bath/coverage";
import { brushRadius, STEPS } from "../../src/bath/steps";

const wideBox = 640 * LW / LH;
const narrow = new Uint8Array(GRID_COLS * GRID_ROWS);
for (let row = 7; row < 79; row++) {
  const center = 31 + Math.round(5 * Math.sin(row / 17));
  for (let col = center - 3; col <= center + 3; col++) narrow[row * GRID_COLS + col] = 1;
}

for (const [name, mask] of [["szkicu", insideMask()], ["wąskiej sylwetki", narrow]] as const) {
  test(`osiem pasów w masce ${name} pokrywa co najmniej 90% komórek`, () => {
    const radius = autoBrushRadius(mask, brushRadius(STEPS.scrub, "normal", wideBox));
    const strokes = planAutoStrokes(mask, radius);
    expect(strokes.length).toBeGreaterThanOrEqual(6);
    expect(strokes.length).toBeLessThanOrEqual(8);
    const grid = createGrid(mask);
    const inside = (x: number, y: number) => mask[Math.floor(y / CELL) * GRID_COLS + Math.floor(x / CELL)];
    for (const [index, stroke] of strokes.entries()) {
      expect(inside(stroke.x0, stroke.y)).toBe(1);
      expect(inside(stroke.x1, stroke.y)).toBe(1);
      if (index) expect(stroke.y).toBeGreaterThan(strokes[index - 1].y);
      stampSegment(grid, stroke.x0, stroke.y, stroke.x1, stroke.y, radius);
    }
    expect(progress(grid)).toBeGreaterThanOrEqual(0.9);
  });
}

test("próbkowanie pasa jest przewidywalne i zwalnia przy końcach", () => {
  const stroke = { x0: 40, x1: 120, y: 50 };
  expect(strokePoint(stroke, -1)).toEqual([40, 50]);
  expect(strokePoint(stroke, 0.25)[0]).toBeLessThan(60);
  expect(strokePoint(stroke, 0.5)).toEqual([80, 50]);
  expect(strokePoint(stroke, 0.75)[0]).toBeGreaterThan(100);
  expect(strokePoint(stroke, 2)).toEqual([120, 50]);
  expect(planAutoStrokes(new Uint8Array(GRID_COLS * GRID_ROWS), 20)).toEqual([]);
});

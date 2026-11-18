// Źródło: child-page@e7a19ac:js/kapiel.js (brushTo i onKey: krok 0,07, zakresy i zygzak).
// Zmiany: czyste funkcje i dociągnięcie pędzla do krawędzi przed zmianą wiersza.
export interface Brush { x: number; y: number; dir: 1 | -1 }
export type ArrowKey = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

export const START_BRUSH: Readonly<Brush> = { x: 0.5, y: 0.46, dir: 1 };
const LEFT = 0.06, RIGHT = 0.94, TOP = 0.05, BOTTOM = 0.95;
const STEP = 0.07, ROW = 0.1;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(value * 100) / 100));

export function isArrowKey(key: string): key is ArrowKey {
  return key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown";
}

export function moveBrush(brush: Brush, key: ArrowKey): Brush {
  const dx = key === "ArrowLeft" ? -STEP : key === "ArrowRight" ? STEP : 0;
  const dy = key === "ArrowUp" ? -STEP : key === "ArrowDown" ? STEP : 0;
  return { x: clamp(brush.x + dx, LEFT, RIGHT), y: clamp(brush.y + dy, TOP, BOTTOM), dir: brush.dir };
}

export function zigzag(brush: Brush): Brush {
  const edge = brush.dir > 0 ? RIGHT : LEFT;
  if (brush.x !== edge) return { ...brush, x: clamp(brush.x + STEP * brush.dir, LEFT, RIGHT) };
  return {
    x: brush.x,
    y: brush.y === BOTTOM ? TOP : clamp(brush.y + ROW, TOP, BOTTOM),
    dir: brush.dir > 0 ? -1 : 1,
  };
}

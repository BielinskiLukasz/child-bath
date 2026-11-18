import { CELL, GRID_COLS, GRID_ROWS } from "./coverage";

export interface Stroke { y: number; x0: number; x1: number }
const PASS_COUNT = 8;

/** Tryb jednoprzyciskowy może poszerzyć pędzel: pasy mają sięgać do sąsiadów także w wysokiej masce. */
export function autoBrushRadius(inside: Uint8Array, baseRadius: number): number {
  const first = inside.findIndex((cell) => cell > 0);
  if (first < 0 || !(baseRadius > 0)) return baseRadius;
  let last = inside.length - 1;
  while (!inside[last]) last--;
  const height = (Math.floor(last / GRID_COLS) - Math.floor(first / GRID_COLS) + 1) * CELL;
  return Math.max(baseRadius, height / (2 * PASS_COUNT) + CELL);
}

/** Pasy od góry do dołu. Końce leżą na masce; canvas przycina ślad także w przerwach między częściami sylwetki. */
export function planAutoStrokes(inside: Uint8Array, r: number): Stroke[] {
  if (inside.length !== GRID_COLS * GRID_ROWS || !(r > 0) || !Number.isFinite(r)) return [];
  const rows: Stroke[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    let left = GRID_COLS, right = -1;
    for (let col = 0; col < GRID_COLS; col++) {
      if (!inside[row * GRID_COLS + col]) continue;
      left = Math.min(left, col);
      right = col;
    }
    if (right >= 0) rows.push({ y: (row + 0.5) * CELL, x0: (left + 0.5) * CELL, x1: (right + 0.5) * CELL });
  }
  const count = Math.min(PASS_COUNT, rows.length);
  if (!count) return [];
  const first = rows[0].y;
  const last = rows[rows.length - 1].y;
  const span = last - first + CELL;
  const band = span / count;
  const strokes: Stroke[] = [];
  let next = 0;
  for (let i = 0; i < count; i++) {
    const to = rows.length - (count - i);
    const target = first - CELL / 2 + band * (i + 0.5);
    while (next < to && Math.abs(rows[next + 1].y - target) <= Math.abs(rows[next].y - target)) next++;
    const row = rows[next++];
    // Gdy promień sam pokrywa wąski rząd, krótki ruch nadal pokazuje kierunek pracy.
    const spanX = row.x1 - row.x0;
    const inset = Math.min(r * 0.22, spanX * 0.18);
    const offset = Math.floor(row.y / CELL) * GRID_COLS;
    const onMask = (x: number) => inside[offset + Math.floor(x / CELL)] !== 0;
    const x0 = onMask(row.x0 + inset) ? row.x0 + inset : row.x0;
    const x1 = onMask(row.x1 - inset) ? row.x1 - inset : row.x1;
    strokes.push({ y: row.y, x0: i % 2 ? x1 : x0, x1: i % 2 ? x0 : x1 });
  }
  return strokes;
}

export function strokePoint(stroke: Stroke, t: number): [number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  const eased = clamped * clamped * (3 - 2 * clamped);
  return [stroke.x0 + (stroke.x1 - stroke.x0) * eased, stroke.y];
}

/**
 * Siatka pokrycia (PROJECT.md, A1): postęp kroku liczony w logicznych współrzędnych, bez odczytu pikseli.
 * Przestrzeń logiczna 256 × 336 i proporcje 64 : 84 pochodzą z kapiel; komórka ma 4 × 4 jednostki,
 * więc siatka 64 × 84 pokrywa się 1 : 1 z viewBoxem zwierzątka. Moduł jest czysty: bez DOM i canvasu.
 */
export const LW = 256;
export const LH = 336;
export const GRID_COLS = 64;
export const GRID_ROWS = 84;
export const CELL = LW / GRID_COLS;

export interface CoverageGrid {
  cols: number;
  rows: number;
  /** 1, gdy środek komórki leży w sylwetce zwierzątka. */
  inside: Uint8Array;
  /** 1, gdy komórka została już wyczyszczona (zmywanie) albo pokryta (nakładanie). */
  done: Uint8Array;
  insideCount: number;
  doneCount: number;
}

export function createGrid(inside: Uint8Array): CoverageGrid {
  if (inside.length !== GRID_COLS * GRID_ROWS) {
    throw new Error(`Maska musi mieć ${GRID_COLS * GRID_ROWS} komórek, ma ${inside.length}.`);
  }
  let insideCount = 0;
  for (let i = 0; i < inside.length; i++) insideCount += inside[i] ? 1 : 0;
  return { cols: GRID_COLS, rows: GRID_ROWS, inside, done: new Uint8Array(inside.length), insideCount, doneCount: 0 };
}

/** Czyści postęp przed nowym krokiem (maska sylwetki zostaje). */
export function resetGrid(grid: CoverageGrid): void {
  grid.done.fill(0);
  grid.doneCount = 0;
}

/**
 * Oznacza komórki, których środek leży w „kapsule”: odcinku (x0, y0)–(x1, y1) poszerzonym o promień r.
 * Odcinek zerowej długości działa jak okrągły stempel. Zwraca liczbę nowo oznaczonych komórek.
 * Bez alokacji: sprawdzamy tylko komórki w prostokącie ograniczającym kapsułę.
 */
export function stampSegment(grid: CoverageGrid, x0: number, y0: number, x1: number, y1: number, r: number): number {
  if (!(r > 0)) return 0;
  const minCol = Math.max(0, Math.floor((Math.min(x0, x1) - r) / CELL));
  const maxCol = Math.min(grid.cols - 1, Math.floor((Math.max(x0, x1) + r) / CELL));
  const minRow = Math.max(0, Math.floor((Math.min(y0, y1) - r) / CELL));
  const maxRow = Math.min(grid.rows - 1, Math.floor((Math.max(y0, y1) + r) / CELL));
  const dx = x1 - x0;
  const dy = y1 - y0;
  const lengthSq = dx * dx + dy * dy;
  const rSq = r * r;
  let added = 0;

  for (let row = minRow; row <= maxRow; row++) {
    const cy = (row + 0.5) * CELL;
    for (let col = minCol; col <= maxCol; col++) {
      const index = row * grid.cols + col;
      if (!grid.inside[index] || grid.done[index]) continue;
      const cx = (col + 0.5) * CELL;
      let t = lengthSq > 0 ? ((cx - x0) * dx + (cy - y0) * dy) / lengthSq : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = x0 + t * dx - cx;
      const py = y0 + t * dy - cy;
      if (px * px + py * py <= rSq) {
        grid.done[index] = 1;
        added++;
      }
    }
  }
  grid.doneCount += added;
  return added;
}

/** Udział wyczyszczonych komórek sylwetki: od 0 do 1 (pusta sylwetka daje 1). */
export function progress(grid: CoverageGrid): number {
  return grid.insideCount === 0 ? 1 : grid.doneCount / grid.insideCount;
}

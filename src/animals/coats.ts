import { GRID_COLS, GRID_ROWS } from "../bath/coverage";
import { VIEWBOX } from "./geometry/template";
import { insideMask } from "./mask";
import type { AnimalDef, Hex, Okrywa } from "./types";

export type CoatLook = "fluffy" | "woolly" | "feathered" | "spiny" | "smooth" | "scaled" | "shell";
export const COAT_LOOK: Record<Okrywa, CoatLook> = {
  futro: "fluffy", welna: "woolly", piora: "feathered", kolce: "spiny", skora: "smooth", luski: "scaled", skorupa: "shell",
};

export function mixTone(a: Hex, b: Hex, amount: number): Hex {
  const channel = (i: number) => {
    const start = Number.parseInt(a.slice(i, i + 2), 16);
    const end = Number.parseInt(b.slice(i, i + 2), 16);
    return Math.round(start + (end - start) * amount).toString(16).padStart(2, "0");
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

interface Tuft { x: number; y: number; side: -1 | 1; size: number }
const tuftCache = new WeakMap<AnimalDef, readonly Tuft[]>();

/** Sample the cheeks and sides of the base mask, so tufts follow each contour. */
export function coatTufts(def: AnimalDef): readonly Tuft[] {
  const cached = tuftCache.get(def);
  if (cached) return cached;
  const points: Tuft[] = [];
  const mask = insideMask(def);
  const wool = def.okrywa === "welna";
  const rows = wool ? [28, 33, 38, 44, 56, 63, 69, 73] : [34, 40, 46, 61, 69];
  for (const row of rows) {
    if (row >= GRID_ROWS) continue;
    let lo = GRID_COLS, hi = -1;
    for (let col = 0; col < GRID_COLS; col++) {
      if (!mask[row * GRID_COLS + col]) continue;
      lo = Math.min(col, lo);
      hi = col;
    }
    if (hi - lo < 8) continue;
    points.push(
      { x: VIEWBOX.x + lo + 0.8, y: VIEWBOX.y + row + 0.5, side: -1, size: wool ? 2.65 : 1.75 },
      { x: VIEWBOX.x + hi + 0.15, y: VIEWBOX.y + row + 0.5, side: 1, size: wool ? 2.65 : 1.75 },
    );
  }
  tuftCache.set(def, points);
  return points;
}
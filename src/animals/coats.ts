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
  const plush = def.coatProfile === "plush";
  const pompons = def.coatProfile === "pompons";
  const rows = plush ? [27, 31, 35, 39, 43, 47, 51, 55, 60, 65, 70, 74]
    : pompons ? [22, 26, 31, 36, 61, 68, 72, 76]
    : wool ? [28, 33, 38, 44, 56, 63, 69, 73] : [34, 40, 46, 61, 69];
  const size = plush ? 2.95 : pompons ? 3.15 : wool ? 2.65 : 1.75;
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
      { x: VIEWBOX.x + lo + 0.8, y: VIEWBOX.y + row + 0.5, side: -1, size },
      { x: VIEWBOX.x + hi + 0.15, y: VIEWBOX.y + row + 0.5, side: 1, size },
    );
  }
  tuftCache.set(def, points);
  return points;
}
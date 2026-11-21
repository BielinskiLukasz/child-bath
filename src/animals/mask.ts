import { CELL, GRID_COLS, GRID_ROWS, LW } from "../bath/coverage";
import { VIEWBOX } from "./geometry/template";
import type { AnimalDef, Shape } from "./types";

const units = LW / VIEWBOX.w;
const paths = new WeakMap<AnimalDef, Path2D>();
const masks = new WeakMap<AnimalDef, Uint8Array>();

function shapePath(shape: Shape): Path2D {
  if (shape.el === "path") return new Path2D(shape.attrs.d);
  const path = new Path2D();
  if (shape.el === "circle") {
    const { cx, cy, r } = shape.attrs;
    path.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (shape.el === "ellipse") {
    const { cx, cy, rx, ry } = shape.attrs;
    path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  } else {
    const { x, y, width, height, rx } = shape.attrs;
    path.roundRect(x, y, width, height, rx);
  }
  return path;
}

/** The same matrices as the SVG, with the viewBox mapped to bath coordinates. */
export function silhouettePath(def: AnimalDef): Path2D {
  const cached = paths.get(def);
  if (cached) return cached;
  const path = new Path2D();
  for (const shape of def.shapes) {
    if (!shape.silhouette) continue;
    const [a, b, c, d, e, f] = shape.matrix;
    path.addPath(shapePath(shape), {
      a: a * units, b: b * units, c: c * units, d: d * units,
      e: (e - VIEWBOX.x) * units, f: (f - VIEWBOX.y) * units,
    });
  }
  paths.set(def, path);
  return path;
}

let probe: CanvasRenderingContext2D | null = null;

/** Samples cell centers once per definition. The returned mask is shared and must stay read-only. */
export function insideMask(def: AnimalDef): Uint8Array {
  const cached = masks.get(def);
  if (cached) return cached;
  const path = silhouettePath(def);
  probe ??= document.createElement("canvas").getContext("2d");
  if (!probe) throw new Error("Nie można utworzyć siatki kąpieli.");
  const mask = new Uint8Array(GRID_COLS * GRID_ROWS);
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      mask[row * GRID_COLS + col] = probe.isPointInPath(path, (col + 0.5) * CELL, (row + 0.5) * CELL) ? 1 : 0;
    }
  }
  masks.set(def, mask);
  return mask;
}
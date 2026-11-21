// Źródło: child-page@e7a19ac:js/kapiel.js (viewBox -32 -42 64 84, skala 4 do maski 256 × 336) oraz js/animals.js (sylwetka misia).
// Zmiany: geometria jako dane (PROJECT.md, A5): ten sam opis kształtu daje rysunek SVG, Path2D i maskę siatki.
/** Archiwalna maska szkicu do deterministycznych testów jednostkowych rdzenia z Fazy 2. */
import { CELL, GRID_COLS, GRID_ROWS, LW } from "../bath/coverage";

export const VIEWBOX = { x: -32, y: -42, w: 64, h: 84 } as const;
/** Jednostki logiczne na jednostkę viewBoxu (256 / 64 = 4). */
export const UNIT = LW / VIEWBOX.w;

export type SketchShape =
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number };

/** Sylwetka szkicu: tułów, łapki, uszy i głowa (kolejność rysowania od tyłu). */
export const SKETCH_SILHOUETTE: readonly SketchShape[] = [
  { kind: "ellipse", cx: 0, cy: 27, rx: 18, ry: 12 },
  { kind: "ellipse", cx: -9, cy: 38, rx: 6, ry: 3.5 },
  { kind: "ellipse", cx: 9, cy: 38, rx: 6, ry: 3.5 },
  { kind: "circle", cx: -13, cy: -13, r: 6 },
  { kind: "circle", cx: 13, cy: -13, r: 6 },
  { kind: "circle", cx: 0, cy: 0, r: 16 },
];

/** Kolory futra szkicu z rodziny child-page i child-train (miś, piesek, myszka, kotek). */
export const SKETCH_FURS = ["#d2a67f", "#dcb88e", "#cfcad8", "#f2c48d"] as const;

function radii(shape: SketchShape): [number, number] {
  return shape.kind === "circle" ? [shape.r, shape.r] : [shape.rx, shape.ry];
}

function inShape(shape: SketchShape, x: number, y: number): boolean {
  const [rx, ry] = radii(shape);
  const dx = (x - shape.cx) / rx;
  const dy = (y - shape.cy) / ry;
  return dx * dx + dy * dy <= 1;
}

/** Czy punkt w jednostkach logicznych leży w sylwetce. */
export function insideAt(shapes: readonly SketchShape[], lx: number, ly: number): boolean {
  const x = lx / UNIT + VIEWBOX.x;
  const y = ly / UNIT + VIEWBOX.y;
  return shapes.some((shape) => inShape(shape, x, y));
}

/** Maska siatki pokrycia: 1 dla komórek, których środek leży w sylwetce. Czysta funkcja. */
export function insideMask(shapes: readonly SketchShape[] = SKETCH_SILHOUETTE): Uint8Array {
  const mask = new Uint8Array(GRID_COLS * GRID_ROWS);
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      mask[row * GRID_COLS + col] = insideAt(shapes, (col + 0.5) * CELL, (row + 0.5) * CELL) ? 1 : 0;
    }
  }
  return mask;
}

/** Ścieżka sylwetki w jednostkach logicznych do przycinania warstw w canvasie (tylko w przeglądarce). */
export function silhouettePath(shapes: readonly SketchShape[] = SKETCH_SILHOUETTE): Path2D {
  const path = new Path2D();
  for (const shape of shapes) {
    const [rx, ry] = radii(shape);
    const cx = (shape.cx - VIEWBOX.x) * UNIT;
    const cy = (shape.cy - VIEWBOX.y) * UNIT;
    path.moveTo(cx + rx * UNIT, cy);
    path.ellipse(cx, cy, rx * UNIT, ry * UNIT, 0, 0, Math.PI * 2);
    path.closePath();
  }
  return path;
}

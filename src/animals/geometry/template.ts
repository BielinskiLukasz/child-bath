// Źródło: child-train@b881e09:src/components/illustration/Animal.tsx (frontalny szablon, twarz i nastroje).
// Korpus przełożony na płaskie kształty z osobną maską; grube kreski łap są teraz pełnymi wycinankami.
import type { AnchorKind, AnimalRig, ColorRef, Hex, Matrix, PartId, Point, Shape } from "../types";

export const VIEWBOX = { x: -32, y: -42, w: 64, h: 84 } as const;
const SCALE = 0.46;
const Y = -1;
const matrix: Matrix = [SCALE, 0, 0, SCALE, 0, Y];
const fromTrain = ([x, y]: Point): Point => [x * SCALE, y * SCALE + Y];

export function oval(part: PartId, cx: number, cy: number, rx: number, ry: number, fill: ColorRef = "fur", silhouette = false, angle = 0): Shape {
  const cos = Math.cos(angle * Math.PI / 180) * SCALE;
  const sin = Math.sin(angle * Math.PI / 180) * SCALE;
  const rotated: Matrix = [cos, sin, -sin, cos, cx * (SCALE - cos) + cy * sin, cy * (SCALE - cos) - cx * sin + Y];
  return { part, el: "ellipse", attrs: { cx, cy, rx, ry }, fill, silhouette, matrix: angle ? rotated : matrix };
}

export function circle(part: PartId, cx: number, cy: number, r: number, fill: ColorRef = "fur", silhouette = false): Shape {
  return { part, el: "circle", attrs: { cx, cy, r }, fill, silhouette, matrix };
}

export function rounded(part: PartId, x: number, y: number, width: number, height: number, rx: number, fill: ColorRef = "fur", silhouette = false): Shape {
  return { part, el: "rect", attrs: { x, y, width, height, rx }, fill, silhouette, matrix };
}

export function path(part: PartId, d: string, fill: ColorRef = "fur", silhouette = false): Shape {
  return { part, el: "path", attrs: { d }, fill, silhouette, matrix };
}

export function line(part: PartId, d: string, color: ColorRef = "line", width = 1.5): Shape {
  return { ...path(part, d, "none"), stroke: { color, width } };
}

export function pair(part: PartId, x: number, y: number, rx: number, ry: number, fill: ColorRef = "fur", silhouette = false, angle = 0): Shape[] {
  return [oval(part, -x, y, rx, ry, fill, silhouette, -angle), oval(part, x, y, rx, ry, fill, silhouette, angle)];
}

const SHARED_MOUTH = "M0 13v4m-7-1q3 6 7 1 4 5 7-1";
const SHARED_NOSE = "M-4 7q4-3 8 0 0 6-4 6-4 0-4-6Z";

type Eye = { x: number; y: number; rx: number; ry: number; color?: ColorRef; glint?: ColorRef };

interface RigOptions {
  fur: Hex;
  furDark: Hex;
  accent?: Hex;
  back?: readonly Shape[];
  ears?: readonly Shape[];
  head: readonly Shape[];
  details?: readonly Shape[];
  bodyDetails?: readonly Shape[];
  body?: readonly Shape[];
  paws?: readonly Shape[];
  arms?: readonly Shape[];
  limbs?: ColorRef;
  feet?: ColorRef;
  eyes?: Eye;
  face?: "shared" | "custom";
  cheeks?: boolean;
  useNose?: boolean;
  smile?: false | string;
  anchors?: Partial<Record<AnchorKind, Point>>;
  mouth?: Point;
  coatProfile?: AnimalRig["coatProfile"];
  collar?: { center: Point; width: number };
}

export const head = (rx: number, ry: number, fill: ColorRef = "fur") => oval("head", 0, -1, rx, ry, fill, true);
export const muzzle = (rx: number, ry: number, fill: ColorRef = "accent", cy = 11) => oval("face", 0, cy, rx, ry, fill);
export const waving = (shape: Shape): Shape => ({ ...shape, motion: "paw" });

export function makeRig(options: RigOptions): AnimalRig {
  const limbs = options.limbs ?? "fur";
  const face = options.face ?? "shared";
  const eye = options.eyes ?? { x: 11, y: -4, rx: 2.5, ry: 3 };
  const eyeTone = eye.color ?? "ink";
  const pupils = (larger: boolean) => [
    ...pair("eyes", eye.x, eye.y, eye.rx + (larger ? 0.6 : 0), eye.ry + (larger ? 0.6 : 0), eyeTone),
    ...(eye.glint || larger ? [
      circle("eyes", -eye.x + 1, eye.y - 1.4, 1, eye.glint ?? "#ffffff"),
      circle("eyes", eye.x + 1, eye.y - 1.4, 1, eye.glint ?? "#ffffff"),
    ] : []),
  ];
  const wink = [-eye.x, eye.x].map((x) =>
    line("eyes", `M${x - eye.rx - 1.4} ${eye.y}q${eye.rx + 1.4} ${eye.ry + 1.4} ${(eye.rx + 1.4) * 2} 0`, eyeTone, 2),
  );
  const anchors: Record<AnchorKind, Point> = { headTop: [0, -29], earLeft: [-25, -25], earRight: [25, -25], neck: [0, 32], brow: [0, -18], ...options.anchors };
  for (const key of Object.keys(anchors) as AnchorKind[]) anchors[key] = fromTrain(anchors[key]);
  const collar = options.collar;
  const scarfMatrix: Matrix | undefined = collar && [collar.width, 0, 0, 1, collar.center[0] * SCALE, (collar.center[1] - 32) * SCALE];

  return {
    palette: { fur: options.fur, furDark: options.furDark, accent: options.accent ?? "#f3e7cc", ink: "#3f4d40", cream: "#fffcf3", blush: "#cf9f89", nose: "#495043", line: "#655c4b" },
    face, anchors, mouth: fromTrain(options.mouth ?? [0, 17]), coatProfile: options.coatProfile, scarfMatrix,
    shapes: [
      ...(options.back ?? []),
      ...(options.body ?? [oval("body", 0, 27, 15, 10, "fur", true), oval("body", 0, 55, 27, 29, "fur", true)]),
      ...(options.bodyDetails ?? []),
      ...(options.paws ?? pair("paws", 15, 77, 12, 7, options.feet ?? limbs, true)),
      ...(options.arms ?? [
        oval("arm", -29, 45, 9, 17, limbs, true, 22),
        waving(path("arm", "M19 39C29 35 36 32 35 24C33 16 35 10 41 10C48 10 51 18 50 25C49 40 38 48 24 54Z", limbs, true)),
      ]),
      ...(options.ears ?? []),
      ...options.head,
      ...(options.details ?? []),
      ...(options.cheeks === false ? [] : pair("cheeks", 20, 7, 6, 3.5, "blush").map((shape) => ({ ...shape, opacity: 0.55 }))),
      ...(options.useNose === false ? [] : [path("nose", SHARED_NOSE, "nose")]),
      ...(options.smile === false ? [] : [line("face", options.smile ?? SHARED_MOUTH)]),
    ],
    eyes: { cheerful: pupils(false), curious: pupils(true), dozing: wink },
  };
}
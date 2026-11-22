import { LH, LW } from "../bath/coverage";
import type { SceneLayout } from "./scenery";

export interface Size { width: number; height: number }
export interface Rect extends Size { x: number; y: number }
export interface ResolvedSpot { x: number; y: number; size: number }
const ASPECT = LW / LH;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));

export function bathBox(scene: Size): Rect {
  const { width, height } = scene;
  const side = Math.min(width * 0.24, 112);
  const available = Math.min(height, Math.max(0, width - side - 16) / ASPECT);
  const h = Math.max(0, Math.floor(Math.min(available, Math.max(160, Math.min(available * 0.88, 640)))));
  const w = h * ASPECT;
  return { x: clamp((width - w) / 2, Math.min(side + 6, width - w), width - w), y: (height - h) * 0.44, width: w, height: h };
}

export function resolveLayout(scene: Size, box: Rect, design: SceneLayout) {
  const edge = Math.min(14, scene.width * 0.028);
  const xOf = (x: number) => box.x + box.width * x;
  const yOf = (y: number) => box.y + box.height * y;
  const doorW = Math.max(0, Math.min(128, scene.height * 0.37, box.x - edge - 7, box.width * design.door.scale));
  const doorH = doorW * 1.32;
  const door = { x: clamp(xOf(design.door.x) - doorW / 2, edge, box.x - doorW - 6), y: clamp(yOf(design.door.y) - doorH, 0, scene.height - doorH - edge), width: doorW, height: doorH };

  const tubW = Math.min(scene.width * 0.64, box.width * 0.96);
  const tubH = Math.min(scene.height * 0.21, box.height * 0.25);
  const tub = { x: xOf(0.50) - tubW / 2, y: clamp(yOf(0.85), 0, scene.height - tubH - 5), width: tubW, height: tubH };

  const [left, middle, right] = design.bench;
  const spacing = Math.max(12, Math.min((right.x - middle.x) * box.width, scene.width * 0.105, scene.height * 0.19));
  const benchW = spacing * 3.25;
  const benchH = Math.min(scene.height * 0.22, spacing * 1.14);
  const benchX = clamp(xOf(middle.x), benchW / 2 + edge, scene.width - benchW / 2 - edge);
  const benchY = clamp(yOf(middle.y) - benchH * 0.62, 0, scene.height - benchH - 3);
  const bench = { x: benchX - benchW / 2, y: benchY, width: benchW, height: benchH };
  const seats = [left, middle, right].map((spot, index): ResolvedSpot => ({
    x: benchX + (index - 1) * spacing, y: benchY + benchH * 0.52, size: Math.min(spacing * 0.81, spot.scale * box.width),
  }));
  const companions = design.companions.map((spot): ResolvedSpot => ({
    x: clamp(xOf(spot.x), tub.x + tub.width * 0.1, tub.x + tub.width * 0.9),
    y: tub.y + tub.height * (0.14 + spot.y * 0.17), size: Math.min(44, Math.max(16, box.width * spot.scale)),
  }));
  return { door, tub, bench, seats, companions };
}

export type WorldGeometry = ReturnType<typeof resolveLayout>;
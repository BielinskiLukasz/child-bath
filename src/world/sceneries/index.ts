import { SCENERY_RULES, type SceneryDef, type SceneryId, type SceneLayout } from "../scenery";
import { Bathroom } from "./bathroom";
import { ForestSpring } from "./forest-spring";
import { Garden } from "./garden";
import { Jetty } from "./jetty";
import { LavenderSpa } from "./lavender-spa";
import { MountainTub } from "./mountain-tub";

function spots(doorX: number, doorY: number, benchX: number, benchY: number): SceneLayout {
  const seat = (x: number) => ({ x, y: benchY, scale: 0.11 });
  return {
    door: { x: doorX, y: doorY, scale: 0.32 },
    bench: [seat(benchX - 0.14), seat(benchX), seat(benchX + 0.14)],
    companions: [{ x: 0.15, y: 1, scale: 0.14 }, { x: 0.86, y: 0.28, scale: 0.13 }],
  };
}

export const SCENERIES: Readonly<Record<SceneryId, SceneryDef>> = {
  bathroom: { ...SCENERY_RULES.bathroom, Background: Bathroom, portal: "door", tub: "porcelain", benchStyle: "wood",
    layout: { portrait: spots(-0.21, 0.98, 1.07, 1.19), landscape: spots(-0.53, 0.98, 1.45, 0.95) } },
  garden: { ...SCENERY_RULES.garden, Background: Garden, portal: "gate", tub: "wood", benchStyle: "wood",
    layout: { portrait: spots(-0.19, 1.02, 1.07, 1.20), landscape: spots(-0.60, 0.94, 1.50, 0.98) } },
  forest_spring: { ...SCENERY_RULES.forest_spring, Background: ForestSpring, portal: "ferns", tub: "stone", benchStyle: "log",
    layout: { portrait: spots(-0.20, 0.96, 1.09, 1.19), landscape: spots(-0.55, 1.0, 1.42, 1.02) } },
  mountain_tub: { ...SCENERY_RULES.mountain_tub, Background: MountainTub, portal: "path", tub: "wood", benchStyle: "stone", steam: true,
    layout: { portrait: spots(-0.19, 0.94, 1.10, 1.20), landscape: spots(-0.52, 0.94, 1.55, 0.98) } },
  jetty: { ...SCENERY_RULES.jetty, Background: Jetty, portal: "reeds", tub: "copper", benchStyle: "plank",
    layout: { portrait: spots(-0.19, 0.99, 1.08, 1.21), landscape: spots(-0.60, 0.95, 1.50, 0.99) } },
  lavender_spa: { ...SCENERY_RULES.lavender_spa, Background: LavenderSpa, portal: "arch", tub: "lavender", benchStyle: "stone", steam: true,
    layout: { portrait: spots(-0.21, 0.98, 1.07, 1.2), landscape: spots(-0.54, 0.98, 1.49, 0.97) } },
};
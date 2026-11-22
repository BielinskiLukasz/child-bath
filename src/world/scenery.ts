import type { ComponentType } from "react";
import { SEASONS, type Season, type TimeOfDay, type Weather } from "./atmosphere";

export const SCENERY_IDS = ["bathroom", "garden", "forest_spring", "mountain_tub", "jetty", "lavender_spa"] as const;
export type SceneryId = (typeof SCENERY_IDS)[number];
export type WaterSource = "shower" | "can" | "scoop";
export type Portal = "door" | "gate" | "ferns" | "path" | "reeds" | "arch";
export type TubStyle = "porcelain" | "wood" | "stone" | "copper" | "lavender";
export type BenchStyle = "wood" | "log" | "stone" | "plank";
export type SceneSpot = { x: number; y: number; scale: number }; // x/y relative to the wash box; scale relative to its width
export interface SceneLayout { door: SceneSpot; bench: readonly [SceneSpot, SceneSpot, SceneSpot]; companions: readonly SceneSpot[] }
export interface SceneryRules {
  id: SceneryId;
  name: string;
  water: WaterSource;
  indoor: boolean;
  seasons: readonly Season[];
  avoidWeather?: readonly Weather[];
  times?: readonly TimeOfDay[];
}
export interface SceneryDef extends SceneryRules {
  layout: { portrait: SceneLayout; landscape: SceneLayout };
  portal: Portal;
  tub: TubStyle;
  benchStyle: BenchStyle;
  steam?: boolean;
  Background: ComponentType;
}

export const SCENERY_RULES: Readonly<Record<SceneryId, SceneryRules>> = {
  bathroom: { id: "bathroom", name: "Domowa łazienka", water: "shower", indoor: true, seasons: SEASONS },
  garden: { id: "garden", name: "Ogród", water: "can", indoor: false, seasons: ["spring", "summer"], avoidWeather: ["snow"] },
  forest_spring: { id: "forest_spring", name: "Leśne źródełko", water: "scoop", indoor: false, seasons: ["spring", "summer", "autumn"], avoidWeather: ["snow"] },
  mountain_tub: { id: "mountain_tub", name: "Górska balia", water: "scoop", indoor: false, seasons: SEASONS },
  jetty: { id: "jetty", name: "Pomost nad jeziorem", water: "scoop", indoor: false, seasons: ["summer"], avoidWeather: ["snow"] },
  lavender_spa: { id: "lavender_spa", name: "Lawendowe spa", water: "shower", indoor: false, seasons: ["summer"], avoidWeather: ["snow"], times: ["dusk", "night"] },
};

export function isSceneryId(value: string | null | undefined): value is SceneryId {
  return SCENERY_IDS.includes(value as SceneryId);
}
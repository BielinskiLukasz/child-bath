export const ANIMAL_IDS = [
  "rabbit", "fox", "bear", "hedgehog", "owl", "squirrel", "dachowiec", "labrador", "frog", "badger",
  "deer", "mouse", "duck", "sheep", "pig", "turtle", "lion", "elephant", "panda", "koala",
  "capybara", "penguin", "otter", "diplodocus", "triceratops", "stegosaurus", "parasaurolophus", "trex",
  "dalmatian", "dachshund", "poodle", "husky", "bulldog", "persian", "siamese", "british",
] as const;
export type AnimalId = (typeof ANIMAL_IDS)[number];
export type Okrywa = "futro" | "welna" | "piora" | "kolce" | "skora" | "luski" | "skorupa";
export type Rodzaj = "m" | "f" | "n";
export type AnimalGroup = "wiejskie" | "dalekie" | "pieski" | "kotki" | "dinozaury";
export type PartId = "back" | "tail" | "body" | "paws" | "arm" | "head" | "ears" | "face" | "eyes" | "nose" | "cheeks" | "scarf" | "extra";
export type Tone = "fur" | "furDark" | "accent" | "blush" | "ink" | "cream" | "nose" | "line";
export type Hex = `#${string}`;
export type ColorRef = Tone | Hex | "none";
export type Point = readonly [number, number];
export type Matrix = readonly [number, number, number, number, number, number];

type ElementShape =
  | { el: "circle"; attrs: { cx: number; cy: number; r: number } }
  | { el: "ellipse"; attrs: { cx: number; cy: number; rx: number; ry: number } }
  | { el: "rect"; attrs: { x: number; y: number; width: number; height: number; rx: number } }
  | { el: "path"; attrs: { d: string } };

export type Shape = ElementShape & {
  part: PartId;
  fill: ColorRef;
  matrix: Matrix;
  silhouette?: boolean;
  opacity?: number;
  motion?: "paw";
  stroke?: { color: ColorRef; width: number };
};

export type AnimalMood = "cheerful" | "curious" | "dozing";
export type ReactionKind = "fluff" | "ruffle" | "tailWag" | "squint" | "smileClosed" | "yawn" | "stretch" | "pawSplash" | "wingFan" | "shine" | "shake" | "armWave";
export const ANCHOR_KINDS = ["headTop", "earLeft", "earRight", "neck", "brow"] as const;
export type AnchorKind = (typeof ANCHOR_KINDS)[number];
export interface NameForms { mian: string; dop: string; cel: string; bier: string; narz: string; miejsc: string }
export type ScarfTone = 0 | 1 | 2 | 3;

export interface AnimalRig {
  palette: Readonly<Record<Tone, Hex>>;
  shapes: readonly Shape[];
  eyes: Readonly<Record<AnimalMood, readonly Shape[]>>;
  face: "shared" | "custom";
  anchors: Readonly<Record<AnchorKind, Point>>;
  mouth: Point;
  coatProfile?: "plush" | "pompons";
  scarfMatrix?: Matrix;
}

export interface AnimalDef extends AnimalRig {
  id: AnimalId;
  group: AnimalGroup;
  okrywa: Okrywa;
  rodzaj: Rodzaj;
  names: NameForms;
  reactions: readonly ReactionKind[];
  scarf: ScarfTone;
}
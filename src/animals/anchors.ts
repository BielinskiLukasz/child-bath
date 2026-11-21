import { ANIMALS } from "./roster";
import type { AnchorKind, AnimalDef, AnimalId, Point } from "./types";

// Identyfikatory ozdób z PHASE-08. W Fazie 4 nie ma jeszcze ich grafiki.
const DECOR = {
  wreath_flowers: "headTop", wreath_leaves: "headTop", bow: "earLeft", crown: "headTop", party_hat: "headTop",
  towel_turban: "headTop", flower: "earLeft", bow_tie: "neck", star: "brow", straw_hat: "headTop", pompom_hat: "headTop",
} as const satisfies Record<string, AnchorKind>;

export type DecorId = keyof typeof DECOR;
export const DECOR_IDS = Object.keys(DECOR) as DecorId[];
type DecorAnchors = Readonly<Record<DecorId, AnchorKind | null>>;
const OVERRIDES: Partial<Record<AnimalId, Partial<DecorAnchors>>> = {
  rabbit: { party_hat: null, straw_hat: null, pompom_hat: null, towel_turban: null, crown: null, bow: "earRight" },
  deer: { straw_hat: null, pompom_hat: null, party_hat: null, towel_turban: null },
  owl: { pompom_hat: null, bow: "earRight" },
  hedgehog: { flower: null },
  elephant: { bow: "earRight" },
  lion: { straw_hat: null },
  turtle: { bow: null, flower: null },
};

export const DECOR_COMPATIBILITY = Object.fromEntries(ANIMALS.map(({ id }) => [id, { ...DECOR, ...OVERRIDES[id] }])) as Readonly<Record<AnimalId, DecorAnchors>>;

export function decorAnchor(def: AnimalDef, id: DecorId): { kind: AnchorKind; point: Point } | null {
  const kind = DECOR_COMPATIBILITY[def.id][id];
  return kind ? { kind, point: def.anchors[kind] } : null;
}
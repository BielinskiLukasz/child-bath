import { expect, test } from "@playwright/test";
import { DECOR_COMPATIBILITY, DECOR_IDS, decorAnchor } from "../../src/animals/anchors";
import { ANIMALS, ANIMALS_BY_ID } from "../../src/animals/roster";
import { ANCHOR_KINDS } from "../../src/animals/types";
import { VIEWBOX } from "../../src/animals/geometry/template";

test("macierz 36 × 11 nie ma luk, a wszystkie kotwice mieszczą się w viewBoxie", () => {
  expect(DECOR_IDS).toHaveLength(11);
  expect(Object.keys(DECOR_COMPATIBILITY)).toHaveLength(36);
  for (const animal of ANIMALS) {
    expect(Object.keys(animal.anchors)).toHaveLength(5);
    for (const kind of ANCHOR_KINDS) {
      const [x, y] = animal.anchors[kind];
      expect(x).toBeGreaterThanOrEqual(VIEWBOX.x);
      expect(x).toBeLessThanOrEqual(VIEWBOX.x + VIEWBOX.w);
      expect(y).toBeGreaterThanOrEqual(VIEWBOX.y);
      expect(y).toBeLessThanOrEqual(VIEWBOX.y + VIEWBOX.h);
    }
    expect(Object.keys(DECOR_COMPATIBILITY[animal.id])).toHaveLength(11);
    for (const id of DECOR_IDS) {
      const kind = DECOR_COMPATIBILITY[animal.id][id];
      expect(kind === null || ANCHOR_KINDS.includes(kind)).toBe(true);
      const anchor = decorAnchor(animal, id);
      expect(anchor).toEqual(kind === null ? null : { kind, point: animal.anchors[kind] });
    }
  }
  for (const id of DECOR_IDS) expect(ANIMALS.filter((def) => decorAnchor(def, id)).length, id).toBeGreaterThanOrEqual(Math.ceil(ANIMALS.length * 0.8));
  expect(decorAnchor(ANIMALS_BY_ID.rabbit, "party_hat")).toBeNull();
  expect(decorAnchor(ANIMALS_BY_ID.rabbit, "bow")?.kind).toBe("earRight");
});
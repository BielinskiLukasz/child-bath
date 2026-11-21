import { expect, test } from "@playwright/test";
import { ANIMALS, ANIMALS_BY_ID, isAnimalId, pickAnimal } from "../../src/animals/roster";
import { ANIMAL_GROUPS, finishingAction } from "../../src/animals/traits";
import { COAT_LOOK, mixTone } from "../../src/animals/coats";

test("20 rozpoznawalnych definicji, grupy, kształty i paleta", () => {
  expect(ANIMALS).toHaveLength(20);
  expect(new Set(ANIMALS.map((animal) => animal.id)).size).toBe(20);
  expect(Object.keys(ANIMAL_GROUPS)).toHaveLength(5);
  expect(ANIMALS_BY_ID.labrador.palette).toMatchObject({ fur: "#e8c27a", furDark: "#c9a05a", accent: "#f3dcab" });
  expect(ANIMALS_BY_ID.dachowiec.palette.fur).toBe("#e2bc8d");
  expect(ANIMALS_BY_ID.lion.palette.furDark).toBe("#d9964a");
  expect(ANIMALS_BY_ID.elephant.palette.fur).toBe("#b9c9dc");
  expect(ANIMALS_BY_ID.panda.palette.furDark).toBe("#4a4560");
  expect(ANIMALS_BY_ID.koala.palette.fur).toBe("#aeb4bf");
  for (const animal of ANIMALS) {
    expect(animal.reactions.length, animal.id).toBeGreaterThanOrEqual(2);
    const parts = animal.shapes.filter((shape) => shape.silhouette).map(({ part }) => part);
    expect(parts, animal.id).toEqual(expect.arrayContaining(["head", "body", "paws", "arm"]));
    for (const shape of [...animal.shapes, ...Object.values(animal.eyes).flat()]) {
      expect(shape.matrix.length).toBe(6);
      expect(shape.matrix.every(Number.isFinite)).toBe(true);
      for (const color of [shape.fill, shape.stroke?.color].filter(Boolean)) {
        const resolved = color?.startsWith("#") ? color : animal.palette[color as keyof typeof animal.palette];
        expect(color === "none" || /^#[0-9a-f]{6}$/i.test(resolved ?? ""), `${animal.id}: ${color}`).toBe(true);
      }
      if (shape.stroke) expect(["eyes", "face", "nose", "extra"]).toContain(shape.part);
      if (shape.silhouette) expect(shape.stroke).toBeUndefined();
    }
  }
  expect(ANIMALS.filter(({ face }) => face === "custom").map(({ id }) => id)).toEqual(["owl", "duck", "sheep", "turtle"]);
});

test("losowanie z ziarnem nie powtarza postaci bezpośrednio", () => {
  expect(isAnimalId("__proto__")).toBe(false);
  expect(isAnimalId("frog")).toBe(true);
  const draws = (n: number) => {
    const ids = [pickAnimal(n).id];
    for (let i = 1; i < 120; i++) ids.push(pickAnimal(n + i * 317, ids[i - 1]).id);
    return ids;
  };
  const sequence = draws(12);
  expect(sequence).toEqual(draws(12));
  expect(new Set(sequence).size).toBe(20);
  expect(sequence.slice(1).every((id, i) => id !== sequence[i])).toBe(true);
});

test("siedem okryw ma własny efekt, a DP-4 wybiera tylko szczotkę lub głaskanie", () => {
  expect(new Set(Object.values(COAT_LOOK)).size).toBe(7);
  expect(mixTone("#b9c9dc", "#3f4d40", 0.15)).toBe("#a7b6c5");
  expect(finishingAction("futro")).toBe("comb");
  expect(finishingAction("welna")).toBe("comb");
  for (const coat of ["piora", "kolce", "skora", "luski", "skorupa"] as const) expect(finishingAction(coat)).toBe("pet");
});
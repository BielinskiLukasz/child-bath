import { expect, test } from "@playwright/test";
import { DECOR_COMPATIBILITY, DECOR_IDS } from "../../src/animals/anchors";
import { ANIMALS, ANIMALS_BY_ID, isAnimalId, pickAnimal } from "../../src/animals/roster";
import { NAME_CASES } from "../../src/animals/names";
import { ANIMAL_GROUPS } from "../../src/animals/traits";
import { ANCHOR_KINDS, ANIMAL_IDS, type AnimalGroup } from "../../src/animals/types";
import { validateAnimalExclusions } from "../../src/settings/animalSelection";
import { DEFAULT_BATH_SETTINGS } from "../../src/settings/defaults";

const PACKS = {
  wiejskie: ["rabbit", "fox", "bear", "hedgehog", "owl", "squirrel", "frog", "badger", "deer", "mouse", "duck", "sheep", "pig", "turtle", "otter"],
  dalekie: ["lion", "elephant", "panda", "koala", "capybara", "penguin"],
  pieski: ["labrador", "dalmatian", "dachshund", "poodle", "husky", "bulldog"],
  kotki: ["dachowiec", "persian", "siamese", "british"],
  dinozaury: ["diplodocus", "triceratops", "stegosaurus", "parasaurolophus", "trex"],
} as const;

test("36 unikalnych postaci i pełne dane w pięciu grupach", () => {
  expect(ANIMALS).toHaveLength(36);
  expect(new Set(ANIMAL_IDS).size).toBe(36);
  expect(DEFAULT_BATH_SETTINGS.allowedAnimals).toEqual(ANIMAL_IDS);
  for (const group of Object.keys(ANIMAL_GROUPS) as AnimalGroup[]) {
    expect(ANIMALS.filter((animal) => animal.group === group).map(({ id }) => id)).toEqual(PACKS[group]);
  }
  expect(isAnimalId("dog")).toBe(false);
  expect(isAnimalId("cat")).toBe(false);
  for (const animal of ANIMALS) {
    expect(NAME_CASES.every((key) => animal.names[key].trim().length > 0), animal.id).toBe(true);
    expect(["m", "f", "n"]).toContain(animal.rodzaj);
    expect(Object.keys(animal.anchors)).toEqual(expect.arrayContaining([...ANCHOR_KINDS]));
    expect(Object.keys(DECOR_COMPATIBILITY[animal.id])).toEqual([...DECOR_IDS]);
    expect(animal.scarf).toBeGreaterThanOrEqual(0);
    expect(animal.scarf).toBeLessThanOrEqual(3);
    expect(new Set(animal.reactions).size).toBeGreaterThanOrEqual(animal.group === "pieski" ? 3 : 2);
  }
});

test("rasy zachowują charakterystyczne palety i odrębne sylwetki", () => {
  const dogs = PACKS.pieski.map((id) => ANIMALS_BY_ID[id]);
  const cats = PACKS.kotki.map((id) => ANIMALS_BY_ID[id]);
  for (const breeds of [dogs, cats]) {
    const silhouettes = breeds.map(({ shapes }) => JSON.stringify(shapes.filter(({ silhouette }) => silhouette).map(({ part, el, attrs, matrix }) => [part, el, attrs, matrix])));
    expect(new Set(silhouettes).size).toBe(breeds.length);
  }
  for (const dog of dogs) expect(dog.reactions).toEqual(["tailWag", "shake", "stretch", "smileClosed"]);
  const { dalmatian, dachshund, poodle, husky, bulldog, persian, siamese, british } = ANIMALS_BY_ID;
  expect(dalmatian.palette).toMatchObject({ fur: "#f8f5e8", accent: "#fffcf3", furDark: "#4f4a66" });
  expect(dalmatian.shapes.filter(({ part, fill }) => part === "extra" && fill === "furDark")).toHaveLength(7);
  expect(dachshund.palette).toMatchObject({ fur: "#a8683f", accent: "#c58d62", furDark: "#7d4a2b" });
  expect(poodle.palette).toMatchObject({ fur: "#f1e6d6", accent: "#fbf4ea", furDark: "#e6d6bf" });
  expect(poodle.okrywa).toBe("welna");
  expect(poodle.coatProfile).toBe("pompons");
  expect(husky.palette).toMatchObject({ fur: "#8f98aa", accent: "#f6f4fa", furDark: "#6f788c" });
  expect(bulldog.palette).toMatchObject({ fur: "#e3b98c", accent: "#fbf1e4", furDark: "#c08f63" });
  expect(persian.coatProfile).toBe("plush");
  expect(siamese.palette.furDark).toBe("#6b5248");
  expect(british.palette.fur).toBe("#9aa4b1");
});

test("DP-5: T-Rex nie ma otwartej paszczy ani reakcji z otwieraniem pyszczka", () => {
  const { trex } = ANIMALS_BY_ID;
  expect(trex.palette.fur).toBe("#b9c79d");
  expect(trex.reactions).toEqual(["armWave", "smileClosed", "shine"]);
  const line = trex.shapes.filter((shape) => shape.part === "face" && shape.stroke);
  expect(line).toHaveLength(1);
  expect(line[0]).toMatchObject({ fill: "none", el: "path", attrs: { d: "M-12 11Q0 20 12 11" } });
  expect(trex.shapes.filter(({ part, motion }) => part === "arm" && motion === "paw")).toHaveLength(1);
  expect(PACKS.dinozaury.every((id) => ANIMALS_BY_ID[id].okrywa === "luski")).toBe(true);
});

test("walidacja i losowanie respektują wykluczenie T-Reksa i całej grupy", () => {
  const one = validateAnimalExclusions(["trex", "trex"], []);
  const group = validateAnimalExclusions([], ["dinozaury"]);
  expect(one.valid).toBe(true);
  expect(group.valid).toBe(true);
  if (!one.valid || !group.valid) throw new Error("Brak prawidłowych list zwierzątek.");
  expect(one.allowedAnimals).toHaveLength(35);
  expect(one.allowedAnimals).toContain("diplodocus");
  expect(one.allowedAnimals).not.toContain("trex");
  expect(group.allowedAnimals).toHaveLength(31);
  expect(PACKS.dinozaury.every((id) => !group.allowedAnimals.includes(id))).toBe(true);
  expect(validateAnimalExclusions(["__proto__"], [])).toEqual({ valid: false, reason: "unknown-animal" });
  expect(validateAnimalExclusions([], ["constructor"])).toEqual({ valid: false, reason: "unknown-group" });
  expect(validateAnimalExclusions([], ["wiejskie", "dalekie", "pieski", "kotki", "dinozaury"])).toEqual({ valid: false, reason: "too-few-animals" });
  let previous = pickAnimal(43, undefined, group.allowedAnimals).id;
  for (let seed = 44; seed < 144; seed++) {
    const next = pickAnimal(seed, previous, group.allowedAnimals);
    expect(next.group).not.toBe("dinozaury");
    expect(next.id).not.toBe(previous);
    previous = next.id;
  }
});
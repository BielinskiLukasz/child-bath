import { expect, test } from "@playwright/test";
import { ANIMAL_IDS } from "../../src/animals/types";
import { CLASSIC_STEPS } from "../../src/bath/steps";
import { readSessionParams } from "../../src/settings/testParams";

test("tryb jednoprzyciskowy i próba nakładania są dostępne tylko z trybem testowym", () => {
  const options = "layer=apply&oneButton=1&seed=7&ease=easy&pace=1.45&animal=lion";
  expect(readSessionParams(`?${options}`)).toMatchObject({
    steps: CLASSIC_STEPS, ease: "normal", pace: 1, oneButton: false,
  });
  expect(readSessionParams(`?${options}`)).not.toHaveProperty("animal");
  expect(readSessionParams(`?test=1&${options}`)).toEqual({
    steps: ["lather"], seed: 7, ease: "easy", pace: 1.45, oneButton: true, animal: "lion",
    allowedAnimals: ANIMAL_IDS,
  });
  expect(readSessionParams("?test=1&layer=unknown&oneButton=yes&seed=7")).toMatchObject({
    steps: CLASSIC_STEPS, oneButton: false,
  });
  expect(readSessionParams("?test=1&animal=constructor")).not.toHaveProperty("animal");
});

test("testowe wykluczenia wygrywają z ręcznym wyborem i nie zmieniają zwykłej gry", () => {
  const url = "?seed=7&animal=trex&excludeAnimal=trex";
  expect(readSessionParams(url).allowedAnimals).toContain("trex");
  const params = readSessionParams(`${url}&test=1`);
  expect(params.animal).toBeUndefined();
  expect(params.allowedAnimals).toHaveLength(35);
  expect(params.allowedAnimals).not.toContain("trex");
  const groups = readSessionParams("?test=1&excludeGroup=dinozaury&excludeAnimal=labrador");
  expect(groups.allowedAnimals).toHaveLength(30);
  expect(groups.allowedAnimals).not.toContain("diplodocus");
  expect(groups.allowedAnimals).not.toContain("labrador");
  expect(readSessionParams("?test=1&excludeGroup=unknown").allowedAnimals).toEqual(ANIMAL_IDS);
});

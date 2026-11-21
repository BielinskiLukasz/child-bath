import { expect, test } from "@playwright/test";
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
  });
  expect(readSessionParams("?test=1&layer=unknown&oneButton=yes&seed=7")).toMatchObject({
    steps: CLASSIC_STEPS, oneButton: false,
  });
  expect(readSessionParams("?test=1&animal=constructor")).not.toHaveProperty("animal");
});

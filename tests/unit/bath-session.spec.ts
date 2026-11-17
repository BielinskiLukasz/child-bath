import { expect, test } from "@playwright/test";
import { CLASSIC_STEPS } from "../../src/bath/steps";
import { readSessionParams } from "../../src/settings/testParams";

test("próbę nakładania i ustawienia diagnostyczne włącza tylko tryb testowy", () => {
  expect(readSessionParams("?layer=apply&seed=7&ease=easy&pace=1.45")).toMatchObject({
    steps: CLASSIC_STEPS, ease: "normal", pace: 1,
  });
  expect(readSessionParams("?test=1&layer=apply&seed=7&ease=easy&pace=1.45")).toEqual({
    steps: ["lather"], seed: 7, ease: "easy", pace: 1.45,
  });
  expect(readSessionParams("?test=1&layer=unknown&seed=7").steps).toEqual(CLASSIC_STEPS);
});
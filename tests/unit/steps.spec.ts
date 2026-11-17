import { expect, test } from "@playwright/test";
import { LW } from "../../src/bath/coverage";
import {
  brushRadius,
  CLASSIC_STEPS,
  EASE,
  isEaseKey,
  MIN_TOOL_CSS,
  STEPS,
  toolDiameterCss,
  type EaseKey,
} from "../../src/bath/steps";

const EASES = Object.keys(EASE) as EaseKey[];

test("średnica narzędzia ma co najmniej 44 px CSS także w najmniejszym pudełku", () => {
  const smallestBoxWidth = (160 * 64) / 84;
  for (const step of Object.values(STEPS)) {
    for (const ease of EASES) {
      const diameter = toolDiameterCss(step, ease, smallestBoxWidth);
      expect(diameter).toBeGreaterThanOrEqual(MIN_TOOL_CSS);
      // Promień logiczny przeliczony z powrotem na piksele daje tę samą średnicę.
      expect(((brushRadius(step, ease, smallestBoxWidth) * 2) / LW) * smallestBoxWidth).toBeCloseTo(diameter, 6);
    }
  }
});

test("progi łatwości wynoszą 0,8 / 0,9 / 0,95, a szerokość narzędzia rośnie z łatwością", () => {
  expect(EASES.map((ease) => EASE[ease].threshold)).toEqual([0.8, 0.9, 0.95]);
  const box = 487;
  const width = (ease: EaseKey) => toolDiameterCss(STEPS.rinse, ease, box);
  expect(width("easy")).toBeGreaterThan(width("normal"));
  expect(width("normal")).toBeGreaterThan(width("precise"));
});

test("kroki mają tryb zmywania albo nakładania, a rytuał roboczy to brud → piana → wilgoć", () => {
  expect(STEPS.scrub.mode).toBe("erase");
  expect(STEPS.rinse.mode).toBe("erase");
  expect(STEPS.dry.mode).toBe("erase");
  expect(STEPS.lather.mode).toBe("apply");
  expect(STEPS.groom.mode).toBe("apply");
  expect(CLASSIC_STEPS).toEqual(["scrub", "rinse", "dry"]);
});

test("pudełko bez szerokości daje promień 0, a łatwość jest sprawdzana", () => {
  expect(brushRadius(STEPS.scrub, "normal", 0)).toBe(0);
  expect(isEaseKey("easy")).toBe(true);
  expect(isEaseKey("hard")).toBe(false);
});

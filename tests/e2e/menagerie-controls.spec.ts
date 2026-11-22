import { expect, test, type Page } from "@playwright/test";
import { ANIMALS, ANIMALS_BY_ID, isAnimalId, pickAnimal } from "../../src/animals/roster";
import { name } from "../../src/animals/names";
import { CLASSIC_STEPS } from "../../src/bath/steps";
import { createRng, MAX_SEED } from "../../src/random";
import { waitForWashing } from "../helpers/bath";

async function pausedClock(page: Page) {
  const start = new Date("2026-06-01T12:00:00Z");
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
}

async function finishStepWithOneButton(page: Page): Promise<number> {
  const stage = page.locator(".bath-stage");
  await waitForWashing(page);
  let strokes = 0;
  while (strokes < 8 && await stage.getAttribute("data-phase") === "scrubbing") {
    await page.keyboard.press("Enter");
    await page.clock.runFor(1270);
    strokes++;
  }
  await expect(stage).toHaveAttribute("data-phase", "stage_rest");
  return strokes;
}

for (const dino of ANIMALS.filter((def) => def.group === "dinozaury")) {
  test(`${name(dino)}: każdy krok trybu jednoprzyciskowego mieści się w ośmiu ruchach`, async ({ page }) => {
    await pausedClock(page);
    await page.goto(`./?test=1&seed=11&animal=${dino.id}&oneButton=1`);
    const stage = page.locator(".bath-stage");
    await expect(stage).toHaveAttribute("data-animal", dino.id);
    await page.keyboard.press("Enter");
    await page.clock.runFor(2350);
    for (const step of CLASSIC_STEPS) {
      await expect(stage).toHaveAttribute("data-step", step);
      const strokes = await finishStepWithOneButton(page);
      if (dino.id === "diplodocus" && step === "scrub") expect(strokes).toBeGreaterThanOrEqual(6);
      await page.clock.runFor(step === "dry" ? 530 : 1950);
    }
    await expect(stage).toHaveAttribute("data-phase", "reward");
    await expect(stage.locator('[data-animal-state="washed"] [data-finish="scaled"]')).toHaveCount(1);
  });
}

test("wykluczenia działają przy pierwszym wyborze i po kąpieli", async ({ page }) => {
  await pausedClock(page);
  const stage = page.locator(".bath-stage");
  // Wybieramy powtarzalną sesję, w której bez ograniczenia po Misiu wyszedłby T-Rex.
  const seed = Array.from({ length: 300 }, (_, i) => i + 1).find((value) =>
    pickAnimal(createRng(value ^ 0x6d2b79f5).int(1, MAX_SEED), "bear").id === "trex");
  expect(seed).toBeDefined();
  await page.goto(`./?test=1&seed=${seed}&animal=bear&excludeAnimal=trex&oneButton=1&layer=apply`);
  await expect(stage).toHaveAttribute("data-animal", "bear");
  await page.keyboard.press("Enter");
  await page.clock.runFor(2350);
  await finishStepWithOneButton(page);
  await page.clock.runFor(4000);
  await expect(stage).toHaveAttribute("data-animal-turn", "2");
  await expect(stage).not.toHaveAttribute("data-animal", "trex");

  await page.goto("./?test=1&seed=11&animal=trex&excludeGroup=dinozaury");
  await expect(stage).toHaveAttribute("data-phase", "door_waiting");
  const chosen = await stage.getAttribute("data-animal");
  expect(isAnimalId(chosen) && ANIMALS_BY_ID[chosen].group !== "dinozaury").toBe(true);
});

test("T-Rex w galerii macha spokojnie i można ocenić sylwetkę bez podpisów", async ({ page }) => {
  await pausedClock(page);
  await page.goto("./?test=1&gallery=animals&animal=trex&group=dinozaury&pace=0.8");
  const gallery = page.locator(".animal-gallery");
  const inspector = gallery.locator(".gallery-inspector");
  const cards = gallery.locator("[data-gallery-animal]");
  await expect(cards).toHaveCount(5);
  await gallery.getByLabel("Pokaż podpisy postaci").uncheck();
  await expect(cards.first().locator("strong")).toBeHidden();
  await expect(inspector.getByRole("heading", { name: "T-Rex" })).toBeVisible();
  await expect(inspector.locator('[data-play-reaction="yawn"]')).toHaveCount(0);
  await inspector.getByRole("button", { name: "Macha łapką" }).click();
  await expect(inspector.locator('[data-reaction="armWave"]')).toBeVisible();
  expect(await inspector.locator('[data-motion="paw"]').evaluate((paw) =>
    paw.getAnimations().every((motion) => Number(motion.effect?.getTiming().duration) >= 1200) && paw.getAnimations().length > 0,
  )).toBe(true);
  await expect(inspector.locator(".animal-yawn")).toHaveCount(0);
});
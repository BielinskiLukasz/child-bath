import { expect, test } from "@playwright/test";
import { ANIMAL_IDS } from "../../src/animals/types";
import { ANIMALS_BY_ID } from "../../src/animals/roster";
import { byGender, name } from "../../src/animals/names";
import { waitForWashing } from "../helpers/bath";

for (const animal of ANIMAL_IDS) {
  test(`${name(ANIMALS_BY_ID[animal])} przechodzi wszystkie kroki kąpieli`, async ({ page }) => {
    const now = new Date("2026-06-01T12:00:00Z");
    await page.clock.install({ time: now });
    await page.clock.pauseAt(new Date(now.getTime() + 1000));
    await page.goto(`./?test=1&seed=7&animal=${animal}&scenery=bathroom&still=1`);
    const stage = page.locator(".bath-stage");
    const animalArt = page.locator(".bath-animal");
    const box = page.locator(".bath-box");
    await expect(stage).toHaveAttribute("data-animal", animal);
    await expect(page.locator(".door-preview-animal [data-part=scarf]")).toHaveCount(1);
    await page.keyboard.press("Enter");
    await page.clock.runFor(2300);
    await waitForWashing(page);
    await expect(page.locator(".hanging-scarf")).toHaveCSS("opacity", "1");
    await expect(animalArt.locator("[data-part=scarf]")).toHaveCount(0);

    for (const step of ["scrub", "rinse", "dry"]) {
      await expect(stage).toHaveAttribute("data-step", step);
      await expect(animalArt.locator(".animal-svg")).toHaveAttribute("data-animal-state", step === "scrub" ? "dirty" : "wet");
      await box.evaluate((element) => {
        const r = element.getBoundingClientRect();
        const event = (kind: string, x: number, y: number) => element.dispatchEvent(new PointerEvent(kind, {
          pointerId: 22, pointerType: "touch", bubbles: true, button: 0,
          clientX: r.left + x * r.width, clientY: r.top + y * r.height,
        }));
        event("pointerdown", 0.025, 0.025);
        for (let row = 1; row <= 28; row++) {
          const y = row / 29;
          const x = row % 2 ? 0.025 : 0.975;
          event("pointermove", x, y);
          event("pointermove", 1 - x, y);
        }
        event("pointerup", 0.025, 0.975);
      });
      await page.clock.runFor(40);
      await expect(stage).toHaveAttribute("data-phase", "stage_rest");
      await page.clock.runFor(step === "dry" ? 520 : 1960);
      if (step !== "dry") await waitForWashing(page);
    }

    const def = ANIMALS_BY_ID[animal];
    await expect(stage).toHaveAttribute("data-phase", "reward");
    await expect(animalArt.locator('[data-animal-state="washed"]')).toHaveCount(1);
    await expect(page.locator("[aria-live]")).toHaveText(`${name(def)} jest ${byGender(def, { m: "czysty", f: "czysta", n: "czyste" })}.`);
    await page.clock.runFor(2000);
    await expect(stage).toHaveAttribute("data-phase", "to_bench");
    await expect(animalArt.locator('[data-wear="robe"]')).toHaveCount(1);
    await expect(animalArt.locator("[data-part=scarf]")).toHaveCount(1);
    await page.clock.runFor(1450);
    await expect(stage).toHaveAttribute("data-phase", "door_waiting");
    await expect(stage).not.toHaveAttribute("data-animal", animal);
  });
}
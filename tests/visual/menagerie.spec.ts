import { expect, test } from "@playwright/test";
import { ANIMALS } from "../../src/animals/roster";
import { ANIMAL_GROUPS } from "../../src/animals/traits";
import type { AnimalGroup } from "../../src/animals/types";

test.skip(process.platform !== "linux", "Referencje są generowane w tym samym Chromium na Linuksie co CI.");

for (const group of Object.keys(ANIMAL_GROUPS) as AnimalGroup[]) {
  test(`${ANIMAL_GROUPS[group]}: cztery stany w galerii`, async ({ page }) => {
    await page.goto(`./?test=1&gallery=animals&still=1&group=${group}`);
    const gallery = page.locator(".animal-gallery");
    const grid = gallery.locator(".gallery-grid");
    const statePicker = gallery.getByLabel("Stan wszystkich postaci");
    await expect(gallery).toHaveAttribute("data-still", "true");
    await expect(grid.locator("[data-gallery-animal]")).toHaveCount(ANIMALS.filter((def) => def.group === group).length);
    await page.evaluate(async () => { await document.fonts.ready; });

    for (const state of ["clean", "wet", "washed", "robe"]) {
      await statePicker.selectOption(state);
      await expect(grid.locator("[data-animal-state]").first()).toHaveAttribute("data-animal-state", state);
      await expect(grid).toHaveScreenshot(`${group}-${state}.png`, {
        animations: "disabled", caret: "hide", scale: "css", maxDiffPixelRatio: 0.003,
      });
    }
  });
}
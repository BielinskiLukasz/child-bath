// Źródło: child-train@b881e09:tests/atmosphere.spec.ts (próby ciągłości i ukrytej karty).
// Zmiany: symulacja aktywnej kąpieli i okno z przyciętą pogodą.
import { expect, test, type Page } from "@playwright/test";

const variables = ["--day-hour", "--sky-top", "--sky-bottom", "--moon-phase-shift", "--rain-opacity", "--snow-opacity", "--foliage-a", "--blossom"];
const world = (page: Page) => page.locator(".little-world");
const weatherLayer = (page: Page) => page.locator(".world-board[data-scene-role=current]");

async function useClock(page: Page) {
  const start = new Date("2026-06-01T12:00:00Z");
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
}

function atmosphere(page: Page) {
  return world(page).evaluate((element, properties) => Object.fromEntries(properties.map((key) => [key, getComputedStyle(element).getPropertyValue(key)])), variables);
}

async function hide(page: Page, hidden: boolean) {
  await page.evaluate((value) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

test("godzina startuje z kąpielą, zatrzymuje się z kartą i nie przeskakuje po wznowieniu", async ({ page }) => {
  await useClock(page);
  await page.goto("./?test=1&seed=77&scenery=bathroom&hour=17.49&weather=rain");
  await expect(world(page)).toHaveAttribute("data-time-of-day", "day");
  const before = await atmosphere(page);
  await page.clock.runFor(4000);
  expect(await atmosphere(page)).toEqual(before);
  await page.keyboard.press("Enter");
  await expect(world(page)).toHaveAttribute("data-phase", "arriving");
  await page.clock.runFor(3600);
  await expect(world(page)).toHaveAttribute("data-time-of-day", "dusk");
  const during = await atmosphere(page);
  expect(Number(during["--day-hour"]) - 17.49).toBeCloseTo(3.6 / 120, 3);
  expect(during["--sky-top"]).not.toBe(before["--sky-top"]);
  await hide(page, true);
  await expect(world(page)).toHaveAttribute("data-paused", "true");
  await page.clock.runFor(12500);
  expect(await atmosphere(page)).toEqual(during);
  await expect(weatherLayer(page).locator(".rain-drop").first()).toHaveCSS("animation-play-state", "paused");
  await hide(page, false);
  await page.clock.runFor(1200);
  const resumed = await atmosphere(page);
  expect(Number(resumed["--day-hour"]) - Number(during["--day-hour"])).toBeCloseTo(0.01, 3);
  expect(resumed["--moon-phase-shift"]).toBe(before["--moon-phase-shift"]);
});

test("w łazience opady są tylko za szybą; na zewnątrz pada na scenerię", async ({ page }) => {
  await page.goto("./?test=1&scenery=bathroom&time=night&weather=snow&season=winter");
  await expect(world(page)).toHaveAttribute("data-weather", "snow");
  await expect(weatherLayer(page).locator(".atmosphere-weather")).toHaveCount(1);
  await expect(weatherLayer(page).locator("[data-window-view] .atmosphere-weather")).toHaveCount(1);
  expect(await page.locator("[data-window-view]").evaluate((el) => {
    const clip = el.querySelector("g[clip-path]");
    return Boolean(clip?.contains(el.querySelector(".atmosphere-snow")));
  })).toBe(true);
  await expect(weatherLayer(page).locator(".atmosphere-snow")).toHaveCSS("opacity", "0.9");
  await page.goto("./?test=1&scenery=garden&time=day&weather=rain");
  await expect(weatherLayer(page).locator(".world-backdrop .atmosphere-weather")).toHaveCount(1);
  await expect(weatherLayer(page).locator(".atmosphere-rain")).toHaveCSS("opacity", "0.73");
});

test("ustawienia stałe wygrywają z kolejną rundą i ograniczony ruch zatrzymuje pogodę", async ({ page }) => {
  await useClock(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./?test=1&seed=7&scenery=bathroom&time=night&season=winter&weather=snow");
  await expect(world(page)).toHaveAttribute("data-atmosphere-mode", "override");
  const before = await atmosphere(page);
  await expect(weatherLayer(page).locator(".snow-flake").first()).toHaveCSS("animation-name", "none");
  expect(await page.evaluate(() => window.__bath?.nextRound())).toBe(true);
  await page.clock.runFor(8500);
  await expect(world(page)).toHaveAttribute("data-round", "2");
  await expect(world(page)).toHaveAttribute("data-scenery", "bathroom");
  await expect(world(page)).toHaveAttribute("data-season", "winter");
  await expect(world(page)).toHaveAttribute("data-weather", "snow");
  expect(await atmosphere(page)).toEqual(before);
});
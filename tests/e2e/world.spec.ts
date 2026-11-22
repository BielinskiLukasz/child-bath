import { expect, test, type Locator, type Page } from "@playwright/test";
import { SEASONS, WEATHER_TYPES } from "../../src/world/atmosphere";
import { SCENERY_IDS, SCENERY_RULES } from "../../src/world/scenery";
import { waitForWashing } from "../helpers/bath";

const world = (page: Page) => page.locator(".little-world");
const active = (page: Page) => page.locator(".world-board[data-scene-role=current]");
const sizes = [[360, 640], [640, 360], [1280, 800]] as const;

async function pausedClock(page: Page) {
  const start = new Date("2026-06-01T12:00:00Z");
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
}

async function inside(element: Locator, stage: NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>>) {
  const box = await element.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
  expect(box!.x).toBeGreaterThanOrEqual(stage.x - 1);
  expect(box!.y).toBeGreaterThanOrEqual(stage.y - 1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(stage.x + stage.width + 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(stage.y + stage.height + 1);
}

for (const id of SCENERY_IDS) {
  test(`${SCENERY_RULES[id].name}: balia, trzy miejsca i zapowiedź mieszczą się w każdym widoku`, async ({ page }) => {
    await page.goto(`./?test=1&seed=6&animal=otter&scenery=${id}&still=1&time=day`);
    await expect(world(page)).toHaveAttribute("data-scenery", id);
    await expect(active(page).locator("[data-water-fixture]")).toHaveAttribute("data-water-fixture", SCENERY_RULES[id].water);
    await expect(active(page).locator("[data-bench-seat]")).toHaveCount(3);
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      const scene = page.locator("#scene");
      const stage = (await scene.boundingBox())!;
      await expect.poll(() => active(page).locator(".world-props").getAttribute("viewBox")).toBe(`0 0 ${stage.width} ${stage.height}`);
      const features = ["[data-preview-place]", "[data-scene-tub]", "[data-bench]", "[data-companion]"];
      for (const feature of features) for (const item of await active(page).locator(feature).all()) await inside(item, stage);
      await inside(page.locator(".door-preview-animal"), stage);
      const companions = await active(page).locator("[data-companion]").count();
      expect(companions).toBeGreaterThanOrEqual(1);
      expect(companions).toBeLessThanOrEqual(2);
      const tub = (await active(page).locator("[data-scene-tub]").boundingBox())!;
      for (const companion of await active(page).locator("[data-companion]").all()) {
        const buddy = (await companion.boundingBox())!;
        const center = buddy.x + buddy.width / 2;
        expect(center).toBeGreaterThan(tub.x);
        expect(center).toBeLessThan(tub.x + tub.width);
        expect(buddy.y + buddy.height).toBeGreaterThan(tub.y);
        const duration = await companion.locator(".world-companion__body").evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
        expect(duration).toBeGreaterThanOrEqual(4);
        expect(duration).toBeLessThanOrEqual(6);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight)).toBe(true);
    }
  });
}

async function washDirt(page: Page) {
  await page.locator(".bath-box").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const point = (type: string, x: number, y: number) => element.dispatchEvent(new PointerEvent(type, {
      pointerType: "touch", pointerId: 18, bubbles: true, button: 0,
      clientX: rect.left + x * rect.width, clientY: rect.top + y * rect.height,
    }));
    point("pointerdown", .03, .03);
    for (let row = 1; row < 28; row++) {
      const x = row % 2 ? .03 : .97;
      point("pointermove", x, row / 28);
      point("pointermove", 1 - x, row / 28);
    }
    point("pointerup", .03, .97);
  });
  await page.clock.runFor(1990);
  await waitForWashing(page);
}

for (const id of ["bathroom", "garden", "forest_spring"] as const) {
  const { water } = SCENERY_RULES[id];
  test(`${water}: płukanie korzysta z narzędzia i strumienia scenerii`, async ({ page }) => {
    await pausedClock(page);
    await page.goto(`./?test=1&animal=bear&scenery=${id}&time=day&weather=clear`);
    await expect(page.locator(".bath-stage")).toHaveAttribute("data-step", "scrub");
    await page.keyboard.press("Enter");
    await page.clock.runFor(2350);
    await waitForWashing(page);
    await washDirt(page);
    await expect(page.locator(".bath-stage")).toHaveAttribute("data-step", "rinse");
    await expect(page.locator(".bath-tools")).toHaveAttribute("data-water-source", water);
    const box = (await page.locator(".bath-box").boundingBox())!;
    await page.mouse.move(box.x + box.width * .48, box.y + box.height * .43);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * .55, box.y + box.height * .52);
    await page.clock.runFor(120);
    const stream = page.locator(`[data-water-stream=${water}][data-visible=true]`);
    await expect(stream).toHaveCount(1);
    await expect(page.locator(`[data-visible=true] [data-water-tool=${water}]`)).toHaveCount(1);
    await expect(page.locator(".bath-particle--drop").first()).toBeAttached();
    expect(await stream.evaluate((node) => (node as SVGElement).style.transform)).toContain(water === "shower" ? "scaleY" : "translate(");
    await page.mouse.up();
    await expect(stream).toHaveCount(0);
  });
}

test("zegar na ścianie ma wskazówki zgodne z godziną symulacji", async ({ page }) => {
  await page.goto("./?test=1&scenery=bathroom&hour=6.25&still=1");
  await expect(page.locator("[data-world-clock]")).toBeVisible();
  const orientation = (hand: string) => page.locator(`.clock-hand--${hand}`).evaluate((node) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
    return (Math.atan2(matrix.b, matrix.a) * 180 / Math.PI + 360) % 360;
  });
  expect(await orientation("hour")).toBeCloseTo(187.5, 2);
  expect(await orientation("minute")).toBeCloseTo(90, 2);
});

test("zmiana rundy przenika, przesuwa sezon i pogodę oraz nie powtarza scenerii", async ({ page }) => {
  await pausedClock(page);
  await page.goto("./?test=1&seed=7&hour=12&pace=1.45");
  const root = world(page);
  const current = await root.getAttribute("data-scenery");
  const season = await root.getAttribute("data-season");
  const weather = await root.getAttribute("data-weather");
  const color = () => root.evaluate((el) => getComputedStyle(el).getPropertyValue("--foliage-a"));
  const firstColor = await color();
  const roundChange = () => page.evaluate(() => window.__bath?.nextRound());
  expect(await roundChange()).toBe(true);
  await expect(root).toHaveAttribute("data-round", "2");
  await expect(root).not.toHaveAttribute("data-scenery", current!);
  expect(await roundChange()).toBe(false);
  const fading = page.locator(".world-board");
  await expect(fading).toHaveCount(2);
  const fade = Number(await page.locator(".world-layer").getAttribute("data-fade-seconds"));
  expect(fade).toBeGreaterThanOrEqual(1.2 * 1.45);
  expect(await active(page).evaluate((node) => Number(getComputedStyle(node).opacity))).toBeLessThanOrEqual(0.01);
  await page.clock.runFor(670);
  await expect(root).toHaveAttribute("data-season", SEASONS[(SEASONS.indexOf(season as typeof SEASONS[number]) + 1) % SEASONS.length]);
  await expect(root).toHaveAttribute("data-weather", weather!);
  const middle = await active(page).evaluate((node) => Number(getComputedStyle(node).opacity));
  expect(middle).toBeGreaterThan(0.05);
  expect(middle).toBeLessThan(.8);
  expect(await color()).not.toBe(firstColor);
  await page.clock.runFor(1700);
  await expect(fading).toHaveCount(1);
  await expect(active(page)).toHaveCSS("opacity", "1");
  await page.clock.runFor(6000);
  await expect(root).toHaveAttribute("data-weather", WEATHER_TYPES[(WEATHER_TYPES.indexOf(weather as typeof WEATHER_TYPES[number]) + 1) % WEATHER_TYPES.length]);
  await page.goto("./?scenery=bathroom&time=night");
  expect(await page.evaluate(() => window.__bath)).toBeUndefined();
  await expect(root).toHaveAttribute("data-atmosphere-mode", "dynamic");
});
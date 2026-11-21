import { expect, test, type Page } from "@playwright/test";
import { waitForWashing } from "../helpers/bath";

const EPOCH = new Date("2026-06-01T12:00:00Z");
const scene = (page: Page) => page.locator(".bath-stage");
const world = (page: Page) => page.locator(".little-world");
const button = (page: Page) => page.locator("[data-bath-control]");
const phase = (page: Page, value: string) => expect(scene(page)).toHaveAttribute("data-phase", value);
const inputReady = (page: Page) => expect(world(page)).toHaveAttribute("data-input-ready", "true");

async function openWithClock(page: Page, query = "") {
  await page.clock.install({ time: EPOCH });
  await page.clock.pauseAt(new Date(EPOCH.getTime() + 1000));
  await page.goto(`./?test=1&seed=7${query}`);
  await phase(page, "door_waiting");
}

async function readyForWork(page: Page) {
  await page.clock.runFor(2400);
  await waitForWashing(page);
}

async function zigzagWithKeyboard(page: Page, step: string) {
  for (let i = 0; i < 200; i++) {
    if (await scene(page).getAttribute("data-phase") !== "scrubbing") break;
    await page.keyboard.press(i % 2 ? "Enter" : "Space");
    // Grupujemy klatki, ale wszystkie gesty są prawdziwymi naciśnięciami.
    if (i % 8 === 7) await page.clock.runFor(32);
  }
  await phase(page, "stage_rest");
  await expect(scene(page)).toHaveAttribute("data-step", step);
}

async function tapControl(page: Page, touch: boolean, force = false) {
  const control = button(page);
  if (touch) await control.tap({ force });
  else await control.click({ force });
}

test("pierwsze zwierzątko czeka, a Dalej zachowuje fokus i ma odpowiedni rozmiar", async ({ page }, testInfo) => {
  await openWithClock(page);
  const control = button(page);
  const animal = page.locator(".door-preview-animal");
  await expect(animal).toBeVisible();
  const [preview, box, target] = await Promise.all([animal.boundingBox(), page.locator(".bath-box").boundingBox(), control.boundingBox()]);
  if (!preview || !box || !target) throw new Error("Brak wymiarów sceny albo przycisku.");
  expect(preview.x + preview.width).toBeLessThan(box.x);
  expect(target.height).toBeGreaterThanOrEqual(testInfo.project.use.hasTouch ? 74 : 50);
  await page.clock.runFor(4500);
  await phase(page, "door_waiting");
  await page.keyboard.press("Tab");
  await expect(control).toBeFocused();
  await expect(control).toHaveCSS("outline-width", "4px");
  await tapControl(page, Boolean(testInfo.project.use.hasTouch));
  await phase(page, "arriving");
  await expect(control).toHaveAttribute("aria-disabled", "true");
  await expect(control).toBeFocused();
  await page.clock.runFor(650); // Minęła blokada, ale zwierzątko jeszcze wchodzi.
  await tapControl(page, Boolean(testInfo.project.use.hasTouch), true);
  await phase(page, "arriving");
  await readyForWork(page);
  await tapControl(page, Boolean(testInfo.project.use.hasTouch), true);
  await phase(page, "scrubbing");
  await expect(control).toHaveAttribute("aria-disabled", "true");
});

test("Tab, strzałki, Spacja i Enter prowadzą przez całą kąpiel bez myszy", async ({ page }) => {
  await openWithClock(page, "&ease=easy&animal=bear");
  const box = page.getByRole("application", { name: /Miś do kąpieli/ });
  await page.keyboard.press("Tab");
  await expect(button(page)).toBeFocused();
  await page.keyboard.press("Enter");
  await phase(page, "arriving");
  await readyForWork(page);
  await page.keyboard.press("Shift+Tab");
  await expect(box).toBeFocused();
  await expect(box).toHaveCSS("outline-width", "4px");
  await expect(page.locator('.tool-cursor[data-keyboard="true"][data-visible="true"]')).toHaveCount(1);
  await page.keyboard.press("ArrowRight");
  await page.clock.runFor(32);
  await expect(scene(page)).not.toHaveAttribute("data-progress", "0.00");
  await page.keyboard.press("ArrowLeft");

  for (const step of ["scrub", "rinse", "dry"]) {
    await expect(scene(page)).toHaveAttribute("data-step", step);
    await zigzagWithKeyboard(page, step);
    await page.clock.runFor(step === "dry" ? 4250 : 2000);
    if (step !== "dry") await waitForWashing(page);
  }
  await phase(page, "door_waiting");
  await expect(scene(page)).toHaveAttribute("data-animal-turn", "2");
  await expect(scene(page)).not.toHaveAttribute("data-animal", "bear");
  await expect(button(page)).toBeFocused();
  await expect(button(page)).toHaveAttribute("aria-disabled", "false");
  await page.clock.runFor(1400);
  await phase(page, "door_waiting");
  await page.keyboard.press("Enter");
  await phase(page, "arriving");
});

test("w trybie jednoprzyciskowym szybka seria i przytrzymanie nie kolejkują pasów", async ({ page }, testInfo) => {
  await openWithClock(page, "&oneButton=1&animal=bear");
  const touch = Boolean(testInfo.project.use.hasTouch);
  if (touch) await tapControl(page, true);
  else await page.keyboard.press("Enter");
  await readyForWork(page);
  const stage = scene(page);
  const control = button(page);
  await expect(control).toHaveAttribute("aria-disabled", "false");

  await page.keyboard.down("Enter");
  await expect(stage).toHaveAttribute("data-auto-strokes", "1");
  await expect(control).toHaveAttribute("aria-disabled", "true");
  for (let i = 0; i < 10; i++) {
    await page.keyboard.down("Enter");
    await page.clock.runFor(75);
  }
  await page.keyboard.up("Enter");
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Enter");
    if (i === 4) await tapControl(page, touch, true);
    await page.clock.runFor(15);
  }
  await expect(stage).toHaveAttribute("data-auto-strokes", "1");
  await page.clock.runFor(400);
  await expect(control).toHaveAttribute("aria-disabled", "false");
  await page.clock.runFor(500);
  await expect(stage).toHaveAttribute("data-auto-strokes", "1");

  let presses = 1;
  while (presses < 8 && await stage.getAttribute("data-phase") === "scrubbing") {
    await tapControl(page, touch);
    presses++;
    await page.clock.runFor(1280);
  }
  expect(presses).toBeGreaterThanOrEqual(6);
  expect(presses).toBeLessThanOrEqual(8);
  await phase(page, "stage_rest");
  await page.clock.runFor(2000);
  await expect(stage).toHaveAttribute("data-step", "rinse");
  await waitForWashing(page);
  await expect(stage).toHaveAttribute("data-auto-strokes", "0");
});

test("jeden region ogłasza wszystkie fazy, a ograniczony ruch działa od razu", async ({ page }) => {
  await openWithClock(page, "&oneButton=1&layer=apply&animal=frog");
  const live = page.locator("[aria-live]");
  const infinite = () => page.evaluate(() => document.getAnimations().filter((a) => a.effect?.getTiming().iterations === Infinity).length);
  await expect(live).toHaveCount(1);
  await expect(live).toHaveAttribute("aria-live", "polite");
  await expect(live).toContainText("czeka na kąpiel");
  await expect.poll(infinite).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(infinite).toBe(0);
  await page.keyboard.press("Enter");
  await expect(live).toHaveText("Żabka wchodzi do kąpieli.");
  await page.clock.runFor(880);
  await expect(live).toHaveText("Przygotowanie kroku 1.");
  await page.clock.runFor(1440);
  await waitForWashing(page);
  await expect(live).toHaveText("Krok 1 z 1: namydlanie.");

  for (let i = 0; i < 8; i++) {
    if (await scene(page).getAttribute("data-phase") !== "scrubbing") break;
    await page.keyboard.press("Enter");
    await page.clock.runFor(700);
    const particle = page.locator('.bath-particle[style*="translate"]').first();
    const transform = await particle.evaluate((element) => (element as SVGElement).style.transform);
    await page.clock.runFor(120);
    const later = await particle.evaluate((element) => (element as SVGElement).style.transform);
    if (i === 0) expect(later).toBe(transform);
    expect(await page.locator('.bath-particle').evaluateAll((nodes) => nodes.filter((node) => Number((node as SVGElement).style.opacity) > 0).length)).toBeLessThanOrEqual(6);
    await page.clock.runFor(425);
  }
  await page.clock.runFor(80);
  await expect(live).toHaveText("Żabka jest czysta.");
  await expect.poll(infinite).toBe(0);
  await page.clock.runFor(2050);
  await expect(live).toHaveText("Żabka odchodzi odpocząć.");
  await page.clock.runFor(1450);
  await expect(live).toContainText("czeka na kąpiel");
  await inputReady(page);
});

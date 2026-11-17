import { expect, test, type Page } from "@playwright/test";

const STAGE = ".bath-stage";
const BOX = ".bath-box";

async function waitPhase(page: Page, phase: string) {
  await expect(page.locator(STAGE)).toHaveAttribute("data-phase", phase, { timeout: 15_000 });
}

async function progressOf(page: Page): Promise<number> {
  return Number(await page.locator(STAGE).getAttribute("data-progress"));
}

async function boxOf(page: Page) {
  const box = await page.locator(BOX).boundingBox();
  if (!box) throw new Error("Pudełko kąpieli nie ma wymiarów.");
  return box;
}

/** Zygzak myszą przez bieżący krok, bez pocierania podczas przejścia do następnego. */
async function scrubWithMouse(page: Page) {
  const stage = page.locator(STAGE);
  const step = await stage.getAttribute("data-step");
  const box = await boxOf(page);
  const rows = 18;
  const left = box.x + 2;
  const right = box.x + box.width - 2;
  await page.mouse.move(left, box.y + 2);
  await page.mouse.down();
  try {
    for (let row = 0; row <= rows; row++) {
      const stillScrubbing = await stage.evaluate((element, kind) =>
        element.getAttribute("data-step") === kind && element.getAttribute("data-phase") === "scrubbing", step);
      if (!stillScrubbing) break;
      const y = box.y + 2 + ((box.height - 4) * row) / rows;
      const [from, to] = row % 2 === 0 ? [left, right] : [right, left];
      await page.mouse.move(from, y);
      await page.mouse.move(to, y, { steps: 4 });
    }
  } finally {
    await page.mouse.up();
  }
}

/** Poziome pociągnięcie jednym albo dwoma palcami naraz (CDP, Chromium). */
async function strokeWithFingers(page: Page, fingers: 1 | 2): Promise<number> {
  await page.goto("./?test=1&seed=3");
  await waitPhase(page, "scrubbing");
  const box = await boxOf(page);
  const ys = [0.55, 0.75].slice(0, fingers).map((fraction) => box.y + box.height * fraction);
  const x0 = box.x + box.width * 0.25;
  const x1 = box.x + box.width * 0.75;
  const points = (x: number) => ys.map((y, id) => ({ x, y, id }));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: points(x0) });
  for (let stepIndex = 1; stepIndex <= 12; stepIndex++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: points(x0 + ((x1 - x0) * stepIndex) / 12) });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => progressOf(page)).toBeGreaterThan(0);
  await page.waitForTimeout(200);
  return progressOf(page);
}

async function setHidden(page: Page, hidden: boolean) {
  await page.evaluate((value) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (value ? "hidden" : "visible") });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

test("pocieranie myszą przechodzi trzy kroki, a potem pojawia się nowe zwierzątko", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./?test=1&seed=7&ease=easy");
  const stage = page.locator(STAGE);
  await expect(stage).toHaveAttribute("data-animal", "sketch-1");

  for (const step of ["scrub", "rinse", "dry"]) {
    await expect(stage).toHaveAttribute("data-step", step, { timeout: 15_000 });
    await waitPhase(page, "scrubbing");
    await scrubWithMouse(page);
  }

  // Następny data-step (lub data-animal po ostatnim) dowodzi domknięcia kroku nawet
  // wtedy, gdy przeglądarka zdążyła już wejść w kolejną fazę „scrubbing”.
  await expect(stage).toHaveAttribute("data-animal", "sketch-2", { timeout: 15_000 });
  await expect(stage).toHaveAttribute("data-step", "scrub");
  await expect(page.locator(".little-world")).toHaveAttribute("data-phase", /^(stage_in|scrubbing)$/);
  expect(errors).toEqual([]);
});

test("dwa palce naraz myją szybciej niż jeden", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, "Test wielodotyku działa tylko na ekranach dotykowych.");
  const one = await strokeWithFingers(page, 1);
  const two = await strokeWithFingers(page, 2);
  expect(two).toBeGreaterThan(one * 1.4);
});

test("obrót ekranu w trakcie kroku nie zmienia postępu", async ({ page }) => {
  await page.goto("./?test=1&seed=5");
  await waitPhase(page, "scrubbing");
  const box = await boxOf(page);
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.6);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.6, { steps: 10 });
  await page.mouse.up();
  await expect.poll(() => progressOf(page)).toBeGreaterThan(0);
  await page.waitForTimeout(200);
  const before = await progressOf(page);

  const viewport = page.viewportSize();
  if (!viewport) throw new Error("Brak rozmiaru okna.");
  await page.setViewportSize({ width: viewport.height, height: viewport.width });
  await page.waitForTimeout(400);
  expect(await progressOf(page)).toBe(before);
  await expect(page.locator(STAGE)).toHaveAttribute("data-phase", "scrubbing");
});

test("ukryta karta wstrzymuje przejście, a po powrocie zabawa toczy się dalej", async ({ page }) => {
  await page.goto("./?test=1&seed=9&pace=1.45");
  await setHidden(page, true);
  await page.waitForTimeout(1600);
  await expect(page.locator(STAGE)).toHaveAttribute("data-phase", "stage_in");
  await setHidden(page, false);
  await waitPhase(page, "scrubbing");
});

test("kąpiel nie wysyła zapytań poza urządzenie", async ({ context, page }) => {
  const external: string[] = [];
  context.on("request", (request) => {
    const url = new URL(request.url());
    if (!["data:", "blob:", "about:"].includes(url.protocol) && url.hostname !== "localhost") external.push(request.url());
  });
  await page.goto("./?test=1&seed=11&ease=easy");
  await waitPhase(page, "scrubbing");
  await scrubWithMouse(page);
  await expect(page.locator(STAGE)).not.toHaveAttribute("data-phase", "scrubbing", { timeout: 15_000 });
  expect(external).toEqual([]);
});

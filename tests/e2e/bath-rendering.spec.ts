import { expect, test, type Page } from "@playwright/test";
import { insideMask } from "../../src/animals/sketch";
import { createGrid, LH, LW, progress, stampSegment } from "../../src/bath/coverage";
import { brushRadius, STEPS } from "../../src/bath/steps";

const BOX = ".bath-box";
const STAGE = ".bath-stage";

async function layerAlpha(page: Page) {
  // Odczyt pikseli jest wyłącznie w teście, nigdy podczas gry.
  return page.locator(".bath-layer").evaluate((element, { width, height }) => {
    const canvas = element as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const alpha = (x: number, y: number) => ctx.getImageData(
      Math.round(x * canvas.width / width), Math.round(y * canvas.height / height), 1, 1,
    ).data[3];
    return { center: alpha(128, 168), body: alpha(128, 276), outside: alpha(40, 168) };
  }, { width: LW, height: LH });
}

for (const mode of ["erase", "apply"] as const) {
  test(`znany gest ${mode === "erase" ? "zmywa" : "nakłada"} warstwę dokładnie pod narzędziem`, async ({ page }) => {
    const step = mode === "erase" ? STEPS.scrub : STEPS.lather;
    await page.goto(`./?test=1&seed=7&layer=${mode}`);
    const stage = page.locator(STAGE);
    await expect(stage).toHaveAttribute("data-step", step.kind);
    await expect(stage).toHaveAttribute("data-phase", "scrubbing");
    const box = await page.locator(BOX).boundingBox();
    if (!box) throw new Error("Brak wymiarów pudełka kąpieli.");

    const before = await layerAlpha(page);
    expect(before.outside).toBe(0);
    if (mode === "erase") {
      expect(before.center).toBeGreaterThan(200);
      expect(before.body).toBeGreaterThan(200);
    } else {
      expect(before).toEqual({ center: 0, body: 0, outside: 0 });
    }

    const x0 = Math.round(box.x + box.width * 0.125);
    const x1 = Math.round(box.x + box.width * 0.875);
    const y = Math.round(box.y + box.height / 2);
    await page.mouse.move(x0, y);
    const tool = page.locator(".tool-cursor[data-visible='true'] svg");
    await expect(tool).toHaveCount(1); // Najechanie myszą nie maluje warstwy.
    expect(await layerAlpha(page)).toEqual(before);
    await page.mouse.down();
    await page.mouse.move(x1, y, { steps: 6 });
    await page.mouse.up();

    const bounds = await tool.boundingBox();
    if (!bounds) throw new Error("Narzędzie nie ma wymiarów.");
    expect(Math.abs(bounds.x + bounds.width / 2 - x1)).toBeLessThan(1);
    expect(Math.abs(bounds.y + bounds.height / 2 - y)).toBeLessThan(1);
    expect(bounds.width).toBeGreaterThanOrEqual(43.95);

    const grid = createGrid(insideMask());
    const px = (x: number) => (x - box.x) * LW / box.width;
    const py = (y - box.y) * LH / box.height;
    const radius = brushRadius(step, "normal", box.width);
    stampSegment(grid, px(x0), py, px(x1), py, radius);
    await expect(stage).toHaveAttribute("data-progress", progress(grid).toFixed(2));
    // Piksele poza sylwetką i poza zasięgiem narzędzia nie zmieniają się.
    expect(await layerAlpha(page)).toEqual({ center: mode === "erase" ? 0 : 255, body: before.body, outside: 0 });
  });
}

test("pudełko mieści się w scenie, a canvas zachowuje logiczne proporcje i limit DPR", async ({ page }) => {
  for (const [width, height] of [[360, 640], [640, 360], [1280, 800]]) {
    await page.setViewportSize({ width, height });
    await page.goto("./");
    const bath = page.locator(BOX);
    await expect(bath).toBeVisible();
    const [scene, box] = await Promise.all([page.locator("#scene").boundingBox(), bath.boundingBox()]);
    if (!scene || !box) throw new Error("Brak wymiarów sceny lub pudełka.");
    expect(box.x).toBeGreaterThanOrEqual(scene.x);
    expect(box.y).toBeGreaterThanOrEqual(scene.y);
    expect(box.x + box.width).toBeLessThanOrEqual(scene.x + scene.width + 0.1);
    expect(box.y + box.height).toBeLessThanOrEqual(scene.y + scene.height + 0.1);
    expect(box.height).toBeGreaterThanOrEqual(160);
    expect(box.height).toBeLessThanOrEqual(640);
    expect(box.width / box.height).toBeCloseTo(LW / LH, 3);

    const dpr = await page.evaluate(() => Math.min(2, Math.max(1, devicePixelRatio)));
    const canvas = bath.locator(".bath-layer");
    await expect(canvas).toHaveAttribute("width", String(Math.ceil(LW * dpr)));
    await expect(canvas).toHaveAttribute("height", String(Math.ceil(LH * dpr)));
  }
});

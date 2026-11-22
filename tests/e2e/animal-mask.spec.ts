import { expect, test } from "@playwright/test";
import { ANIMAL_IDS } from "../../src/animals/types";
import { autoBrushRadius, planAutoStrokes } from "../../src/bath/autoStroke";
import { createGrid, progress, stampSegment } from "../../src/bath/coverage";
import { brushRadius, CLASSIC_STEPS, STEPS } from "../../src/bath/steps";

test("SVG i maska siatki wszystkich 36 zwierzątek mają IoU co najmniej 0,97", async ({ page }) => {
  await page.goto("./?test=1&gallery=animals&mask=1");
  const tiles = page.locator("[data-gallery-animal]");
  await expect(tiles).toHaveCount(ANIMAL_IDS.length);
  const scores = await tiles.evaluateAll(async (nodes) => {
    // Read pixels only in this test. The rendered SVG and actual runtime grid are independent inputs.
    const canvas = document.createElement("canvas");
    canvas.width = 576; canvas.height = 736;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const serializer = new XMLSerializer();
    const scores: { id: string; iou: number; outside: boolean; uncovered: number }[] = [];
    for (const node of nodes) {
      const id = (node as HTMLElement).dataset.galleryAnimal!;
      const mask = document.querySelector(`[data-mask-for="${id}"]`)!.textContent!;
      const svg = node.querySelector("svg")!.cloneNode(true) as SVGElement;
      const figure = svg.querySelector(".animal-figure")!;
      svg.setAttribute("viewBox", "-36 -46 72 92");
      svg.setAttribute("width", "576"); svg.setAttribute("height", "736");
      const raster = async () => {
        const image = new Image();
        image.src = `data:image/svg+xml,${encodeURIComponent(serializer.serializeToString(svg))}`;
        await image.decode();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      };
      const full = await raster();
      for (const child of Array.from(figure.children)) if (!child.hasAttribute("data-silhouette")) child.remove();
      const drawn = await raster();
      let intersection = 0, union = 0, uncovered = 0;
      const alpha = (data: Uint8ClampedArray, x: number, y: number) => data[(y * canvas.width + x) * 4 + 3];
      for (let row = 0; row < 84; row++) for (let col = 0; col < 64; col++) {
        // Average the four pixels surrounding the logical cell center.
        const x = 35 + col * 8, y = 35 + row * 8;
        const coverage = (data: Uint8ClampedArray) => (alpha(data, x, y) + alpha(data, x + 1, y) + alpha(data, x, y + 1) + alpha(data, x + 1, y + 1)) / 4;
        const actual = coverage(drawn) >= 128;
        const expected = mask[row * 64 + col] === "1";
        if (actual || expected) union++;
        if (actual && expected) intersection++;
        if (coverage(full) >= 200 && !actual) uncovered++;
      }
      let outside = false;
      for (let y = 0; y < canvas.height && !outside; y++) for (let x = 0; x < canvas.width; x++) {
        if ((x < 32 || x >= 544 || y < 32 || y >= 704) && alpha(full, x, y) >= 128) { outside = true; break; }
      }
      scores.push({ id, iou: intersection / union, outside, uncovered });
    }
    return scores;
  });
  expect(scores.map(({ id }) => id)).toEqual([...ANIMAL_IDS]);
  for (const { id, iou, outside, uncovered } of scores) {
    expect.soft(iou, `${id}: IoU`).toBeGreaterThanOrEqual(0.97);
    expect.soft(outside, `${id}: kształt poza obszarem`).toBe(false);
    expect.soft(uncovered, `${id}: detale poza maską`).toBeLessThanOrEqual(3); // tolerancja antyaliasingu na granicy kształtu
  }
});

test("pasy trybu jednoprzyciskowego nadają się do całej rodziny", async ({ page }) => {
  await page.goto("./?test=1&gallery=animals&mask=1");
  const masks = await page.locator("[data-mask-for]").allTextContents();
  expect(masks).toHaveLength(ANIMAL_IDS.length);
  for (const [index, cells] of masks.entries()) {
    const mask = Uint8Array.from(cells, Number);
    for (const kind of CLASSIC_STEPS) {
      const radius = autoBrushRadius(mask, brushRadius(STEPS[kind], "normal", 640 * 64 / 84));
      const grid = createGrid(mask);
      const passes = planAutoStrokes(mask, radius);
      expect(passes.length).toBeLessThanOrEqual(8);
      for (const { y, x0, x1 } of passes) stampSegment(grid, x0, y, x1, y, radius);
      expect(progress(grid), `${ANIMAL_IDS[index]}: ${kind}`).toBeGreaterThanOrEqual(0.9);
    }
  }
});
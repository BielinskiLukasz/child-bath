import { expect, test } from "@playwright/test";

const NOW = new Date("2026-06-01T12:00:00Z");

test("ukrycie karty zamraża zanik reszty, a wznowienie nie przeskakuje czasu", async ({ page }) => {
  await page.clock.install({ time: NOW });
  await page.clock.pauseAt(new Date(NOW.getTime() + 1000));
  await page.goto("./?test=1&seed=7&ease=easy");
  const stage = page.locator(".bath-stage");
  const box = page.locator(".bath-box");
  const layer = page.locator(".bath-layer");
  await expect(box).toBeVisible();
  // rAF jest zegarem gry; czas w tym teście płynie tylko przy runFor.
  await page.clock.runFor(800);
  await expect(stage).toHaveAttribute("data-phase", "scrubbing");

  // Wysyłamy gęsty zygzak w jednym obrocie kolejki, żeby obserwować początek stage_rest.
  await box.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const send = (type: string, x: number, y: number) => element.dispatchEvent(new PointerEvent(type, {
      pointerId: 12, pointerType: "touch", bubbles: true, button: 0,
      clientX: rect.left + x * rect.width, clientY: rect.top + y * rect.height,
    }));
    send("pointerdown", 0.05, 0.05);
    for (let i = 1; i < 24; i++) {
      const y = i / 24;
      const x0 = i % 2 ? 0.05 : 0.95;
      send("pointermove", x0, y);
      send("pointermove", 1 - x0, y);
    }
    send("pointerup", 0.95, 0.96);
  });

  await page.clock.runFor(40);
  await expect(stage).toHaveAttribute("data-phase", "stage_rest");
  await page.clock.runFor(160);
  const before = await layer.evaluate((element) => Number(getComputedStyle(element).opacity));
  expect(before).toBeGreaterThan(0);
  expect(before).toBeLessThan(0.9);

  const visibility = (hidden: boolean) => page.evaluate((value) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
  await visibility(true);
  await page.clock.runFor(5000);
  await expect(stage).toHaveAttribute("data-phase", "stage_rest");
  expect(await layer.evaluate((element) => Number(getComputedStyle(element).opacity))).toBe(before);

  await visibility(false);
  await page.clock.runFor(80);
  await expect(stage).toHaveAttribute("data-phase", "stage_rest");
  expect(await layer.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeLessThan(before);
  await page.clock.runFor(480);
  await expect(stage).toHaveAttribute("data-step", "rinse");
});

import { expect, test } from "@playwright/test";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ZONES = ["header.top-bar", "#scene", "#narration", "#action"] as const;

/** Rozmiary z Definition of Done (planning/phases/README.md) i minimalna wysokość strefy akcji z PHASE-01. */
const VIEWPORTS = [
  { name: "telefon w pionie", width: 360, height: 640, minAction: 96 },
  { name: "telefon w poziomie", width: 640, height: 360, minAction: 72 },
  { name: "laptop", width: 1280, height: 800, minAction: 72 },
] as const;

test("dokument jest po polsku, ma tytuł z imieniem w dopełniaczu i działa bez błędów", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page).toHaveTitle("Mała łazienka dziecka");
  await expect(page.locator("h1")).toHaveText("Mała łazienka dziecka");
  // Od Fazy 3 pierwsze zwierzątko czeka na zaproszenie.
  await expect(page.locator(".little-world")).toHaveAttribute("data-phase", "door_waiting");
  expect(errors).toEqual([]);
});

for (const viewport of VIEWPORTS) {
  test(`strefy mieszczą się bez przewijania: ${viewport.name} ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("./");

    const boxes: Box[] = [];
    for (const selector of ZONES) {
      const zone = page.locator(selector);
      await expect(zone, selector).toBeVisible();
      const box = await zone.boundingBox();
      if (!box) throw new Error(`Strefa ${selector} nie ma wymiarów.`);
      boxes.push(box);
    }

    const [top, scene, narration, action] = boxes;
    const bottom = (box: Box) => box.y + box.height;
    // Strefy leżą jedna pod drugą i nie nachodzą na siebie.
    expect(bottom(top)).toBeLessThanOrEqual(scene.y + 1);
    expect(bottom(scene)).toBeLessThanOrEqual(narration.y + 1);
    expect(bottom(narration)).toBeLessThanOrEqual(action.y + 1);
    // Strefa akcji kończy się nad dolną krawędzią ekranu i mieści duży przycisk.
    expect(bottom(action)).toBeLessThanOrEqual(viewport.height + 1);
    expect(action.height).toBeGreaterThanOrEqual(viewport.minAction);
    // Scena pozostaje główną częścią ekranu.
    expect(scene.height).toBeGreaterThanOrEqual(viewport.height * 0.4);

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const world = document.querySelector(".little-world") as HTMLElement;
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollWidth: root.scrollWidth,
        scrollHeight: root.scrollHeight,
        worldOverflow: world.scrollHeight - world.clientHeight,
      };
    });
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width);
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.height);
    expect(metrics.worldOverflow).toBeLessThanOrEqual(1);
  });
}

test("wycięcie ekranu i pasek systemowy nie zasłaniają tytułu ani przycisku", async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  const cases = [
    { width: 360, height: 640, insets: { top: 47, bottom: 34, left: 0, right: 0 } },
    { width: 640, height: 360, insets: { top: 0, bottom: 21, left: 47, right: 47 } },
  ];

  for (const { width, height, insets } of cases) {
    await page.setViewportSize({ width, height });
    await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets });
    await page.goto("./?test=1");

    const action = page.locator("#action");
    const title = page.locator("h1");
    const button = action.getByRole("button", { name: "Dalej", exact: true });
    await expect(action).toHaveCSS("padding-bottom", `${insets.bottom}px`);
    await expect(page.locator(".little-world")).toHaveCSS("padding-left", `${insets.left}px`);
    await expect(button).toBeVisible();

    const [titleBox, buttonBox] = await Promise.all([title.boundingBox(), button.boundingBox()]);
    if (!titleBox || !buttonBox) throw new Error("Tytuł lub przykładowy przycisk nie ma wymiarów.");
    expect(titleBox.y).toBeGreaterThanOrEqual(insets.top);
    expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(height - insets.bottom + 1);
    expect(buttonBox.x).toBeGreaterThanOrEqual(insets.left);
    expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(width - insets.right + 1);
  }
});

test("ziarno papieru leży nad sceną i nie przechwytuje dotyku", async ({ page }) => {
  await page.goto("./");
  const grain = await page.evaluate(() => {
    const style = getComputedStyle(document.querySelector(".little-world") as Element, "::after");
    return {
      opacity: Number(style.opacity),
      pointerEvents: style.pointerEvents,
      zIndex: style.zIndex,
      image: style.backgroundImage,
    };
  });
  expect(grain.opacity).toBeCloseTo(0.12, 2);
  expect(grain.pointerEvents).toBe("none");
  expect(grain.zIndex).toBe("10");
  expect(grain.image).toContain("feTurbulence");
});

test("ramki i przykładowa treść stref są widoczne tylko w trybie testowym", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".little-world")).not.toHaveAttribute("data-test-frames");
  await expect(page.locator(".zone-sample")).toHaveCount(0);

  await page.goto("./?test=1");
  await expect(page.locator(".little-world")).toHaveAttribute("data-test-frames", "true");
  await expect(page.locator(".zone-sample")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Dalej", exact: true })).toHaveCount(1);
});

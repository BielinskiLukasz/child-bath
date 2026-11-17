// Źródło: child-train@b881e09:tests/pwa.spec.ts (instalacja service workera i ponowne otwarcie offline).
// Zmiany: ścieżki pod /child-bath/, selektory stref, osobny test manifestu i rozmiarów ikon PNG.
import { expect, test, type Page } from "@playwright/test";

const SHELL_ASSETS = {
  "./manifest.json": "application/json",
  "./icons/icon-192.png": "image/png",
  "./icons/icon-512.png": "image/png",
  "./icons/maskable-512.png": "image/png",
  "./icons/apple-touch-icon.png": "image/png",
};

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

async function expectShellAssets(page: Page) {
  const assets = await page.evaluate(async (paths) => {
    return Promise.all(paths.map(async (path) => {
      const response = await fetch(path);
      return { path, status: response.status, type: response.headers.get("content-type") };
    }));
  }, Object.keys(SHELL_ASSETS));

  for (const [path, type] of Object.entries(SHELL_ASSETS)) {
    expect(assets.find((asset) => asset.path === path), path).toEqual({
      path,
      status: 200,
      type: expect.stringContaining(type),
    });
  }
}

test("manifest opisuje instalowalną aplikację po polsku", async ({ request }) => {
  const response = await request.get("manifest.json");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/json");
  const manifest = await response.json();
  expect(manifest).toMatchObject({
    name: "Mała łazienka",
    short_name: "Łazienka",
    lang: "pl",
    display: "standalone",
    start_url: "./",
    scope: "./",
  });

  const icons = manifest.icons as ManifestIcon[];
  expect(icons.some((icon) => icon.purpose === "maskable")).toBe(true);
  expect(icons.map((icon) => icon.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));

  for (const icon of icons) {
    const iconResponse = await request.get(new URL(icon.src, response.url()).href);
    expect(iconResponse.ok(), icon.src).toBe(true);
    if (icon.type === "image/png") {
      // Nagłówek PNG z wymiarami zapisanymi przez tools/generate-icons.py.
      const png = await iconResponse.body();
      expect(png.subarray(1, 4).toString("ascii"), icon.src).toBe("PNG");
      expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.src).toBe(icon.sizes);
    }
  }
});

test("service worker zapisuje powłokę, a aplikacja otwiera się ponownie bez sieci", async ({ context, page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("./");
  await expect.poll(() => page.evaluate(async () => {
    return (await navigator.serviceWorker.getRegistration())?.active?.state;
  }), { message: "Service worker aplikacji aktywuje się pod /child-bath/" }).toBe("activated");
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.state)).toBe("activated");
  await expectShellAssets(page);

  await context.setOffline(true);
  const offlinePage = await context.newPage();
  offlinePage.on("pageerror", (error) => errors.push(error.message));
  const response = await offlinePage.goto("./");
  expect(response?.ok()).toBe(true);
  expect(response?.fromServiceWorker()).toBe(true);
  await expect(offlinePage.locator("h1")).toContainText("Mała łazienka");
  await expect(offlinePage.locator("#scene")).toBeVisible();
  await expectShellAssets(offlinePage);
  expect(errors).toEqual([]);
});

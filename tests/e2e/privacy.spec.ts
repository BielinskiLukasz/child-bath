import { expect, test } from "@playwright/test";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const LOCAL_PROTOCOLS = new Set(["data:", "blob:", "file:", "about:"]);

test("podczas zabawy żadne zapytanie nie wychodzi poza urządzenie", async ({ context, page }) => {
  const external: string[] = [];
  // Zdarzenia kontekstu obejmują także zapytania service workera.
  context.on("request", (request) => {
    const url = new URL(request.url());
    if (LOCAL_PROTOCOLS.has(url.protocol)) return;
    if (!LOCAL_HOSTS.has(url.hostname)) external.push(request.url());
  });

  await page.goto("./");
  await expect(page.locator("#scene")).toBeVisible();
  await page.waitForLoadState("networkidle");

  // Proste interakcje dziecka; od Fazy 2 test obejmie też pocieranie i kolejne kroki kąpieli.
  await page.locator("#scene").click();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await page.waitForLoadState("networkidle");

  expect(external).toEqual([]);
});

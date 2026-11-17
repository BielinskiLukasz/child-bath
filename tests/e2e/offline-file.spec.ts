import { copyFile, mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

const DIST_HTML = new URL("../../dist/index.html", import.meta.url);
const FONTS_CSS = new URL("../../src/fonts.css", import.meta.url);
const ZONES = ["header.top-bar", "#scene", "#narration", "#action"];

test("dist/index.html działa z dysku bez sieci, z osadzonymi fontami i ich licencją", async ({ context, page }, testInfo) => {
  // Obok kopii HTML celowo nie ma manifestu, ikon ani żadnych innych zasobów z dist/.
  const standalone = testInfo.outputPath("standalone", "index.html");
  await mkdir(dirname(standalone), { recursive: true });
  await copyFile(DIST_HTML, standalone);

  const blocked: string[] = [];
  await context.route(/^(?:https?|wss?):/, async (route) => {
    blocked.push(route.request().url());
    await route.abort();
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(pathToFileURL(standalone).href);
  for (const selector of ZONES) {
    await expect(page.locator(selector), selector).toBeVisible();
  }
  await expect(page.locator("h1")).toHaveText("Mała łazienka dziecka");

  // Licencja SIL OFL musi być w każdej kopii pliku, który osadza fonty.
  const licenses = (await page.locator("#font-licenses").textContent()) ?? "";
  expect(licenses).toContain("SIL OPEN FONT LICENSE");
  expect(licenses).toContain("The DM Sans Project Authors");
  expect(licenses).toContain("The Fraunces Project Authors");

  const placeholder = readFileSync(FONTS_CSS, "utf8").includes("CHILD_BATH_FONTS_PLACEHOLDER");
  const hint = placeholder ? "src/fonts.css jest jeszcze zaślepką: uruchom npm run fonts" : "font nie jest osadzony";
  const fonts = await page.evaluate(async () => {
    const sample = "„Mała łazienka” – ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ…";
    const [ui, display, italic] = await Promise.all([
      document.fonts.load('500 16px "DM Sans"', sample),
      document.fonts.load('500 16px "Fraunces"', sample),
      document.fonts.load('italic 500 16px "Fraunces"', sample),
    ]);
    return {
      ui: ui.length,
      display: display.length,
      italic: italic.length,
      uiReady: document.fonts.check('500 16px "DM Sans"', sample),
      displayReady: document.fonts.check('500 16px "Fraunces"', sample),
    };
  });
  expect(fonts.ui, `DM Sans Latin + Latin Extended: ${hint}`).toBeGreaterThan(1);
  expect(fonts.display, `Fraunces Latin + Latin Extended: ${hint}`).toBeGreaterThan(1);
  expect(fonts.italic, `Fraunces kursywa Latin + Latin Extended: ${hint}`).toBeGreaterThan(1);
  expect(fonts.uiReady).toBe(true);
  expect(fonts.displayReady).toBe(true);

  expect(blocked).toEqual([]);
  expect(errors).toEqual([]);
});

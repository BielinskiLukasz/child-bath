// Źródło: child-train@b881e09:playwright.config.ts (ustawienia przebiegu testów).
// Zmiany: projekty unit/phone/small/desktop i serwer build + preview pod /child-bath/ (PHASE-01).
import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}/child-bath/`;
const PREVIEW = `npm run preview -- --port ${PORT} --strictPort`;
const USE_PREBUILT = process.env.PLAYWRIGHT_PREBUILT === "1";

export default defineConfig({
  testDir: "./tests",
  // Jeden z testów rejestruje service workera na wspólnym serwerze; w CI testy biegną po kolei, jak w child-train.
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    headless: true,
    trace: "retain-on-failure",
  },
  projects: [
    // Czyste moduły i skany plików, bez przeglądarki.
    { name: "unit", testDir: "./tests/unit" },
    // Telefon jest głównym urządzeniem (D-04).
    { name: "phone", testDir: "./tests/e2e", use: { ...devices["Pixel 7"] } },
    {
      name: "small",
      testDir: "./tests/e2e",
      use: {
        browserName: "chromium",
        viewport: { width: 360, height: 640 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "desktop",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    // CI testuje gotowy dist/, który po sukcesie będzie opublikowany. Lokalnie npm test nadal buduje aplikację.
    command: USE_PREBUILT ? PREVIEW : `npm run build && ${PREVIEW}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI && !USE_PREBUILT,
    timeout: 180_000,
  },
});

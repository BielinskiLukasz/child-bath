import { expect, type Page } from "@playwright/test";

export async function waitForWashing(page: Page) {
  const world = page.locator(".little-world");
  await expect(world).toHaveAttribute("data-phase", "scrubbing");
  await expect(world).toHaveAttribute("data-input-ready", "true");
}

export async function openBath(page: Page, url: string) {
  await page.goto(url);
  await page.getByRole("button", { name: "Dalej", exact: true }).click();
  await waitForWashing(page);
}

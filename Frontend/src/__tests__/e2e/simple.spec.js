import { test, expect } from "@playwright/test";

test("simple test", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Just check if the page loads
  await expect(page).toHaveTitle(/Laravel Vite/);

  console.log("Test completed successfully!");
});

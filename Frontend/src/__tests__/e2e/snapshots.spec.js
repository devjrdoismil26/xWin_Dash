import { test, expect } from "@playwright/test";

test.describe("Visual Snapshots", () => {
  test("should match dashboard snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take a full page screenshot
    await expect(page).toHaveScreenshot("dashboard-full.png");

    // Take a screenshot of the main content area
    const mainContent = page
      .locator('main, [data-testid="main-content"], .main-content')
      .first();
    if (await mainContent.isVisible()) {
      await expect(mainContent).toHaveScreenshot("dashboard-content.png");
    }
  });

  test("should match navigation snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take a screenshot of the navigation
    const navigation = page
      .locator('nav, [data-testid="navigation"], .navigation')
      .first();
    if (await navigation.isVisible()) {
      await expect(navigation).toHaveScreenshot("navigation.png");
    }
  });

  test("should match mobile layout snapshot", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take mobile screenshot
    await expect(page).toHaveScreenshot("dashboard-mobile.png");
  });

  test("should match dark mode snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Try to enable dark mode if toggle exists
    const darkModeToggle = page
      .locator('[data-testid="dark-mode-toggle"], .dark-mode-toggle')
      .first();
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(500); // Wait for theme change
    }

    // Take dark mode screenshot
    await expect(page).toHaveScreenshot("dashboard-dark.png");
  });

  test("should match component snapshots", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take snapshots of individual components
    const cards = page.locator(
      '[data-testid="metric-card"], .card, .metric-card',
    );
    const cardCount = await cards.count();

    if (cardCount > 0) {
      // Take snapshot of first card
      await expect(cards.first()).toHaveScreenshot("metric-card.png");
    }

    // Take snapshot of buttons
    const buttons = page.locator("button").first();
    if (await buttons.isVisible()) {
      await expect(buttons).toHaveScreenshot("button.png");
    }
  });

  test("should match form snapshots", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Take snapshot of login form
    const loginForm = page.locator('form, [data-testid="login-form"]').first();
    if (await loginForm.isVisible()) {
      await expect(loginForm).toHaveScreenshot("login-form.png");
    }

    // Take full page snapshot
    await expect(page).toHaveScreenshot("login-page.png");
  });

  test("should match error state snapshots", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Simulate error state by mocking failed API
    await page.route("**/api/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Reload to trigger error
    await page.reload();
    await page.waitForTimeout(1000);

    // Take error state snapshot
    await expect(page).toHaveScreenshot("error-state.png");
  });
});

import { test, expect } from '@playwright/test';

test.describe('Focus Management', () => {
  test('should trap focus in modal', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="delete-btn"]:first-child');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.closest('[role="dialog"]'));
    expect(focused).toBeTruthy();
  });

  test('should restore focus after modal close', async ({ page }) => {
    await page.goto('/products');
    const trigger = page.locator('[data-testid="delete-btn"]:first-child');
    await trigger.click();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
});

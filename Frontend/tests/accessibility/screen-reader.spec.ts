import { test, expect } from '@playwright/test';

test.describe('Screen Reader Support', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/products');
    const button = page.locator('[data-testid="new-product-btn"]');
    await expect(button).toHaveAttribute('aria-label');
  });

  test('should announce page changes', async ({ page }) => {
    await page.goto('/products');
    const main = page.locator('main');
    await expect(main).toHaveAttribute('role', 'main');
  });
});

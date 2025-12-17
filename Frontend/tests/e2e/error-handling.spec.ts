import { test, expect } from '@playwright/test';

test.describe('E2E - Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/products');
    await expect(page.locator('text=Network error')).toBeVisible();
    await expect(page.locator('[data-testid="retry-btn"]')).toBeVisible();
  });

  test('should handle 404 errors', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=Page not found')).toBeVisible();
    await expect(page.locator('[data-testid="back-home"]')).toBeVisible();
  });

  test('should handle unauthorized access', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('text=Please login')).toBeVisible();
  });
});

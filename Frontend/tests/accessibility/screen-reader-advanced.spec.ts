import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility - Screen Reader Support', () => {
  test('should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/dashboard');
    await injectAxe(page);
    
    await expect(page.locator('[role="banner"]')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[role="contentinfo"]')).toBeVisible();
  });

  test('should announce dynamic content changes', async ({ page }) => {
    await page.goto('/products');
    
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeInTheDocument();
    
    await page.click('[data-testid="new-product-btn"]');
    await expect(liveRegion).toContainText('Form opened');
  });

  test('should have descriptive button labels', async ({ page }) => {
    await page.goto('/products');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      rules: { 'button-name': { enabled: true } }
    });
  });
});

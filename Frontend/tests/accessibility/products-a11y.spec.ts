import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Products Accessibility', () => {
  test('products page should be accessible', async ({ page }) => {
    await page.goto('/products');
    await injectAxe(page);
    await checkA11y(page);
  });

  test('product form should be accessible', async ({ page }) => {
    await page.goto('/products/new');
    await injectAxe(page);
    await checkA11y(page);
  });
});

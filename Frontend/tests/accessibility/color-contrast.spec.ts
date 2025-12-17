import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Color Contrast', () => {
  test('should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/products');
    await injectAxe(page);
    await checkA11y(page, null, {
      rules: { 'color-contrast': { enabled: true } }
    });
  });
});

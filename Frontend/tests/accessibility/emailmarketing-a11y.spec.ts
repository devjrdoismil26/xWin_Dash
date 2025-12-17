import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('EmailMarketing Accessibility', () => {
  test('email campaigns should be accessible', async ({ page }) => {
    await page.goto('/emailmarketing');
    await injectAxe(page);
    await checkA11y(page);
  });
});

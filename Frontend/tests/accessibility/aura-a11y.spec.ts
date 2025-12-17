import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Aura Accessibility', () => {
  test('aura conversations should be accessible', async ({ page }) => {
    await page.goto('/aura');
    await injectAxe(page);
    await checkA11y(page);
  });
});

import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('ADStool Accessibility', () => {
  test('adstool should be accessible', async ({ page }) => {
    await page.goto('/adstool');
    await injectAxe(page);
    await checkA11y(page);
  });
});

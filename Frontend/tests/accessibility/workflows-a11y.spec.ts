import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Workflows Accessibility', () => {
  test('workflow builder should be accessible', async ({ page }) => {
    await page.goto('/workflows');
    await injectAxe(page);
    await checkA11y(page);
  });
});

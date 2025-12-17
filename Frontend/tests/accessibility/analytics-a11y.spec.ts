import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Analytics Accessibility', () => {
  test('analytics dashboard should be accessible', async ({ page }) => {
    await page.goto('/analytics');
    await injectAxe(page);
    await checkA11y(page);
  });
});

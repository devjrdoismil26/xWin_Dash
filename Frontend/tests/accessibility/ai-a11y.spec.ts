import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('AI Accessibility', () => {
  test('ai chat should be accessible', async ({ page }) => {
    await page.goto('/ai');
    await injectAxe(page);
    await checkA11y(page);
  });
});

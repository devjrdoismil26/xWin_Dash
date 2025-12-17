import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Users Accessibility', () => {
  test('users page should be accessible', async ({ page }) => {
    await page.goto('/users');
    await injectAxe(page);
    await checkA11y(page);
  });
});

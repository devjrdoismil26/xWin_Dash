import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Projects Accessibility', () => {
  test('projects page should be accessible', async ({ page }) => {
    await page.goto('/projects');
    await injectAxe(page);
    await checkA11y(page);
  });
});

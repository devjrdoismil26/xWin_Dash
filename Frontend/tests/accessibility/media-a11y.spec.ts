import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Media Accessibility', () => {
  test('media library should be accessible', async ({ page }) => {
    await page.goto('/media');
    await injectAxe(page);
    await checkA11y(page);
  });
});

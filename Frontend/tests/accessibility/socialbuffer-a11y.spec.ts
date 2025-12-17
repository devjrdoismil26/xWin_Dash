import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('SocialBuffer Accessibility', () => {
  test('social buffer should be accessible', async ({ page }) => {
    await page.goto('/socialbuffer');
    await injectAxe(page);
    await checkA11y(page);
  });
});

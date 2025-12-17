import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Media UI Visual Regression', () => {
  test('media library', async ({ page }) => {
    await page.goto('/media');
    await percySnapshot(page, 'Media Library');
  });
});

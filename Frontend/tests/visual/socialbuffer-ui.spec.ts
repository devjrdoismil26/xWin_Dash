import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('SocialBuffer UI Visual Regression', () => {
  test('social posts calendar', async ({ page }) => {
    await page.goto('/socialbuffer');
    await percySnapshot(page, 'Social Buffer Calendar');
  });
});

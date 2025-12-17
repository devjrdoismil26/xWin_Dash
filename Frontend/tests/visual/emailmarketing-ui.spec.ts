import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('EmailMarketing UI Visual Regression', () => {
  test('campaigns list', async ({ page }) => {
    await page.goto('/emailmarketing');
    await percySnapshot(page, 'Email Campaigns');
  });
});

import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('AI UI Visual Regression', () => {
  test('ai chat interface', async ({ page }) => {
    await page.goto('/ai');
    await percySnapshot(page, 'AI Chat');
  });
});

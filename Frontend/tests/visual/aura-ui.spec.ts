import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Aura UI Visual Regression', () => {
  test('aura conversations', async ({ page }) => {
    await page.goto('/aura');
    await percySnapshot(page, 'Aura Conversations');
  });
});

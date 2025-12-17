import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Modals UI Visual Regression', () => {
  test('modal dialogs', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="delete-btn"]:first-child');
    await percySnapshot(page, 'Modal Dialog');
  });
});

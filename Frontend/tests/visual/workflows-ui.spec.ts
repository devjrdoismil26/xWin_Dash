import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Workflows UI Visual Regression', () => {
  test('workflow builder', async ({ page }) => {
    await page.goto('/workflows');
    await percySnapshot(page, 'Workflow Builder');
  });
});

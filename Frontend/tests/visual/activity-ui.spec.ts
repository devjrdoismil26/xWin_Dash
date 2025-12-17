import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Activity UI Visual Regression', () => {
  test('activity feed', async ({ page }) => {
    await page.goto('/activity');
    await percySnapshot(page, 'Activity Feed');
  });
});

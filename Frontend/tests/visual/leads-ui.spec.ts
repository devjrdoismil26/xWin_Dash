import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Leads UI Visual Regression', () => {
  test('leads list', async ({ page }) => {
    await page.goto('/leads');
    await percySnapshot(page, 'Leads List');
  });

  test('lead funnel', async ({ page }) => {
    await page.goto('/leads/funnel');
    await percySnapshot(page, 'Lead Funnel');
  });
});

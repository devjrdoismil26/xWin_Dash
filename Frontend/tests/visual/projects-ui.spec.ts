import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Projects UI Visual Regression', () => {
  test('projects list', async ({ page }) => {
    await page.goto('/projects');
    await percySnapshot(page, 'Projects List');
  });

  test('project details', async ({ page }) => {
    await page.goto('/projects/1');
    await percySnapshot(page, 'Project Details');
  });
});

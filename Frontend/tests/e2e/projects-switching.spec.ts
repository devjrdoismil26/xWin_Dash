import { test, expect } from '@playwright/test';

test.describe('Projects Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should switch between projects', async ({ page }) => {
    await page.click('[data-testid="project-selector"]');
    await page.click('[data-testid="project-option-2"]');
    await expect(page.locator('[data-testid="current-project"]')).toContainText('Project 2');
  });

  test('should persist project selection', async ({ page }) => {
    await page.click('[data-testid="project-selector"]');
    await page.click('[data-testid="project-option-3"]');
    await page.reload();
    await expect(page.locator('[data-testid="current-project"]')).toContainText('Project 3');
  });

  test('should filter data by project', async ({ page }) => {
    await page.click('[data-testid="project-selector"]');
    await page.click('[data-testid="project-option-1"]');
    await page.goto('/products');
    await expect(page.locator('[data-testid="project-filter"]')).toContainText('Project 1');
  });
});

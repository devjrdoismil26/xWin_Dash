import { test, expect } from '@playwright/test';

test.describe('Analytics Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/analytics');
  });

  test('should filter by date range', async ({ page }) => {
    await page.click('[data-testid="date-filter"]');
    await page.click('[data-testid="last-7-days"]');
    await expect(page.locator('[data-testid="chart"]')).toBeVisible();
  });

  test('should filter by metric type', async ({ page }) => {
    await page.selectOption('[data-testid="metric-select"]', 'revenue');
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
  });

  test('should apply multiple filters', async ({ page }) => {
    await page.click('[data-testid="date-filter"]');
    await page.click('[data-testid="last-30-days"]');
    await page.selectOption('[data-testid="metric-select"]', 'users');
    await page.selectOption('[data-testid="project-select"]', 'project-1');
    await expect(page.locator('[data-testid="filtered-data"]')).toBeVisible();
  });
});

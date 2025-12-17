import { test, expect } from '@playwright/test';

test.describe('Social Buffer Scheduling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/socialbuffer');
  });

  test('should create scheduled post', async ({ page }) => {
    await page.click('[data-testid="new-post-btn"]');
    await page.fill('[data-testid="post-content"]', 'Test post content');
    await page.click('[data-testid="schedule-btn"]');
    await page.fill('[data-testid="schedule-date"]', '2025-12-01');
    await page.fill('[data-testid="schedule-time"]', '14:00');
    await page.click('[data-testid="save-btn"]');
    await expect(page.locator('text=Post scheduled')).toBeVisible();
  });

  test('should edit scheduled post', async ({ page }) => {
    await page.click('[data-testid="post-item"]:first-child');
    await page.click('[data-testid="edit-btn"]');
    await page.fill('[data-testid="post-content"]', 'Updated content');
    await page.click('[data-testid="save-btn"]');
    await expect(page.locator('text=Post updated')).toBeVisible();
  });

  test('should delete scheduled post', async ({ page }) => {
    await page.click('[data-testid="post-item"]:first-child');
    await page.click('[data-testid="delete-btn"]');
    await page.click('[data-testid="confirm-delete"]');
    await expect(page.locator('text=Post deleted')).toBeVisible();
  });
});

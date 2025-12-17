import { test, expect } from '@playwright/test';

test.describe('Aura Conversations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/aura');
  });

  test('should load conversation list', async ({ page }) => {
    await expect(page.locator('[data-testid="conversation-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversation-item"]')).toHaveCount(5);
  });

  test('should send message', async ({ page }) => {
    await page.click('[data-testid="conversation-item"]:first-child');
    await page.fill('[data-testid="message-input"]', 'Test message');
    await page.click('[data-testid="send-btn"]');
    await expect(page.locator('text=Test message')).toBeVisible();
  });

  test('should filter conversations', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'John');
    await expect(page.locator('[data-testid="conversation-item"]')).toHaveCount(1);
  });

  test('should mark as read', async ({ page }) => {
    await page.click('[data-testid="conversation-item"]:first-child');
    await expect(page.locator('[data-testid="unread-badge"]')).not.toBeVisible();
  });
});

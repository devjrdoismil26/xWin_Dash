import { test, expect } from '@playwright/test';

test.describe('AI Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ai');
  });

  test('should send message and receive response', async ({ page }) => {
    await page.fill('[data-testid="chat-input"]', 'Hello AI');
    await page.click('[data-testid="send-btn"]');
    await expect(page.locator('[data-testid="user-message"]')).toContainText('Hello AI');
    await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });
  });

  test('should switch AI provider', async ({ page }) => {
    await page.selectOption('[data-testid="provider-select"]', 'gemini');
    await page.fill('[data-testid="chat-input"]', 'Test');
    await page.click('[data-testid="send-btn"]');
    await expect(page.locator('[data-testid="provider-badge"]')).toContainText('Gemini');
  });

  test('should clear chat history', async ({ page }) => {
    await page.click('[data-testid="clear-chat-btn"]');
    await page.click('[data-testid="confirm-clear"]');
    await expect(page.locator('[data-testid="message-list"]')).toBeEmpty();
  });
});

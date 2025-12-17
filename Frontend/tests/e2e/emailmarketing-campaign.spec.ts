import { test, expect } from '@playwright/test';

test.describe('Email Marketing Campaign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/emailmarketing');
  });

  test('should create campaign', async ({ page }) => {
    await page.click('[data-testid="new-campaign-btn"]');
    await page.fill('[name="name"]', 'Black Friday');
    await page.fill('[name="subject"]', 'Special Offer');
    await page.fill('[data-testid="email-editor"]', 'Campaign content');
    await page.click('[data-testid="save-btn"]');
    await expect(page.locator('text=Campaign created')).toBeVisible();
  });

  test('should send test email', async ({ page }) => {
    await page.click('[data-testid="campaign-item"]:first-child');
    await page.click('[data-testid="send-test-btn"]');
    await page.fill('[name="test-email"]', 'test@example.com');
    await page.click('[data-testid="confirm-send"]');
    await expect(page.locator('text=Test email sent')).toBeVisible();
  });

  test('should view campaign stats', async ({ page }) => {
    await page.click('[data-testid="campaign-item"]:first-child');
    await page.click('[data-testid="stats-tab"]');
    await expect(page.locator('[data-testid="open-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="click-rate"]')).toBeVisible();
  });
});

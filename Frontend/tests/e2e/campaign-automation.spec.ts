import { test, expect } from '@playwright/test';

test.describe('E2E - Campaign Automation', () => {
  test('should create and automate email campaign', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'marketing@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.goto('/emailmarketing');
    await page.click('[data-testid="new-campaign-btn"]');
    
    await page.fill('[name="name"]', 'Black Friday Campaign');
    await page.fill('[name="subject"]', 'Special Offer - 50% Off');
    await page.fill('[data-testid="email-editor"]', 'Limited time offer!');
    
    await page.click('[data-testid="select-audience"]');
    await page.click('[data-testid="segment-all-customers"]');
    
    await page.click('[data-testid="schedule-tab"]');
    await page.fill('[name="sendDate"]', '2025-12-01');
    await page.fill('[name="sendTime"]', '09:00');
    
    await page.click('[data-testid="save-and-schedule"]');
    await expect(page.locator('text=Campaign scheduled')).toBeVisible();
  });
});

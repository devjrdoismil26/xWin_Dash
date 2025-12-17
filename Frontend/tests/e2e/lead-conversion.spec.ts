import { test, expect } from '@playwright/test';

test.describe('E2E - Lead Conversion', () => {
  test('should convert lead through full funnel', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'sales@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Create lead
    await page.goto('/leads');
    await page.click('[data-testid="new-lead-btn"]');
    await page.fill('[name="name"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+1234567890');
    await page.click('[data-testid="save-btn"]');
    
    // Move through funnel
    await page.click('[data-testid="lead-card"]:first-child');
    await page.click('[data-testid="move-to-contacted"]');
    await page.fill('[data-testid="notes"]', 'Called customer');
    await page.click('[data-testid="save-note"]');
    
    await page.click('[data-testid="move-to-qualified"]');
    await page.click('[data-testid="move-to-proposal"]');
    
    // Convert to customer
    await page.click('[data-testid="convert-to-customer"]');
    await expect(page.locator('text=Lead converted')).toBeVisible();
  });
});

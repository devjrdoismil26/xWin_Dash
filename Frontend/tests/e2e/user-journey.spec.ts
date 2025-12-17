import { test, expect } from '@playwright/test';

test.describe('E2E - User Journey', () => {
  test('should complete full user journey', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await page.fill('[name="name"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 2. Login
    await page.waitForURL('/login');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 3. View Dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // 4. Create Product
    await page.goto('/products');
    await page.click('[data-testid="new-product-btn"]');
    await page.fill('[name="name"]', 'Test Product');
    await page.fill('[name="price"]', '99.99');
    await page.click('[data-testid="save-btn"]');
    
    // 5. View Analytics
    await page.goto('/analytics');
    await expect(page.locator('[data-testid="chart"]')).toBeVisible();
    
    // 6. Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-btn"]');
    await page.waitForURL('/login');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should navigate to all main modules', async ({ page }) => {
    const modules = [
      { name: 'Products', url: '/products' },
      { name: 'Users', url: '/users' },
      { name: 'Projects', url: '/projects' },
      { name: 'Leads', url: '/leads' },
      { name: 'Analytics', url: '/analytics' },
    ];

    for (const module of modules) {
      await page.click(`a[href="${module.url}"]`);
      await expect(page).toHaveURL(new RegExp(module.url));
      await page.goBack();
    }
  });

  test('should display dashboard widgets', async ({ page }) => {
    await expect(page.locator('[data-testid="revenue-widget"]')).toBeVisible();
    await expect(page.locator('[data-testid="users-widget"]')).toBeVisible();
    await expect(page.locator('[data-testid="leads-widget"]')).toBeVisible();
  });

  test('should handle breadcrumb navigation', async ({ page }) => {
    await page.click('a[href="/products"]');
    await page.click('a[href="/products/new"]');
    await page.click('[data-testid="breadcrumb-products"]');
    await expect(page).toHaveURL('/products');
  });
});

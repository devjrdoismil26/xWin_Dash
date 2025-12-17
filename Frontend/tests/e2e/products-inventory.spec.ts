import { test, expect } from '@playwright/test';

test.describe('Products Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should create new product', async ({ page }) => {
    await page.click('[data-testid="new-product-btn"]');
    await page.fill('[name="name"]', 'Test Product');
    await page.fill('[name="price"]', '99.99');
    await page.fill('[name="stock"]', '100');
    await page.click('[data-testid="save-btn"]');
    await expect(page.locator('text=Product created')).toBeVisible();
  });

  test('should update stock quantity', async ({ page }) => {
    await page.click('[data-testid="product-item"]:first-child');
    await page.click('[data-testid="edit-stock-btn"]');
    await page.fill('[name="stock"]', '50');
    await page.click('[data-testid="save-btn"]');
    await expect(page.locator('text=Stock updated')).toBeVisible();
  });

  test('should filter low stock products', async ({ page }) => {
    await page.click('[data-testid="filter-low-stock"]');
    await expect(page.locator('[data-testid="low-stock-badge"]')).toHaveCount(3);
  });
});

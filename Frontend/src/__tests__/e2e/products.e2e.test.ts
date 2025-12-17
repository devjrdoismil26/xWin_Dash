import { test, expect } from '@playwright/test';

test.describe('Product Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');

    await page.fill('[name="password"]', 'password');

    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');

  });

  test('should create product', async ({ page }) => {
    await page.goto('/products');

    await page.click('button:has-text("Novo Produto")');

    await page.fill('[name="name"]', 'Product Test');

    await page.fill('[name="sku"]', 'SKU001');

    await page.fill('[name="price"]', '99.90');

    await page.click('button:has-text("Salvar")');

    await expect(page.locator('text=Produto criado')).toBeVisible();

  });

  test('should update stock', async ({ page }) => {
    await page.goto('/products');

    await page.click('[data-testid="product-item"]:first-child');

    await page.click('button:has-text("Atualizar Estoque")');

    await page.fill('[name="stock"]', '50');

    await page.click('button:has-text("Confirmar")');

    await expect(page.locator('text=Estoque atualizado')).toBeVisible();

  });

  test('should search products', async ({ page }) => {
    await page.goto('/products');

    await page.fill('[data-testid="search-input"]', 'Product');

    await expect(page.locator('[data-testid="product-item"]')).toHaveCount(1);

  });

});

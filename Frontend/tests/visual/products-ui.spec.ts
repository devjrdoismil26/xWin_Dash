import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Products UI Visual Regression', () => {
  test('products list page', async ({ page }) => {
    await page.goto('/products');
    await percySnapshot(page, 'Products List');
  });

  test('product form', async ({ page }) => {
    await page.goto('/products/new');
    await percySnapshot(page, 'Product Form');
  });

  test('product details', async ({ page }) => {
    await page.goto('/products/1');
    await percySnapshot(page, 'Product Details');
  });
});

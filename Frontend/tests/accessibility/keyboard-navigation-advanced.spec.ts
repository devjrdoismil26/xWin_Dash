import { test, expect } from '@playwright/test';

test.describe('Accessibility - Advanced Keyboard Navigation', () => {
  test('should navigate form with keyboard', async ({ page }) => {
    await page.goto('/products/new');
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="name"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="price"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="stock"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should handle escape key in modal', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="delete-btn"]:first-child');
    
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should navigate dropdown with arrow keys', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="filter-dropdown"]');
    
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('[data-testid="selected-filter"]')).toBeVisible();
  });
});

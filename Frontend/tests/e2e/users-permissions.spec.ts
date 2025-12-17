import { test, expect } from '@playwright/test';

test.describe('Users Permissions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('should assign role to user', async ({ page }) => {
    await page.click('[data-testid="user-item"]:first-child');
    await page.click('[data-testid="edit-role-btn"]');
    await page.selectOption('[name="role"]', 'admin');
    await page.click('[data-testid="save-btn"]');
    await expect(page.locator('text=Role updated')).toBeVisible();
  });

  test('should manage user permissions', async ({ page }) => {
    await page.click('[data-testid="user-item"]:first-child');
    await page.click('[data-testid="permissions-tab"]');
    await page.check('[data-testid="permission-products-create"]');
    await page.check('[data-testid="permission-users-read"]');
    await page.click('[data-testid="save-permissions"]');
    await expect(page.locator('text=Permissions updated')).toBeVisible();
  });

  test('should deactivate user', async ({ page }) => {
    await page.click('[data-testid="user-item"]:first-child');
    await page.click('[data-testid="deactivate-btn"]');
    await page.click('[data-testid="confirm-deactivate"]');
    await expect(page.locator('[data-testid="inactive-badge"]')).toBeVisible();
  });
});

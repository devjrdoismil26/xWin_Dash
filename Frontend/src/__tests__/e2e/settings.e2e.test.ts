import { test, expect } from '@playwright/test';

test.describe('Settings E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');

    await page.fill('[name="password"]', 'password');

    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');

  });

  test('should update profile', async ({ page }) => {
    await page.goto('/settings/profile');

    await page.fill('[name="name"]', 'Updated Name');

    await page.click('button:has-text("Salvar")');

    await expect(page.locator('text=Perfil atualizado')).toBeVisible();

  });

  test('should change theme', async ({ page }) => {
    await page.goto('/settings');

    await page.click('[data-testid="theme-toggle"]');

    await expect(page.locator('body')).toHaveClass(/dark/);

  });

  test('should manage integrations', async ({ page }) => {
    await page.goto('/settings/integrations');

    await page.click('button:has-text("Conectar Google")');

    await expect(page.locator('text=Conectado')).toBeVisible();

  });

});

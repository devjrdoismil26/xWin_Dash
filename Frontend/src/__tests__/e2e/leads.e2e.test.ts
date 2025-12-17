import { test, expect } from '@playwright/test';

test.describe('Lead Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');

    await page.fill('[name="password"]', 'password');

    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');

  });

  test('should create new lead', async ({ page }) => {
    await page.goto('/leads');

    await page.click('button:has-text("Novo Lead")');

    await page.fill('[name="name"]', 'John Doe');

    await page.fill('[name="email"]', 'john@example.com');

    await page.fill('[name="phone"]', '11999999999');

    await page.click('button:has-text("Salvar")');

    await expect(page.locator('text=Lead criado com sucesso')).toBeVisible();

  });

  test('should edit lead', async ({ page }) => {
    await page.goto('/leads');

    await page.click('[data-testid="lead-item"]:first-child');

    await page.click('button:has-text("Editar")');

    await page.fill('[name="name"]', 'Jane Doe');

    await page.click('button:has-text("Salvar")');

    await expect(page.locator('text=Jane Doe')).toBeVisible();

  });

  test('should filter leads by status', async ({ page }) => {
    await page.goto('/leads');

    await page.click('[data-testid="filter-status"]');

    await page.click('text=Qualificado');

    await expect(page.locator('[data-testid="lead-item"]')).toHaveCount(1);

  });

});

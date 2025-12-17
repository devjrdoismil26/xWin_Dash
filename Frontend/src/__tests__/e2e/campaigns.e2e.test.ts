import { test, expect } from '@playwright/test';

test.describe('Email Campaign E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');

    await page.fill('[name="password"]', 'password');

    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');

  });

  test('should create campaign', async ({ page }) => {
    await page.goto('/email-marketing');

    await page.click('button:has-text("Nova Campanha")');

    await page.fill('[name="subject"]', 'Test Campaign');

    await page.fill('[name="content"]', 'Campaign content');

    await page.click('button:has-text("Criar")');

    await expect(page.locator('text=Campanha criada')).toBeVisible();

  });

  test('should schedule campaign', async ({ page }) => {
    await page.goto('/email-marketing/1');

    await page.click('button:has-text("Agendar")');

    await page.fill('[name="scheduledAt"]', '2025-12-01T10:00');

    await page.click('button:has-text("Confirmar")');

    await expect(page.locator('text=Campanha agendada')).toBeVisible();

  });

});

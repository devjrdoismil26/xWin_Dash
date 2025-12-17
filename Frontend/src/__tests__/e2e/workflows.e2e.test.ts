import { test, expect } from '@playwright/test';

test.describe('Workflow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');

    await page.fill('[name="password"]', 'password');

    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');

  });

  test('should create workflow', async ({ page }) => {
    await page.goto('/workflows');

    await page.click('button:has-text("Novo Workflow")');

    await page.fill('[name="name"]', 'Test Workflow');

    await page.selectOption('[name="trigger"]', 'lead_created');

    await page.click('button:has-text("Criar")');

    await expect(page.locator('text=Workflow criado')).toBeVisible();

  });

  test('should add action to workflow', async ({ page }) => {
    await page.goto('/workflows/1');

    await page.click('button:has-text("Adicionar Ação")');

    await page.click('text=Enviar Email');

    await page.fill('[name="subject"]', 'Welcome');

    await page.click('button:has-text("Salvar")');

    await expect(page.locator('text=Ação adicionada')).toBeVisible();

  });

  test('should activate workflow', async ({ page }) => {
    await page.goto('/workflows');

    await page.click('[data-testid="workflow-toggle"]:first-child');

    await expect(page.locator('text=Workflow ativado')).toBeVisible();

  });

});

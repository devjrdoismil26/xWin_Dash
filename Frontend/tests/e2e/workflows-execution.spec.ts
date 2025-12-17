import { test, expect } from '@playwright/test';

test.describe('Workflows Execution', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/workflows');
  });

  test('should create and execute workflow', async ({ page }) => {
    await page.click('[data-testid="new-workflow-btn"]');
    await page.fill('[name="name"]', 'Test Workflow');
    await page.dragAndDrop('[data-testid="trigger-node"]', '[data-testid="canvas"]');
    await page.dragAndDrop('[data-testid="action-node"]', '[data-testid="canvas"]');
    await page.click('[data-testid="save-btn"]');
    await page.click('[data-testid="execute-btn"]');
    await expect(page.locator('text=Workflow executed')).toBeVisible();
  });

  test('should view execution history', async ({ page }) => {
    await page.click('[data-testid="workflow-item"]:first-child');
    await page.click('[data-testid="history-tab"]');
    await expect(page.locator('[data-testid="execution-log"]')).toBeVisible();
  });

  test('should handle workflow errors', async ({ page }) => {
    await page.click('[data-testid="workflow-item"]:first-child');
    await page.click('[data-testid="execute-btn"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});

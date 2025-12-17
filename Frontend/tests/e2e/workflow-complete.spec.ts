import { test, expect } from '@playwright/test';

test.describe('E2E - Complete Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create and execute workflow', async ({ page }) => {
    // Navigate to workflows
    await page.goto('/workflows');
    
    // Create new workflow
    await page.click('[data-testid="new-workflow-btn"]');
    await page.fill('[name="name"]', 'Test Workflow');
    
    // Add trigger
    await page.dragAndDrop('[data-testid="trigger-email"]', '[data-testid="canvas"]');
    
    // Add action
    await page.dragAndDrop('[data-testid="action-send-email"]', '[data-testid="canvas"]');
    
    // Connect nodes
    await page.click('[data-testid="node-output"]');
    await page.click('[data-testid="node-input"]');
    
    // Save workflow
    await page.click('[data-testid="save-btn"]');
    await expect(page.locator('text=Workflow saved')).toBeVisible();
    
    // Execute workflow
    await page.click('[data-testid="execute-btn"]');
    await expect(page.locator('text=Workflow executed')).toBeVisible();
  });
});

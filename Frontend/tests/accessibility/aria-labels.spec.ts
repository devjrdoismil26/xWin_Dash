import { test, expect } from '@playwright/test';

test.describe('ARIA Labels', () => {
  test('should have aria-label on interactive elements', async ({ page }) => {
    await page.goto('/products');
    const buttons = page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const hasLabel = await buttons.nth(i).evaluate(el => 
        el.hasAttribute('aria-label') || el.textContent?.trim().length > 0
      );
      expect(hasLabel).toBe(true);
    }
  });
});

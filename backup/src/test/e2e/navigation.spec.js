import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to main pages', async ({ page }) => {
    await page.goto('/');
    
    // Check if main navigation elements exist
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should handle responsive navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
    await page.goto('/');
    
    // Mobile navigation should be present
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to different sections
    const links = await page.locator('nav a').all();
    
    for (const link of links.slice(0, 3)) { // Test first 3 links
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        await link.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(href);
        await page.goBack();
      }
    }
  });
});

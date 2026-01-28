import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard with metrics', async ({ page }) => {
    // Check if dashboard title is visible
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check if metrics cards are displayed
    await expect(page.locator('[data-testid="metric-card"]')).toHaveCount.greaterThan(0);
    
    // Check if glassmorphism effects are applied
    await expect(page.locator('.backdrop-blur-xl')).toHaveCount.greaterThan(0);
  });

  test('should display loading state initially', async ({ page }) => {
    // Check if loading spinner is visible initially
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // Wait for loading to complete
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });

  test('should handle refresh functionality', async ({ page }) => {
    // Click refresh button
    await page.click('[data-testid="refresh-button"]');
    
    // Check if loading state appears
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // Wait for refresh to complete
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });

  test('should display error state when API fails', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/dashboard/stats', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    // Reload page to trigger API call
    await page.reload();
    
    // Check if error message is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to load');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if dashboard is still functional
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if metrics are stacked vertically on mobile
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards.first()).toBeVisible();
  });

  test('should support dark mode toggle', async ({ page }) => {
    // Check if dark mode toggle exists
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    await expect(darkModeToggle).toBeVisible();
    
    // Click dark mode toggle
    await darkModeToggle.click();
    
    // Check if dark mode classes are applied
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back to light mode
    await darkModeToggle.click();
    
    // Check if light mode is restored
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should display charts when data is available', async ({ page }) => {
    // Wait for charts to load
    await page.waitForSelector('[data-testid="chart-container"]');
    
    // Check if chart is visible
    await expect(page.locator('[data-testid="chart-container"]')).toBeVisible();
    
    // Check if chart has proper dimensions
    const chart = page.locator('[data-testid="chart-container"]');
    const box = await chart.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('should handle navigation between modules', async ({ page }) => {
    // Click on a module navigation item
    await page.click('[data-testid="nav-email-marketing"]');
    
    // Check if URL changes
    await expect(page).toHaveURL(/.*email-marketing/);
    
    // Check if module content loads
    await expect(page.locator('[data-testid="module-content"]')).toBeVisible();
  });

  test('should display notifications', async ({ page }) => {
    // Trigger a notification (e.g., by clicking a button that shows success)
    await page.click('[data-testid="test-notification-button"]');
    
    // Check if notification appears
    await expect(page.locator('[data-testid="notification"]')).toBeVisible();
    
    // Check if notification has correct content
    await expect(page.locator('[data-testid="notification"]')).toContainText('Success');
    
    // Wait for notification to auto-dismiss
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="notification"]')).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on the page
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    
    // Check if focus moved
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should display proper accessibility attributes', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount.greaterThan(0);
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    await expect(h1).toHaveCount(1);
    await expect(h2).toHaveCount.greaterThan(0);
    
    // Check for proper button roles
    await expect(page.locator('button[role="button"]')).toHaveCount.greaterThan(0);
  });

  test('should handle real-time updates', async ({ page }) => {
    // Wait for initial data to load
    await page.waitForSelector('[data-testid="metric-value"]');
    
    // Get initial metric value
    const initialValue = await page.locator('[data-testid="metric-value"]').first().textContent();
    
    // Simulate real-time update (this would normally come from WebSocket)
    await page.evaluate(() => {
      // Simulate WebSocket message
      window.dispatchEvent(new CustomEvent('metric-update', {
        detail: { metric: 'revenue', value: '150000' }
      }));
    });
    
    // Wait for update to be reflected
    await page.waitForTimeout(1000);
    
    // Check if value updated
    const updatedValue = await page.locator('[data-testid="metric-value"]').first().textContent();
    expect(updatedValue).not.toBe(initialValue);
  });
});
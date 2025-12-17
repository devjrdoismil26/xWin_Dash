import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Auth UI Visual Regression', () => {
  test('login page', async ({ page }) => {
    await page.goto('/login');
    await percySnapshot(page, 'Login Page');
  });

  test('register page', async ({ page }) => {
    await page.goto('/register');
    await percySnapshot(page, 'Register Page');
  });

  test('forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await percySnapshot(page, 'Forgot Password');
  });
});

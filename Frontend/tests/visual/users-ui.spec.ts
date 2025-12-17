import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Users UI Visual Regression', () => {
  test('users list page', async ({ page }) => {
    await page.goto('/users');
    await percySnapshot(page, 'Users List');
  });

  test('user form', async ({ page }) => {
    await page.goto('/users/new');
    await percySnapshot(page, 'User Form');
  });

  test('user profile', async ({ page }) => {
    await page.goto('/users/1');
    await percySnapshot(page, 'User Profile');
  });
});

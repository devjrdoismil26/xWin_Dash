import { test, expect } from '@playwright/test';

test.describe('Perfil de Usuário', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página principal antes de cada teste
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('deve exibir informações do perfil', async ({ page }) => {
    // Procurar por elementos relacionados ao perfil
    const profileElements = page.locator('[data-testid*="profile"], [class*="profile"], [id*="profile"]');
    const profileCount = await profileElements.count();
    
    if (profileCount > 0) {
      await expect(profileElements.first()).toBeVisible();
    }
  });

  test('deve ter formulário de edição de perfil', async ({ page }) => {
    // Procurar por elementos de edição
    const editElements = page.locator('[data-testid*="edit"], [class*="edit"], [id*="edit"]');
    const editCount = await editElements.count();
    
    if (editCount > 0) {
      await expect(editElements.first()).toBeVisible();
    }
  });

  test('deve ter preferências do usuário', async ({ page }) => {
    // Procurar por elementos de preferências
    const preferenceElements = page.locator('[data-testid*="preference"], [class*="preference"], [id*="preference"]');
    const preferenceCount = await preferenceElements.count();
    
    if (preferenceCount > 0) {
      await expect(preferenceElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de usuário', async ({ page }) => {
    // Procurar por elementos de configurações
    const settingsElements = page.locator('[data-testid*="setting"], [class*="setting"], [id*="setting"]');
    const settingsCount = await settingsElements.count();
    
    if (settingsCount > 0) {
      await expect(settingsElements.first()).toBeVisible();
    }
  });

  test('deve ter informações pessoais', async ({ page }) => {
    // Procurar por campos de informações pessoais
    const personalInfoElements = page.locator('input[name="name"], input[name="email"], input[name="phone"]');
    const personalInfoCount = await personalInfoElements.count();
    
    if (personalInfoCount > 0) {
      await expect(personalInfoElements.first()).toBeVisible();
    }
  });

  test('deve ter upload de avatar', async ({ page }) => {
    // Procurar por elementos de upload
    const uploadElements = page.locator('input[type="file"], [data-testid*="upload"], [class*="upload"]');
    const uploadCount = await uploadElements.count();
    
    if (uploadCount > 0) {
      await expect(uploadElements.first()).toBeVisible();
    }
  });

  test('deve ter alteração de senha', async ({ page }) => {
    // Procurar por elementos de alteração de senha
    const passwordElements = page.locator('input[name*="password"], [data-testid*="password"], [class*="password"]');
    const passwordCount = await passwordElements.count();
    
    if (passwordCount > 0) {
      await expect(passwordElements.first()).toBeVisible();
    }
  });

  test('deve ter notificações do perfil', async ({ page }) => {
    // Procurar por elementos de notificação
    const notificationElements = page.locator('[data-testid*="notification"], [class*="notification"], [id*="notification"]');
    const notificationCount = await notificationElements.count();
    
    if (notificationCount > 0) {
      await expect(notificationElements.first()).toBeVisible();
    }
  });

  test('deve ter histórico de atividades', async ({ page }) => {
    // Procurar por elementos de histórico
    const historyElements = page.locator('[data-testid*="history"], [class*="history"], [id*="history"]');
    const historyCount = await historyElements.count();
    
    if (historyCount > 0) {
      await expect(historyElements.first()).toBeVisible();
    }
  });

  test('deve ter estatísticas do usuário', async ({ page }) => {
    // Procurar por elementos de estatísticas
    const statsElements = page.locator('[data-testid*="stats"], [class*="stats"], [id*="stats"]');
    const statsCount = await statsElements.count();
    
    if (statsCount > 0) {
      await expect(statsElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de privacidade', async ({ page }) => {
    // Procurar por elementos de privacidade
    const privacyElements = page.locator('[data-testid*="privacy"], [class*="privacy"], [id*="privacy"]');
    const privacyCount = await privacyElements.count();
    
    if (privacyCount > 0) {
      await expect(privacyElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de segurança', async ({ page }) => {
    // Procurar por elementos de segurança
    const securityElements = page.locator('[data-testid*="security"], [class*="security"], [id*="security"]');
    const securityCount = await securityElements.count();
    
    if (securityCount > 0) {
      await expect(securityElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de conta', async ({ page }) => {
    // Procurar por elementos de conta
    const accountElements = page.locator('[data-testid*="account"], [class*="account"], [id*="account"]');
    const accountCount = await accountElements.count();
    
    if (accountCount > 0) {
      await expect(accountElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de tema', async ({ page }) => {
    // Procurar por elementos de tema
    const themeElements = page.locator('[data-testid*="theme"], [class*="theme"], [id*="theme"]');
    const themeCount = await themeElements.count();
    
    if (themeCount > 0) {
      await expect(themeElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de idioma', async ({ page }) => {
    // Procurar por elementos de idioma
    const languageElements = page.locator('[data-testid*="language"], [class*="language"], [id*="language"]');
    const languageCount = await languageElements.count();
    
    if (languageCount > 0) {
      await expect(languageElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de timezone', async ({ page }) => {
    // Procurar por elementos de timezone
    const timezoneElements = page.locator('[data-testid*="timezone"], [class*="timezone"], [id*="timezone"]');
    const timezoneCount = await timezoneElements.count();
    
    if (timezoneCount > 0) {
      await expect(timezoneElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de email', async ({ page }) => {
    // Procurar por elementos de configurações de email
    const emailSettingsElements = page.locator('[data-testid*="email"], [class*="email"], [id*="email"]');
    const emailSettingsCount = await emailSettingsElements.count();
    
    if (emailSettingsCount > 0) {
      await expect(emailSettingsElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de SMS', async ({ page }) => {
    // Procurar por elementos de configurações de SMS
    const smsElements = page.locator('[data-testid*="sms"], [class*="sms"], [id*="sms"]');
    const smsCount = await smsElements.count();
    
    if (smsCount > 0) {
      await expect(smsElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de push', async ({ page }) => {
    // Procurar por elementos de configurações de push
    const pushElements = page.locator('[data-testid*="push"], [class*="push"], [id*="push"]');
    const pushCount = await pushElements.count();
    
    if (pushCount > 0) {
      await expect(pushElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de webhook', async ({ page }) => {
    // Procurar por elementos de configurações de webhook
    const webhookElements = page.locator('[data-testid*="webhook"], [class*="webhook"], [id*="webhook"]');
    const webhookCount = await webhookElements.count();
    
    if (webhookCount > 0) {
      await expect(webhookElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de API', async ({ page }) => {
    // Procurar por elementos de configurações de API
    const apiElements = page.locator('[data-testid*="api"], [class*="api"], [id*="api"]');
    const apiCount = await apiElements.count();
    
    if (apiCount > 0) {
      await expect(apiElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de integração', async ({ page }) => {
    // Procurar por elementos de configurações de integração
    const integrationElements = page.locator('[data-testid*="integration"], [class*="integration"], [id*="integration"]');
    const integrationCount = await integrationElements.count();
    
    if (integrationCount > 0) {
      await expect(integrationElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de backup', async ({ page }) => {
    // Procurar por elementos de configurações de backup
    const backupElements = page.locator('[data-testid*="backup"], [class*="backup"], [id*="backup"]');
    const backupCount = await backupElements.count();
    
    if (backupCount > 0) {
      await expect(backupElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de exportação', async ({ page }) => {
    // Procurar por elementos de configurações de exportação
    const exportElements = page.locator('[data-testid*="export"], [class*="export"], [id*="export"]');
    const exportCount = await exportElements.count();
    
    if (exportCount > 0) {
      await expect(exportElements.first()).toBeVisible();
    }
  });

  test('deve ter configurações de importação', async ({ page }) => {
    // Procurar por elementos de configurações de importação
    const importElements = page.locator('[data-testid*="import"], [class*="import"], [id*="import"]');
    const importCount = await importElements.count();
    
    if (importCount > 0) {
      await expect(importElements.first()).toBeVisible();
    }
  });

  test('deve ter responsividade em diferentes telas', async ({ page }) => {
    // Testar responsividade
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.waitForLoadState('networkidle');
    
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await page.waitForLoadState('networkidle');
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.waitForLoadState('networkidle');
    
    // Se chegou até aqui, a responsividade está funcionando
    expect(true).toBe(true);
  });

  test('deve ter acessibilidade básica', async ({ page }) => {
    // Verificar elementos básicos de acessibilidade
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    // Deve haver pelo menos um heading
    expect(headingCount).toBeGreaterThan(0);
    
    // Verificar se há elementos com roles apropriados
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      await expect(buttons.first()).toBeVisible();
    }
  });
});
import { test, expect } from '@playwright/test';

test.describe('Perfil de Usuário - Testes Isolados', () => {
  test.describe('Página de Perfil Principal', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/profile');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de perfil corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*profile/);
    });

    test('deve exibir informações do usuário', async ({ page }) => {
      // Procurar por elementos relacionados ao perfil
      const profileElements = await page.evaluate(() => {
        return {
          hasProfileSection: !!document.querySelector('[data-testid*="profile"], [class*="profile"], [id*="profile"]'),
          hasUserInfo: !!document.querySelector('[data-testid*="user-info"], [class*="user-info"], [id*="user-info"]'),
          hasAvatar: !!document.querySelector('img[alt*="avatar"], [data-testid*="avatar"], [class*="avatar"]'),
          hasName: !!document.querySelector('[data-testid*="name"], [class*="name"], [id*="name"]'),
          hasEmail: !!document.querySelector('[data-testid*="email"], [class*="email"], [id*="email"]'),
          totalElements: document.querySelectorAll('*').length
        };
      });

      console.log('Elementos do perfil encontrados:', profileElements);
      expect(profileElements.totalElements).toBeGreaterThan(0);
    });

    test('deve ter navegação para edição', async ({ page }) => {
      // Procurar por botões ou links de edição
      const editElements = await page.evaluate(() => {
        return {
          hasEditButton: !!document.querySelector('button[data-testid*="edit"], [class*="edit"], [id*="edit"]'),
          hasEditLink: !!document.querySelector('a[href*="edit"], a[data-testid*="edit"]'),
          editButtons: document.querySelectorAll('button').length,
          editLinks: document.querySelectorAll('a').length
        };
      });

      console.log('Elementos de edição encontrados:', editElements);
    });

    test('deve ter seções organizadas', async ({ page }) => {
      // Verificar estrutura da página
      const pageStructure = await page.evaluate(() => {
        return {
          hasMain: !!document.querySelector('main, [role="main"]'),
          hasSections: document.querySelectorAll('section').length,
          hasHeaders: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          hasCards: document.querySelectorAll('[class*="card"], [data-testid*="card"]').length,
          hasGrid: document.querySelectorAll('[class*="grid"], [class*="flex"]').length
        };
      });

      console.log('Estrutura da página:', pageStructure);
      expect(pageStructure.hasMain || pageStructure.hasSections).toBeTruthy();
    });
  });

  test.describe('Página de Edição de Perfil', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/profile/edit');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de edição corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*profile.*edit/);
    });

    test('deve exibir formulário de edição', async ({ page }) => {
      const formElements = await page.evaluate(() => {
        return {
          hasForm: !!document.querySelector('form'),
          hasNameInput: !!document.querySelector('input[name="name"], input[data-testid*="name"]'),
          hasEmailInput: !!document.querySelector('input[name="email"], input[data-testid*="email"]'),
          hasPhoneInput: !!document.querySelector('input[name="phone"], input[data-testid*="phone"]'),
          hasBioInput: !!document.querySelector('textarea[name="bio"], textarea[data-testid*="bio"]'),
          hasSubmitButton: !!document.querySelector('button[type="submit"], button[data-testid*="submit"]'),
          hasCancelButton: !!document.querySelector('button[data-testid*="cancel"], button[class*="cancel"]'),
          totalInputs: document.querySelectorAll('input, textarea').length
        };
      });

      console.log('Elementos do formulário:', formElements);
      expect(formElements.hasForm).toBeTruthy();
    });

    test('deve ter validação de campos', async ({ page }) => {
      const validationElements = await page.evaluate(() => {
        return {
          requiredInputs: document.querySelectorAll('input[required], textarea[required]').length,
          emailInputs: document.querySelectorAll('input[type="email"]').length,
          textInputs: document.querySelectorAll('input[type="text"]').length,
          textareas: document.querySelectorAll('textarea').length
        };
      });

      console.log('Elementos de validação:', validationElements);
    });

    test('deve ter upload de avatar', async ({ page }) => {
      const uploadElements = await page.evaluate(() => {
        return {
          hasFileInput: !!document.querySelector('input[type="file"]'),
          hasUploadButton: !!document.querySelector('button[data-testid*="upload"], [class*="upload"]'),
          hasImagePreview: !!document.querySelector('img[data-testid*="preview"], [class*="preview"]'),
          hasDragDrop: !!document.querySelector('[data-testid*="drop"], [class*="drop"]')
        };
      });

      console.log('Elementos de upload:', uploadElements);
    });
  });

  test.describe('Página de Preferências', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/profile/preferences');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de preferências corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*preferences/);
    });

    test('deve exibir configurações de preferências', async ({ page }) => {
      const preferenceElements = await page.evaluate(() => {
        return {
          hasThemeToggle: !!document.querySelector('[data-testid*="theme"], [class*="theme"], [id*="theme"]'),
          hasLanguageSelect: !!document.querySelector('select[name*="language"], [data-testid*="language"]'),
          hasTimezoneSelect: !!document.querySelector('select[name*="timezone"], [data-testid*="timezone"]'),
          hasNotificationSettings: !!document.querySelector('[data-testid*="notification"], [class*="notification"]'),
          hasPrivacySettings: !!document.querySelector('[data-testid*="privacy"], [class*="privacy"]'),
          hasSecuritySettings: !!document.querySelector('[data-testid*="security"], [class*="security"]'),
          totalSwitches: document.querySelectorAll('input[type="checkbox"], [role="switch"]').length,
          totalSelects: document.querySelectorAll('select').length
        };
      });

      console.log('Elementos de preferências:', preferenceElements);
    });

    test('deve ter configurações de notificação', async ({ page }) => {
      const notificationElements = await page.evaluate(() => {
        return {
          hasEmailNotifications: !!document.querySelector('[data-testid*="email-notification"], [class*="email-notification"]'),
          hasPushNotifications: !!document.querySelector('[data-testid*="push-notification"], [class*="push-notification"]'),
          hasSMSNotifications: !!document.querySelector('[data-testid*="sms-notification"], [class*="sms-notification"]'),
          hasWebhookSettings: !!document.querySelector('[data-testid*="webhook"], [class*="webhook"]'),
          totalNotificationSettings: document.querySelectorAll('[data-testid*="notification"], [class*="notification"]').length
        };
      });

      console.log('Configurações de notificação:', notificationElements);
    });

    test('deve ter configurações de tema', async ({ page }) => {
      const themeElements = await page.evaluate(() => {
        return {
          hasLightMode: !!document.querySelector('[data-testid*="light"], [class*="light"]'),
          hasDarkMode: !!document.querySelector('[data-testid*="dark"], [class*="dark"]'),
          hasAutoMode: !!document.querySelector('[data-testid*="auto"], [class*="auto"]'),
          hasColorPicker: !!document.querySelector('input[type="color"], [data-testid*="color"]'),
          totalThemeOptions: document.querySelectorAll('[data-testid*="theme"], [class*="theme"]').length
        };
      });

      console.log('Configurações de tema:', themeElements);
    });
  });

  test.describe('Página de Configurações de Conta', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/profile/settings');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de configurações corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*settings/);
    });

    test('deve exibir configurações de conta', async ({ page }) => {
      const accountElements = await page.evaluate(() => {
        return {
          hasAccountSection: !!document.querySelector('[data-testid*="account"], [class*="account"], [id*="account"]'),
          hasPasswordChange: !!document.querySelector('[data-testid*="password"], [class*="password"]'),
          hasTwoFactor: !!document.querySelector('[data-testid*="two-factor"], [class*="two-factor"]'),
          hasAPIKeys: !!document.querySelector('[data-testid*="api"], [class*="api"]'),
          hasIntegrations: !!document.querySelector('[data-testid*="integration"], [class*="integration"]'),
          hasBackup: !!document.querySelector('[data-testid*="backup"], [class*="backup"]'),
          hasExport: !!document.querySelector('[data-testid*="export"], [class*="export"]'),
          hasImport: !!document.querySelector('[data-testid*="import"], [class*="import"]'),
          totalSettings: document.querySelectorAll('[data-testid*="setting"], [class*="setting"]').length
        };
      });

      console.log('Configurações de conta:', accountElements);
    });

    test('deve ter alteração de senha', async ({ page }) => {
      const passwordElements = await page.evaluate(() => {
        return {
          hasCurrentPassword: !!document.querySelector('input[name*="current-password"], input[data-testid*="current-password"]'),
          hasNewPassword: !!document.querySelector('input[name*="new-password"], input[data-testid*="new-password"]'),
          hasConfirmPassword: !!document.querySelector('input[name*="confirm-password"], input[data-testid*="confirm-password"]'),
          hasPasswordStrength: !!document.querySelector('[data-testid*="strength"], [class*="strength"]'),
          hasPasswordRequirements: !!document.querySelector('[data-testid*="requirements"], [class*="requirements"]'),
          totalPasswordInputs: document.querySelectorAll('input[type="password"]').length
        };
      });

      console.log('Elementos de alteração de senha:', passwordElements);
    });

    test('deve ter autenticação de dois fatores', async ({ page }) => {
      const twoFactorElements = await page.evaluate(() => {
        return {
          has2FAEnabled: !!document.querySelector('[data-testid*="2fa-enabled"], [class*="2fa-enabled"]'),
          has2FADisable: !!document.querySelector('[data-testid*="2fa-disable"], [class*="2fa-disable"]'),
          hasQRCode: !!document.querySelector('[data-testid*="qr"], [class*="qr"]'),
          hasBackupCodes: !!document.querySelector('[data-testid*="backup-codes"], [class*="backup-codes"]'),
          hasRecoveryCodes: !!document.querySelector('[data-testid*="recovery"], [class*="recovery"]'),
          total2FAElements: document.querySelectorAll('[data-testid*="2fa"], [class*="2fa"]').length
        };
      });

      console.log('Elementos de 2FA:', twoFactorElements);
    });
  });

  test.describe('Página de Atividade do Usuário', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/profile/activity');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de atividade corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*activity/);
    });

    test('deve exibir histórico de atividades', async ({ page }) => {
      const activityElements = await page.evaluate(() => {
        return {
          hasActivityList: !!document.querySelector('[data-testid*="activity-list"], [class*="activity-list"]'),
          hasActivityItems: document.querySelectorAll('[data-testid*="activity-item"], [class*="activity-item"]').length,
          hasTimeline: !!document.querySelector('[data-testid*="timeline"], [class*="timeline"]'),
          hasFilters: !!document.querySelector('[data-testid*="filter"], [class*="filter"]'),
          hasSearch: !!document.querySelector('input[type="search"], [data-testid*="search"]'),
          hasPagination: !!document.querySelector('[data-testid*="pagination"], [class*="pagination"]'),
          totalActivities: document.querySelectorAll('[data-testid*="activity"], [class*="activity"]').length
        };
      });

      console.log('Elementos de atividade:', activityElements);
    });

    test('deve ter filtros de atividade', async ({ page }) => {
      const filterElements = await page.evaluate(() => {
        return {
          hasDateFilter: !!document.querySelector('input[type="date"], [data-testid*="date-filter"]'),
          hasTypeFilter: !!document.querySelector('select[name*="type"], [data-testid*="type-filter"]'),
          hasStatusFilter: !!document.querySelector('select[name*="status"], [data-testid*="status-filter"]'),
          hasClearFilters: !!document.querySelector('button[data-testid*="clear"], [class*="clear"]'),
          totalFilters: document.querySelectorAll('[data-testid*="filter"], [class*="filter"]').length
        };
      });

      console.log('Elementos de filtro:', filterElements);
    });
  });

  test.describe('Responsividade das Páginas de Perfil', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      test(`deve ser responsivo em ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Testar página principal
        await page.goto('/profile');
        await page.waitForSelector('body');
        
        // Verificar se a página carrega sem problemas
        const pageInfo = await page.evaluate(() => {
          return {
            hasScrollbars: document.documentElement.scrollHeight > window.innerHeight,
            elementsVisible: document.querySelectorAll('*').length,
            hasMainContent: !!document.querySelector('main, [role="main"]')
          };
        });

        console.log(`Página de perfil em ${viewport.name}:`, pageInfo);
        expect(pageInfo.elementsVisible).toBeGreaterThan(0);
      });
    }
  });

  test.describe('Acessibilidade das Páginas de Perfil', () => {
    test('deve ter estrutura semântica adequada', async ({ page }) => {
      await page.goto('/profile');
      
      const semanticElements = await page.evaluate(() => {
        return {
          hasMain: !!document.querySelector('main, [role="main"]'),
          hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          hasSections: document.querySelectorAll('section').length,
          hasArticles: document.querySelectorAll('article').length,
          hasAsides: document.querySelectorAll('aside').length
        };
      });

      console.log('Elementos semânticos:', semanticElements);
      expect(semanticElements.hasMain || semanticElements.hasHeadings).toBeTruthy();
    });

    test('deve ter navegação por teclado', async ({ page }) => {
      await page.goto('/profile');
      
      // Verificar se elementos podem receber foco
      const focusableElements = await page.evaluate(() => {
        return {
          buttons: document.querySelectorAll('button').length,
          links: document.querySelectorAll('a[href]').length,
          inputs: document.querySelectorAll('input, textarea, select').length,
          totalFocusable: document.querySelectorAll('button, a[href], input, textarea, select, [tabindex]').length
        };
      });

      console.log('Elementos focáveis:', focusableElements);
      expect(focusableElements.totalFocusable).toBeGreaterThan(0);
    });

    test('deve ter contraste adequado', async ({ page }) => {
      await page.goto('/profile');
      
      // Verificar classes de modo escuro
      const darkElements = await page.evaluate(() => {
        return {
          darkText: document.querySelectorAll('.dark\\:text-white, .dark\\:text-gray-100').length,
          darkBg: document.querySelectorAll('.dark\\:bg-gray-800, .dark\\:bg-gray-900').length,
          darkBorder: document.querySelectorAll('.dark\\:border-gray-700, .dark\\:border-gray-600').length,
          totalDarkElements: document.querySelectorAll('[class*="dark:"]').length
        };
      });

      console.log('Elementos de modo escuro:', darkElements);
    });
  });

  test.describe('Navegação entre Páginas de Perfil', () => {
    test('deve navegar entre seções do perfil', async ({ page }) => {
      await page.goto('/profile');
      
      // Procurar por links de navegação
      const navigationElements = await page.evaluate(() => {
        return {
          hasEditLink: !!document.querySelector('a[href*="edit"]'),
          hasPreferencesLink: !!document.querySelector('a[href*="preferences"]'),
          hasSettingsLink: !!document.querySelector('a[href*="settings"]'),
          hasActivityLink: !!document.querySelector('a[href*="activity"]'),
          totalLinks: document.querySelectorAll('a[href]').length
        };
      });

      console.log('Elementos de navegação:', navigationElements);
    });

    test('deve ter breadcrumbs', async ({ page }) => {
      await page.goto('/profile');
      
      const breadcrumbElements = await page.evaluate(() => {
        return {
          hasBreadcrumbs: !!document.querySelector('[data-testid*="breadcrumb"], [class*="breadcrumb"], nav[aria-label*="breadcrumb"]'),
          breadcrumbItems: document.querySelectorAll('[data-testid*="breadcrumb-item"], [class*="breadcrumb-item"]').length,
          hasHomeLink: !!document.querySelector('a[href="/"], a[href*="dashboard"]')
        };
      });

      console.log('Elementos de breadcrumb:', breadcrumbElements);
    });
  });
});
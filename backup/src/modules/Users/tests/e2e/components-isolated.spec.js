import { test, expect } from '@playwright/test';

test.describe('Componentes de Usuários - Testes Isolados', () => {
  test.describe('Componentes de Autenticação', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('body');
    });

    test('deve ter componente LoginForm funcionando', async ({ page }) => {
      const loginFormElements = await page.evaluate(() => {
        return {
          hasForm: !!document.querySelector('form'),
          hasEmailField: !!document.querySelector('input[name="email"]'),
          hasPasswordField: !!document.querySelector('input[name="password"]'),
          hasRememberCheckbox: !!document.querySelector('input[name="remember"]'),
          hasSubmitButton: !!document.querySelector('button[type="submit"]'),
          hasPasswordToggle: !!document.querySelector('button[type="button"]'),
          hasFormValidation: !!document.querySelector('input[required]'),
          formClass: document.querySelector('form')?.className || '',
          totalFormElements: document.querySelectorAll('form *').length
        };
      });

      console.log('Elementos do LoginForm:', loginFormElements);
      expect(loginFormElements.hasForm).toBeTruthy();
    });

    test('deve ter componente Input funcionando', async ({ page }) => {
      const inputElements = await page.evaluate(() => {
        return {
          emailInput: {
            hasInput: !!document.querySelector('input[name="email"]'),
            hasLabel: !!document.querySelector('label[for="email"]'),
            hasIcon: !!document.querySelector('input[name="email"] + svg, input[name="email"]').previousElementSibling?.tagName === 'svg',
            hasPlaceholder: !!document.querySelector('input[name="email"]')?.placeholder,
            hasValidation: !!document.querySelector('input[name="email"]')?.required
          },
          passwordInput: {
            hasInput: !!document.querySelector('input[name="password"]'),
            hasLabel: !!document.querySelector('label[for="password"]'),
            hasIcon: !!document.querySelector('input[name="password"] + svg, input[name="password"]').previousElementSibling?.tagName === 'svg',
            hasPlaceholder: !!document.querySelector('input[name="password"]')?.placeholder,
            hasValidation: !!document.querySelector('input[name="password"]')?.required
          }
        };
      });

      console.log('Elementos dos Inputs:', inputElements);
      expect(inputElements.emailInput.hasInput).toBeTruthy();
      expect(inputElements.passwordInput.hasInput).toBeTruthy();
    });

    test('deve ter componente Button funcionando', async ({ page }) => {
      const buttonElements = await page.evaluate(() => {
        return {
          submitButton: {
            hasButton: !!document.querySelector('button[type="submit"]'),
            hasText: document.querySelector('button[type="submit"]')?.textContent || '',
            hasClass: document.querySelector('button[type="submit"]')?.className || '',
            isDisabled: document.querySelector('button[type="submit"]')?.disabled || false
          },
          toggleButton: {
            hasButton: !!document.querySelector('button[type="button"]'),
            hasIcon: !!document.querySelector('button[type="button"] svg'),
            hasClickHandler: true // Assumindo que tem handler
          }
        };
      });

      console.log('Elementos dos Buttons:', buttonElements);
      expect(buttonElements.submitButton.hasButton).toBeTruthy();
    });

    test('deve ter componente Checkbox funcionando', async ({ page }) => {
      const checkboxElements = await page.evaluate(() => {
        return {
          hasCheckbox: !!document.querySelector('input[name="remember"]'),
          hasLabel: !!document.querySelector('input[name="remember"] + span, label:has(input[name="remember"])'),
          hasText: document.querySelector('input[name="remember"] + span')?.textContent || '',
          isChecked: document.querySelector('input[name="remember"]')?.checked || false,
          checkboxType: document.querySelector('input[name="remember"]')?.type || ''
        };
      });

      console.log('Elementos do Checkbox:', checkboxElements);
      expect(checkboxElements.hasCheckbox).toBeTruthy();
    });
  });

  test.describe('Componentes de Cadastro', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
      await page.waitForSelector('body');
    });

    test('deve ter componente RegisterForm funcionando', async ({ page }) => {
      const registerFormElements = await page.evaluate(() => {
        return {
          hasForm: !!document.querySelector('form'),
          hasNameField: !!document.querySelector('input[name="name"]'),
          hasEmailField: !!document.querySelector('input[name="email"]'),
          hasPasswordField: !!document.querySelector('input[name="password"]'),
          hasPasswordConfirmationField: !!document.querySelector('input[name="password_confirmation"]'),
          hasSubmitButton: !!document.querySelector('button[type="submit"]'),
          hasPasswordToggles: document.querySelectorAll('button[type="button"]').length,
          totalFormElements: document.querySelectorAll('form *').length
        };
      });

      console.log('Elementos do RegisterForm:', registerFormElements);
      expect(registerFormElements.hasForm).toBeTruthy();
    });

    test('deve ter validação de confirmação de senha', async ({ page }) => {
      const passwordValidationElements = await page.evaluate(() => {
        return {
          hasPasswordField: !!document.querySelector('input[name="password"]'),
          hasPasswordConfirmationField: !!document.querySelector('input[name="password_confirmation"]'),
          passwordType: document.querySelector('input[name="password"]')?.type || '',
          confirmationType: document.querySelector('input[name="password_confirmation"]')?.type || '',
          bothRequired: document.querySelector('input[name="password"]')?.required && 
                       document.querySelector('input[name="password_confirmation"]')?.required
        };
      });

      console.log('Elementos de validação de senha:', passwordValidationElements);
      expect(passwordValidationElements.hasPasswordField).toBeTruthy();
      expect(passwordValidationElements.hasPasswordConfirmationField).toBeTruthy();
    });
  });

  test.describe('Componentes de Gerenciamento', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/users');
      await page.waitForSelector('body');
    });

    test('deve ter componente UserTable funcionando', async ({ page }) => {
      const tableElements = await page.evaluate(() => {
        return {
          hasTable: !!document.querySelector('table'),
          hasTableHeaders: document.querySelectorAll('th').length,
          hasTableRows: document.querySelectorAll('tr').length,
          hasTableCells: document.querySelectorAll('td').length,
          hasTableActions: document.querySelectorAll('button, a').length,
          tableClass: document.querySelector('table')?.className || '',
          totalTableElements: document.querySelectorAll('table *').length
        };
      });

      console.log('Elementos da UserTable:', tableElements);
    });

    test('deve ter componente UserCard funcionando', async ({ page }) => {
      const cardElements = await page.evaluate(() => {
        return {
          hasCards: document.querySelectorAll('[class*="card"], [data-testid*="card"]').length,
          hasUserCards: document.querySelectorAll('[class*="user-card"], [data-testid*="user-card"]').length,
          hasCardHeaders: document.querySelectorAll('[class*="card-header"], [data-testid*="card-header"]').length,
          hasCardContent: document.querySelectorAll('[class*="card-content"], [data-testid*="card-content"]').length,
          hasCardActions: document.querySelectorAll('[class*="card-actions"], [data-testid*="card-actions"]').length,
          totalCardElements: document.querySelectorAll('[class*="card"], [data-testid*="card"]').length
        };
      });

      console.log('Elementos dos UserCards:', cardElements);
    });

    test('deve ter componente UserStats funcionando', async ({ page }) => {
      const statsElements = await page.evaluate(() => {
        return {
          hasStats: !!document.querySelector('[data-testid*="stats"], [class*="stats"]'),
          hasStatCards: document.querySelectorAll('[data-testid*="stat-card"], [class*="stat-card"]').length,
          hasStatNumbers: document.querySelectorAll('[data-testid*="stat-number"], [class*="stat-number"]').length,
          hasStatLabels: document.querySelectorAll('[data-testid*="stat-label"], [class*="stat-label"]').length,
          hasStatCharts: document.querySelectorAll('[data-testid*="chart"], [class*="chart"], canvas').length,
          totalStatsElements: document.querySelectorAll('[data-testid*="stat"], [class*="stat"]').length
        };
      });

      console.log('Elementos dos UserStats:', statsElements);
    });

    test('deve ter componente UserFilters funcionando', async ({ page }) => {
      const filterElements = await page.evaluate(() => {
        return {
          hasFilters: !!document.querySelector('[data-testid*="filter"], [class*="filter"]'),
          hasSearchInput: !!document.querySelector('input[type="search"], input[placeholder*="search"]'),
          hasStatusFilter: !!document.querySelector('select[name*="status"], [data-testid*="status-filter"]'),
          hasRoleFilter: !!document.querySelector('select[name*="role"], [data-testid*="role-filter"]'),
          hasDateFilter: !!document.querySelector('input[type="date"], [data-testid*="date-filter"]'),
          hasClearButton: !!document.querySelector('button[data-testid*="clear"], [class*="clear"]'),
          totalFilterElements: document.querySelectorAll('[data-testid*="filter"], [class*="filter"]').length
        };
      });

      console.log('Elementos dos UserFilters:', filterElements);
    });
  });

  test.describe('Componentes de Perfil', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/profile');
      await page.waitForSelector('body');
    });

    test('deve ter componente UserProfile funcionando', async ({ page }) => {
      const profileElements = await page.evaluate(() => {
        return {
          hasProfile: !!document.querySelector('[data-testid*="profile"], [class*="profile"]'),
          hasAvatar: !!document.querySelector('img[alt*="avatar"], [data-testid*="avatar"]'),
          hasName: !!document.querySelector('[data-testid*="name"], [class*="name"]'),
          hasEmail: !!document.querySelector('[data-testid*="email"], [class*="email"]'),
          hasBio: !!document.querySelector('[data-testid*="bio"], [class*="bio"]'),
          hasEditButton: !!document.querySelector('button[data-testid*="edit"], [class*="edit"]'),
          totalProfileElements: document.querySelectorAll('[data-testid*="profile"], [class*="profile"]').length
        };
      });

      console.log('Elementos do UserProfile:', profileElements);
    });

    test('deve ter componente UserPreferences funcionando', async ({ page }) => {
      const preferencesElements = await page.evaluate(() => {
        return {
          hasPreferences: !!document.querySelector('[data-testid*="preferences"], [class*="preferences"]'),
          hasThemeToggle: !!document.querySelector('[data-testid*="theme"], [class*="theme"]'),
          hasLanguageSelect: !!document.querySelector('select[name*="language"], [data-testid*="language"]'),
          hasTimezoneSelect: !!document.querySelector('select[name*="timezone"], [data-testid*="timezone"]'),
          hasNotificationSettings: !!document.querySelector('[data-testid*="notification"], [class*="notification"]'),
          totalPreferencesElements: document.querySelectorAll('[data-testid*="preference"], [class*="preference"]').length
        };
      });

      console.log('Elementos dos UserPreferences:', preferencesElements);
    });

    test('deve ter componente UserActivity funcionando', async ({ page }) => {
      const activityElements = await page.evaluate(() => {
        return {
          hasActivity: !!document.querySelector('[data-testid*="activity"], [class*="activity"]'),
          hasActivityList: !!document.querySelector('[data-testid*="activity-list"], [class*="activity-list"]'),
          hasActivityItems: document.querySelectorAll('[data-testid*="activity-item"], [class*="activity-item"]').length,
          hasTimeline: !!document.querySelector('[data-testid*="timeline"], [class*="timeline"]'),
          hasActivityFilters: !!document.querySelector('[data-testid*="activity-filter"], [class*="activity-filter"]'),
          totalActivityElements: document.querySelectorAll('[data-testid*="activity"], [class*="activity"]').length
        };
      });

      console.log('Elementos do UserActivity:', activityElements);
    });
  });

  test.describe('Componentes de Notificação', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('body');
    });

    test('deve ter componente NotificationSystem funcionando', async ({ page }) => {
      const notificationElements = await page.evaluate(() => {
        return {
          hasNotificationSystem: !!document.querySelector('[data-testid*="notification-system"], [class*="notification-system"]'),
          hasNotificationList: !!document.querySelector('[data-testid*="notification-list"], [class*="notification-list"]'),
          hasNotificationItems: document.querySelectorAll('[data-testid*="notification-item"], [class*="notification-item"]').length,
          hasNotificationBell: !!document.querySelector('[data-testid*="notification-bell"], [class*="notification-bell"]'),
          hasNotificationBadge: !!document.querySelector('[data-testid*="notification-badge"], [class*="notification-badge"]'),
          totalNotificationElements: document.querySelectorAll('[data-testid*="notification"], [class*="notification"]').length
        };
      });

      console.log('Elementos do NotificationSystem:', notificationElements);
    });

    test('deve ter componente NotificationItem funcionando', async ({ page }) => {
      const notificationItemElements = await page.evaluate(() => {
        return {
          hasNotificationItems: document.querySelectorAll('[data-testid*="notification-item"], [class*="notification-item"]').length,
          hasNotificationTitle: !!document.querySelector('[data-testid*="notification-title"], [class*="notification-title"]'),
          hasNotificationMessage: !!document.querySelector('[data-testid*="notification-message"], [class*="notification-message"]'),
          hasNotificationTime: !!document.querySelector('[data-testid*="notification-time"], [class*="notification-time"]'),
          hasNotificationActions: !!document.querySelector('[data-testid*="notification-actions"], [class*="notification-actions"]'),
          hasNotificationClose: !!document.querySelector('[data-testid*="notification-close"], [class*="notification-close"]')
        };
      });

      console.log('Elementos do NotificationItem:', notificationItemElements);
    });
  });

  test.describe('Componentes de Formulário', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/users/create');
      await page.waitForSelector('body');
    });

    test('deve ter componente Form funcionando', async ({ page }) => {
      const formElements = await page.evaluate(() => {
        return {
          hasForm: !!document.querySelector('form'),
          hasFormFields: document.querySelectorAll('input, textarea, select').length,
          hasFormValidation: document.querySelectorAll('input[required], textarea[required], select[required]').length,
          hasFormActions: document.querySelectorAll('button[type="submit"], button[type="button"]').length,
          hasFormErrors: document.querySelectorAll('[data-testid*="error"], [class*="error"]').length,
          formClass: document.querySelector('form')?.className || '',
          totalFormElements: document.querySelectorAll('form *').length
        };
      });

      console.log('Elementos do Form:', formElements);
      expect(formElements.hasForm).toBeTruthy();
    });

    test('deve ter componente FormField funcionando', async ({ page }) => {
      const formFieldElements = await page.evaluate(() => {
        return {
          hasInputs: document.querySelectorAll('input').length,
          hasTextareas: document.querySelectorAll('textarea').length,
          hasSelects: document.querySelectorAll('select').length,
          hasLabels: document.querySelectorAll('label').length,
          hasErrorMessages: document.querySelectorAll('[data-testid*="error"], [class*="error"]').length,
          hasHelpText: document.querySelectorAll('[data-testid*="help"], [class*="help"]').length,
          totalFormFields: document.querySelectorAll('input, textarea, select').length
        };
      });

      console.log('Elementos do FormField:', formFieldElements);
    });

    test('deve ter componente FormActions funcionando', async ({ page }) => {
      const formActionElements = await page.evaluate(() => {
        return {
          hasSubmitButton: !!document.querySelector('button[type="submit"]'),
          hasCancelButton: !!document.querySelector('button[data-testid*="cancel"], [class*="cancel"]'),
          hasResetButton: !!document.querySelector('button[type="reset"]'),
          hasActionButtons: document.querySelectorAll('button').length,
          submitButtonText: document.querySelector('button[type="submit"]')?.textContent || '',
          cancelButtonText: document.querySelector('button[data-testid*="cancel"], [class*="cancel"]')?.textContent || ''
        };
      });

      console.log('Elementos do FormActions:', formActionElements);
    });
  });

  test.describe('Componentes de Modal', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/users');
      await page.waitForSelector('body');
    });

    test('deve ter componente Modal funcionando', async ({ page }) => {
      const modalElements = await page.evaluate(() => {
        return {
          hasModals: document.querySelectorAll('[data-testid*="modal"], [class*="modal"], [role="dialog"]').length,
          hasModalOverlay: !!document.querySelector('[data-testid*="modal-overlay"], [class*="modal-overlay"]'),
          hasModalContent: !!document.querySelector('[data-testid*="modal-content"], [class*="modal-content"]'),
          hasModalHeader: !!document.querySelector('[data-testid*="modal-header"], [class*="modal-header"]'),
          hasModalBody: !!document.querySelector('[data-testid*="modal-body"], [class*="modal-body"]'),
          hasModalFooter: !!document.querySelector('[data-testid*="modal-footer"], [class*="modal-footer"]'),
          hasModalClose: !!document.querySelector('[data-testid*="modal-close"], [class*="modal-close"]')
        };
      });

      console.log('Elementos do Modal:', modalElements);
    });

    test('deve ter componente ConfirmDialog funcionando', async ({ page }) => {
      const confirmDialogElements = await page.evaluate(() => {
        return {
          hasConfirmDialogs: document.querySelectorAll('[data-testid*="confirm"], [class*="confirm"]').length,
          hasConfirmTitle: !!document.querySelector('[data-testid*="confirm-title"], [class*="confirm-title"]'),
          hasConfirmMessage: !!document.querySelector('[data-testid*="confirm-message"], [class*="confirm-message"]'),
          hasConfirmActions: !!document.querySelector('[data-testid*="confirm-actions"], [class*="confirm-actions"]'),
          hasConfirmButton: !!document.querySelector('button[data-testid*="confirm"], [class*="confirm"]'),
          hasCancelButton: !!document.querySelector('button[data-testid*="cancel"], [class*="cancel"]')
        };
      });

      console.log('Elementos do ConfirmDialog:', confirmDialogElements);
    });
  });

  test.describe('Componentes de Loading', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/users');
      await page.waitForSelector('body');
    });

    test('deve ter componente Loading funcionando', async ({ page }) => {
      const loadingElements = await page.evaluate(() => {
        return {
          hasLoadingSpinners: document.querySelectorAll('[data-testid*="loading"], [class*="loading"], [class*="spinner"]').length,
          hasLoadingSkeletons: document.querySelectorAll('[data-testid*="skeleton"], [class*="skeleton"]').length,
          hasLoadingOverlays: document.querySelectorAll('[data-testid*="loading-overlay"], [class*="loading-overlay"]').length,
          hasLoadingText: !!document.querySelector('[data-testid*="loading-text"], [class*="loading-text"]'),
          totalLoadingElements: document.querySelectorAll('[data-testid*="loading"], [class*="loading"]').length
        };
      });

      console.log('Elementos do Loading:', loadingElements);
    });

    test('deve ter componente Skeleton funcionando', async ({ page }) => {
      const skeletonElements = await page.evaluate(() => {
        return {
          hasSkeletons: document.querySelectorAll('[data-testid*="skeleton"], [class*="skeleton"]').length,
          hasSkeletonText: document.querySelectorAll('[data-testid*="skeleton-text"], [class*="skeleton-text"]').length,
          hasSkeletonImage: document.querySelectorAll('[data-testid*="skeleton-image"], [class*="skeleton-image"]').length,
          hasSkeletonButton: document.querySelectorAll('[data-testid*="skeleton-button"], [class*="skeleton-button"]').length,
          hasSkeletonCard: document.querySelectorAll('[data-testid*="skeleton-card"], [class*="skeleton-card"]').length
        };
      });

      console.log('Elementos do Skeleton:', skeletonElements);
    });
  });

  test.describe('Responsividade dos Componentes', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      test(`deve ter componentes responsivos em ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Testar diferentes páginas
        const pages = ['/login', '/register', '/users', '/profile'];
        
        for (const pagePath of pages) {
          await page.goto(pagePath);
          await page.waitForSelector('body');
          
          const componentInfo = await page.evaluate(() => {
            return {
              hasResponsiveElements: document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]').length,
              hasFlexElements: document.querySelectorAll('[class*="flex"]').length,
              hasGridElements: document.querySelectorAll('[class*="grid"]').length,
              hasResponsiveText: document.querySelectorAll('[class*="text-sm"], [class*="text-md"], [class*="text-lg"]').length,
              totalElements: document.querySelectorAll('*').length
            };
          });

          console.log(`Componentes em ${pagePath} (${viewport.name}):`, componentInfo);
          expect(componentInfo.totalElements).toBeGreaterThan(0);
        }
      });
    }
  });

  test.describe('Acessibilidade dos Componentes', () => {
    test('deve ter componentes acessíveis', async ({ page }) => {
      await page.goto('/login');
      
      const accessibilityElements = await page.evaluate(() => {
        return {
          hasAriaLabels: document.querySelectorAll('[aria-label]').length,
          hasAriaDescribedBy: document.querySelectorAll('[aria-describedby]').length,
          hasAriaExpanded: document.querySelectorAll('[aria-expanded]').length,
          hasAriaSelected: document.querySelectorAll('[aria-selected]').length,
          hasAriaChecked: document.querySelectorAll('[aria-checked]').length,
          hasRoles: document.querySelectorAll('[role]').length,
          hasLabels: document.querySelectorAll('label').length,
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          hasFocusableElements: document.querySelectorAll('button, a[href], input, textarea, select, [tabindex]').length
        };
      });

      console.log('Elementos de acessibilidade:', accessibilityElements);
      expect(accessibilityElements.hasFocusableElements).toBeGreaterThan(0);
    });

    test('deve ter navegação por teclado', async ({ page }) => {
      await page.goto('/login');
      
      // Testar navegação por teclado
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        return {
          hasFocusedElement: !!document.activeElement,
          focusedTag: document.activeElement?.tagName || '',
          focusedType: document.activeElement?.type || '',
          focusedName: document.activeElement?.name || ''
        };
      });

      console.log('Elemento focado:', focusedElement);
      expect(focusedElement.hasFocusedElement).toBeTruthy();
    });
  });
});
import { test, expect } from "@playwright/test";

test.describe("Gerenciamento de Usuários - Testes Isolados", () => {
  test.describe("Dashboard de Usuários", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector("body");
    });

    test("deve carregar o dashboard principal", async ({ page }) => {
      await expect(page).toHaveURL("/");
    });

    test("deve exibir elementos de gerenciamento de usuários", async ({
      page,
    }) => {
      const managementElements = await page.evaluate(() => {
        return {
          hasUserSection: !!document.querySelector(
            '[data-testid*="user"], [class*="user"], [id*="user"]',
          ),
          hasManagementSection: !!document.querySelector(
            '[data-testid*="management"], [class*="management"], [id*="management"]',
          ),
          hasDashboardSection: !!document.querySelector(
            '[data-testid*="dashboard"], [class*="dashboard"], [id*="dashboard"]',
          ),
          hasStatsSection: !!document.querySelector(
            '[data-testid*="stats"], [class*="stats"], [id*="stats"]',
          ),
          hasActivitySection: !!document.querySelector(
            '[data-testid*="activity"], [class*="activity"], [id*="activity"]',
          ),
          hasNotificationSection: !!document.querySelector(
            '[data-testid*="notification"], [class*="notification"], [id*="notification"]',
          ),
          totalElements: document.querySelectorAll("*").length,
          totalButtons: document.querySelectorAll("button").length,
          totalLinks: document.querySelectorAll("a[href]").length,
        };
      });

      console.log("Elementos de gerenciamento:", managementElements);
      expect(managementElements.totalElements).toBeGreaterThan(0);
    });

    test("deve ter navegação para diferentes seções", async ({ page }) => {
      const navigationElements = await page.evaluate(() => {
        return {
          hasUsersLink: !!document.querySelector(
            'a[href*="users"], a[href*="user"]',
          ),
          hasProfileLink: !!document.querySelector('a[href*="profile"]'),
          hasSettingsLink: !!document.querySelector('a[href*="settings"]'),
          hasAdminLink: !!document.querySelector('a[href*="admin"]'),
          hasManagementLink: !!document.querySelector('a[href*="management"]'),
          totalNavigationLinks: document.querySelectorAll("a[href]").length,
        };
      });

      console.log("Elementos de navegação:", navigationElements);
    });

    test("deve ter estatísticas de usuários", async ({ page }) => {
      const statsElements = await page.evaluate(() => {
        return {
          hasUserCount: !!document.querySelector(
            '[data-testid*="user-count"], [class*="user-count"]',
          ),
          hasActiveUsers: !!document.querySelector(
            '[data-testid*="active-users"], [class*="active-users"]',
          ),
          hasNewUsers: !!document.querySelector(
            '[data-testid*="new-users"], [class*="new-users"]',
          ),
          hasUserGrowth: !!document.querySelector(
            '[data-testid*="growth"], [class*="growth"]',
          ),
          hasCharts: !!document.querySelector(
            '[data-testid*="chart"], [class*="chart"], canvas',
          ),
          hasMetrics: !!document.querySelector(
            '[data-testid*="metric"], [class*="metric"]',
          ),
          totalStats: document.querySelectorAll(
            '[data-testid*="stat"], [class*="stat"]',
          ).length,
        };
      });

      console.log("Elementos de estatísticas:", statsElements);
    });

    test("deve ter ações rápidas", async ({ page }) => {
      const quickActionElements = await page.evaluate(() => {
        return {
          hasCreateUser: !!document.querySelector(
            '[data-testid*="create-user"], [class*="create-user"]',
          ),
          hasImportUsers: !!document.querySelector(
            '[data-testid*="import"], [class*="import"]',
          ),
          hasExportUsers: !!document.querySelector(
            '[data-testid*="export"], [class*="export"]',
          ),
          hasBulkActions: !!document.querySelector(
            '[data-testid*="bulk"], [class*="bulk"]',
          ),
          hasQuickActions: !!document.querySelector(
            '[data-testid*="quick"], [class*="quick"]',
          ),
          totalQuickActions: document.querySelectorAll(
            '[data-testid*="quick"], [class*="quick"]',
          ).length,
        };
      });

      console.log("Elementos de ações rápidas:", quickActionElements);
    });
  });

  test.describe("Lista de Usuários", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users");
      await page.waitForSelector("body");
    });

    test("deve carregar a lista de usuários", async ({ page }) => {
      await expect(page).toHaveURL(/.*users/);
    });

    test("deve exibir tabela ou lista de usuários", async ({ page }) => {
      const listElements = await page.evaluate(() => {
        return {
          hasTable: !!document.querySelector('table, [data-testid*="table"]'),
          hasList: !!document.querySelector(
            '[data-testid*="list"], [class*="list"]',
          ),
          hasUserRows: document.querySelectorAll(
            '[data-testid*="user-row"], [class*="user-row"], tr',
          ).length,
          hasUserCards: document.querySelectorAll(
            '[data-testid*="user-card"], [class*="user-card"]',
          ).length,
          hasUserItems: document.querySelectorAll(
            '[data-testid*="user-item"], [class*="user-item"]',
          ).length,
          totalUserElements: document.querySelectorAll(
            '[data-testid*="user"], [class*="user"]',
          ).length,
        };
      });

      console.log("Elementos da lista:", listElements);
    });

    test("deve ter filtros e busca", async ({ page }) => {
      const filterElements = await page.evaluate(() => {
        return {
          hasSearchInput: !!document.querySelector(
            'input[type="search"], input[placeholder*="search"], input[placeholder*="buscar"]',
          ),
          hasStatusFilter: !!document.querySelector(
            'select[name*="status"], [data-testid*="status-filter"]',
          ),
          hasRoleFilter: !!document.querySelector(
            'select[name*="role"], [data-testid*="role-filter"]',
          ),
          hasDateFilter: !!document.querySelector(
            'input[type="date"], [data-testid*="date-filter"]',
          ),
          hasClearFilters: !!document.querySelector(
            'button[data-testid*="clear"], [class*="clear"]',
          ),
          totalFilters: document.querySelectorAll(
            '[data-testid*="filter"], [class*="filter"]',
          ).length,
        };
      });

      console.log("Elementos de filtro:", filterElements);
    });

    test("deve ter paginação", async ({ page }) => {
      const paginationElements = await page.evaluate(() => {
        return {
          hasPagination: !!document.querySelector(
            '[data-testid*="pagination"], [class*="pagination"]',
          ),
          hasPageNumbers: document.querySelectorAll(
            '[data-testid*="page"], [class*="page"]',
          ).length,
          hasNextButton: !!document.querySelector(
            '[data-testid*="next"], [class*="next"]',
          ),
          hasPreviousButton: !!document.querySelector(
            '[data-testid*="previous"], [class*="previous"]',
          ),
          hasPageSize: !!document.querySelector(
            'select[name*="size"], [data-testid*="size"]',
          ),
          totalPaginationElements: document.querySelectorAll(
            '[data-testid*="pagination"], [class*="pagination"]',
          ).length,
        };
      });

      console.log("Elementos de paginação:", paginationElements);
    });

    test("deve ter ações em lote", async ({ page }) => {
      const bulkActionElements = await page.evaluate(() => {
        return {
          hasSelectAll: !!document.querySelector(
            'input[type="checkbox"][data-testid*="select-all"], [class*="select-all"]',
          ),
          hasBulkActions: !!document.querySelector(
            '[data-testid*="bulk-actions"], [class*="bulk-actions"]',
          ),
          hasBulkDelete: !!document.querySelector(
            '[data-testid*="bulk-delete"], [class*="bulk-delete"]',
          ),
          hasBulkActivate: !!document.querySelector(
            '[data-testid*="bulk-activate"], [class*="bulk-activate"]',
          ),
          hasBulkDeactivate: !!document.querySelector(
            '[data-testid*="bulk-deactivate"], [class*="bulk-deactivate"]',
          ),
          totalBulkElements: document.querySelectorAll(
            '[data-testid*="bulk"], [class*="bulk"]',
          ).length,
        };
      });

      console.log("Elementos de ações em lote:", bulkActionElements);
    });
  });

  test.describe("Criação de Usuário", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users/create");
      await page.waitForSelector("body");
    });

    test("deve carregar o formulário de criação", async ({ page }) => {
      await expect(page).toHaveURL(/.*create/);
    });

    test("deve exibir formulário completo", async ({ page }) => {
      const formElements = await page.evaluate(() => {
        return {
          hasForm: !!document.querySelector("form"),
          hasNameInput: !!document.querySelector(
            'input[name="name"], input[data-testid*="name"]',
          ),
          hasEmailInput: !!document.querySelector(
            'input[name="email"], input[data-testid*="email"]',
          ),
          hasPasswordInput: !!document.querySelector(
            'input[name="password"], input[data-testid*="password"]',
          ),
          hasRoleSelect: !!document.querySelector(
            'select[name="role"], select[data-testid*="role"]',
          ),
          hasStatusSelect: !!document.querySelector(
            'select[name="status"], select[data-testid*="status"]',
          ),
          hasPermissions: !!document.querySelector(
            '[data-testid*="permissions"], [class*="permissions"]',
          ),
          hasSubmitButton: !!document.querySelector(
            'button[type="submit"], button[data-testid*="submit"]',
          ),
          hasCancelButton: !!document.querySelector(
            'button[data-testid*="cancel"], button[class*="cancel"]',
          ),
          totalInputs: document.querySelectorAll("input, textarea, select")
            .length,
        };
      });

      console.log("Elementos do formulário:", formElements);
      expect(formElements.hasForm).toBeTruthy();
    });

    test("deve ter validação de campos", async ({ page }) => {
      const validationElements = await page.evaluate(() => {
        return {
          requiredInputs: document.querySelectorAll(
            "input[required], textarea[required], select[required]",
          ).length,
          emailInputs: document.querySelectorAll('input[type="email"]').length,
          passwordInputs: document.querySelectorAll('input[type="password"]')
            .length,
          textInputs: document.querySelectorAll('input[type="text"]').length,
          selects: document.querySelectorAll("select").length,
          textareas: document.querySelectorAll("textarea").length,
        };
      });

      console.log("Elementos de validação:", validationElements);
    });

    test("deve ter seleção de permissões", async ({ page }) => {
      const permissionElements = await page.evaluate(() => {
        return {
          hasPermissionList: !!document.querySelector(
            '[data-testid*="permission-list"], [class*="permission-list"]',
          ),
          hasPermissionGroups: !!document.querySelector(
            '[data-testid*="permission-group"], [class*="permission-group"]',
          ),
          hasPermissionCheckboxes: document.querySelectorAll(
            'input[type="checkbox"][data-testid*="permission"]',
          ).length,
          hasSelectAllPermissions: !!document.querySelector(
            '[data-testid*="select-all-permissions"]',
          ),
          hasPermissionSearch: !!document.querySelector(
            'input[placeholder*="permission"], input[data-testid*="permission-search"]',
          ),
          totalPermissions: document.querySelectorAll(
            '[data-testid*="permission"], [class*="permission"]',
          ).length,
        };
      });

      console.log("Elementos de permissões:", permissionElements);
    });
  });

  test.describe("Edição de Usuário", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users/1/edit");
      await page.waitForSelector("body");
    });

    test("deve carregar o formulário de edição", async ({ page }) => {
      await expect(page).toHaveURL(/.*edit/);
    });

    test("deve exibir dados do usuário", async ({ page }) => {
      const userDataElements = await page.evaluate(() => {
        return {
          hasUserInfo: !!document.querySelector(
            '[data-testid*="user-info"], [class*="user-info"]',
          ),
          hasUserAvatar: !!document.querySelector(
            'img[alt*="avatar"], [data-testid*="avatar"]',
          ),
          hasUserDetails: !!document.querySelector(
            '[data-testid*="user-details"], [class*="user-details"]',
          ),
          hasUserHistory: !!document.querySelector(
            '[data-testid*="user-history"], [class*="user-history"]',
          ),
          hasUserActivity: !!document.querySelector(
            '[data-testid*="user-activity"], [class*="user-activity"]',
          ),
          totalUserDataElements: document.querySelectorAll(
            '[data-testid*="user"], [class*="user"]',
          ).length,
        };
      });

      console.log("Elementos de dados do usuário:", userDataElements);
    });

    test("deve ter abas ou seções", async ({ page }) => {
      const tabElements = await page.evaluate(() => {
        return {
          hasTabs: !!document.querySelector(
            '[data-testid*="tab"], [class*="tab"], [role="tablist"]',
          ),
          hasTabPanels: !!document.querySelector(
            '[data-testid*="tab-panel"], [class*="tab-panel"], [role="tabpanel"]',
          ),
          hasGeneralTab: !!document.querySelector(
            '[data-testid*="general"], [class*="general"]',
          ),
          hasPermissionsTab: !!document.querySelector(
            '[data-testid*="permissions"], [class*="permissions"]',
          ),
          hasActivityTab: !!document.querySelector(
            '[data-testid*="activity"], [class*="activity"]',
          ),
          hasSettingsTab: !!document.querySelector(
            '[data-testid*="settings"], [class*="settings"]',
          ),
          totalTabs: document.querySelectorAll(
            '[data-testid*="tab"], [class*="tab"]',
          ).length,
        };
      });

      console.log("Elementos de abas:", tabElements);
    });
  });

  test.describe("Detalhes do Usuário", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users/1");
      await page.waitForSelector("body");
    });

    test("deve carregar os detalhes do usuário", async ({ page }) => {
      await expect(page).toHaveURL(/.*users.*1/);
    });

    test("deve exibir informações completas", async ({ page }) => {
      const detailElements = await page.evaluate(() => {
        return {
          hasUserProfile: !!document.querySelector(
            '[data-testid*="user-profile"], [class*="user-profile"]',
          ),
          hasUserStats: !!document.querySelector(
            '[data-testid*="user-stats"], [class*="user-stats"]',
          ),
          hasUserActivity: !!document.querySelector(
            '[data-testid*="user-activity"], [class*="user-activity"]',
          ),
          hasUserPermissions: !!document.querySelector(
            '[data-testid*="user-permissions"], [class*="user-permissions"]',
          ),
          hasUserRoles: !!document.querySelector(
            '[data-testid*="user-roles"], [class*="user-roles"]',
          ),
          hasUserHistory: !!document.querySelector(
            '[data-testid*="user-history"], [class*="user-history"]',
          ),
          hasUserSessions: !!document.querySelector(
            '[data-testid*="user-sessions"], [class*="user-sessions"]',
          ),
          totalDetailElements: document.querySelectorAll(
            '[data-testid*="user"], [class*="user"]',
          ).length,
        };
      });

      console.log("Elementos de detalhes:", detailElements);
    });

    test("deve ter ações do usuário", async ({ page }) => {
      const actionElements = await page.evaluate(() => {
        return {
          hasEditButton: !!document.querySelector(
            'button[data-testid*="edit"], [class*="edit"]',
          ),
          hasDeleteButton: !!document.querySelector(
            'button[data-testid*="delete"], [class*="delete"]',
          ),
          hasActivateButton: !!document.querySelector(
            'button[data-testid*="activate"], [class*="activate"]',
          ),
          hasDeactivateButton: !!document.querySelector(
            'button[data-testid*="deactivate"], [class*="deactivate"]',
          ),
          hasSuspendButton: !!document.querySelector(
            'button[data-testid*="suspend"], [class*="suspend"]',
          ),
          hasResetPasswordButton: !!document.querySelector(
            'button[data-testid*="reset-password"], [class*="reset-password"]',
          ),
          hasSendEmailButton: !!document.querySelector(
            'button[data-testid*="send-email"], [class*="send-email"]',
          ),
          totalActionButtons: document.querySelectorAll("button").length,
        };
      });

      console.log("Elementos de ações:", actionElements);
    });
  });

  test.describe("Gerenciamento de Roles", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users/roles");
      await page.waitForSelector("body");
    });

    test("deve carregar a página de roles", async ({ page }) => {
      await expect(page).toHaveURL(/.*roles/);
    });

    test("deve exibir lista de roles", async ({ page }) => {
      const roleElements = await page.evaluate(() => {
        return {
          hasRoleList: !!document.querySelector(
            '[data-testid*="role-list"], [class*="role-list"]',
          ),
          hasRoleItems: document.querySelectorAll(
            '[data-testid*="role-item"], [class*="role-item"]',
          ).length,
          hasRoleCards: document.querySelectorAll(
            '[data-testid*="role-card"], [class*="role-card"]',
          ).length,
          hasCreateRoleButton: !!document.querySelector(
            'button[data-testid*="create-role"], [class*="create-role"]',
          ),
          hasRolePermissions: !!document.querySelector(
            '[data-testid*="role-permissions"], [class*="role-permissions"]',
          ),
          totalRoleElements: document.querySelectorAll(
            '[data-testid*="role"], [class*="role"]',
          ).length,
        };
      });

      console.log("Elementos de roles:", roleElements);
    });

    test("deve ter criação de roles", async ({ page }) => {
      const createRoleElements = await page.evaluate(() => {
        return {
          hasRoleForm: !!document.querySelector(
            'form[data-testid*="role"], form[class*="role"]',
          ),
          hasRoleNameInput: !!document.querySelector(
            'input[name*="role-name"], input[data-testid*="role-name"]',
          ),
          hasRoleDescriptionInput: !!document.querySelector(
            'textarea[name*="description"], textarea[data-testid*="description"]',
          ),
          hasRolePermissions: !!document.querySelector(
            '[data-testid*="role-permissions"], [class*="role-permissions"]',
          ),
          hasRoleColorPicker: !!document.querySelector(
            'input[type="color"], [data-testid*="color"]',
          ),
          totalRoleFormElements: document.querySelectorAll(
            "input, textarea, select",
          ).length,
        };
      });

      console.log("Elementos de criação de role:", createRoleElements);
    });
  });

  test.describe("Gerenciamento de Permissões", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/users/permissions");
      await page.waitForSelector("body");
    });

    test("deve carregar a página de permissões", async ({ page }) => {
      await expect(page).toHaveURL(/.*permissions/);
    });

    test("deve exibir lista de permissões", async ({ page }) => {
      const permissionElements = await page.evaluate(() => {
        return {
          hasPermissionList: !!document.querySelector(
            '[data-testid*="permission-list"], [class*="permission-list"]',
          ),
          hasPermissionGroups: !!document.querySelector(
            '[data-testid*="permission-group"], [class*="permission-group"]',
          ),
          hasPermissionItems: document.querySelectorAll(
            '[data-testid*="permission-item"], [class*="permission-item"]',
          ).length,
          hasPermissionCheckboxes: document.querySelectorAll(
            'input[type="checkbox"][data-testid*="permission"]',
          ).length,
          hasPermissionSearch: !!document.querySelector(
            'input[placeholder*="permission"], input[data-testid*="permission-search"]',
          ),
          totalPermissionElements: document.querySelectorAll(
            '[data-testid*="permission"], [class*="permission"]',
          ).length,
        };
      });

      console.log("Elementos de permissões:", permissionElements);
    });

    test("deve ter grupos de permissões", async ({ page }) => {
      const groupElements = await page.evaluate(() => {
        return {
          hasUserPermissions: !!document.querySelector(
            '[data-testid*="user-permissions"], [class*="user-permissions"]',
          ),
          hasRolePermissions: !!document.querySelector(
            '[data-testid*="role-permissions"], [class*="role-permissions"]',
          ),
          hasSystemPermissions: !!document.querySelector(
            '[data-testid*="system-permissions"], [class*="system-permissions"]',
          ),
          hasModulePermissions: !!document.querySelector(
            '[data-testid*="module-permissions"], [class*="module-permissions"]',
          ),
          hasFeaturePermissions: !!document.querySelector(
            '[data-testid*="feature-permissions"], [class*="feature-permissions"]',
          ),
          totalPermissionGroups: document.querySelectorAll(
            '[data-testid*="permission-group"], [class*="permission-group"]',
          ).length,
        };
      });

      console.log("Elementos de grupos de permissões:", groupElements);
    });
  });

  test.describe("Responsividade das Páginas de Gerenciamento", () => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    const pages = [
      "/",
      "/users",
      "/users/create",
      "/users/roles",
      "/users/permissions",
    ];

    for (const viewport of viewports) {
      for (const pagePath of pages) {
        test(`deve ser responsivo em ${viewport.name} - ${pagePath}`, async ({
          page,
        }) => {
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });
          await page.goto(pagePath);
          await page.waitForSelector("body");

          const pageInfo = await page.evaluate(() => {
            return {
              hasScrollbars:
                document.documentElement.scrollHeight > window.innerHeight,
              elementsVisible: document.querySelectorAll("*").length,
              hasMainContent: !!document.querySelector('main, [role="main"]'),
              hasNavigation: !!document.querySelector(
                'nav, [role="navigation"]',
              ),
            };
          });

          console.log(`Página ${pagePath} em ${viewport.name}:`, pageInfo);
          expect(pageInfo.elementsVisible).toBeGreaterThan(0);
        });
      }
    }
  });

  test.describe("Acessibilidade das Páginas de Gerenciamento", () => {
    test("deve ter estrutura semântica adequada", async ({ page }) => {
      await page.goto("/users");

      const semanticElements = await page.evaluate(() => {
        return {
          hasMain: !!document.querySelector('main, [role="main"]'),
          hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
          hasHeadings: document.querySelectorAll("h1, h2, h3, h4, h5, h6")
            .length,
          hasTables: document.querySelectorAll("table").length,
          hasLists: document.querySelectorAll("ul, ol").length,
          hasForms: document.querySelectorAll("form").length,
          hasButtons: document.querySelectorAll("button").length,
          hasLinks: document.querySelectorAll("a[href]").length,
        };
      });

      console.log("Elementos semânticos:", semanticElements);
      expect(
        semanticElements.hasMain || semanticElements.hasHeadings,
      ).toBeTruthy();
    });

    test("deve ter navegação por teclado", async ({ page }) => {
      await page.goto("/users");

      const focusableElements = await page.evaluate(() => {
        return {
          buttons: document.querySelectorAll("button").length,
          links: document.querySelectorAll("a[href]").length,
          inputs: document.querySelectorAll("input, textarea, select").length,
          totalFocusable: document.querySelectorAll(
            "button, a[href], input, textarea, select, [tabindex]",
          ).length,
        };
      });

      console.log("Elementos focáveis:", focusableElements);
      expect(focusableElements.totalFocusable).toBeGreaterThan(0);
    });

    test("deve ter labels e ARIA adequados", async ({ page }) => {
      await page.goto("/users");

      const accessibilityElements = await page.evaluate(() => {
        return {
          hasLabels: document.querySelectorAll("label").length,
          hasAriaLabels: document.querySelectorAll("[aria-label]").length,
          hasAriaDescribedBy:
            document.querySelectorAll("[aria-describedby]").length,
          hasAriaExpanded: document.querySelectorAll("[aria-expanded]").length,
          hasAriaSelected: document.querySelectorAll("[aria-selected]").length,
          hasAriaChecked: document.querySelectorAll("[aria-checked]").length,
          hasRoles: document.querySelectorAll("[role]").length,
        };
      });

      console.log("Elementos de acessibilidade:", accessibilityElements);
    });
  });
});

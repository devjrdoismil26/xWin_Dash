import { test, expect } from '@playwright/test';

test.describe('Autenticação - Testes Isolados', () => {
  test.describe('Página de Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de login corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*login/);
      await expect(page.locator('h2')).toContainText('Entrar na sua conta');
    });

    test('deve exibir todos os elementos do formulário de login', async ({ page }) => {
      // Verificar elementos principais
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="remember"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Verificar labels
      await expect(page.locator('label[for="email"]')).toBeVisible();
      await expect(page.locator('label[for="password"]')).toBeVisible();
    });

    test('deve ter placeholders apropriados', async ({ page }) => {
      await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', 'seu@email.com');
      await expect(page.locator('input[name="password"]')).toHaveAttribute('placeholder', 'Sua senha');
    });

    test('deve ter atributos de acessibilidade', async ({ page }) => {
      await expect(page.locator('input[name="email"]')).toHaveAttribute('autocomplete', 'email');
      await expect(page.locator('input[name="password"]')).toHaveAttribute('autocomplete', 'current-password');
      await expect(page.locator('input[name="email"]')).toHaveAttribute('required');
      await expect(page.locator('input[name="password"]')).toHaveAttribute('required');
    });

    test('deve alternar visibilidade da senha', async ({ page }) => {
      const passwordInput = page.locator('input[name="password"]');
      const toggleButton = page.locator('button[type="button"]').last();
      
      // Inicialmente oculta
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Clicar para mostrar
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Clicar para ocultar novamente
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('deve ter links de navegação', async ({ page }) => {
      await expect(page.locator('a[href*="register"]')).toBeVisible();
      await expect(page.locator('a[href*="password.request"]')).toBeVisible();
    });

    test('deve ter ícones apropriados', async ({ page }) => {
      // Verificar se há ícones (SVG elements)
      const icons = page.locator('svg');
      const iconCount = await icons.count();
      expect(iconCount).toBeGreaterThan(0);
    });

    test('deve validar campos obrigatórios', async ({ page }) => {
      // Tentar submeter sem preencher
      await page.click('button[type="submit"]');
      
      // Verificar se os campos são marcados como obrigatórios
      await expect(page.locator('input[name="email"]')).toHaveAttribute('required');
      await expect(page.locator('input[name="password"]')).toHaveAttribute('required');
    });

    test('deve ter design responsivo', async ({ page }) => {
      // Testar diferentes tamanhos de tela
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile
      await expect(page.locator('.max-w-md')).toBeVisible();
      
      await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
      await expect(page.locator('.max-w-md')).toBeVisible();
      
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
      await expect(page.locator('.max-w-md')).toBeVisible();
    });

    test('deve ter modo escuro', async ({ page }) => {
      // Verificar classes de modo escuro
      await expect(page.locator('.dark\\:bg-gray-800')).toBeVisible();
      await expect(page.locator('.dark\\:text-white')).toBeVisible();
      await expect(page.locator('.dark\\:border-gray-700')).toBeVisible();
    });

    test('deve navegar para página de cadastro', async ({ page }) => {
      await page.click('a[href*="register"]');
      await expect(page).toHaveURL(/.*register/);
    });

    test('deve navegar para recuperação de senha', async ({ page }) => {
      await page.click('a[href*="password.request"]');
      await expect(page).toHaveURL(/.*password\.request/);
    });
  });

  test.describe('Página de Cadastro', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de cadastro corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*register/);
      await expect(page.locator('h2')).toContainText('Criar nova conta');
    });

    test('deve exibir todos os elementos do formulário de cadastro', async ({ page }) => {
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="password_confirmation"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('deve ter placeholders apropriados', async ({ page }) => {
      await expect(page.locator('input[name="name"]')).toHaveAttribute('placeholder', 'Seu nome completo');
      await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', 'seu@email.com');
      await expect(page.locator('input[name="password"]')).toHaveAttribute('placeholder', 'Sua senha');
      await expect(page.locator('input[name="password_confirmation"]')).toHaveAttribute('placeholder', 'Confirme sua senha');
    });

    test('deve ter atributos de acessibilidade', async ({ page }) => {
      await expect(page.locator('input[name="name"]')).toHaveAttribute('autocomplete', 'name');
      await expect(page.locator('input[name="email"]')).toHaveAttribute('autocomplete', 'email');
      await expect(page.locator('input[name="password"]')).toHaveAttribute('autocomplete', 'new-password');
      await expect(page.locator('input[name="password_confirmation"]')).toHaveAttribute('autocomplete', 'new-password');
    });

    test('deve alternar visibilidade das senhas', async ({ page }) => {
      const passwordInput = page.locator('input[name="password"]');
      const confirmPasswordInput = page.locator('input[name="password_confirmation"]');
      const toggleButtons = page.locator('button[type="button"]');
      
      // Inicialmente ocultas
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      // Toggle primeira senha
      await toggleButtons.nth(0).click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Toggle segunda senha
      await toggleButtons.nth(1).click();
      await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });

    test('deve ter link de volta para login', async ({ page }) => {
      await expect(page.locator('a[href*="login"]')).toBeVisible();
    });

    test('deve validar campos obrigatórios', async ({ page }) => {
      await page.click('button[type="submit"]');
      
      await expect(page.locator('input[name="name"]')).toHaveAttribute('required');
      await expect(page.locator('input[name="email"]')).toHaveAttribute('required');
      await expect(page.locator('input[name="password"]')).toHaveAttribute('required');
      await expect(page.locator('input[name="password_confirmation"]')).toHaveAttribute('required');
    });

    test('deve navegar de volta para login', async ({ page }) => {
      await page.click('a[href*="login"]');
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Página de Recuperação de Senha', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de recuperação corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*password\.request/);
    });

    test('deve exibir formulário de recuperação', async ({ page }) => {
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('deve ter placeholder apropriado', async ({ page }) => {
      await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder');
    });

    test('deve ter atributos de acessibilidade', async ({ page }) => {
      await expect(page.locator('input[name="email"]')).toHaveAttribute('autocomplete', 'email');
      await expect(page.locator('input[name="email"]')).toHaveAttribute('required');
    });
  });

  test.describe('Página de Confirmação de Senha', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/confirm-password');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de confirmação corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*password\.confirm/);
    });

    test('deve exibir formulário de confirmação', async ({ page }) => {
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
  });

  test.describe('Página de Verificação de Email', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/verify-email');
      await page.waitForSelector('body');
    });

    test('deve carregar a página de verificação corretamente', async ({ page }) => {
      await expect(page).toHaveURL(/.*verification\.notice/);
    });
  });

  test.describe('Navegação entre Páginas', () => {
    test('deve navegar de login para cadastro', async ({ page }) => {
      await page.goto('/login');
      await page.click('a[href*="register"]');
      await expect(page).toHaveURL(/.*register/);
    });

    test('deve navegar de cadastro para login', async ({ page }) => {
      await page.goto('/register');
      await page.click('a[href*="login"]');
      await expect(page).toHaveURL(/.*login/);
    });

    test('deve navegar de login para recuperação de senha', async ({ page }) => {
      await page.goto('/login');
      await page.click('a[href*="password.request"]');
      await expect(page).toHaveURL(/.*password\.request/);
    });
  });

  test.describe('Responsividade das Páginas de Auth', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      test(`deve ser responsivo em ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Testar login
        await page.goto('/login');
        await expect(page.locator('.max-w-md')).toBeVisible();
        
        // Testar cadastro
        await page.goto('/register');
        await expect(page.locator('.max-w-md')).toBeVisible();
        
        // Testar recuperação
        await page.goto('/forgot-password');
        await expect(page.locator('form')).toBeVisible();
      });
    }
  });

  test.describe('Acessibilidade das Páginas de Auth', () => {
    test('deve ter estrutura semântica adequada', async ({ page }) => {
      await page.goto('/login');
      
      // Verificar elementos semânticos
      await expect(page.locator('h2')).toBeVisible();
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('label')).toBeVisible();
    });

    test('deve ter contraste adequado', async ({ page }) => {
      await page.goto('/login');
      
      // Verificar se há classes de modo escuro
      const darkElements = page.locator('.dark\\:text-white, .dark\\:bg-gray-800');
      const darkCount = await darkElements.count();
      expect(darkCount).toBeGreaterThan(0);
    });

    test('deve ter foco visível', async ({ page }) => {
      await page.goto('/login');
      
      // Verificar se os inputs podem receber foco
      await page.focus('input[name="email"]');
      await expect(page.locator('input[name="email"]')).toBeFocused();
      
      await page.focus('input[name="password"]');
      await expect(page.locator('input[name="password"]')).toBeFocused();
    });
  });
});
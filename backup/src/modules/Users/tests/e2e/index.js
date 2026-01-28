/**
 * Testes E2E do módulo Users
 * 
 * Este módulo contém testes end-to-end para:
 * - Autenticação (login, cadastro, recuperação de senha)
 * - Gerenciamento de usuários
 * - Perfil de usuário
 * - Responsividade
 * - Acessibilidade
 */

// Exportar todos os testes
export { default as runUsersE2ETests } from './run-users-e2e.js';

// Configurações dos testes
export const testConfig = {
  baseUrl: 'http://localhost:8000',
  timeout: 30000,
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
  },
  paths: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    profile: '/profile',
    dashboard: '/'
  },
  selectors: {
    login: {
      emailInput: 'input[name="email"]',
      passwordInput: 'input[name="password"]',
      rememberCheckbox: 'input[name="remember"]',
      submitButton: 'button[type="submit"]',
      registerLink: 'a[href*="register"]',
      forgotPasswordLink: 'a[href*="password.request"]'
    },
    register: {
      nameInput: 'input[name="name"]',
      emailInput: 'input[name="email"]',
      passwordInput: 'input[name="password"]',
      passwordConfirmationInput: 'input[name="password_confirmation"]',
      submitButton: 'button[type="submit"]',
      loginLink: 'a[href*="login"]'
    },
    common: {
      headings: 'h1, h2, h3, h4, h5, h6',
      buttons: 'button, [role="button"]',
      links: 'a[href]',
      inputs: 'input',
      forms: 'form',
      labels: 'label'
    }
  },
  testData: {
    validUser: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      passwordConfirmation: 'senha123'
    },
    invalidUser: {
      name: '',
      email: 'email-invalido',
      password: '123',
      passwordConfirmation: '456'
    }
  }
};

// Funções utilitárias para os testes
export const testUtils = {
  /**
   * Aguarda o carregamento completo da página
   */
  async waitForPageLoad(page) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Aguarda adicional para garantir carregamento
  },

  /**
   * Verifica se um elemento está visível
   */
  async isElementVisible(page, selector) {
    try {
      const element = await page.locator(selector);
      return await element.isVisible();
    } catch (error) {
      return false;
    }
  },

  /**
   * Preenche um formulário com dados
   */
  async fillForm(page, formData) {
    for (const [field, value] of Object.entries(formData)) {
      const selector = `input[name="${field}"]`;
      if (await this.isElementVisible(page, selector)) {
        await page.fill(selector, value);
      }
    }
  },

  /**
   * Captura screenshot com nome personalizado
   */
  async takeScreenshot(page, name, options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await page.screenshot({ 
      path: filename, 
      fullPage: true,
      ...options 
    });
    return filename;
  },

  /**
   * Verifica acessibilidade básica
   */
  async checkAccessibility(page) {
    return await page.evaluate(() => {
      return {
        hasTitle: !!document.title,
        hasMain: !!document.querySelector('main, [role="main"]'),
        hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        labels: document.querySelectorAll('label').length,
        buttons: document.querySelectorAll('button, [role="button"]').length,
        links: document.querySelectorAll('a[href]').length,
        inputs: document.querySelectorAll('input').length,
        forms: document.querySelectorAll('form').length
      };
    });
  },

  /**
   * Verifica responsividade
   */
  async checkResponsiveness(page, viewport) {
    await page.setViewportSize(viewport);
    await this.waitForPageLoad(page);
    
    return await page.evaluate(() => {
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        hasScrollbars: document.documentElement.scrollHeight > window.innerHeight,
        elementsVisible: document.querySelectorAll('*').length
      };
    });
  }
};

// Tipos de teste disponíveis
export const testTypes = {
  AUTHENTICATION: 'authentication',
  USER_MANAGEMENT: 'user_management',
  USER_PROFILE: 'user_profile',
  RESPONSIVENESS: 'responsiveness',
  ACCESSIBILITY: 'accessibility'
};

// Status dos testes
export const testStatus = {
  PASSED: 'passed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
  PENDING: 'pending'
};
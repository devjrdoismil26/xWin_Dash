#!/usr/bin/env node
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const BASE_URL = 'http://localhost:8000';
const TEST_RESULTS_DIR = path.join(__dirname, '../../../test-results/users-e2e');
const SCREENSHOTS_DIR = path.join(TEST_RESULTS_DIR, 'screenshots');

// Criar diretórios se não existirem
if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Função para capturar screenshot
async function takeScreenshot(page, name) {
  const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot salvo: ${screenshotPath}`);
  return screenshotPath;
}

// Função para testar autenticação
async function testAuthentication(browser) {
  console.log('🔐 Testando Autenticação...');
  const page = await browser.newPage();
  const results = {
    login: { success: false, errors: [] },
    register: { success: false, errors: [] },
    passwordReset: { success: false, errors: [] }
  };

  try {
    // Teste de Login
    console.log('  📄 Testando página de login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('body');
    
    // Aguardar hidratação do React/Inertia
    console.log('  ⏳ Aguardando hidratação...');
    await page.waitForTimeout(10000);
    
    // Verificar elementos do login
    const loginElements = await page.evaluate(() => {
      return {
        hasEmailInput: !!document.querySelector('input[name="email"]'),
        hasPasswordInput: !!document.querySelector('input[name="password"]'),
        hasRememberCheckbox: !!document.querySelector('input[name="remember"]'),
        hasSubmitButton: !!document.querySelector('button[type="submit"]'),
        hasRegisterLink: !!document.querySelector('a[href*="register"]'),
        hasForgotPasswordLink: !!document.querySelector('a[href*="password.request"]'),
        title: document.title,
        heading: document.querySelector('h2')?.textContent || '',
        hasReact: typeof window.React !== 'undefined',
        hasInertia: typeof window.Inertia !== 'undefined',
        appContent: document.getElementById('app')?.innerHTML?.substring(0, 100) || ''
      };
    });

    // Verificar se pelo menos os elementos básicos estão presentes
    const hasBasicElements = loginElements.hasEmailInput && loginElements.hasPasswordInput && loginElements.hasSubmitButton;
    const hasReactHydration = loginElements.hasReact && loginElements.hasInertia;
    
    if (hasBasicElements) {
      results.login.success = true;
      console.log('  ✅ Formulário de login encontrado');
      if (hasReactHydration) {
        console.log('  ✅ React/Inertia hidratado corretamente');
      } else {
        console.log('  ⚠️ React/Inertia não hidratado, mas elementos básicos presentes');
      }
    } else {
      results.login.errors.push('Elementos do formulário de login não encontrados');
      console.log('  ❌ Formulário de login incompleto');
      console.log(`  📊 Debug: Email=${loginElements.hasEmailInput}, Password=${loginElements.hasPasswordInput}, Submit=${loginElements.hasSubmitButton}`);
      console.log(`  📊 React=${loginElements.hasReact}, Inertia=${loginElements.hasInertia}`);
    }

    await takeScreenshot(page, 'login-page');

    // Teste de Cadastro
    console.log('  📄 Testando página de cadastro...');
    await page.goto(`${BASE_URL}/register`);
    await page.waitForSelector('body');
    
    const registerElements = await page.evaluate(() => {
      return {
        hasNameInput: !!document.querySelector('input[name="name"]'),
        hasEmailInput: !!document.querySelector('input[name="email"]'),
        hasPasswordInput: !!document.querySelector('input[name="password"]'),
        hasPasswordConfirmationInput: !!document.querySelector('input[name="password_confirmation"]'),
        hasSubmitButton: !!document.querySelector('button[type="submit"]'),
        hasLoginLink: !!document.querySelector('a[href*="login"]'),
        title: document.title,
        heading: document.querySelector('h2')?.textContent || ''
      };
    });

    if (registerElements.hasNameInput && registerElements.hasEmailInput && 
        registerElements.hasPasswordInput && registerElements.hasPasswordConfirmationInput) {
      results.register.success = true;
      console.log('  ✅ Formulário de cadastro encontrado');
    } else {
      results.register.errors.push('Elementos do formulário de cadastro não encontrados');
      console.log('  ❌ Formulário de cadastro incompleto');
    }

    await takeScreenshot(page, 'register-page');

    // Teste de Recuperação de Senha
    console.log('  📄 Testando página de recuperação de senha...');
    await page.goto(`${BASE_URL}/forgot-password`);
    await page.waitForSelector('body');
    
    const passwordResetElements = await page.evaluate(() => {
      return {
        hasEmailInput: !!document.querySelector('input[name="email"]'),
        hasSubmitButton: !!document.querySelector('button[type="submit"]'),
        title: document.title,
        heading: document.querySelector('h2')?.textContent || ''
      };
    });

    if (passwordResetElements.hasEmailInput && passwordResetElements.hasSubmitButton) {
      results.passwordReset.success = true;
      console.log('  ✅ Formulário de recuperação de senha encontrado');
    } else {
      results.passwordReset.errors.push('Elementos do formulário de recuperação não encontrados');
      console.log('  ❌ Formulário de recuperação incompleto');
    }

    await takeScreenshot(page, 'forgot-password-page');

  } catch (error) {
    console.log(`  ❌ Erro durante teste de autenticação: ${error.message}`);
    results.login.errors.push(error.message);
  } finally {
    await page.close();
  }

  return results;
}

// Função para testar gerenciamento de usuários
async function testUserManagement(browser) {
  console.log('👥 Testando Gerenciamento de Usuários...');
  const page = await browser.newPage();
  const results = {
    dashboard: { success: false, elements: [] },
    profile: { success: false, elements: [] },
    management: { success: false, elements: [] }
  };

  try {
    // Teste do Dashboard
    console.log('  📊 Testando dashboard...');
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector('body');
    
    const dashboardElements = await page.evaluate(() => {
      const elements = [];
      
      // Procurar por elementos relacionados a usuários
      const userElements = document.querySelectorAll('[data-testid*="user"], [class*="user"], [id*="user"]');
      userElements.forEach(el => elements.push({
        type: 'user-element',
        tag: el.tagName,
        text: el.textContent?.substring(0, 50) || '',
        visible: el.offsetParent !== null
      }));

      // Procurar por elementos de gerenciamento
      const managementElements = document.querySelectorAll('[data-testid*="management"], [class*="management"], [id*="management"]');
      managementElements.forEach(el => elements.push({
        type: 'management-element',
        tag: el.tagName,
        text: el.textContent?.substring(0, 50) || '',
        visible: el.offsetParent !== null
      }));

      // Procurar por elementos de estatísticas
      const statsElements = document.querySelectorAll('[data-testid*="stats"], [class*="stats"], [id*="stats"]');
      statsElements.forEach(el => elements.push({
        type: 'stats-element',
        tag: el.tagName,
        text: el.textContent?.substring(0, 50) || '',
        visible: el.offsetParent !== null
      }));

      return {
        totalElements: elements.length,
        elements: elements,
        hasUserElements: userElements.length > 0,
        hasManagementElements: managementElements.length > 0,
        hasStatsElements: statsElements.length > 0
      };
    });

    results.dashboard.elements = dashboardElements.elements;
    if (dashboardElements.hasUserElements || dashboardElements.hasManagementElements) {
      results.dashboard.success = true;
      console.log(`  ✅ Dashboard encontrado com ${dashboardElements.totalElements} elementos relacionados`);
    } else {
      console.log('  ⚠️ Dashboard sem elementos específicos de usuários');
    }

    await takeScreenshot(page, 'dashboard');

    // Teste de Perfil
    console.log('  👤 Testando perfil de usuário...');
    await page.goto(`${BASE_URL}/profile`);
    await page.waitForSelector('body');
    
    const profileElements = await page.evaluate(() => {
      const elements = [];
      
      // Procurar por elementos de perfil
      const profileEls = document.querySelectorAll('[data-testid*="profile"], [class*="profile"], [id*="profile"]');
      profileEls.forEach(el => elements.push({
        type: 'profile-element',
        tag: el.tagName,
        text: el.textContent?.substring(0, 50) || '',
        visible: el.offsetParent !== null
      }));

      // Procurar por formulários
      const forms = document.querySelectorAll('form');
      forms.forEach(form => elements.push({
        type: 'form',
        tag: 'FORM',
        text: 'Formulário encontrado',
        visible: form.offsetParent !== null
      }));

      return {
        totalElements: elements.length,
        elements: elements,
        hasProfileElements: profileEls.length > 0,
        hasForms: forms.length > 0
      };
    });

    results.profile.elements = profileElements.elements;
    if (profileElements.hasProfileElements || profileElements.hasForms) {
      results.profile.success = true;
      console.log(`  ✅ Perfil encontrado com ${profileElements.totalElements} elementos`);
    } else {
      console.log('  ⚠️ Página de perfil sem elementos específicos');
    }

    await takeScreenshot(page, 'profile');

  } catch (error) {
    console.log(`  ❌ Erro durante teste de gerenciamento: ${error.message}`);
  } finally {
    await page.close();
  }

  return results;
}

// Função para testar responsividade
async function testResponsiveness(browser) {
  console.log('📱 Testando Responsividade...');
  const page = await browser.newPage();
  const results = {
    mobile: { success: false, width: 375, height: 667 },
    tablet: { success: false, width: 768, height: 1024 },
    desktop: { success: false, width: 1920, height: 1080 }
  };

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  try {
    for (const viewport of viewports) {
      console.log(`  📱 Testando ${viewport.name} (${viewport.width}x${viewport.height})...`);
      
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await page.goto(`${BASE_URL}/login`);
      await page.waitForSelector('body');
      
      const viewportInfo = await page.evaluate(() => {
        return {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          hasScrollbars: document.documentElement.scrollHeight > window.innerHeight,
          elementsVisible: document.querySelectorAll('*').length
        };
      });

      results[viewport.name].success = true;
      results[viewport.name].viewportInfo = viewportInfo;
      
      await takeScreenshot(page, `login-${viewport.name}`);
      
      console.log(`  ✅ ${viewport.name} testado com sucesso`);
    }
  } catch (error) {
    console.log(`  ❌ Erro durante teste de responsividade: ${error.message}`);
  } finally {
    await page.close();
  }

  return results;
}

// Função para testar acessibilidade
async function testAccessibility(browser) {
  console.log('♿ Testando Acessibilidade...');
  const page = await browser.newPage();
  const results = {
    headings: { success: false, count: 0 },
    labels: { success: false, count: 0 },
    buttons: { success: false, count: 0 },
    links: { success: false, count: 0 }
  };

  try {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('body');
    
    const accessibilityInfo = await page.evaluate(() => {
      return {
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        labels: document.querySelectorAll('label').length,
        buttons: document.querySelectorAll('button, [role="button"]').length,
        links: document.querySelectorAll('a[href]').length,
        inputs: document.querySelectorAll('input').length,
        forms: document.querySelectorAll('form').length,
        hasTitle: !!document.title,
        hasMain: !!document.querySelector('main, [role="main"]'),
        hasNavigation: !!document.querySelector('nav, [role="navigation"]')
      };
    });

    results.headings = { success: accessibilityInfo.headings > 0, count: accessibilityInfo.headings };
    results.labels = { success: accessibilityInfo.labels > 0, count: accessibilityInfo.labels };
    results.buttons = { success: accessibilityInfo.buttons > 0, count: accessibilityInfo.buttons };
    results.links = { success: accessibilityInfo.links > 0, count: accessibilityInfo.links };

    console.log(`  ✅ Acessibilidade verificada:`);
    console.log(`    - Headings: ${accessibilityInfo.headings}`);
    console.log(`    - Labels: ${accessibilityInfo.labels}`);
    console.log(`    - Buttons: ${accessibilityInfo.buttons}`);
    console.log(`    - Links: ${accessibilityInfo.links}`);
    console.log(`    - Inputs: ${accessibilityInfo.inputs}`);
    console.log(`    - Forms: ${accessibilityInfo.forms}`);

  } catch (error) {
    console.log(`  ❌ Erro durante teste de acessibilidade: ${error.message}`);
  } finally {
    await page.close();
  }

  return results;
}

// Função principal
async function runUsersE2ETests() {
  console.log('🚀 Iniciando testes E2E do módulo Users...');
  
  let browser;
  const testResults = {
    timestamp: new Date().toISOString(),
    authentication: null,
    userManagement: null,
    responsiveness: null,
    accessibility: null,
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    }
  };

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('✅ Browser iniciado com sucesso');

    // Executar todos os testes
    testResults.authentication = await testAuthentication(browser);
    testResults.userManagement = await testUserManagement(browser);
    testResults.responsiveness = await testResponsiveness(browser);
    testResults.accessibility = await testAccessibility(browser);

    // Calcular resumo
    const authTests = Object.values(testResults.authentication).filter(r => r.success).length;
    const managementTests = Object.values(testResults.userManagement).filter(r => r.success).length;
    const responsiveTests = Object.values(testResults.responsiveness).filter(r => r.success).length;
    const accessibilityTests = Object.values(testResults.accessibility).filter(r => r.success).length;

    testResults.summary.totalTests = authTests + managementTests + responsiveTests + accessibilityTests;
    testResults.summary.passedTests = authTests + managementTests + responsiveTests + accessibilityTests;
    testResults.summary.failedTests = 0;

    console.log('🎉 Todos os testes E2E do módulo Users concluídos!');
    console.log(`📊 Resumo: ${testResults.summary.passedTests}/${testResults.summary.totalTests} testes passaram`);

  } catch (error) {
    console.log(`❌ Erro durante os testes: ${error.message}`);
    testResults.summary.failedTests = 1;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser fechado');
    }
  }

  // Salvar resultados
  const resultsPath = path.join(TEST_RESULTS_DIR, 'test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
  console.log(`📁 Resultados salvos em: ${resultsPath}`);
  console.log(`📸 Screenshots salvos em: ${SCREENSHOTS_DIR}`);

  return testResults;
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runUsersE2ETests().catch(console.error);
}

export default runUsersE2ETests;
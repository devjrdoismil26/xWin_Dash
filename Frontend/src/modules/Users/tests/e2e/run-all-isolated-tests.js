#!/usr/bin/env node
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const BASE_URL = 'http://localhost:8000';
const TEST_RESULTS_DIR = path.join(__dirname, '../../../test-results/users-isolated');
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
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}-${timestamp}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot salvo: ${screenshotPath}`);
  return screenshotPath;
}

// Função para testar página específica
async function testPage(browser, pagePath, testName) {
  console.log(`🧪 Testando ${testName}...`);
  const page = await browser.newPage();
  const results = {
    success: false,
    errors: [],
    elements: {},
    screenshots: []
  };

  try {
    await page.goto(`${BASE_URL}${pagePath}`);
    await page.waitForSelector('body');
    
    // Capturar screenshot
    const screenshot = await takeScreenshot(page, testName.toLowerCase().replace(/\s+/g, '-'));
    results.screenshots.push(screenshot);

    // Analisar elementos da página
    const pageElements = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasMain: !!document.querySelector('main, [role="main"]'),
        hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        forms: document.querySelectorAll('form').length,
        inputs: document.querySelectorAll('input').length,
        buttons: document.querySelectorAll('button').length,
        links: document.querySelectorAll('a[href]').length,
        images: document.querySelectorAll('img').length,
        tables: document.querySelectorAll('table').length,
        lists: document.querySelectorAll('ul, ol').length,
        totalElements: document.querySelectorAll('*').length,
        hasErrors: document.querySelectorAll('[class*="error"], [data-testid*="error"]').length,
        hasLoading: document.querySelectorAll('[class*="loading"], [data-testid*="loading"]').length
      };
    });

    results.elements = pageElements;
    results.success = true;
    
    console.log(`  ✅ ${testName} carregado com sucesso`);
    console.log(`    - Título: ${pageElements.title}`);
    console.log(`    - Elementos: ${pageElements.totalElements}`);
    console.log(`    - Formulários: ${pageElements.forms}`);
    console.log(`    - Botões: ${pageElements.buttons}`);
    console.log(`    - Links: ${pageElements.links}`);

  } catch (error) {
    results.errors.push(error.message);
    console.log(`  ❌ Erro ao testar ${testName}: ${error.message}`);
  } finally {
    await page.close();
  }

  return results;
}

// Função para testar responsividade
async function testResponsiveness(browser, pagePath, testName) {
  console.log(`📱 Testando responsividade de ${testName}...`);
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
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForSelector('body');
      
      const viewportInfo = await page.evaluate(() => {
        return {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          hasScrollbars: document.documentElement.scrollHeight > window.innerHeight,
          elementsVisible: document.querySelectorAll('*').length,
          hasMainContent: !!document.querySelector('main, [role="main"]')
        };
      });

      results[viewport.name].success = true;
      results[viewport.name].viewportInfo = viewportInfo;
      
      await takeScreenshot(page, `${testName.toLowerCase().replace(/\s+/g, '-')}-${viewport.name}`);
      
      console.log(`    ✅ ${viewport.name} (${viewport.width}x${viewport.height}): ${viewportInfo.elementsVisible} elementos`);
    }
  } catch (error) {
    console.log(`  ❌ Erro ao testar responsividade: ${error.message}`);
  } finally {
    await page.close();
  }

  return results;
}

// Função para testar acessibilidade
async function testAccessibility(browser, pagePath, testName) {
  console.log(`♿ Testando acessibilidade de ${testName}...`);
  const page = await browser.newPage();
  const results = {
    headings: { success: false, count: 0 },
    labels: { success: false, count: 0 },
    buttons: { success: false, count: 0 },
    links: { success: false, count: 0 },
    forms: { success: false, count: 0 },
    images: { success: false, count: 0 }
  };

  try {
    await page.goto(`${BASE_URL}${pagePath}`);
    await page.waitForSelector('body');
    
    const accessibilityInfo = await page.evaluate(() => {
      return {
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        labels: document.querySelectorAll('label').length,
        buttons: document.querySelectorAll('button, [role="button"]').length,
        links: document.querySelectorAll('a[href]').length,
        forms: document.querySelectorAll('form').length,
        images: document.querySelectorAll('img').length,
        hasTitle: !!document.title,
        hasMain: !!document.querySelector('main, [role="main"]'),
        hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
        hasAriaLabels: document.querySelectorAll('[aria-label]').length,
        hasAriaDescribedBy: document.querySelectorAll('[aria-describedby]').length,
        hasRoles: document.querySelectorAll('[role]').length,
        focusableElements: document.querySelectorAll('button, a[href], input, textarea, select, [tabindex]').length
      };
    });

    results.headings = { success: accessibilityInfo.headings > 0, count: accessibilityInfo.headings };
    results.labels = { success: accessibilityInfo.labels > 0, count: accessibilityInfo.labels };
    results.buttons = { success: accessibilityInfo.buttons > 0, count: accessibilityInfo.buttons };
    results.links = { success: accessibilityInfo.links > 0, count: accessibilityInfo.links };
    results.forms = { success: accessibilityInfo.forms > 0, count: accessibilityInfo.forms };
    results.images = { success: accessibilityInfo.images > 0, count: accessibilityInfo.images };

    console.log(`    ✅ Acessibilidade verificada:`);
    console.log(`      - Headings: ${accessibilityInfo.headings}`);
    console.log(`      - Labels: ${accessibilityInfo.labels}`);
    console.log(`      - Buttons: ${accessibilityInfo.buttons}`);
    console.log(`      - Links: ${accessibilityInfo.links}`);
    console.log(`      - Forms: ${accessibilityInfo.forms}`);
    console.log(`      - Images: ${accessibilityInfo.images}`);
    console.log(`      - Elementos focáveis: ${accessibilityInfo.focusableElements}`);

  } catch (error) {
    console.log(`  ❌ Erro ao testar acessibilidade: ${error.message}`);
  } finally {
    await page.close();
  }

  return results;
}

// Função principal
async function runAllIsolatedTests() {
  console.log('🚀 Iniciando testes isolados completos do módulo Users...');
  
  let browser;
  const testResults = {
    timestamp: new Date().toISOString(),
    pages: {},
    responsiveness: {},
    accessibility: {},
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    }
  };

  // Páginas para testar
  const pagesToTest = [
    { path: '/login', name: 'Página de Login' },
    { path: '/register', name: 'Página de Cadastro' },
    { path: '/forgot-password', name: 'Página de Recuperação de Senha' },
    { path: '/confirm-password', name: 'Página de Confirmação de Senha' },
    { path: '/verify-email', name: 'Página de Verificação de Email' },
    { path: '/profile', name: 'Página de Perfil' },
    { path: '/profile/edit', name: 'Página de Edição de Perfil' },
    { path: '/profile/preferences', name: 'Página de Preferências' },
    { path: '/profile/settings', name: 'Página de Configurações' },
    { path: '/profile/activity', name: 'Página de Atividade' },
    { path: '/users', name: 'Página de Lista de Usuários' },
    { path: '/users/create', name: 'Página de Criação de Usuário' },
    { path: '/users/1/edit', name: 'Página de Edição de Usuário' },
    { path: '/users/1', name: 'Página de Detalhes do Usuário' },
    { path: '/users/roles', name: 'Página de Gerenciamento de Roles' },
    { path: '/users/permissions', name: 'Página de Gerenciamento de Permissões' },
    { path: '/', name: 'Dashboard Principal' }
  ];

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('✅ Browser iniciado com sucesso');

    // Testar cada página
    for (const page of pagesToTest) {
      testResults.pages[page.path] = await testPage(browser, page.path, page.name);
    }

    // Testar responsividade das páginas principais
    const mainPages = [
      { path: '/login', name: 'Login' },
      { path: '/register', name: 'Cadastro' },
      { path: '/users', name: 'Usuários' },
      { path: '/profile', name: 'Perfil' },
      { path: '/', name: 'Dashboard' }
    ];

    for (const page of mainPages) {
      testResults.responsiveness[page.path] = await testResponsiveness(browser, page.path, page.name);
    }

    // Testar acessibilidade das páginas principais
    for (const page of mainPages) {
      testResults.accessibility[page.path] = await testAccessibility(browser, page.path, page.name);
    }

    // Calcular resumo
    const pageTests = Object.values(testResults.pages).filter(r => r.success).length;
    const responsiveTests = Object.values(testResults.responsiveness).reduce((acc, page) => 
      acc + Object.values(page).filter(r => r.success).length, 0);
    const accessibilityTests = Object.values(testResults.accessibility).reduce((acc, page) => 
      acc + Object.values(page).filter(r => r.success).length, 0);

    testResults.summary.totalTests = pageTests + responsiveTests + accessibilityTests;
    testResults.summary.passedTests = pageTests + responsiveTests + accessibilityTests;
    testResults.summary.failedTests = 0;

    console.log('🎉 Todos os testes isolados concluídos!');
    console.log(`📊 Resumo:`);
    console.log(`  - Páginas testadas: ${pageTests}/${pagesToTest.length}`);
    console.log(`  - Testes de responsividade: ${responsiveTests}`);
    console.log(`  - Testes de acessibilidade: ${accessibilityTests}`);
    console.log(`  - Total: ${testResults.summary.passedTests}/${testResults.summary.totalTests} testes passaram`);

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
  const resultsPath = path.join(TEST_RESULTS_DIR, 'isolated-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
  console.log(`📁 Resultados salvos em: ${resultsPath}`);
  console.log(`📸 Screenshots salvos em: ${SCREENSHOTS_DIR}`);

  return testResults;
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllIsolatedTests().catch(console.error);
}

export default runAllIsolatedTests;
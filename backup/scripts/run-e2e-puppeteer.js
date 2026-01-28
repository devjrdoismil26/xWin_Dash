#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar diretório de resultados se não existir
const resultsDir = path.join(__dirname, '..', 'test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

async function runE2ETests() {
  console.log('🚀 Iniciando testes E2E com Puppeteer...');
  
  let browser;
  let page;
  
  try {
    // Configurar Puppeteer
    browser = await puppeteer.launch({
      headless: false, // Para visualizar
      slowMo: 100,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('✅ Browser iniciado com sucesso');
    
    // Teste 1: Carregar homepage (renderizada pelo Laravel)
    console.log('📄 Testando carregamento da homepage (Laravel + Inertia.js)...');
    await page.goto('http://localhost:8000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    const title = await page.title();
    console.log(`📋 Título da página: ${title}`);
    
    // Verificar se é uma página Laravel/Inertia
    const hasInertia = await page.evaluate(() => {
      return !!window.$page || !!document.querySelector('[data-page]');
    });
    console.log(`🔄 Inertia.js detectado: ${hasInertia ? 'Sim' : 'Não'}`);
    
    // Screenshot da homepage
    await page.screenshot({ 
      path: path.join(resultsDir, '01-homepage.png'),
      fullPage: true 
    });
    console.log('📸 Screenshot da homepage salvo');
    
    // Teste 2: Responsividade
    console.log('📱 Testando responsividade...');
    
    // Desktop (Laravel renderizado)
    await page.setViewport({ width: 1280, height: 720 });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.screenshot({ 
      path: path.join(resultsDir, '02-desktop.png'),
      fullPage: true 
    });
    
    // Mobile (Laravel renderizado)
    await page.setViewport({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.screenshot({ 
      path: path.join(resultsDir, '03-mobile.png'),
      fullPage: true 
    });
    
    // Tablet (Laravel renderizado)
    await page.setViewport({ width: 768, height: 1024 });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.screenshot({ 
      path: path.join(resultsDir, '04-tablet.png'),
      fullPage: true 
    });
    
    console.log('📸 Screenshots de responsividade salvos');
    
    // Teste 3: Elementos da página Laravel/Inertia
    console.log('🔍 Analisando elementos da página Laravel/Inertia...');
    
    const elements = await page.evaluate(() => {
      return {
        links: document.querySelectorAll('a').length,
        buttons: document.querySelectorAll('button').length,
        inputs: document.querySelectorAll('input').length,
        forms: document.querySelectorAll('form').length,
        images: document.querySelectorAll('img').length,
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        // Elementos específicos do Laravel/Inertia
        csrfToken: document.querySelector('meta[name="csrf-token"]') ? 'Presente' : 'Ausente',
        inertiaData: document.querySelector('[data-page]') ? 'Presente' : 'Ausente',
        laravelAssets: document.querySelectorAll('link[href*="laravel"], script[src*="laravel"]').length
      };
    });
    
    console.log('📊 Elementos encontrados:', elements);
    
    // Verificar se é uma aplicação Laravel
    const isLaravelApp = await page.evaluate(() => {
      return {
        hasLaravelMeta: !!document.querySelector('meta[name="csrf-token"]'),
        hasLaravelAssets: document.querySelectorAll('link[href*="laravel"], script[src*="laravel"]').length > 0,
        hasInertiaData: !!document.querySelector('[data-page]'),
        hasLaravelRoutes: !!window.Laravel || !!window.route
      };
    });
    
    console.log('🔧 Detecção Laravel/Inertia:', isLaravelApp);
    
    // Teste 4: Interações básicas
    console.log('🖱️ Testando interações...');
    
    // Procurar por botões clicáveis
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      console.log(`🔘 Encontrados ${buttons.length} botões`);
      
      // Tentar clicar no primeiro botão se for seguro
      try {
        await buttons[0].click();
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: path.join(resultsDir, '05-after-click.png'),
          fullPage: true 
        });
        console.log('✅ Clique em botão testado');
      } catch (error) {
        console.log('⚠️ Erro ao clicar no botão:', error.message);
      }
    }
    
    // Teste 5: Formulários
    const forms = await page.$$('form');
    if (forms.length > 0) {
      console.log(`📝 Encontrados ${forms.length} formulários`);
      
      // Tentar preencher campos de texto
      const textInputs = await page.$$('input[type="text"], input[type="email"]');
      for (let i = 0; i < Math.min(2, textInputs.length); i++) {
        try {
          await textInputs[i].type('test@example.com');
          console.log(`✏️ Campo ${i + 1} preenchido`);
        } catch (error) {
          console.log(`⚠️ Erro ao preencher campo ${i + 1}:`, error.message);
        }
      }
      
      await page.screenshot({ 
        path: path.join(resultsDir, '06-form-filled.png'),
        fullPage: true 
      });
    }
    
    // Teste 6: Performance
    console.log('⚡ Testando performance...');
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
      };
    });
    
    console.log('📈 Métricas de performance:', performanceMetrics);
    
    // Teste 7: Acessibilidade básica
    console.log('♿ Testando acessibilidade básica...');
    
    const accessibilityInfo = await page.evaluate(() => {
      return {
        hasTitle: !!document.title,
        hasMain: !!document.querySelector('main'),
        hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        hasAltText: document.querySelectorAll('img[alt]').length,
        hasLabels: document.querySelectorAll('label').length,
        hasAriaLabels: document.querySelectorAll('[aria-label]').length
      };
    });
    
    console.log('♿ Informações de acessibilidade:', accessibilityInfo);
    
    // Screenshot final
    await page.screenshot({ 
      path: path.join(resultsDir, '07-final-state.png'),
      fullPage: true 
    });
    
    console.log('🎉 Todos os testes E2E concluídos com sucesso!');
    console.log(`📁 Screenshots salvos em: ${resultsDir}`);
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    
    // Screenshot de erro se possível
    try {
      await page.screenshot({ 
        path: path.join(resultsDir, 'error-screenshot.png'),
        fullPage: true 
      });
    } catch (screenshotError) {
      console.error('❌ Erro ao tirar screenshot de erro:', screenshotError);
    }
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser fechado');
    }
  }
}

// Executar testes
runE2ETests().catch(console.error);
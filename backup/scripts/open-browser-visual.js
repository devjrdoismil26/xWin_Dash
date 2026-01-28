import puppeteer from 'puppeteer';

async function openBrowserVisual() {
  console.log('🌐 Abrindo browser para visualização...');
  
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo: 100,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-extensions',
      '--disable-plugins',
      '--single-process',
      '--enable-features=NetworkService,NetworkServiceInProcess',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-field-trial-config',
      '--disable-ipc-flooding-protection',
      '--force-color-profile=srgb',
      '--metrics-recording-only',
      '--no-first-run',
      '--enable-automation',
      '--password-store=basic',
      '--use-mock-keychain',
      '--disable-javascript-harmony-shipping',
      '--disable-background-networking',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-pings',
      '--no-zygote',
      '--enable-experimental-web-platform-features',
      '--enable-blink-features=CustomElementsV0',
      '--disable-blink-features=AutomationControlled'
    ],
    timeout: 30000,
    defaultViewport: {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1
    }
  });

  try {
    const page = await browser.newPage();
    
    // Configurar logs
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.log(`❌ [${type}] ${text}`);
      } else if (type === 'log' && (text.includes('Resolvendo página') || text.includes('React') || text.includes('Inertia'))) {
        console.log(`🔍 [${type}] ${text}`);
      }
    });
    
    page.on('pageerror', (error) => {
      console.log(`❌ PAGE ERROR: ${error.message}`);
    });

    const BASE_URL = 'http://localhost:8000';

    console.log('🚀 Navegando para a página de login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    
    console.log('⏳ Aguardando hidratação...');
    await page.waitForTimeout(5000);

    // Verificar estado da aplicação
    const appState = await page.evaluate(() => {
      return {
        hasReact: typeof window.React !== 'undefined',
        hasReactDOM: typeof window.ReactDOM !== 'undefined',
        hasInertia: typeof window.Inertia !== 'undefined',
        title: document.title,
        readyState: document.readyState,
        totalInputs: document.querySelectorAll('input').length,
        totalButtons: document.querySelectorAll('button').length,
        totalForms: document.querySelectorAll('form').length,
        bodyClasses: document.body.className,
        bodyStyles: {
          backgroundColor: window.getComputedStyle(document.body).backgroundColor,
          color: window.getComputedStyle(document.body).color,
          fontFamily: window.getComputedStyle(document.body).fontFamily,
          margin: window.getComputedStyle(document.body).margin,
          padding: window.getComputedStyle(document.body).padding
        }
      };
    });

    console.log('\n📊 === ESTADO DA APLICAÇÃO ===');
    console.log(`⚛️ React: ${appState.hasReact}`);
    console.log(`🔄 ReactDOM: ${appState.hasReactDOM}`);
    console.log(`🔄 Inertia: ${appState.hasInertia}`);
    console.log(`📄 Title: ${appState.title}`);
    console.log(`📄 Ready State: ${appState.readyState}`);
    console.log(`📊 Inputs: ${appState.totalInputs}`);
    console.log(`📊 Buttons: ${appState.totalButtons}`);
    console.log(`📊 Forms: ${appState.totalForms}`);
    console.log(`🎨 Body Classes: ${appState.bodyClasses}`);
    console.log(`🎨 Body Background: ${appState.bodyStyles.backgroundColor}`);
    console.log(`🎨 Body Color: ${appState.bodyStyles.color}`);
    console.log(`🎨 Body Font: ${appState.bodyStyles.fontFamily}`);

    // Verificar elementos específicos
    const elements = await page.evaluate(() => {
      const form = document.querySelector('form');
      const inputs = document.querySelectorAll('input');
      const buttons = document.querySelectorAll('button');
      
      return {
        form: form ? {
          className: form.className,
          styles: {
            backgroundColor: window.getComputedStyle(form).backgroundColor,
            borderRadius: window.getComputedStyle(form).borderRadius,
            boxShadow: window.getComputedStyle(form).boxShadow,
            padding: window.getComputedStyle(form).padding,
            margin: window.getComputedStyle(form).margin
          }
        } : null,
        inputs: Array.from(inputs).map(input => ({
          className: input.className,
          type: input.type,
          styles: {
            backgroundColor: window.getComputedStyle(input).backgroundColor,
            border: window.getComputedStyle(input).border,
            borderRadius: window.getComputedStyle(input).borderRadius,
            padding: window.getComputedStyle(input).padding,
            fontSize: window.getComputedStyle(input).fontSize,
            color: window.getComputedStyle(input).color
          }
        })),
        buttons: Array.from(buttons).map(button => ({
          className: button.className,
          textContent: button.textContent,
          styles: {
            backgroundColor: window.getComputedStyle(button).backgroundColor,
            color: window.getComputedStyle(button).color,
            borderRadius: window.getComputedStyle(button).borderRadius,
            padding: window.getComputedStyle(button).padding,
            fontSize: window.getComputedStyle(button).fontSize,
            border: window.getComputedStyle(button).border
          }
        }))
      };
    });

    console.log('\n🎨 === ELEMENTOS ESTILIZADOS ===');
    
    if (elements.form) {
      console.log('📋 Formulário:');
      console.log(`  Classes: ${elements.form.className}`);
      console.log(`  Background: ${elements.form.styles.backgroundColor}`);
      console.log(`  Border Radius: ${elements.form.styles.borderRadius}`);
      console.log(`  Box Shadow: ${elements.form.styles.boxShadow}`);
      console.log(`  Padding: ${elements.form.styles.padding}`);
    }

    console.log('\n📝 Inputs:');
    elements.inputs.forEach((input, index) => {
      console.log(`  Input ${index + 1} (${input.type}):`);
      console.log(`    Classes: ${input.className}`);
      console.log(`    Background: ${input.styles.backgroundColor}`);
      console.log(`    Border: ${input.styles.border}`);
      console.log(`    Border Radius: ${input.styles.borderRadius}`);
      console.log(`    Padding: ${input.styles.padding}`);
      console.log(`    Font Size: ${input.styles.fontSize}`);
      console.log(`    Color: ${input.styles.color}`);
    });

    console.log('\n🔘 Buttons:');
    elements.buttons.forEach((button, index) => {
      console.log(`  Button ${index + 1} (${button.textContent}):`);
      console.log(`    Classes: ${button.className}`);
      console.log(`    Background: ${button.styles.backgroundColor}`);
      console.log(`    Color: ${button.styles.color}`);
      console.log(`    Border Radius: ${button.styles.borderRadius}`);
      console.log(`    Padding: ${button.styles.padding}`);
      console.log(`    Font Size: ${button.styles.fontSize}`);
      console.log(`    Border: ${button.styles.border}`);
    });

    // Verificar se há problemas visuais
    const hasVisualIssues = 
      elements.inputs.some(input => 
        input.styles.backgroundColor === 'rgba(0, 0, 0, 0)' || 
        input.styles.backgroundColor === 'transparent'
      ) ||
      elements.buttons.some(button => 
        button.styles.backgroundColor === 'rgba(0, 0, 0, 0)' || 
        button.styles.backgroundColor === 'transparent'
      );

    if (hasVisualIssues) {
      console.log('\n⚠️ === PROBLEMAS VISUAIS DETECTADOS ===');
      console.log('❌ Alguns elementos podem não estar estilizados corretamente');
      console.log('💡 Verifique se o Tailwind CSS está sendo aplicado');
    } else {
      console.log('\n✅ === ESTILOS APLICADOS CORRETAMENTE ===');
      console.log('🎉 Todos os elementos estão estilizados!');
    }

    console.log('\n🌐 Browser aberto para visualização...');
    console.log('👀 Você pode ver a página no browser que abriu');
    console.log('🔍 Use o DevTools (F12) para inspecionar os elementos');
    console.log('⏹️ Pressione Ctrl+C para fechar');

    // Manter o browser aberto
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Erro durante abertura:', error);
  }
}

openBrowserVisual().catch(console.error);
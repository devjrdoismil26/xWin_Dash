const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

describe("E2E Tests with Puppeteer", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Para ver o que está acontecendo
      slowMo: 100, // Desacelerar para visualizar
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();

    // Configurar viewport
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("should load the homepage", async () => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Verificar se a página carregou
    const title = await page.title();
    expect(title).toContain("Laravel Vite");

    // Tirar screenshot
    await page.screenshot({
      path: "test-results/homepage.png",
      fullPage: true,
    });
  });

  test("should take component screenshots", async () => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Screenshot da página completa
    await page.screenshot({
      path: "test-results/full-page.png",
      fullPage: true,
    });

    // Screenshot de elementos específicos se existirem
    const elements = await page.$$("div, section, main");
    if (elements.length > 0) {
      await elements[0].screenshot({
        path: "test-results/main-element.png",
      });
    }
  });

  test("should test responsive design", async () => {
    // Desktop
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/desktop.png",
      fullPage: true,
    });

    // Mobile
    await page.setViewport({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/mobile.png",
      fullPage: true,
    });

    // Tablet
    await page.setViewport({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/tablet.png",
      fullPage: true,
    });
  });

  test("should test navigation", async () => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Procurar por links de navegação
    const links = await page.$$("a[href]");
    console.log(`Found ${links.length} links on the page`);

    // Testar alguns links se existirem
    for (let i = 0; i < Math.min(3, links.length); i++) {
      const href = await links[i].evaluate((el) => el.href);
      console.log(`Testing link: ${href}`);

      // Navegar para o link
      await page.goto(href);
      await page.waitForLoadState("networkidle");

      // Screenshot da página
      const filename = `test-results/navigation-${i + 1}.png`;
      await page.screenshot({
        path: filename,
        fullPage: true,
      });
    }
  });

  test("should test form interactions", async () => {
    // Tentar encontrar formulários
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    const forms = await page.$$("form");
    console.log(`Found ${forms.length} forms on the page`);

    if (forms.length > 0) {
      // Screenshot do formulário
      await forms[0].screenshot({
        path: "test-results/form.png",
      });

      // Tentar preencher campos se existirem
      const inputs = await page.$$(
        'input[type="text"], input[type="email"], input[type="password"]',
      );
      for (let i = 0; i < Math.min(2, inputs.length); i++) {
        await inputs[i].type("test@example.com");
      }

      // Screenshot após preenchimento
      await page.screenshot({
        path: "test-results/form-filled.png",
        fullPage: true,
      });
    }
  });

  test("should test dark mode if available", async () => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Procurar por toggle de dark mode
    const darkModeToggle = await page.$(
      '[data-testid="dark-mode-toggle"], .dark-mode-toggle, button[aria-label*="dark"], button[aria-label*="theme"]',
    );

    if (darkModeToggle) {
      // Screenshot modo claro
      await page.screenshot({
        path: "test-results/light-mode.png",
        fullPage: true,
      });

      // Clicar no toggle
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      // Screenshot modo escuro
      await page.screenshot({
        path: "test-results/dark-mode.png",
        fullPage: true,
      });
    } else {
      console.log("Dark mode toggle not found");
    }
  });
});

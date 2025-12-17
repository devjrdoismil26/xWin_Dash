import { test, expect } from "@playwright/test";

test.describe("Autenticação de Usuários", () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de login antes de cada teste
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
  });

  test("deve exibir formulário de login corretamente", async ({ page }) => {
    // Verificar elementos do formulário de login
    await expect(page.locator("h2")).toContainText("Entrar na sua conta");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="remember"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Verificar links de navegação
    await expect(page.locator('a[href*="register"]')).toBeVisible();
    await expect(page.locator('a[href*="password.request"]')).toBeVisible();
  });

  test("deve validar campos obrigatórios no login", async ({ page }) => {
    // Tentar submeter formulário vazio
    await page.click('button[type="submit"]');

    // Verificar se os campos são marcados como obrigatórios
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "required",
    );
    await expect(page.locator('input[name="password"]')).toHaveAttribute(
      "required",
    );
  });

  test("deve alternar visibilidade da senha", async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[type="button"]').last();

    // Verificar que inicialmente a senha está oculta
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Clicar no botão de toggle
    await toggleButton.click();

    // Verificar que a senha agora está visível
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Clicar novamente para ocultar
    await toggleButton.click();

    // Verificar que a senha voltou a ficar oculta
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("deve navegar para página de cadastro", async ({ page }) => {
    // Clicar no link de cadastro
    await page.click('a[href*="register"]');

    // Verificar se navegou para a página de cadastro
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator("h2")).toContainText("Criar nova conta");
  });

  test("deve navegar para página de recuperação de senha", async ({ page }) => {
    // Clicar no link "Esqueceu a senha?"
    await page.click('a[href*="password.request"]');

    // Verificar se navegou para a página de recuperação
    await expect(page).toHaveURL(/.*password\.request/);
  });

  test("deve exibir formulário de cadastro corretamente", async ({ page }) => {
    // Navegar para página de cadastro
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Verificar elementos do formulário de cadastro
    await expect(page.locator("h2")).toContainText("Criar nova conta");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(
      page.locator('input[name="password_confirmation"]'),
    ).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Verificar link de volta para login
    await expect(page.locator('a[href*="login"]')).toBeVisible();
  });

  test("deve validar campos obrigatórios no cadastro", async ({ page }) => {
    // Navegar para página de cadastro
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Tentar submeter formulário vazio
    await page.click('button[type="submit"]');

    // Verificar se os campos são marcados como obrigatórios
    await expect(page.locator('input[name="name"]')).toHaveAttribute(
      "required",
    );
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "required",
    );
    await expect(page.locator('input[name="password"]')).toHaveAttribute(
      "required",
    );
    await expect(
      page.locator('input[name="password_confirmation"]'),
    ).toHaveAttribute("required");
  });

  test("deve alternar visibilidade das senhas no cadastro", async ({
    page,
  }) => {
    // Navegar para página de cadastro
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator(
      'input[name="password_confirmation"]',
    );
    const toggleButtons = page.locator('button[type="button"]');

    // Verificar que inicialmente as senhas estão ocultas
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(confirmPasswordInput).toHaveAttribute("type", "password");

    // Clicar no primeiro botão de toggle (senha)
    await toggleButtons.nth(0).click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Clicar no segundo botão de toggle (confirmação de senha)
    await toggleButtons.nth(1).click();
    await expect(confirmPasswordInput).toHaveAttribute("type", "text");
  });

  test("deve navegar de volta para login a partir do cadastro", async ({
    page,
  }) => {
    // Navegar para página de cadastro
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Clicar no link de login
    await page.click('a[href*="login"]');

    // Verificar se navegou para a página de login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator("h2")).toContainText("Entrar na sua conta");
  });

  test("deve ter ícones apropriados nos campos", async ({ page }) => {
    // Verificar ícones no formulário de login
    await expect(page.locator("svg")).toHaveCount(4); // Mail, Lock, Eye/EyeOff

    // Navegar para cadastro e verificar ícones
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("svg")).toHaveCount(6); // User, Mail, Lock, Eye/EyeOff (2x)
  });

  test("deve ter design responsivo", async ({ page }) => {
    // Testar em diferentes tamanhos de tela
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page.locator(".max-w-md")).toBeVisible();

    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await expect(page.locator(".max-w-md")).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await expect(page.locator(".max-w-md")).toBeVisible();
  });

  test("deve ter modo escuro funcionando", async ({ page }) => {
    // Verificar se os elementos têm classes de modo escuro
    await expect(page.locator(".dark\\:bg-gray-800")).toBeVisible();
    await expect(page.locator(".dark\\:text-white")).toBeVisible();
    await expect(page.locator(".dark\\:border-gray-700")).toBeVisible();
  });

  test("deve ter acessibilidade básica", async ({ page }) => {
    // Verificar labels associados aos inputs
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();

    // Verificar placeholders
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "placeholder",
    );
    await expect(page.locator('input[name="password"]')).toHaveAttribute(
      "placeholder",
    );

    // Verificar autocomplete
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "autocomplete",
      "email",
    );
    await expect(page.locator('input[name="password"]')).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });
});

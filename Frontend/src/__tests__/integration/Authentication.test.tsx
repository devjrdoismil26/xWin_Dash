import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import Authentication from "@/pages/Authentication";

// Mock do componente de autenticação
vi.mock("@/pages/Authentication", () => ({
  default: () => (
    <div data-testid="authentication-page">
           
        </div><form data-testid="login-form" />
        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          name="email"
        / />
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          name="password"
        / />
        <button data-testid="login-button" type="submit" />
          Login
        </button></form></div>
  ),
}));

// Mock do hook de autenticação
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

describe("Authentication Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  });

  it("should render authentication page", async () => {
    render(<Authentication />, { queryClient, withInertia: true });

    await waitFor(() => {
      expect(screen.getByTestId("authentication-page")).toBeInTheDocument();

    });

  });

  it("should display login form", async () => {
    render(<Authentication />, { queryClient, withInertia: true });

    await waitFor(() => {
      expect(screen.getByTestId("login-form")).toBeInTheDocument();

      expect(screen.getByTestId("email-input")).toBeInTheDocument();

      expect(screen.getByTestId("password-input")).toBeInTheDocument();

      expect(screen.getByTestId("login-button")).toBeInTheDocument();

    });

  });

  it("should handle form submission", async () => {
    const mockLogin = vi.fn();

    vi.mocked(require("@/hooks/useAuth").useAuth).mockReturnValue({
      user: null,
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false,
      error: null,
    });

    render(<Authentication />, { queryClient, withInertia: true });

    const emailInput = screen.getByTestId("email-input");

    const passwordInput = screen.getByTestId("password-input");

    const loginButton = screen.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } );

    fireEvent.change(passwordInput, { target: { value: "password123" } );

    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });

  });

  it("should show loading state during login", async () => {
    vi.mocked(require("@/hooks/useAuth").useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: true,
      error: null,
    });

    render(<Authentication />, { queryClient, withInertia: true });

    await waitFor(() => {
      expect(screen.getByTestId("login-loading")).toBeInTheDocument();

    });

  });

  it("should show error message on login failure", async () => {
    vi.mocked(require("@/hooks/useAuth").useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: "Invalid credentials",
    });

    render(<Authentication />, { queryClient, withInertia: true });

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();

    });

  });

  it("should redirect after successful login", async () => {
    const mockVisit = vi.fn();

    vi.mock("@inertiajs/react", async () => {
      const actual = await vi.importActual("@inertiajs/react");

      return {
        ...actual,
        router: {
          visit: mockVisit,
        },};

    });

    vi.mocked(require("@/hooks/useAuth").useAuth).mockReturnValue({
      user: { id: 1, name: "Test User", email: "test@example.com" },
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: null,
    });

    render(<Authentication />, { queryClient, withInertia: true });

    await waitFor(() => {
      expect(mockVisit).toHaveBeenCalledWith("/dashboard");

    });

  });

  it("should validate email format", async () => {
    render(<Authentication />, { queryClient, withInertia: true });

    const emailInput = screen.getByTestId("email-input");

    const loginButton = screen.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } );

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Email inválido")).toBeInTheDocument();

    });

  });

  it("should validate password length", async () => {
    render(<Authentication />, { queryClient, withInertia: true });

    const passwordInput = screen.getByTestId("password-input");

    const loginButton = screen.getByTestId("login-button");

    fireEvent.change(passwordInput, { target: { value: "123" } );

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText("Senha deve ter pelo menos 6 caracteres"),
      ).toBeInTheDocument();

    });

  });

  it("should handle keyboard navigation", async () => {
    render(<Authentication />, { queryClient, withInertia: true });

    const emailInput = screen.getByTestId("email-input");

    const passwordInput = screen.getByTestId("password-input");

    emailInput.focus();

    fireEvent.keyDown(emailInput, { key: "Tab" });

    await waitFor(() => {
      expect(passwordInput).toHaveFocus();

    });

  });

  it("should support dark theme", async () => {
    render(
      <BrowserRouter />
        <Authentication / />
      </BrowserRouter>,
      { queryClient, withRouter: true, theme: "dark" },);

    await waitFor(() => {
      const authPage = screen.getByTestId("authentication-page");

      expect(authPage).toHaveClass("dark");

    });

  });

  it("should be responsive", async () => {
    render(<Authentication />, { queryClient, withInertia: true });

    await waitFor(() => {
      const authPage = screen.getByTestId("authentication-page");

      expect(authPage).toHaveClass("responsive");

    });

  });

});

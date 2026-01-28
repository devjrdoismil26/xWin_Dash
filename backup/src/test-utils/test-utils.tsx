
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AdvancedThemeProvider } from '@/components/ui/AdvancedThemeProvider';

// Mock do Inertia
const MockInertiaProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="inertia-provider">{children}</div>;
};

// Criar QueryClient para testes
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Wrapper customizado para testes
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  theme?: 'light' | 'dark' | 'system';
  withInertia?: boolean;
}

const AllTheProviders = ({ 
  children, 
  queryClient, 
  theme = 'light',
  withInertia = false 
}: {
  children: React.ReactNode;
  queryClient?: QueryClient;
  theme?: 'light' | 'dark' | 'system';
  withInertia?: boolean;
}) => {
  const testQueryClient = queryClient || createTestQueryClient();
  
  let content = children;
  
  if (withInertia) {
    content = <MockInertiaProvider>{content}</MockInertiaProvider>;
  }
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider defaultTheme={theme}>
        <AdvancedThemeProvider>
          {content}
        </AdvancedThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Função de render customizada
const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    queryClient,
    theme,
    withInertia,
    ...renderOptions
  } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders 
        queryClient={queryClient}
        theme={theme}
        withInertia={withInertia}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Utilitários de teste
export const testUtils = {
  // Mock de dados comuns
  mockUser: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    avatar: 'https://cdn-icons-png.flaticon.com/512/1503/1503151.png'
  },

  mockProject: {
    id: 1,
    name: 'Test Project',
    description: 'Test project description',
    status: 'active',
    progress: 50,
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  },

  mockLead: {
    id: 1,
    name: 'Test Lead',
    email: 'lead@example.com',
    phone: '+55 11 99999-9999',
    status: 'active',
    source: 'website',
    created_at: '2024-01-15T10:00:00Z'
  },

  // Mock de funções
  mockNavigate: vi.fn(),
  mockToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },

  // Mock de localStorage
  mockLocalStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },

  // Mock de sessionStorage
  mockSessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },

  // Mock de fetch
  mockFetch: vi.fn(),

  // Mock de window.matchMedia
  mockMatchMedia: (matches: boolean = false) => ({
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),

  // Mock de ResizeObserver
  mockResizeObserver: {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  },

  // Mock de IntersectionObserver
  mockIntersectionObserver: {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  },

  // Helpers para testes
  waitFor: async (callback: () => void, options = {}) => {
    const { waitFor } = await import('@testing-library/react');
    return waitFor(callback, options);
  },

  // Mock de eventos
  mockEvent: {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: { value: '' }
  },

  // Mock de formulários
  mockFormData: {
    get: vi.fn(),
    set: vi.fn(),
    has: vi.fn(),
    delete: vi.fn(),
    append: vi.fn(),
    entries: vi.fn(),
    keys: vi.fn(),
    values: vi.fn()
  }
};

// Re-exportar tudo do testing-library
export * from '@testing-library/react';
export { customRender as render };
export { createTestQueryClient };

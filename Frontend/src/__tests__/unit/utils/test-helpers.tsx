/* eslint-env node */
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Tipos específicos dos módulos (em vez dos tipos globais duplicados)
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string; }

interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  source?: string;
  value?: number;
  notes?: string;
  created_at: string;
  updated_at: string; }

interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  progress?: number;
  created_at: string;
  updated_at: string; }

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduled_at?: string;
  open_rate?: number;
  click_rate?: number;
  bounce_rate?: number;
  created_at: string;
  updated_at: string; }

interface SocialPost {
  id: number;
  content: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_for?: string;
  hashtags?: string[];
  views?: number;
  created_at: string;
  updated_at: string; }

interface Tag {
  id: number;
  name: string;
  description?: string;
  type?: string;
  color?: string;
  usage_count?: number;
  created_at: string;
  updated_at: string; }

export const createMockUser = (overrides: Partial<User> = {} as any): User => ({
  id: 1,
  name: 'João Silva',
  email: 'joao@example.com',
  role: 'user',
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockLead = (overrides: Partial<Lead> = {} as any): Lead => ({
  id: 1,
  name: 'Maria Santos',
  email: 'maria@example.com',
  phone: '(11) 99999-9999',
  company: 'Empresa ABC',
  status: 'new',
  source: 'website',
  value: 5000,
  notes: 'Lead interessado em nossos serviços',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockProject = (overrides: Partial<Project> = {} as any): Project => ({
  id: 1,
  name: 'Projeto Website',
  description: 'Desenvolvimento de website corporativo',
  status: 'in_progress',
  priority: 'high',
  start_date: '2024-01-01',
  end_date: '2024-03-01',
  progress: 45,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockEmailCampaign = (overrides: Partial<EmailCampaign> = {} as any): EmailCampaign => ({
  id: 1,
  name: 'Newsletter Janeiro',
  subject: 'Novidades do mês de Janeiro',
  content: '<p>Conteúdo da newsletter</p>',
  status: 'draft',
  open_rate: 0,
  click_rate: 0,
  bounce_rate: 0,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockSocialPost = (overrides: Partial<SocialPost> = {} as any): SocialPost => ({
  id: 1,
  content: 'Confira nosso novo produto! #novidade #produto',
  platform: 'instagram',
  status: 'draft',
  hashtags: ['novidade', 'produto'],
  views: 0,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockTag = (overrides: Partial<Tag> = {} as any): Tag => ({
  id: 1,
  name: 'Tag Teste',
  description: 'Descrição da tag de teste',
  type: 'general',
  color: '#3B82F6',
  usage_count: 5,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

// Mock para route helper (substitui o route.js não utilizado)
export const mockRoute = (routes: Record<string, ((params?: string) => string) | string>) => {
  global.route = vi.fn((name: string, params?: string) => {
    const route = routes[name];
    if (typeof route === 'function') {
      return route(params);

    }
    return route || `/${name}`;
  });};

// Setup padrão para mocks comuns
export const setupCommonMocks = (): void => {
  // Mock do axios
  vi.mock('axios', () => ({
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn()
  } ));

  // Mock do sonner
  vi.mock('sonner', () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn()
  } ));

  // Mock básico do route
  mockRoute({
    'api.users.index': '/api/users',
    'api.users.store': '/api/users',
    'api.users.show': (id: number) => `/api/users/${id}`,
    'api.users.update': (id: number) => `/api/users/${id}`,
    'api.users.destroy': (id: number) => `/api/users/${id}`,
    'api.leads.index': '/api/leads',
    'api.leads.store': '/api/leads',
    'api.leads.show': (id: number) => `/api/leads/${id}`,
    'api.leads.update': (id: number) => `/api/leads/${id}`,
    'api.leads.destroy': (id: number) => `/api/leads/${id}`,
    'api.projects.index': '/api/projects',
    'api.projects.store': '/api/projects',
    'api.projects.show': (id: number) => `/api/projects/${id}`,
    'api.projects.update': (id: number) => `/api/projects/${id}`,
    'api.projects.destroy': (id: number) => `/api/projects/${id}`,
    'api.campaigns.index': '/api/campaigns',
    'api.campaigns.store': '/api/campaigns',
    'api.campaigns.show': (id: number) => `/api/campaigns/${id}`,
    'api.campaigns.update': (id: number) => `/api/campaigns/${id}`,
    'api.campaigns.destroy': (id: number) => `/api/campaigns/${id}`,
    'api.categorization.tags.index': '/api/tags',
    'api.categorization.tags.store': '/api/tags',
    'api.categorization.tags.show': (id: number) => `/api/tags/${id}`,
    'api.categorization.tags.update': (id: number) => `/api/tags/${id}`,
    'api.categorization.tags.destroy': (id: number) => `/api/tags/${id}`,
    'api.apiTokens.store': '/api/tokens',
    'api.apiTokens.destroy': (id: number) => `/api/tokens/${id}`,
    'settings.update': (key: string) => `/settings/${key}`
  });};

// Wrapper customizado para render com providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // initialState?: Partial<AppState>;
  // theme?: 'light' | 'dark';
}

// Utilitários para simular eventos de usuário
export const fillForm = async (fields: Record<string, any>): Promise<void> => {
  const { userEvent } = await import('@testing-library/user-event');

  const user = userEvent.setup();

  for (const [fieldName, value] of Object.entries(fields)) {
    const field = document.querySelector(`[name="${fieldName}"]`)! as HTMLElement;
    if (field != null) {
      if (field.tagName === 'SELECT') {
        await user.selectOptions(field, String(value));

      } else {
        await user.clear(field);

        await user.type(field, String(value));

      } } ;

// Utilitários para aguardar elementos
export const waitForLoadingToFinish = async (): Promise<void> => {
  const { waitForElementToBeRemoved, screen } = await import('@testing-library/react');

  try {
    await waitForElementToBeRemoved(() => screen.queryByText(/carregando/i));

  } catch {
    // Se não encontrar elemento de loading, continua
  } ;

// Utilitários para testar formulários
export const expectFormValidation = (): void => {
  const { screen } = require('@testing-library/react');

  // Implementar validações específicas conforme necessário};

export const expectSuccessToast = (): void => {
  const mockToast = require('sonner').toast;
  expect(mockToast.success).toHaveBeenCalled();};

export const expectErrorToast = (): void => {
  const mockToast = require('sonner').toast;
  expect(mockToast.error).toHaveBeenCalled();};

// Utilitários para testar tabelas
export const expectTableToHaveRows = (): void => {
  const { screen } = require('@testing-library/react');

  const rows = screen.getAllByRole('row');

  expect(rows.length).toBeGreaterThan(1); // Header + data rows};

export const expectTableToBeEmpty = (): void => {
  const { screen } = require('@testing-library/react');

  const rows = screen.getAllByRole('row');

  expect(rows.length).toBe(1); // Only header row};

// Utilitários para testar modais
export const expectModalToBeOpen = (): void => {
  const { screen } = require('@testing-library/react');

  expect(screen.getByRole('dialog')).toBeInTheDocument();};

export const expectModalToBeClosed = (): void => {
  const { screen } = require('@testing-library/react');

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();};

// Utilitários para simular respostas de API
export const mockApiSuccess = (data: unknown) => ({
  data,
  status: 200,
  statusText: 'OK'
});

// Utilitários para testar paginação
export const mockPaginatedResponse = <T>(
  data: T[],
  currentPage: number = 1,
  perPage: number = 10,
  total?: number
): PaginatedResponse<T> => {
  return {
    data,
    meta: {
      current_page: currentPage,
      last_page: Math.ceil((total || (data as any).length) / perPage),
      per_page: perPage,
      total: total || (data as any).length,
      from: (currentPage - 1) * perPage + 1,
      to: Math.min(currentPage * perPage, total || (data as any).length)
  },
    links: {
      first: '/api/resource?page=1',
      last: `/api/resource?page=${Math.ceil((total || (data as any).length) / perPage)}`,
      prev: currentPage > 1 ? `/api/resource?page=${currentPage - 1}` : null,
      next: currentPage < Math.ceil((total || (data as any).length) / perPage) ? `/api/resource?page=${currentPage + 1}` : null
    } ;
};

// Re-export do testing library para conveniência
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

export default createMockUser;

// ========================================
// TESTES DE COMPONENTE - ModernLeadsIndex
// ========================================
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModernLeadsIndex from '../pages/ModernLeadsIndex';
import { useLeads } from '../hooks/useLeads';

// Mock do hook useLeads
jest.mock('../hooks/useLeads');
const mockUseLeads = useLeads as jest.MockedFunction<typeof useLeads>;

// Mock dos componentes filhos
jest.mock('../LeadsManager/components/ModernLeadCard', () => {
  return function MockModernLeadCard({ lead, onView, onEdit, onDelete }: any) {
    return (
      <div data-testid={`lead-card-${lead.id}`}>
        <h3>{lead.name}</h3>
        <p>{lead.email}</p>
        <button onClick={() => onView(lead)}>View</button>
        <button onClick={() => onEdit(lead)}>Edit</button>
        <button onClick={() => onDelete(lead)}>Delete</button>
      </div>
    );
  };
});

jest.mock('../LeadsManager/components/ModernLeadFilters', () => {
  return function MockModernLeadFilters({ onApplyFilters, onClearFilters }: any) {
    return (
      <div data-testid="lead-filters">
        <button onClick={() => onApplyFilters({ status: ['new'] })}>Apply Filters</button>
        <button onClick={() => onClearFilters()}>Clear Filters</button>
      </div>
    );
  };
});

jest.mock('../LeadsAnalytics/components/ModernLeadAnalytics', () => {
  return function MockModernLeadAnalytics({ analytics, metrics }: any) {
    return (
      <div data-testid="lead-analytics">
        <h2>Analytics</h2>
        <p>Total Leads: {metrics?.total_leads || 0}</p>
      </div>
    );
  };
});

// Mock do AppLayout
jest.mock('@/layouts/AppLayout', () => {
  return function MockAppLayout({ children }: any) {
    return <div data-testid="app-layout">{children}</div>;
  };
});

// Mock do Head do Inertia
jest.mock('@inertiajs/react', () => ({
  Head: ({ title }: any) => <title>{title}</title>,
}));

const mockLeads = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'new',
    score: 75,
    origin: 'website',
    project_id: 1,
    tags: [],
    custom_fields: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'contacted',
    score: 60,
    origin: 'social',
    project_id: 1,
    tags: [],
    custom_fields: {},
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

const mockMetrics = {
  total_leads: 2,
  new_today: 1,
  conversion_rate: 10.5,
  average_score: 67.5,
};

const mockAnalytics = {
  leads_by_status: {
    new: 1,
    contacted: 1,
    qualified: 0,
    converted: 0,
    lost: 0,
  },
  leads_by_source: {
    website: 1,
    social: 1,
    email: 0,
    referral: 0,
  },
};

const defaultMockReturn = {
  leads: mockLeads,
  metrics: mockMetrics,
  analytics: mockAnalytics,
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_items: 2,
    items_per_page: 10,
  },
  filters: {},
  isEmpty: false,
  hasNextPage: false,
  hasPrevPage: false,
  createLead: jest.fn(),
  updateLead: jest.fn(),
  deleteLead: jest.fn(),
  getLead: jest.fn(),
  fetchLeads: jest.fn(),
  refreshLeads: jest.fn(),
  exportLeads: jest.fn(),
  importLeads: jest.fn(),
  updateLeadScore: jest.fn(),
  updateLeadStatus: jest.fn(),
  recordActivity: jest.fn(),
  applyFilters: jest.fn(),
  clearFilters: jest.fn(),
  searchLeads: jest.fn(),
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  fetchAnalytics: jest.fn(),
  fetchMetrics: jest.fn(),
  setCurrentLead: jest.fn(),
};

describe('ModernLeadsIndex Component', () => {
  beforeEach(() => {
    mockUseLeads.mockReturnValue(defaultMockReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with leads', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    expect(screen.getByText('Leads CRM')).toBeInTheDocument();
    expect(screen.getByText('Gerencie seus leads e acompanhe conversões')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display metrics cards', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Novos Hoje')).toBeInTheDocument();
    expect(screen.getByText('Taxa Conversão')).toBeInTheDocument();
    expect(screen.getByText('10.5%')).toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar leads...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(defaultMockReturn.searchLeads).toHaveBeenCalledWith('John');
    });
  });

  it('should handle view mode changes', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const listButton = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listButton);

    const analyticsButton = screen.getByRole('button', { name: /analytics/i });
    fireEvent.click(analyticsButton);

    expect(screen.getByTestId('lead-analytics')).toBeInTheDocument();
  });

  it('should handle create lead button click', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const createButton = screen.getByRole('button', { name: /novo lead/i });
    fireEvent.click(createButton);

    expect(screen.getByText('Criar Novo Lead')).toBeInTheDocument();
  });

  it('should handle export functionality', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const exportButton = screen.getByRole('button', { name: /exportar/i });
    fireEvent.click(exportButton);

    expect(defaultMockReturn.exportLeads).toHaveBeenCalledWith({ format: 'csv' });
  });

  it('should handle refresh functionality', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const refreshButton = screen.getByRole('button', { name: /atualizar/i });
    fireEvent.click(refreshButton);

    expect(defaultMockReturn.refreshLeads).toHaveBeenCalled();
  });

  it('should display loading state', () => {
    mockUseLeads.mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    });

    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    expect(screen.getByText('Carregando leads...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    mockUseLeads.mockReturnValue({
      ...defaultMockReturn,
      error: 'Test error message',
    });

    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should display empty state', () => {
    mockUseLeads.mockReturnValue({
      ...defaultMockReturn,
      leads: [],
      isEmpty: true,
    });

    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    expect(screen.getByText('Nenhum lead encontrado')).toBeInTheDocument();
    expect(screen.getByText('Criar Primeiro Lead')).toBeInTheDocument();
  });

  it('should handle filters toggle', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const filtersButton = screen.getByRole('button', { name: /filtros/i });
    fireEvent.click(filtersButton);

    expect(screen.getByTestId('lead-filters')).toBeInTheDocument();
  });

  it('should handle lead selection', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const leadCards = screen.getAllByTestId(/lead-card-/);
    expect(leadCards).toHaveLength(2);
  });

  it('should handle lead actions', () => {
    render(
      <BrowserRouter>
        <ModernLeadsIndex />
      </BrowserRouter>
    );

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    expect(defaultMockReturn.setCurrentLead).toHaveBeenCalled();
  });
});
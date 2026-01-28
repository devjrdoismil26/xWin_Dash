// ========================================
// TESTES UNITÁRIOS - HOOK useLeads
// ========================================
import { renderHook, act } from '@testing-library/react';
import { useLeads } from '../hooks/useLeads';
import { Lead, LeadFormData } from '../types';

// Mock dos serviços
jest.mock('../services/leadsService', () => ({
  fetchLeads: jest.fn(),
  createLead: jest.fn(),
  updateLead: jest.fn(),
  deleteLead: jest.fn(),
  fetchLeadMetrics: jest.fn(),
  fetchLeadAnalytics: jest.fn(),
}));

// Mock do store
jest.mock('../hooks/useLeadsStore', () => ({
  useLeadsStore: jest.fn(() => ({
    leads: [],
    metrics: null,
    analytics: null,
    loading: false,
    error: null,
    pagination: null,
    filters: {},
    setLeads: jest.fn(),
    setMetrics: jest.fn(),
    setAnalytics: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setPagination: jest.fn(),
    setFilters: jest.fn(),
  })),
}));

describe('useLeads Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLeads());

    expect(result.current.leads).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isEmpty).toBe(true);
  });

  it('should handle lead creation', async () => {
    const mockLead: Lead = {
      id: 1,
      name: 'Test Lead',
      email: 'test@example.com',
      status: 'new',
      score: 50,
      origin: 'website',
      project_id: 1,
      tags: [],
      custom_fields: {},
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const { result } = renderHook(() => useLeads());

    await act(async () => {
      const newLead = await result.current.createLead({
        name: 'Test Lead',
        email: 'test@example.com',
      });
      expect(newLead).toBeDefined();
    });
  });

  it('should handle lead update', async () => {
    const { result } = renderHook(() => useLeads());

    await act(async () => {
      const updatedLead = await result.current.updateLead(1, {
        name: 'Updated Lead',
      });
      expect(updatedLead).toBeDefined();
    });
  });

  it('should handle lead deletion', async () => {
    const { result } = renderHook(() => useLeads());

    await act(async () => {
      const success = await result.current.deleteLead(1);
      expect(success).toBe(true);
    });
  });

  it('should handle search functionality', async () => {
    const { result } = renderHook(() => useLeads());

    await act(async () => {
      await result.current.searchLeads('test search');
      expect(result.current.filters.search).toBe('test search');
    });
  });

  it('should handle filter application', async () => {
    const { result } = renderHook(() => useLeads());

    const filters = {
      status: ['new', 'contacted'],
      origin: ['website'],
    };

    await act(async () => {
      await result.current.applyFilters(filters);
      expect(result.current.filters).toEqual(expect.objectContaining(filters));
    });
  });

  it('should handle pagination', async () => {
    const { result } = renderHook(() => useLeads());

    await act(async () => {
      await result.current.goToPage(2);
      expect(result.current.pagination?.current_page).toBe(2);
    });
  });

  it('should handle metrics fetching', async () => {
    const { result } = renderHook(() => useLeads());

    await act(async () => {
      await result.current.fetchMetrics();
      expect(result.current.metrics).toBeDefined();
    });
  });

  it('should handle analytics fetching', async () => {
    const { result } = renderHook(() => useLeads());

    await act(async () => {
      await result.current.fetchAnalytics();
      expect(result.current.analytics).toBeDefined();
    });
  });

  it('should handle error states', async () => {
    const { result } = renderHook(() => useLeads());

    // Simular erro
    await act(async () => {
      result.current.setError('Test error');
      expect(result.current.error).toBe('Test error');
    });
  });

  it('should handle loading states', async () => {
    const { result } = renderHook(() => useLeads());

    await act(async () => {
      result.current.setLoading(true);
      expect(result.current.loading).toBe(true);
    });
  });
});
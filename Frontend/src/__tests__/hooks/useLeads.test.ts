import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLeads } from '@/hooks/useLeads';
import { leadsAPI } from '@/api/leads';

vi.mock('@/api/leads');

describe('useLeads Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch leads on mount', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1', email: 'lead1@test.com' },
      { id: '2', name: 'Lead 2', email: 'lead2@test.com' },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useLeads());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    expect(result.current.leads).toEqual(mockLeads);

    expect(result.current.error).toBeNull();

  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch leads';
    vi.mocked(leadsAPI.getLeads).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    expect(result.current.error).toBe(errorMessage);

    expect(result.current.leads).toEqual([]);

  });

  it('should create a new lead', async () => {
    const newLead = {
      name: 'New Lead',
      email: 'new@test.com',
      project_id: 'project-1',};

    const createdLead = { id: '3', ...newLead, status: 'new'};

    vi.mocked(leadsAPI.createLead).mockResolvedValue(createdLead);

    vi.mocked(leadsAPI.getLeads).mockResolvedValue([createdLead]);

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    await result.current.createLead(newLead);

    await waitFor(() => {
      expect(result.current.leads).toContainEqual(createdLead);

    });

  });

  it('should update a lead', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1', status: 'new' },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    const updatedLead = { id: '1', name: 'Lead 1', status: 'qualified'};

    vi.mocked(leadsAPI.updateLead).mockResolvedValue(updatedLead);

    await result.current.updateLead('1', { status: 'qualified' });

    await waitFor(() => {
      expect(result.current.leads[0].status).toBe('qualified');

    });

  });

  it('should delete a lead', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1' },
      { id: '2', name: 'Lead 2' },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    vi.mocked(leadsAPI.deleteLead).mockResolvedValue();

    await result.current.deleteLead('1');

    await waitFor(() => {
      expect(result.current.leads).toHaveLength(1);

      expect(result.current.leads[0].id).toBe('2');

    });

  });

  it('should filter leads by status', async () => {
    const mockLeads = [
      { id: '1', name: 'Lead 1', status: 'new' },
      { id: '2', name: 'Lead 2', status: 'qualified' },
    ];

    vi.mocked(leadsAPI.getLeads).mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useLeads({ status: 'qualified' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    expect(leadsAPI.getLeads).toHaveBeenCalledWith({ status: 'qualified' });

  });

});

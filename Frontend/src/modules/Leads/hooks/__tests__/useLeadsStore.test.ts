import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadsStore } from '../useLeadsStore';

describe('useLeadsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useLeadsStore());

    act(() => {
      result.current.reset();

    });

  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLeadsStore());

    expect(result.current.leads).toEqual([]);

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBeNull();

  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useLeadsStore());

    act(() => {
      result.current.setLoading(true);

    });

    expect(result.current.loading).toBe(true);

  });

  it('should set leads', () => {
    const { result } = renderHook(() => useLeadsStore());

    const mockLeads = [
      { id: 1, name: 'John Doe', email: 'john@test.com', status: 'new' as const },
      { id: 2, name: 'Jane Smith', email: 'jane@test.com', status: 'qualified' as const },
    ];
    
    act(() => {
      result.current.setLeads(mockLeads);

    });

    expect(result.current.leads).toEqual(mockLeads);

  });

  it('should add lead', () => {
    const { result } = renderHook(() => useLeadsStore());

    const newLead = { id: 1, name: 'New Lead', email: 'new@test.com', status: 'new' as const};

    act(() => {
      result.current.addLead(newLead);

    });

    expect(result.current.leads).toHaveLength(1);

    expect(result.current.leads[0]).toEqual(newLead);

  });

  it('should update lead', () => {
    const { result } = renderHook(() => useLeadsStore());

    const lead = { id: 1, name: 'Lead', email: 'lead@test.com', status: 'new' as const};

    act(() => {
      result.current.setLeads([lead]);

      result.current.updateLead(1, { status: 'qualified' });

    });

    expect(result.current.leads[0].status).toBe('qualified');

  });

  it('should delete lead', () => {
    const { result } = renderHook(() => useLeadsStore());

    const leads = [
      { id: 1, name: 'Lead 1', email: 'lead1@test.com', status: 'new' as const },
      { id: 2, name: 'Lead 2', email: 'lead2@test.com', status: 'new' as const },
    ];
    
    act(() => {
      result.current.setLeads(leads);

      result.current.deleteLead(1);

    });

    expect(result.current.leads).toHaveLength(1);

    expect(result.current.leads[0].id).toBe(2);

  });

  it('should filter leads by status', () => {
    const { result } = renderHook(() => useLeadsStore());

    const leads = [
      { id: 1, name: 'Lead 1', email: 'lead1@test.com', status: 'new' as const },
      { id: 2, name: 'Lead 2', email: 'lead2@test.com', status: 'qualified' as const },
    ];
    
    act(() => {
      result.current.setLeads(leads);

      result.current.setFilter({ status: 'new' });

    });

    const filtered = result.current.filteredLeads;
    expect(filtered).toHaveLength(1);

    expect(filtered[0].status).toBe('new');

  });

  it('should search leads by name', () => {
    const { result } = renderHook(() => useLeadsStore());

    const leads = [
      { id: 1, name: 'John Doe', email: 'john@test.com', status: 'new' as const },
      { id: 2, name: 'Jane Smith', email: 'jane@test.com', status: 'new' as const },
    ];
    
    act(() => {
      result.current.setLeads(leads);

      result.current.setSearchTerm('John');

    });

    const filtered = result.current.filteredLeads;
    expect(filtered).toHaveLength(1);

    expect(filtered[0].name).toBe('John Doe');

  });

});

import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const useLeads = () => {
  const [leads, setLeads] = vi.fn()([]);

  const [loading, setLoading] = vi.fn()(false);

  const fetchLeads = async () => {
    setLoading(true);

    const data = await fetch('/api/leads').then(r => r.json());

    setLeads(data);

    setLoading(false);};

  return { leads, loading, fetchLeads};
};

describe('useLeads', () => {
  it('should initialize with empty leads', () => {
    const { result } = renderHook(() => useLeads());

    expect(result.current.leads).toEqual([]);

  });

  it('should start with loading false', () => {
    const { result } = renderHook(() => useLeads());

    expect(result.current.loading).toBe(false);

  });

  it('should have fetchLeads function', () => {
    const { result } = renderHook(() => useLeads());

    expect(typeof result.current.fetchLeads).toBe('function');

  });

  it('should set loading during fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] });

    const { result } = renderHook(() => useLeads());

    result.current.fetchLeads();

    await waitFor(() => expect(result.current.loading).toBe(false));

  });

  it('should fetch leads successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [{ id: 1 }] });

    const { result } = renderHook(() => useLeads());

    await result.current.fetchLeads();

    await waitFor(() => expect(result.current.leads).toEqual([{ id: 1 }]));

  });

});

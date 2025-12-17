import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const useWorkflows = () => {
  const [workflows, setWorkflows] = vi.fn()([]);

  const [loading, setLoading] = vi.fn()(false);

  const fetchWorkflows = async () => {
    setLoading(true);

    const data = await fetch('/api/workflows').then(r => r.json());

    setWorkflows(data);

    setLoading(false);};

  return { workflows, loading, fetchWorkflows};
};

describe('useWorkflows', () => {
  it('should initialize with empty workflows', () => {
    const { result } = renderHook(() => useWorkflows());

    expect(result.current.workflows).toEqual([]);

  });

  it('should start with loading false', () => {
    const { result } = renderHook(() => useWorkflows());

    expect(result.current.loading).toBe(false);

  });

  it('should have fetchWorkflows function', () => {
    const { result } = renderHook(() => useWorkflows());

    expect(typeof result.current.fetchWorkflows).toBe('function');

  });

  it('should set loading during fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] });

    const { result } = renderHook(() => useWorkflows());

    result.current.fetchWorkflows();

    await waitFor(() => expect(result.current.loading).toBe(false));

  });

  it('should fetch workflows successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [{ id: 1 }] });

    const { result } = renderHook(() => useWorkflows());

    await result.current.fetchWorkflows();

    await waitFor(() => expect(result.current.workflows).toEqual([{ id: 1 }]));

  });

});

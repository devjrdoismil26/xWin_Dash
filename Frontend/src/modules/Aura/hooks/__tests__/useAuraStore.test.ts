import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuraStore } from '../stores/useAuraStore';

describe('useAuraStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuraStore());

    act(() => result.current.reset());

  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuraStore());

    expect(result.current.connections).toEqual([]);

    expect(result.current.loading).toBe(false);

  });

  it('should set connections', () => {
    const { result } = renderHook(() => useAuraStore());

    const connections = [{ id: 1, name: 'WhatsApp', status: 'connected' }];
    act(() => result.current.setConnections(connections));

    expect(result.current.connections).toEqual(connections);

  });

  it('should add connection', () => {
    const { result } = renderHook(() => useAuraStore());

    const connection = { id: 1, name: 'New Connection', status: 'pending'};

    act(() => result.current.addConnection(connection));

    expect(result.current.connections).toHaveLength(1);

  });

  it('should update connection', () => {
    const { result } = renderHook(() => useAuraStore());

    act(() => {
      result.current.setConnections([{ id: 1, status: 'pending' }]);

      result.current.updateConnection(1, { status: 'connected' });

    });

    expect(result.current.connections[0].status).toBe('connected');

  });

  it('should delete connection', () => {
    const { result } = renderHook(() => useAuraStore());

    act(() => {
      result.current.setConnections([{ id: 1 }, { id: 2 }]);

      result.current.deleteConnection(1);

    });

    expect(result.current.connections).toHaveLength(1);

  });

  it('should filter by status', () => {
    const { result } = renderHook(() => useAuraStore());

    act(() => {
      result.current.setConnections([
        { id: 1, status: 'connected' },
        { id: 2, status: 'disconnected' }
      ]);

      result.current.setFilter({ status: 'connected' });

    });

    expect(result.current.filteredConnections).toHaveLength(1);

  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuraStore());

    act(() => result.current.setLoading(true));

    expect(result.current.loading).toBe(true);

  });

  it('should set error', () => {
    const { result } = renderHook(() => useAuraStore());

    act(() => result.current.setError('Error'));

    expect(result.current.error).toBe('Error');

  });

});

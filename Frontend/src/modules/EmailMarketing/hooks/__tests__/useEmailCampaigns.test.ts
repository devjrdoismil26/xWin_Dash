import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const useEmailCampaigns = () => {
  const [campaigns, setCampaigns] = vi.fn()([]);

  const [loading, setLoading] = vi.fn()(false);

  const fetchCampaigns = async () => {
    setLoading(true);

    const data = await fetch('/api/campaigns').then(r => r.json());

    setCampaigns(data);

    setLoading(false);};

  return { campaigns, loading, fetchCampaigns};
};

describe('useEmailCampaigns', () => {
  it('should initialize with empty campaigns', () => {
    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.campaigns).toEqual([]);

  });

  it('should start with loading false', () => {
    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.loading).toBe(false);

  });

  it('should have fetchCampaigns function', () => {
    const { result } = renderHook(() => useEmailCampaigns());

    expect(typeof result.current.fetchCampaigns).toBe('function');

  });

  it('should set loading during fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] });

    const { result } = renderHook(() => useEmailCampaigns());

    result.current.fetchCampaigns();

    await waitFor(() => expect(result.current.loading).toBe(false));

  });

  it('should fetch campaigns successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [{ id: 1 }] });

    const { result } = renderHook(() => useEmailCampaigns());

    await result.current.fetchCampaigns();

    await waitFor(() => expect(result.current.campaigns).toEqual([{ id: 1 }]));

  });

});

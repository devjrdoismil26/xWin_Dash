import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { emailMarketingAPI } from '@/api/email-marketing';

vi.mock('@/api/email-marketing');

describe('useCampaigns Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch campaigns on mount', async () => {
    const mockCampaigns = [
      { id: '1', name: 'Campaign 1', status: 'sent', sent_count: 1000 },
      { id: '2', name: 'Campaign 2', status: 'draft', sent_count: 0 },
    ];

    vi.mocked(emailMarketingAPI.getCampaigns).mockResolvedValue(mockCampaigns);

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.campaigns).toEqual(mockCampaigns);

    });

  });

  it('should send campaign', async () => {
    vi.mocked(emailMarketingAPI.getCampaigns).mockResolvedValue([]);

    vi.mocked(emailMarketingAPI.sendCampaign).mockResolvedValue({
      id: '1',
      status: 'sending',
    });

    const { result } = renderHook(() => useCampaigns());

    await act(async () => {
      await result.current.sendCampaign('1');

    });

    expect(emailMarketingAPI.sendCampaign).toHaveBeenCalledWith('1');

  });

  it('should fetch campaign metrics', async () => {
    const mockMetrics = {
      sent_count: 1000,
      opened_count: 350,
      clicked_count: 120,
      open_rate: 35.0,
      click_rate: 12.0,};

    vi.mocked(emailMarketingAPI.getCampaigns).mockResolvedValue([]);

    vi.mocked(emailMarketingAPI.getMetrics).mockResolvedValue(mockMetrics);

    const { result } = renderHook(() => useCampaigns());

    await act(async () => {
      await result.current.fetchMetrics('1');

    });

    await waitFor(() => {
      expect(result.current.metrics['1']).toEqual(mockMetrics);

    });

  });

  it('should calculate total sent', async () => {
    const mockCampaigns = [
      { id: '1', sent_count: 1000 },
      { id: '2', sent_count: 500 },
    ];

    vi.mocked(emailMarketingAPI.getCampaigns).mockResolvedValue(mockCampaigns);

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.totalSent).toBe(1500);

    });

  });

});

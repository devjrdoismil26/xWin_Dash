import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adsToolAPI } from '@/services/api/adstool';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } ));

describe('ADSToolAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch campaigns', async () => {
    const mockCampaigns = [{ id: '1', name: 'Campaign 1' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockCampaigns });

    const result = await adsToolAPI.getCampaigns();

    expect(result).toEqual(mockCampaigns);

    expect(api.get).toHaveBeenCalledWith('/ads/campaigns');

  });

  it('should create campaign', async () => {
    const newCampaign = { name: 'New Campaign', budget: 1000};

    vi.mocked(api.post).mockResolvedValue({ data: { id: '1', ...newCampaign } );

    const result = await adsToolAPI.createCampaign(newCampaign);

    expect(result.name).toBe('New Campaign');

    expect(api.post).toHaveBeenCalledWith('/ads/campaigns', newCampaign);

  });

  it('should get campaign metrics', async () => {
    const mockMetrics = { impressions: 1000, clicks: 50, ctr: 5};

    vi.mocked(api.get).mockResolvedValue({ data: mockMetrics });

    const result = await adsToolAPI.getCampaignMetrics('1');

    expect(result).toEqual(mockMetrics);

  });

});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { emailMarketingAPI } from '@/api/email-marketing';

vi.mock('@/api/client');

describe('Email Marketing API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe('getCampaigns', () => {
    it('should fetch campaigns', async () => {
      const mockCampaigns = [
        { id: '1', name: 'Campaign 1', status: 'sent', sent_count: 1000 },
        { id: '2', name: 'Campaign 2', status: 'scheduled', sent_count: 0 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockCampaigns });

      const result = await emailMarketingAPI.getCampaigns({ status: 'sent' });

      expect(apiClient.get).toHaveBeenCalledWith('/email-campaigns', {
        params: { status: 'sent' },
      });

      expect(result).toEqual(mockCampaigns);

    });

  });

  describe('createCampaign', () => {
    it('should create a new campaign', async () => {
      const newCampaign = {
        name: 'New Campaign',
        subject: 'Special Offer',
        from_name: 'Company',
        from_email: 'noreply@company.com',
        content: '<html>...</html>',
        project_id: 'project-1',};

      const mockResponse = { id: '3', ...newCampaign, status: 'draft'};

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await emailMarketingAPI.createCampaign(newCampaign);

      expect(apiClient.post).toHaveBeenCalledWith('/email-campaigns', newCampaign);

      expect(result).toEqual(mockResponse);

    });

  });

  describe('sendCampaign', () => {
    it('should send a campaign', async () => {
      const mockResponse = { id: '1', status: 'sending'};

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await emailMarketingAPI.sendCampaign('1');

      expect(apiClient.post).toHaveBeenCalledWith('/email-campaigns/1/send');

      expect(result).toEqual(mockResponse);

    });

  });

  describe('getMetrics', () => {
    it('should fetch campaign metrics', async () => {
      const mockMetrics = {
        sent_count: 1000,
        opened_count: 350,
        clicked_count: 120,
        open_rate: 35.0,
        click_rate: 12.0,};

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockMetrics });

      const result = await emailMarketingAPI.getMetrics('1');

      expect(apiClient.get).toHaveBeenCalledWith('/email-campaigns/1/metrics');

      expect(result).toEqual(mockMetrics);

    });

  });

});

/**
 * Testes unitários do módulo ADStool
 * Testa hooks, services e funções utilitárias
 */
import { renderHook, act } from '@testing-library/react';
import { useADStool } from '../hooks/useADStool';
import { 
  adsAccountService,
  adsCampaignService,
  adsCreativeService,
  adsAnalyticsService,
  adsTemplateService
} from '../services';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateCTR,
  calculateCPC,
  calculateROI
} from '../utils';

// Mock dos serviços
jest.mock('../services/adsAccountService');
jest.mock('../services/adsCampaignService');
jest.mock('../services/adsCreativeService');
jest.mock('../services/adsAnalyticsService');
jest.mock('../services/adsTemplateService');

describe('ADStool Module', () => {
  describe('useADStool Hook', () => {
    it('should initialize with empty data', () => {
      const { result } = renderHook(() => useADStool());
      
      expect(result.current.campaigns).toEqual([]);
      expect(result.current.accounts).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should fetch campaigns successfully', async () => {
      const mockCampaigns = [
        {
          id: '1',
          name: 'Test Campaign',
          status: 'ACTIVE',
          platform: 'Google Ads',
          daily_budget: 100
        }
      ];

      (adsCampaignService.getCampaigns as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCampaigns
      });

      const { result } = renderHook(() => useADStool());

      await act(async () => {
        await result.current.fetchCampaigns();
      });

      expect(result.current.campaigns).toEqual(mockCampaigns);
    });

    it('should fetch accounts successfully', async () => {
      const mockAccounts = [
        {
          id: '1',
          name: 'Test Account',
          platform: 'Google Ads',
          status: 'ACTIVE'
        }
      ];

      (adsAccountService.getAccounts as jest.Mock).mockResolvedValue({
        success: true,
        data: mockAccounts
      });

      const { result } = renderHook(() => useADStool());

      await act(async () => {
        await result.current.fetchAccounts();
      });

      expect(result.current.accounts).toEqual(mockAccounts);
    });

    it('should calculate metrics correctly', () => {
      const { result } = renderHook(() => useADStool());

      // Mock campaigns with metrics
      act(() => {
        result.current.campaigns = [
          {
            id: '1',
            name: 'Campaign 1',
            total_spend: 1000,
            impressions: 10000,
            clicks: 500,
            conversions: 25
          },
          {
            id: '2',
            name: 'Campaign 2',
            total_spend: 2000,
            impressions: 20000,
            clicks: 1000,
            conversions: 50
          }
        ];
      });

      expect(result.current.getTotalSpend()).toBe(3000);
      expect(result.current.getTotalImpressions()).toBe(30000);
      expect(result.current.getTotalClicks()).toBe(1500);
      expect(result.current.getTotalConversions()).toBe(75);
    });

    it('should filter campaigns by status', () => {
      const { result } = renderHook(() => useADStool());

      act(() => {
        result.current.campaigns = [
          { id: '1', name: 'Active Campaign', status: 'ACTIVE' },
          { id: '2', name: 'Paused Campaign', status: 'PAUSED' },
          { id: '3', name: 'Another Active', status: 'ACTIVE' }
        ];
      });

      const activeCampaigns = result.current.getActiveCampaigns();
      const pausedCampaigns = result.current.getPausedCampaigns();

      expect(activeCampaigns).toHaveLength(2);
      expect(pausedCampaigns).toHaveLength(1);
    });
  });

  describe('Utility Functions', () => {
    describe('formatCurrency', () => {
      it('should format currency correctly', () => {
        expect(formatCurrency(1000)).toBe('R$ 1.000,00');
        expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
        expect(formatCurrency(0)).toBe('R$ 0,00');
      });
    });

    describe('formatNumber', () => {
      it('should format numbers correctly', () => {
        expect(formatNumber(1000)).toBe('1.000');
        expect(formatNumber(1234567)).toBe('1.234.567');
        expect(formatNumber(0)).toBe('0');
      });
    });

    describe('formatPercentage', () => {
      it('should format percentages correctly', () => {
        expect(formatPercentage(0.05)).toBe('5,00%');
        expect(formatPercentage(0.1234)).toBe('12,34%');
        expect(formatPercentage(0)).toBe('0,00%');
      });
    });

    describe('calculateCTR', () => {
      it('should calculate CTR correctly', () => {
        expect(calculateCTR(100, 1000)).toBe(10);
        expect(calculateCTR(50, 2000)).toBe(2.5);
        expect(calculateCTR(0, 1000)).toBe(0);
      });
    });

    describe('calculateCPC', () => {
      it('should calculate CPC correctly', () => {
        expect(calculateCPC(100, 50)).toBe(2);
        expect(calculateCPC(200, 100)).toBe(2);
        expect(calculateCPC(0, 100)).toBe(0);
      });
    });

    describe('calculateROI', () => {
      it('should calculate ROI correctly', () => {
        expect(calculateROI(1000, 500)).toBe(100);
        expect(calculateROI(2000, 1000)).toBe(100);
        expect(calculateROI(500, 1000)).toBe(-50);
      });
    });
  });

  describe('Services', () => {
    describe('adsAccountService', () => {
      it('should get accounts', async () => {
        const mockResponse = {
          success: true,
          data: [{ id: '1', name: 'Test Account' }]
        };

        (adsAccountService.getAccounts as jest.Mock).mockResolvedValue(mockResponse);

        const result = await adsAccountService.getAccounts();
        expect(result).toEqual(mockResponse);
      });

      it('should create account', async () => {
        const mockAccount = {
          name: 'New Account',
          platform: 'Google Ads'
        };

        const mockResponse = {
          success: true,
          data: { id: '1', ...mockAccount }
        };

        (adsAccountService.createAccount as jest.Mock).mockResolvedValue(mockResponse);

        const result = await adsAccountService.createAccount(mockAccount);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('adsCampaignService', () => {
      it('should get campaigns', async () => {
        const mockResponse = {
          success: true,
          data: [{ id: '1', name: 'Test Campaign' }]
        };

        (adsCampaignService.getCampaigns as jest.Mock).mockResolvedValue(mockResponse);

        const result = await adsCampaignService.getCampaigns();
        expect(result).toEqual(mockResponse);
      });

      it('should create campaign', async () => {
        const mockCampaign = {
          name: 'New Campaign',
          platform: 'Google Ads',
          daily_budget: 100
        };

        const mockResponse = {
          success: true,
          data: { id: '1', ...mockCampaign }
        };

        (adsCampaignService.createCampaign as jest.Mock).mockResolvedValue(mockResponse);

        const result = await adsCampaignService.createCampaign(mockCampaign);
        expect(result).toEqual(mockResponse);
      });
    });
  });
});

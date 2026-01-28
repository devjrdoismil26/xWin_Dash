/**
 * Testes unitários do módulo AI
 * Testa hooks, services e funções utilitárias
 */
import { renderHook, act } from '@testing-library/react';
import { useAI } from '../hooks/useAI';
import { useAIGeneration } from '../hooks/useAIGeneration';
import { useAIProviders } from '../hooks/useAIProviders';
import { useAIHistory } from '../hooks/useAIHistory';
import { useAIAnalytics } from '../hooks/useAIAnalytics';
import { 
  aiService,
  aiProviderService,
  aiGenerationService,
  aiAnalyticsService
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
jest.mock('../services/aiService');
jest.mock('../services/aiProviderService');
jest.mock('../services/aiGenerationService');
jest.mock('../services/aiAnalyticsService');

describe('AI Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAI Hook', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAI());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentView).toBe('dashboard');
    });

    it('should provide access to all specialized hooks', () => {
      const { result } = renderHook(() => useAI());

      expect(result.current.generation).toBeDefined();
      expect(result.current.providers).toBeDefined();
      expect(result.current.history).toBeDefined();
      expect(result.current.analytics).toBeDefined();
    });

    it('should provide utility methods', () => {
      const { result } = renderHook(() => useAI());

      expect(typeof result.current.isServiceAvailable).toBe('function');
      expect(typeof result.current.getAvailableProviders).toBe('function');
      expect(typeof result.current.getBestProvider).toBe('function');
      expect(typeof result.current.getStats).toBe('function');
    });
  });

  describe('useAIGeneration Hook', () => {
    it('should initialize with empty generations', () => {
      const { result } = renderHook(() => useAIGeneration());

      expect(result.current.textGenerations).toEqual([]);
      expect(result.current.imageGenerations).toEqual([]);
      expect(result.current.videoGenerations).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should generate text successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          text: 'Generated text',
          provider: 'openai'
        }
      };

      (aiGenerationService.generateText as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAIGeneration());

      await act(async () => {
        const generation = await result.current.generateText('Test prompt');
        expect(generation).toBeDefined();
        expect(generation.type).toBe('text');
        expect(generation.result).toBe('Generated text');
      });

      expect(result.current.textGenerations).toHaveLength(1);
    });

    it('should handle generation errors', async () => {
      const mockError = new Error('Generation failed');
      (aiGenerationService.generateText as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAIGeneration());

      await act(async () => {
        try {
          await result.current.generateText('Test prompt');
        } catch (error) {
          expect(error).toBe(mockError);
        }
      });

      expect(result.current.error).toBe('Generation failed');
    });
  });

  describe('useAIProviders Hook', () => {
    it('should initialize with empty providers', () => {
      const { result } = renderHook(() => useAIProviders());

      expect(result.current.availableProviders).toEqual([]);
      expect(result.current.activeProviders).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should load providers successfully', async () => {
      const mockProviders = [
        { id: '1', name: 'OpenAI', status: 'active', type: 'text' },
        { id: '2', name: 'DALL-E', status: 'active', type: 'image' }
      ];

      (aiProviderService.getProviders as jest.Mock).mockResolvedValue({
        success: true,
        data: mockProviders
      });

      const { result } = renderHook(() => useAIProviders());

      await act(async () => {
        await result.current.loadProviders();
      });

      expect(result.current.availableProviders).toEqual(mockProviders);
      expect(result.current.activeProviders).toHaveLength(2);
    });

    it('should check provider status', async () => {
      const mockStatus = { status: 'active', lastCheck: '2024-01-01' };
      (aiProviderService.checkStatus as jest.Mock).mockResolvedValue({
        success: true,
        data: mockStatus
      });

      const { result } = renderHook(() => useAIProviders());

      await act(async () => {
        const status = await result.current.checkProviderStatus('openai');
        expect(status).toEqual(mockStatus);
      });
    });
  });

  describe('useAIHistory Hook', () => {
    it('should initialize with empty history', () => {
      const { result } = renderHook(() => useAIHistory());

      expect(result.current.chatHistory).toEqual([]);
      expect(result.current.analysisHistory).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should add chat message', () => {
      const { result } = renderHook(() => useAIHistory());

      const message = {
        id: '1',
        type: 'user',
        content: 'Hello',
        timestamp: new Date().toISOString()
      };

      act(() => {
        result.current.addChatMessage(message);
      });

      expect(result.current.chatHistory).toHaveLength(1);
      expect(result.current.chatHistory[0]).toEqual(message);
    });

    it('should clear chat history', () => {
      const { result } = renderHook(() => useAIHistory());

      // Add a message first
      act(() => {
        result.current.addChatMessage({
          id: '1',
          type: 'user',
          content: 'Hello',
          timestamp: new Date().toISOString()
        });
      });

      expect(result.current.chatHistory).toHaveLength(1);

      // Clear history
      act(() => {
        result.current.clearChatHistory();
      });

      expect(result.current.chatHistory).toHaveLength(0);
    });
  });

  describe('useAIAnalytics Hook', () => {
    it('should initialize with default analytics', () => {
      const { result } = renderHook(() => useAIAnalytics());

      expect(result.current.totalGenerations).toBe(0);
      expect(result.current.totalCost).toBe(0);
      expect(result.current.averageTime).toBe(0);
      expect(result.current.successRate).toBe(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should load analytics successfully', async () => {
      const mockAnalytics = {
        totalGenerations: 100,
        totalCost: 50.00,
        averageTime: 2.5,
        successRate: 95.5
      };

      (aiAnalyticsService.getAnalytics as jest.Mock).mockResolvedValue({
        success: true,
        data: mockAnalytics
      });

      const { result } = renderHook(() => useAIAnalytics());

      await act(async () => {
        await result.current.loadAnalytics();
      });

      expect(result.current.totalGenerations).toBe(100);
      expect(result.current.totalCost).toBe(50.00);
      expect(result.current.averageTime).toBe(2.5);
      expect(result.current.successRate).toBe(95.5);
    });

    it('should get real-time data', async () => {
      const mockRealTimeData = {
        generationsPerMinute: 5,
        activeUsers: 10,
        currentLoad: 75
      };

      (aiAnalyticsService.getRealTimeData as jest.Mock).mockResolvedValue({
        success: true,
        data: mockRealTimeData
      });

      const { result } = renderHook(() => useAIAnalytics());

      await act(async () => {
        const data = await result.current.getRealTimeData();
        expect(data).toEqual(mockRealTimeData);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('formatCurrency', () => {
      it('should format currency correctly', () => {
        expect(formatCurrency(100)).toBe('R$ 100,00');
        expect(formatCurrency(1000.50)).toBe('R$ 1.000,50');
        expect(formatCurrency(0)).toBe('R$ 0,00');
      });

      it('should handle invalid values', () => {
        expect(formatCurrency(NaN)).toBe('R$ 0,00');
        expect(formatCurrency(undefined as any)).toBe('R$ 0,00');
      });
    });

    describe('formatNumber', () => {
      it('should format numbers correctly', () => {
        expect(formatNumber(1000)).toBe('1.000');
        expect(formatNumber(1000000)).toBe('1.000.000');
        expect(formatNumber(0)).toBe('0');
      });
    });

    describe('formatPercentage', () => {
      it('should format percentages correctly', () => {
        expect(formatPercentage(50)).toBe('50,00%');
        expect(formatPercentage(95.5)).toBe('95,50%');
        expect(formatPercentage(0)).toBe('0%');
      });

      it('should handle custom decimals', () => {
        expect(formatPercentage(50, 1)).toBe('50,0%');
        expect(formatPercentage(95.555, 3)).toBe('95,555%');
      });
    });

    describe('calculateCTR', () => {
      it('should calculate CTR correctly', () => {
        expect(calculateCTR(100, 1000)).toBe(10);
        expect(calculateCTR(50, 500)).toBe(10);
        expect(calculateCTR(0, 1000)).toBe(0);
      });

      it('should handle zero impressions', () => {
        expect(calculateCTR(100, 0)).toBe(0);
      });
    });

    describe('calculateCPC', () => {
      it('should calculate CPC correctly', () => {
        expect(calculateCPC(100, 50)).toBe(2);
        expect(calculateCPC(50, 25)).toBe(2);
        expect(calculateCPC(0, 100)).toBe(0);
      });

      it('should handle zero clicks', () => {
        expect(calculateCPC(100, 0)).toBe(0);
      });
    });

    describe('calculateROI', () => {
      it('should calculate ROI correctly', () => {
        expect(calculateROI(200, 100)).toBe(100);
        expect(calculateROI(150, 100)).toBe(50);
        expect(calculateROI(100, 100)).toBe(0);
      });

      it('should handle zero spend', () => {
        expect(calculateROI(100, 0)).toBe(0);
      });
    });
  });
});

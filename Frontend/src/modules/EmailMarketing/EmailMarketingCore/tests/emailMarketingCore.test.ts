/**
 * Testes unitários do módulo EmailMarketingCore
 * Testa hooks, services e funções utilitárias
 */
import { renderHook, act } from '@testing-library/react';
import { useEmailMarketingCore } from '../hooks/useEmailMarketingCore';
import { useEmailMarketingStore } from '../hooks/useEmailMarketingStore';
import { EmailMarketingCoreService } from '../services/emailMarketingCoreService';

// Mock dos serviços
jest.mock("../services/emailMarketingCoreService");

describe("EmailMarketingCore Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();

  });

  describe("useEmailMarketingCore Hook", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useEmailMarketingCore());

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

      expect(result.current.metrics).toBeNull();

      expect(result.current.stats).toBeNull();

      expect(result.current.dashboard).toBeNull();

    });

    it("should fetch metrics successfully", async () => {
      const mockMetrics = {
        total_campaigns: 10,
        total_templates: 5,
        total_segments: 3,
        total_subscribers: 1000,
        open_rate: 25.5,
        click_rate: 5.2,};

      (
        EmailMarketingCoreService.prototype.getMetrics as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockMetrics,
      });

      const { result } = renderHook(() => useEmailMarketingCore());

      await act(async () => {
        await result.current.fetchMetrics();

      });

      expect(result.current.metrics).toEqual(mockMetrics);

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

    });

    it("should handle metrics fetch error", async () => {
      const mockError = new Error("Failed to fetch metrics");

      (
        EmailMarketingCoreService.prototype.getMetrics as jest.Mock
      ).mockRejectedValue(mockError);

      const { result } = renderHook(() => useEmailMarketingCore());

      await act(async () => {
        await result.current.fetchMetrics();

      });

      expect(result.current.metrics).toBeNull();

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBe("Failed to fetch metrics");

    });

    it("should fetch stats successfully", async () => {
      const mockStats = {
        campaigns_sent_today: 5,
        campaigns_scheduled: 3,
        templates_used: 8,
        new_subscribers: 25,};

      (
        EmailMarketingCoreService.prototype.getStats as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockStats,
      });

      const { result } = renderHook(() => useEmailMarketingCore());

      await act(async () => {
        await result.current.fetchStats();

      });

      expect(result.current.stats).toEqual(mockStats);

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

    });

    it("should fetch dashboard data successfully", async () => {
      const mockDashboard = {
        recent_campaigns: [],
        recent_activities: [],
        performance_summary: {},};

      (
        EmailMarketingCoreService.prototype.getDashboard as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockDashboard,
      });

      const { result } = renderHook(() => useEmailMarketingCore());

      await act(async () => {
        await result.current.fetchDashboard();

      });

      expect(result.current.dashboard).toEqual(mockDashboard);

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

    });

    it("should refresh data successfully", async () => {
      const mockMetrics = { total_campaigns: 10};

      const mockStats = { campaigns_sent_today: 5};

      const mockDashboard = { recent_campaigns: []};

      (
        EmailMarketingCoreService.prototype.getMetrics as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockMetrics,
      });

      (
        EmailMarketingCoreService.prototype.getStats as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockStats,
      });

      (
        EmailMarketingCoreService.prototype.getDashboard as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockDashboard,
      });

      const { result } = renderHook(() => useEmailMarketingCore());

      await act(async () => {
        await result.current.refreshData();

      });

      expect(result.current.metrics).toEqual(mockMetrics);

      expect(result.current.stats).toEqual(mockStats);

      expect(result.current.dashboard).toEqual(mockDashboard);

      expect(result.current.loading).toBe(false);

    });

  });

  describe("useEmailMarketingStore Hook", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useEmailMarketingStore());

      expect(result.current.metrics).toBeNull();

      expect(result.current.stats).toBeNull();

      expect(result.current.dashboard).toBeNull();

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

      expect(result.current.currentView).toBe("dashboard");

      expect(result.current.realTimeEnabled).toBe(false);

    });

    it("should set current view", () => {
      const { result } = renderHook(() => useEmailMarketingStore());

      act(() => {
        result.current.setCurrentView("campaigns");

      });

      expect(result.current.currentView).toBe("campaigns");

    });

    it("should set real time enabled", () => {
      const { result } = renderHook(() => useEmailMarketingStore());

      act(() => {
        result.current.setRealTimeEnabled(true);

      });

      expect(result.current.realTimeEnabled).toBe(true);

    });

    it("should set and clear error", () => {
      const { result } = renderHook(() => useEmailMarketingStore());

      act(() => {
        result.current.setError("Test error");

      });

      expect(result.current.error).toBe("Test error");

      act(() => {
        result.current.clearError();

      });

      expect(result.current.error).toBeNull();

    });

    it("should update metrics", () => {
      const { result } = renderHook(() => useEmailMarketingStore());

      const mockMetrics = { total_campaigns: 10};

      act(() => {
        result.current.updateMetrics(mockMetrics);

      });

      expect(result.current.metrics).toEqual(mockMetrics);

    });

    it("should update stats", () => {
      const { result } = renderHook(() => useEmailMarketingStore());

      const mockStats = { campaigns_sent_today: 5};

      act(() => {
        result.current.updateStats(mockStats);

      });

      expect(result.current.stats).toEqual(mockStats);

    });

    it("should update dashboard", () => {
      const { result } = renderHook(() => useEmailMarketingStore());

      const mockDashboard = { recent_campaigns: []};

      act(() => {
        result.current.updateDashboard(mockDashboard);

      });

      expect(result.current.dashboard).toEqual(mockDashboard);

    });

  });

  describe("EmailMarketingCoreService", () => {
    let service: EmailMarketingCoreService;

    beforeEach(() => {
      service = new EmailMarketingCoreService();

    });

    it("should fetch metrics", async () => {
      const mockResponse = {
        success: true,
        data: { total_campaigns: 10 },};

      (service.getMetrics as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getMetrics();

      expect(result).toEqual(mockResponse);

      expect(service.getMetrics).toHaveBeenCalled();

    });

    it("should fetch stats", async () => {
      const mockResponse = {
        success: true,
        data: { campaigns_sent_today: 5 },};

      (service.getStats as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getStats();

      expect(result).toEqual(mockResponse);

      expect(service.getStats).toHaveBeenCalled();

    });

    it("should fetch dashboard", async () => {
      const mockResponse = {
        success: true,
        data: { recent_campaigns: [] },};

      (service.getDashboard as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getDashboard();

      expect(result).toEqual(mockResponse);

      expect(service.getDashboard).toHaveBeenCalled();

    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error");

      (service.getMetrics as jest.Mock).mockRejectedValue(mockError);

      await expect(service.getMetrics()).rejects.toThrow("API Error");

    });

  });

});

/**
 * Testes unitários do módulo EmailCampaigns
 * Testa hooks, services e funções utilitárias
 */
import { renderHook, act } from '@testing-library/react';
import { useEmailCampaigns } from '../hooks/useEmailCampaigns';
import { useCampaignBuilder } from '../hooks/useCampaignBuilder';
import { EmailCampaignsService } from '../services/emailCampaignsService';

// Mock dos serviços
jest.mock("../services/emailCampaignsService");

describe("EmailCampaigns Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();

  });

  describe("useEmailCampaigns Hook", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useEmailCampaigns());

      expect(result.current.campaigns).toEqual([]);

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

    });

    it("should fetch campaigns successfully", async () => {
      const mockCampaigns = [
        {
          id: "1",
          name: "Test Campaign",
          subject: "Test Subject",
          status: "draft",
          created_at: "2024-01-01T00:00:00Z",
        },
      ];

      (
        EmailCampaignsService.prototype.getCampaigns as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockCampaigns,
      });

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        await result.current.fetchCampaigns();

      });

      expect(result.current.campaigns).toEqual(mockCampaigns);

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

    });

    it("should handle fetch campaigns error", async () => {
      const mockError = new Error("Failed to fetch campaigns");

      (
        EmailCampaignsService.prototype.getCampaigns as jest.Mock
      ).mockRejectedValue(mockError);

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        await result.current.fetchCampaigns();

      });

      expect(result.current.campaigns).toEqual([]);

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBe("Failed to fetch campaigns");

    });

    it("should create campaign successfully", async () => {
      const mockCampaign = {
        id: "1",
        name: "New Campaign",
        subject: "New Subject",
        status: "draft",};

      (
        EmailCampaignsService.prototype.createCampaign as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockCampaign,
      });

      (
        EmailCampaignsService.prototype.getCampaigns as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: [mockCampaign],
      });

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        const response = await result.current.createCampaign({
          name: "New Campaign",
          subject: "New Subject",
        });

        expect(response.success).toBe(true);

      });

      expect(result.current.campaigns).toEqual([mockCampaign]);

    });

    it("should update campaign successfully", async () => {
      const mockCampaign = {
        id: "1",
        name: "Updated Campaign",
        subject: "Updated Subject",
        status: "draft",};

      (
        EmailCampaignsService.prototype.updateCampaign as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockCampaign,
      });

      (
        EmailCampaignsService.prototype.getCampaigns as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: [mockCampaign],
      });

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        const response = await result.current.updateCampaign("1", {
          name: "Updated Campaign",
        });

        expect(response.success).toBe(true);

      });

      expect(result.current.campaigns).toEqual([mockCampaign]);

    });

    it("should delete campaign successfully", async () => {
      (
        EmailCampaignsService.prototype.deleteCampaign as jest.Mock
      ).mockResolvedValue({
        success: true,
      });

      (
        EmailCampaignsService.prototype.getCampaigns as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: [],
      });

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        const response = await result.current.deleteCampaign("1");

        expect(response.success).toBe(true);

      });

      expect(result.current.campaigns).toEqual([]);

    });

    it("should send campaign successfully", async () => {
      const mockResponse = { success: true, message: "Campaign sent"};

      (
        EmailCampaignsService.prototype.sendCampaign as jest.Mock
      ).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        const response = await result.current.sendCampaign("1");

        expect(response).toEqual(mockResponse);

      });

    });

    it("should pause campaign successfully", async () => {
      const mockResponse = { success: true, message: "Campaign paused"};

      (
        EmailCampaignsService.prototype.pauseCampaign as jest.Mock
      ).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        const response = await result.current.pauseCampaign("1");

        expect(response).toEqual(mockResponse);

      });

    });

    it("should resume campaign successfully", async () => {
      const mockResponse = { success: true, message: "Campaign resumed"};

      (
        EmailCampaignsService.prototype.resumeCampaign as jest.Mock
      ).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        const response = await result.current.resumeCampaign("1");

        expect(response).toEqual(mockResponse);

      });

    });

    it("should get campaign analytics successfully", async () => {
      const mockAnalytics = {
        sent: 1000,
        delivered: 950,
        opened: 200,
        clicked: 50,
        bounced: 10,};

      (
        EmailCampaignsService.prototype.getCampaignAnalytics as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: mockAnalytics,
      });

      const { result } = renderHook(() => useEmailCampaigns());

      await act(async () => {
        const response = await result.current.getCampaignAnalytics("1");

        expect(response.data).toEqual(mockAnalytics);

      });

    });

  });

  describe("useCampaignBuilder Hook", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useCampaignBuilder());

      expect(result.current.campaign).toBeNull();

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

      expect(result.current.step).toBe(1);

    });

    it("should set campaign data", () => {
      const { result } = renderHook(() => useCampaignBuilder());

      const mockCampaign = {
        name: "Test Campaign",
        subject: "Test Subject",};

      act(() => {
        result.current.setCampaign(mockCampaign);

      });

      expect(result.current.campaign).toEqual(mockCampaign);

    });

    it("should update campaign data", () => {
      const { result } = renderHook(() => useCampaignBuilder());

      const initialCampaign = {
        name: "Test Campaign",
        subject: "Test Subject",};

      const updates = {
        name: "Updated Campaign",};

      act(() => {
        result.current.setCampaign(initialCampaign);

        result.current.updateCampaign(updates);

      });

      expect(result.current.campaign).toEqual({
        ...initialCampaign,
        ...updates,
      });

    });

    it("should navigate to next step", () => {
      const { result } = renderHook(() => useCampaignBuilder());

      act(() => {
        result.current.nextStep();

      });

      expect(result.current.step).toBe(2);

    });

    it("should navigate to previous step", () => {
      const { result } = renderHook(() => useCampaignBuilder());

      act(() => {
        result.current.nextStep();

        result.current.nextStep();

        result.current.previousStep();

      });

      expect(result.current.step).toBe(2);

    });

    it("should not go below step 1", () => {
      const { result } = renderHook(() => useCampaignBuilder());

      act(() => {
        result.current.previousStep();

      });

      expect(result.current.step).toBe(1);

    });

    it("should reset campaign builder", () => {
      const { result } = renderHook(() => useCampaignBuilder());

      act(() => {
        result.current.setCampaign({ name: "Test" });

        result.current.nextStep();

        result.current.reset();

      });

      expect(result.current.campaign).toBeNull();

      expect(result.current.step).toBe(1);

      expect(result.current.error).toBeNull();

    });

  });

  describe("EmailCampaignsService", () => {
    let service: EmailCampaignsService;

    beforeEach(() => {
      service = new EmailCampaignsService();

    });

    it("should create campaign", async () => {
      const mockCampaign = {
        name: "Test Campaign",
        subject: "Test Subject",};

      const mockResponse = {
        success: true,
        data: { id: "1", ...mockCampaign },};

      (service.createCampaign as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.createCampaign(mockCampaign);

      expect(result).toEqual(mockResponse);

      expect(service.createCampaign).toHaveBeenCalledWith(mockCampaign);

    });

    it("should update campaign", async () => {
      const mockUpdates = { name: "Updated Campaign"};

      const mockResponse = {
        success: true,
        data: { id: "1", ...mockUpdates },};

      (service.updateCampaign as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.updateCampaign("1", mockUpdates);

      expect(result).toEqual(mockResponse);

      expect(service.updateCampaign).toHaveBeenCalledWith("1", mockUpdates);

    });

    it("should delete campaign", async () => {
      const mockResponse = { success: true, message: "Campaign deleted"};

      (service.deleteCampaign as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.deleteCampaign("1");

      expect(result).toEqual(mockResponse);

      expect(service.deleteCampaign).toHaveBeenCalledWith("1");

    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error");

      (service.createCampaign as jest.Mock).mockRejectedValue(mockError);

      await expect(service.createCampaign({})).rejects.toThrow("API Error");

    });

  });

});

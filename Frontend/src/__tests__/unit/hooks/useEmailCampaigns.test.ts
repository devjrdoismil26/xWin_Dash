import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEmailCampaigns } from '@/modules/EmailMarketing/hooks/useEmailCampaigns';

// Mock the email marketing service
vi.mock("@/modules/EmailMarketing/services/emailMarketingService", () => ({
  emailMarketingService: {
    getCampaigns: vi.fn(),
    createCampaign: vi.fn(),
    updateCampaign: vi.fn(),
    deleteCampaign: vi.fn(),
    getCampaignStats: vi.fn(),
  },
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe("useEmailCampaigns", () => {
  const mockCampaigns = [
    {
      id: "1",
      name: "Welcome Campaign",
      subject: "Welcome to our platform",
      status: "active",
      recipients: 1000,
      openRate: 25.5,
      clickRate: 5.2,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Newsletter",
      subject: "Monthly Newsletter",
      status: "draft",
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: "2024-01-10T10:00:00Z",
    },
  ];

  const mockStats = {
    total_campaigns: 2,
    active_campaigns: 1,
    total_recipients: 1000,
    avg_open_rate: 25.5,
    avg_click_rate: 5.2,};

  beforeEach(() => {
    vi.clearAllMocks();

  });

  it("should return campaigns and loading state", () => {
    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: mockCampaigns,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.campaigns).toEqual(mockCampaigns);

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBeNull();

  });

  it("should return loading state when data is loading", () => {
    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.campaigns).toEqual([]);

    expect(result.current.loading).toBe(true);

    expect(result.current.error).toBeNull();

  });

  it("should return error state when query fails", () => {
    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch campaigns"),
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.campaigns).toEqual([]);

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toEqual(
      new Error("Failed to fetch campaigns"),);

  });

  it("should provide memoized campaigns stats", () => {
    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: mockCampaigns,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.campaignsStats).toEqual({
      total: 2,
      active: 1,
      draft: 1,
      totalRecipients: 1000,
      avgOpenRate: 25.5,
      avgClickRate: 5.2,
    });

  });

  it("should provide memoized hasActiveCampaigns", () => {
    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: mockCampaigns,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.hasActiveCampaigns).toBe(true);

  });

  it("should return false for hasActiveCampaigns when no active campaigns", () => {
    const inactiveCampaigns = mockCampaigns.map((campaign) => ({
      ...campaign,
      status: "draft",
    }));

    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: inactiveCampaigns,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.hasActiveCampaigns).toBe(false);

  });

  it("should provide create campaign mutation", () => {
    const { useMutation } = require("@tanstack/react-query");

    const mockMutate = vi.fn();

    useMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.createCampaign).toBeDefined();

    expect(typeof result.current.createCampaign).toBe("function");

  });

  it("should provide update campaign mutation", () => {
    const { useMutation } = require("@tanstack/react-query");

    const mockMutate = vi.fn();

    useMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.updateCampaign).toBeDefined();

    expect(typeof result.current.updateCampaign).toBe("function");

  });

  it("should provide delete campaign mutation", () => {
    const { useMutation } = require("@tanstack/react-query");

    const mockMutate = vi.fn();

    useMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.deleteCampaign).toBeDefined();

    expect(typeof result.current.deleteCampaign).toBe("function");

  });

  it("should handle empty campaigns array", () => {
    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEmailCampaigns());

    expect(result.current.campaigns).toEqual([]);

    expect(result.current.campaignsStats).toEqual({
      total: 0,
      active: 0,
      draft: 0,
      totalRecipients: 0,
      avgOpenRate: 0,
      avgClickRate: 0,
    });

    expect(result.current.hasActiveCampaigns).toBe(false);

  });

  it("should memoize campaigns stats to prevent unnecessary recalculations", () => {
    const { useQuery } = require("@tanstack/react-query");

    useQuery.mockReturnValue({
      data: mockCampaigns,
      isLoading: false,
      error: null,
    });

    const { result, rerender } = renderHook(() => useEmailCampaigns());

    const firstStats = result.current.campaignsStats;

    // Rerender with same data
    rerender();

    const secondStats = result.current.campaignsStats;

    expect(firstStats).toBe(secondStats); // Same reference due to memoization
  });

});

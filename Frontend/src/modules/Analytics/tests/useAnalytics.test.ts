// ========================================
// TESTES UNITÁRIOS - HOOK useAnalytics
// ========================================
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsFilters, AnalyticsReport } from '../types';

// Mock dos hooks especializados
jest.mock("../hooks/useAnalyticsDashboard", () => ({
  useAnalyticsDashboard: jest.fn(() => ({
    dashboardData: null,
    loading: false,
    error: null,
    loadDashboardData: jest.fn(),
    updateDashboard: jest.fn(),
    getMainMetrics: jest.fn(() => []),
    getInsightsByType: jest.fn(() => []),
    getChartsByType: jest.fn(() => []),
    getMetricsSummary: jest.fn(() => ({})),
    getComparisonData: jest.fn(() => ({})),
    hasData: jest.fn(() => false),
    getDashboardStatus: jest.fn(() => "idle"),
    exportDashboardData: jest.fn(() => Promise.resolve({})),
  })),
}));

jest.mock("../hooks/useAnalyticsFilters", () => ({
  useAnalyticsFilters: jest.fn(() => ({
    filters: { date_range: "30days", report_type: "overview" },
    loading: false,
    error: null,
    applyFilters: jest.fn(),
    clearFilters: jest.fn(),
  })),
}));

jest.mock("../hooks/useAnalyticsRealTime", () => ({
  useAnalyticsRealTime: jest.fn(() => ({
    realTimeEnabled: false,
    realTimeData: null,
    loading: false,
    error: null,
    enableRealTime: jest.fn(),
    disableRealTime: jest.fn(),
    toggleRealTime: jest.fn(),
  })),
}));

jest.mock("../hooks/useAnalyticsReports", () => ({
  useAnalyticsReports: jest.fn(() => ({
    reports: [],
    loading: false,
    error: null,
    loadReports: jest.fn(),
    getReportsByType: jest.fn(() => []),
    getPublicReports: jest.fn(() => []),
    getUserReports: jest.fn(() => []),
    getRecentReports: jest.fn(() => []),
    searchReports: jest.fn(() => []),
    getReportsStats: jest.fn(() => ({})),
  })),
}));

jest.mock("../hooks/useAnalyticsStore", () => ({
  useAnalyticsStore: jest.fn(() => ({
    currentView: "dashboard",
    setCurrentView: jest.fn(),
    setError: jest.fn(),
    setLoading: jest.fn(),
  })),
}));

describe("useAnalytics Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBeNull();

    expect(result.current.currentView).toBe("dashboard");

    expect(result.current.dashboard).toBeDefined();

    expect(result.current.filters).toBeDefined();

    expect(result.current.realTime).toBeDefined();

    expect(result.current.reports).toBeDefined();

  });

  it("should provide convenience functions", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(typeof result.current.getMainMetrics).toBe("function");

    expect(typeof result.current.getInsightsByType).toBe("function");

    expect(typeof result.current.getChartsByType).toBe("function");

    expect(typeof result.current.getReportsByType).toBe("function");

    expect(typeof result.current.getPublicReports).toBe("function");

    expect(typeof result.current.getUserReports).toBe("function");

    expect(typeof result.current.getRecentReports).toBe("function");

    expect(typeof result.current.searchReports).toBe("function");

    expect(typeof result.current.getReportsStats).toBe("function");

    expect(typeof result.current.getMetricsSummary).toBe("function");

    expect(typeof result.current.getComparisonData).toBe("function");

    expect(typeof result.current.hasData).toBe("function");

    expect(typeof result.current.getDashboardStatus).toBe("function");

    expect(typeof result.current.exportDashboardData).toBe("function");

  });

  it("should provide utility functions", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(typeof result.current.fetchDashboardData).toBe("function");

    expect(typeof result.current.fetchModuleStats).toBe("function");

    expect(typeof result.current.exportData).toBe("function");

    expect(typeof result.current.getMetricLabel).toBe("function");

    expect(typeof result.current.formatDate).toBe("function");

    expect(typeof result.current.getTimeRangeLabel).toBe("function");

    expect(typeof result.current.getDeviceIcon).toBe("function");

    expect(typeof result.current.getDeviceLabel).toBe("function");

    expect(typeof result.current.getTrafficSourceIcon).toBe("function");

    expect(typeof result.current.getTrafficSourceLabel).toBe("function");

  });

  it("should provide state control functions", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(typeof result.current.setCurrentView).toBe("function");

    expect(typeof result.current.setError).toBe("function");

    expect(typeof result.current.setLoading).toBe("function");

  });

  it("should handle metric label formatting", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.getMetricLabel("page_views")).toBe(
      "Visualizações de Página",);

    expect(result.current.getMetricLabel("unique_visitors")).toBe(
      "Visitantes Únicos",);

    expect(result.current.getMetricLabel("bounce_rate")).toBe(
      "Taxa de Rejeição",);

    expect(result.current.getMetricLabel("avg_session_duration")).toBe(
      "Duração Média da Sessão",);

    expect(result.current.getMetricLabel("conversion_rate")).toBe(
      "Taxa de Conversão",);

    expect(result.current.getMetricLabel("revenue")).toBe("Receita");

    expect(result.current.getMetricLabel("any_metric")).toBe(
      "any_metric",);

  });

  it("should handle date formatting", () => {
    const { result } = renderHook(() => useAnalytics());

    const testDate = "2024-01-15T10:30:00Z";
    const formatted = result.current.formatDate(testDate);

    expect(formatted).toBe("15/01/2024");

  });

  it("should handle time range label formatting", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.getTimeRangeLabel("today")).toBe("Hoje");

    expect(result.current.getTimeRangeLabel("yesterday")).toBe("Ontem");

    expect(result.current.getTimeRangeLabel("7days")).toBe("Últimos 7 dias");

    expect(result.current.getTimeRangeLabel("30days")).toBe("Últimos 30 dias");

    expect(result.current.getTimeRangeLabel("90days")).toBe("Últimos 90 dias");

    expect(result.current.getTimeRangeLabel("any_range")).toBe(
      "any_range",);

  });

  it("should handle device label formatting", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.getDeviceLabel("desktop")).toBe("Monitor");

    expect(result.current.getDeviceLabel("mobile")).toBe("Mobile");

    expect(result.current.getDeviceLabel("tablet")).toBe("Tablet");

    expect(result.current.getDeviceLabel("any_device")).toBe(
      "any_device",);

  });

  it("should handle traffic source label formatting", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.getTrafficSourceLabel("google")).toBe("Google");

    expect(result.current.getTrafficSourceLabel("facebook")).toBe("Facebook");

    expect(result.current.getTrafficSourceLabel("direct")).toBe("Direto");

    expect(result.current.getTrafficSourceLabel("referral")).toBe("Referência");

    expect(result.current.getTrafficSourceLabel("any_source")).toBe(
      "any_source",);

  });

  it("should handle export data", async () => {
    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await result.current.exportData("csv");

    });

    // Should not throw error
    expect(true).toBe(true);

  });

  it("should handle fetch dashboard data", async () => {
    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await result.current.fetchDashboardData();

    });

    // Should not throw error
    expect(true).toBe(true);

  });

  it("should handle fetch module stats", async () => {
    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await result.current.fetchModuleStats();

    });

    // Should not throw error
    expect(true).toBe(true);

  });

  it("should aggregate loading states from specialized hooks", () => {
    // Mock hooks to return loading states
    const mockUseAnalyticsDashboard =
      require("../hooks/useAnalyticsDashboard").useAnalyticsDashboard;
    const mockUseAnalyticsFilters =
      require("../hooks/useAnalyticsFilters").useAnalyticsFilters;
    const mockUseAnalyticsRealTime =
      require("../hooks/useAnalyticsRealTime").useAnalyticsRealTime;
    const mockUseAnalyticsReports =
      require("../hooks/useAnalyticsReports").useAnalyticsReports;

    mockUseAnalyticsDashboard.mockReturnValue({
      loading: true,
      error: null,
      dashboardData: null,
      loadDashboardData: jest.fn(),
      updateDashboard: jest.fn(),
      getMainMetrics: jest.fn(() => []),
      getInsightsByType: jest.fn(() => []),
      getChartsByType: jest.fn(() => []),
      getMetricsSummary: jest.fn(() => ({})),
      getComparisonData: jest.fn(() => ({})),
      hasData: jest.fn(() => false),
      getDashboardStatus: jest.fn(() => "loading"),
      exportDashboardData: jest.fn(() => Promise.resolve({})),
    });

    const { result } = renderHook(() => useAnalytics());

    expect(result.current.loading).toBe(true);

  });

  it("should aggregate error states from specialized hooks", () => {
    // Mock hooks to return error states
    const mockUseAnalyticsDashboard =
      require("../hooks/useAnalyticsDashboard").useAnalyticsDashboard;
    const mockUseAnalyticsFilters =
      require("../hooks/useAnalyticsFilters").useAnalyticsFilters;
    const mockUseAnalyticsRealTime =
      require("../hooks/useAnalyticsRealTime").useAnalyticsRealTime;
    const mockUseAnalyticsReports =
      require("../hooks/useAnalyticsReports").useAnalyticsReports;

    mockUseAnalyticsDashboard.mockReturnValue({
      loading: false,
      error: "Dashboard error",
      dashboardData: null,
      loadDashboardData: jest.fn(),
      updateDashboard: jest.fn(),
      getMainMetrics: jest.fn(() => []),
      getInsightsByType: jest.fn(() => []),
      getChartsByType: jest.fn(() => []),
      getMetricsSummary: jest.fn(() => ({})),
      getComparisonData: jest.fn(() => ({})),
      hasData: jest.fn(() => false),
      getDashboardStatus: jest.fn(() => "error"),
      exportDashboardData: jest.fn(() => Promise.resolve({})),
    });

    const { result } = renderHook(() => useAnalytics());

    expect(result.current.error).toBe("Dashboard error");

  });

  it("should provide access to specialized hooks", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.dashboard).toBeDefined();

    expect(result.current.filters).toBeDefined();

    expect(result.current.realTime).toBeDefined();

    expect(result.current.reports).toBeDefined();

  });

  it("should handle insight type filtering", () => {
    const { result } = renderHook(() => useAnalytics());

    const insights = result.current.getInsightsByType("trend");

    expect(Array.isArray(insights)).toBe(true);

  });

  it("should handle chart type filtering", () => {
    const { result } = renderHook(() => useAnalytics());

    const charts = result.current.getChartsByType("line");

    expect(Array.isArray(charts)).toBe(true);

  });

  it("should handle report type filtering", () => {
    const { result } = renderHook(() => useAnalytics());

    const reports = result.current.getReportsByType("overview");

    expect(Array.isArray(reports)).toBe(true);

  });

  it("should handle recent reports with limit", () => {
    const { result } = renderHook(() => useAnalytics());

    const recentReports = result.current.getRecentReports(5);

    expect(Array.isArray(recentReports)).toBe(true);

  });

  it("should handle report search", () => {
    const { result } = renderHook(() => useAnalytics());

    const searchResults = result.current.searchReports("test query");

    expect(Array.isArray(searchResults)).toBe(true);

  });

  it("should handle metrics summary", () => {
    const { result } = renderHook(() => useAnalytics());

    const summary = result.current.getMetricsSummary();

    expect(typeof summary).toBe("object");

  });

  it("should handle comparison data", () => {
    const { result } = renderHook(() => useAnalytics());

    const comparison = result.current.getComparisonData();

    expect(typeof comparison).toBe("object");

  });

  it("should handle data availability check", () => {
    const { result } = renderHook(() => useAnalytics());

    const hasData = result.current.hasData();

    expect(typeof hasData).toBe("boolean");

  });

  it("should handle dashboard status", () => {
    const { result } = renderHook(() => useAnalytics());

    const status = result.current.getDashboardStatus();

    expect(typeof status).toBe("string");

  });

});

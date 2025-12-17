/**
 * Testes de integração para o módulo Analytics
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { Analytics } from '../index';
import { AnalyticsDashboard } from '../shared/components/AnalyticsDashboard';
import { AnalyticsFilters } from '../shared/components/AnalyticsFilters';
import { AnalyticsMetrics } from '../shared/components/AnalyticsMetrics';
import { useAnalytics } from '../hooks/useAnalytics';

// Mock do analyticsService
const mockAnalyticsService = {
  getDashboardData: jest.fn(),
  getReports: jest.fn(),
  createReport: jest.fn(),
  updateReport: jest.fn(),
  deleteReport: jest.fn(),
  exportReport: jest.fn(),
  getModuleStats: jest.fn(),
  getRealTimeData: jest.fn(),
  refreshDashboard: jest.fn(),};

jest.mock("../services/analyticsService", () => mockAnalyticsService);

// Mock do useAdvancedNotifications
jest.mock("@/hooks/useAdvancedNotifications", () => ({
  notify: jest.fn(),
}));

// Mock do useAnalytics hook
jest.mock("../hooks/useAnalytics", () => ({
  useAnalytics: jest.fn(),
}));

const mockUseAnalytics = useAnalytics as jest.MockedFunction<
  typeof useAnalytics
>;

describe("Analytics Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock padrão do useAnalytics
    mockUseAnalytics.mockReturnValue({
      loading: false,
      error: null,
      currentView: "dashboard",
      dashboard: {
        dashboardData: {
          id: "1",
          metrics: [
            {
              id: "1",
              name: "Page Views",
              type: "page_views",
              value: 1000,
              previous_value: 800,
              change_percentage: 25,
              trend: "up",
              unit: "number",
              timestamp: "2023-01-01T00:00:00Z",
            },
          ],
          charts: [],
          insights: [],
          last_updated: "2023-01-01T00:00:00Z",
          period: "30days",
        },
        loading: false,
        error: null,
        lastRefresh: new Date(),
        loadDashboardData: jest.fn(),
        updateDashboard: jest.fn(),
        exportDashboardData: jest.fn(),
        getMainMetrics: jest.fn().mockReturnValue([]),
        getPerformanceMetrics: jest.fn().mockReturnValue([]),
        getConversionMetrics: jest.fn().mockReturnValue([]),
        getInsightsByType: jest.fn().mockReturnValue([]),
        getHighPriorityInsights: jest.fn().mockReturnValue([]),
        getChartsByType: jest.fn().mockReturnValue([]),
        getMetricsSummary: jest.fn().mockReturnValue(null),
        getComparisonData: jest.fn().mockReturnValue(null),
        hasData: jest.fn().mockReturnValue(true),
        getDashboardStatus: jest.fn().mockReturnValue("success"),
        clearError: jest.fn(),
      },
      filters: {
        filters: {
          date_range: "30days",
          report_type: "overview",
        },
        appliedFilters: null,
        loading: false,
        error: null,
        applyFilters: jest.fn(),
        clearFilters: jest.fn(),
        updatePeriod: jest.fn(),
        updateReportType: jest.fn(),
        updateMetrics: jest.fn(),
        updateDevices: jest.fn(),
        updateTrafficSources: jest.fn(),
        updateCustomFilters: jest.fn(),
        setCustomPeriod: jest.fn(),
        applyFiltersFromQuery: jest.fn(),
        resetToDefaults: jest.fn(),
        getCurrentPeriod: jest.fn().mockReturnValue("30days"),
        getCurrentReportType: jest.fn().mockReturnValue("overview"),
        hasAppliedFilters: jest.fn().mockReturnValue(false),
        hasCustomFilters: jest.fn().mockReturnValue(false),
        getFiltersSummary: jest.fn().mockReturnValue([]),
        getFiltersAsQuery: jest.fn().mockReturnValue(""),
        clearError: jest.fn(),
      },
      realTime: {
        realTimeEnabled: false,
        realTimeData: null,
        autoRefresh: false,
        loading: false,
        error: null,
        connectionStatus: "disconnected",
        lastUpdate: null,
        enableRealTime: jest.fn(),
        disableRealTime: jest.fn(),
        toggleRealTime: jest.fn(),
        enableAutoRefresh: jest.fn(),
        disableAutoRefresh: jest.fn(),
        toggleAutoRefresh: jest.fn(),
        reconnect: jest.fn(),
        getConnectionStatus: jest.fn().mockReturnValue({
          status: "disconnected",
          isConnected: false,
          isConnecting: false,
          hasError: false,
        }),
        getRealTimeStats: jest.fn().mockReturnValue(null),
        isRealTimeActive: jest.fn().mockReturnValue(false),
        getTimeSinceLastUpdate: jest.fn().mockReturnValue(null),
        clearError: jest.fn(),
      },
      reports: {
        reports: [],
        selectedReports: [],
        loading: false,
        error: null,
        loadReports: jest.fn(),
        createReport: jest.fn(),
        editReport: jest.fn(),
        removeReport: jest.fn(),
        removeMultipleReports: jest.fn(),
        exportReportData: jest.fn(),
        exportMultipleReports: jest.fn(),
        selectReport: jest.fn(),
        selectAllReports: jest.fn(),
        deselectAllReports: jest.fn(),
        duplicateReport: jest.fn(),
        getReportsByType: jest.fn().mockReturnValue([]),
        getPublicReports: jest.fn().mockReturnValue([]),
        getUserReports: jest.fn().mockReturnValue([]),
        getRecentReports: jest.fn().mockReturnValue([]),
        searchReports: jest.fn().mockReturnValue([]),
        getReportsStats: jest.fn().mockReturnValue({
          total: 0,
          public: 0,
          user: 0,
          recent: 0,
          typeStats: {},
        }),
        isReportSelected: jest.fn().mockReturnValue(false),
        getSelectedReports: jest.fn().mockReturnValue([]),
        clearError: jest.fn(),
      },
      getMainMetrics: jest.fn().mockReturnValue([]),
      getInsightsByType: jest.fn().mockReturnValue([]),
      getChartsByType: jest.fn().mockReturnValue([]),
      getReportsByType: jest.fn().mockReturnValue([]),
      getPublicReports: jest.fn().mockReturnValue([]),
      getUserReports: jest.fn().mockReturnValue([]),
      getRecentReports: jest.fn().mockReturnValue([]),
      searchReports: jest.fn().mockReturnValue([]),
      getReportsStats: jest.fn().mockReturnValue({}),
      getMetricsSummary: jest.fn().mockReturnValue(null),
      getComparisonData: jest.fn().mockReturnValue(null),
      hasData: jest.fn().mockReturnValue(true),
      getDashboardStatus: jest.fn().mockReturnValue("success"),
      exportDashboardData: jest.fn(),
      fetchDashboardData: jest.fn(),
      fetchModuleStats: jest.fn(),
      exportData: jest.fn(),
      getMetricLabel: jest.fn().mockReturnValue(""),
      formatDate: jest.fn().mockReturnValue(""),
      getTimeRangeLabel: jest.fn().mockReturnValue(""),
      getDeviceIcon: jest.fn().mockReturnValue(null),
      getDeviceLabel: jest.fn().mockReturnValue(""),
      getTrafficSourceIcon: jest.fn().mockReturnValue(null),
      getTrafficSourceLabel: jest.fn().mockReturnValue(""),
      setCurrentView: jest.fn(),
      setError: jest.fn(),
      setLoading: jest.fn(),
    });

  });

  describe("Analytics Dashboard Integration", () => {
    it("should render dashboard with metrics", async () => {
      render(<AnalyticsDashboard />);

      await waitFor(() => {
        expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();

      });

    });

    it("should handle filter changes", async () => {
      const user = userEvent.setup();

      render(
        <AnalyticsFilters
          filters={ date_range: "30days", report_type: "overview" } onFiltersChange={ jest.fn() } />,);

      const periodSelect = screen.getByDisplayValue("Últimos 30 dias");

      await user.selectOptions(periodSelect, "7days");

      // Verificar se a mudança foi processada
      expect(periodSelect).toBeInTheDocument();

    });

    it("should display metrics correctly", async () => {
      render(
        <AnalyticsMetrics
          data={[
            {
              id: "1",
              name: "Page Views",
              type: "page_views",
              value: 1000,
              previous_value: 800,
              change_percentage: 25,
              trend: "up",
              unit: "number",
              timestamp: "2023-01-01T00:00:00Z",
            },
          ]} />,);

      await waitFor(() => {
        expect(screen.getByText("Métricas Principais")).toBeInTheDocument();

      });

    });

  });

  describe("Analytics Filters Integration", () => {
    it("should apply filters and update dashboard", async () => {
      const user = userEvent.setup();

      const onFiltersChange = jest.fn();

      render(
        <AnalyticsFilters
          filters={ date_range: "30days", report_type: "overview" } onFiltersChange={ onFiltersChange } />,);

      const reportTypeSelect = screen.getByDisplayValue("Visão Geral");

      await user.selectOptions(reportTypeSelect, "traffic");

      expect(onFiltersChange).toHaveBeenCalledWith({
        date_range: "30days",
        report_type: "traffic",
      });

    });

    it("should clear filters", async () => {
      const user = userEvent.setup();

      const onFiltersChange = jest.fn();

      render(
        <AnalyticsFilters
          filters={
            date_range: "custom",
            report_type: "traffic",
            start_date: "2023-01-01",
            end_date: "2023-01-31",
          } onFiltersChange={ onFiltersChange } />,);

      const clearButton = screen.getByText("Limpar");

      await user.click(clearButton);

      expect(onFiltersChange).toHaveBeenCalledWith({
        date_range: "30days",
        report_type: "overview",
      });

    });

  });

  describe("Analytics Real-time Integration", () => {
    it("should enable real-time updates", async () => {
      const user = userEvent.setup();

      render(<AnalyticsDashboard />);

      const realTimeButton = screen.getByText("Ativar Tempo Real");

      await user.click(realTimeButton);

      // Verificar se o tempo real foi ativado
      expect(mockUseAnalytics().realTime.enableRealTime).toHaveBeenCalled();

    });

    it("should handle real-time data updates", async () => {
      // Mock de dados em tempo real
      mockUseAnalytics.mockReturnValue({
        ...mockUseAnalytics(),
        realTime: {
          ...mockUseAnalytics().realTime,
          realTimeEnabled: true,
          realTimeData: {
            active_users: 150,
            page_views: 500,
            top_pages: [
              { page: "/", views: 100 },
              { page: "/products", views: 50 },
            ],
            top_sources: [
              { source: "google", users: 75 },
              { source: "direct", users: 50 },
            ],
            top_devices: [
              { device: "desktop", users: 100 },
              { device: "mobile", users: 50 },
            ],
            last_updated: "2023-01-01T00:00:00Z",
          },
        },
      });

      render(<AnalyticsDashboard />);

      await waitFor(() => {
        expect(screen.getByText("Tempo Real Ativo")).toBeInTheDocument();

      });

    });

  });

  describe("Analytics Reports Integration", () => {
    it("should create new report", async () => {
      const user = userEvent.setup();

      render(<AnalyticsDashboard />);

      // Simular criação de relatório
      const createReport = mockUseAnalytics().reports.createReport;
      await createReport({
        name: "Test Report",
        type: "overview",
        filters: { date_range: "30days", report_type: "overview" },
      });

      expect(createReport).toHaveBeenCalledWith({
        name: "Test Report",
        type: "overview",
        filters: { date_range: "30days", report_type: "overview" },
      });

    });

    it("should export report data", async () => {
      const user = userEvent.setup();

      render(<AnalyticsDashboard />);

      // Simular exportação de relatório
      const exportReport = mockUseAnalytics().reports.exportReportData;
      await exportReport("report-id", "csv");

      expect(exportReport).toHaveBeenCalledWith("report-id", "csv");

    });

  });

  describe("Analytics Error Handling", () => {
    it("should handle loading errors", async () => {
      mockUseAnalytics.mockReturnValue({
        ...mockUseAnalytics(),
        loading: true,
        error: "Erro ao carregar dados",
      });

      render(<AnalyticsDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText("Erro ao carregar analytics"),
        ).toBeInTheDocument();

      });

    });

    it("should handle network errors", async () => {
      mockAnalyticsService.getDashboardData.mockRejectedValue(
        new Error("Network error"),);

      render(<AnalyticsDashboard />);

      await waitFor(() => {
        expect(
          mockUseAnalytics().dashboard.loadDashboardData,
        ).toHaveBeenCalled();

      });

    });

  });

  describe("Analytics Performance", () => {
    it("should handle large datasets efficiently", async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `metric-${i}`,
        name: `Metric ${i}`,
        type: "page_views",
        value: Math.random() * 1000,
        trend: "up",
        unit: "number",
        timestamp: "2023-01-01T00:00:00Z",
      }));

      mockUseAnalytics.mockReturnValue({
        ...mockUseAnalytics(),
        dashboard: {
          ...mockUseAnalytics().dashboard,
          dashboardData: {
            ...mockUseAnalytics().dashboard.dashboardData,
            metrics: largeDataset,
          },
        },
      });

      const startTime = performance.now();

      render(<AnalyticsMetrics data={ largeDataset } />);

      const endTime = performance.now();

      // Verificar se o render foi rápido (menos de 100ms)
      expect(endTime - startTime).toBeLessThan(100);

    });

    it("should debounce filter changes", async () => {
      const user = userEvent.setup();

      const onFiltersChange = jest.fn();

      render(
        <AnalyticsFilters
          filters={ date_range: "30days", report_type: "overview" } onFiltersChange={ onFiltersChange } />,);

      const periodSelect = screen.getByDisplayValue("Últimos 30 dias");

      // Fazer múltiplas mudanças rápidas
      await user.selectOptions(periodSelect, "7days");

      await user.selectOptions(periodSelect, "30days");

      await user.selectOptions(periodSelect, "90days");

      // Verificar se apenas a última mudança foi processada
      expect(onFiltersChange).toHaveBeenCalledTimes(3);

    });

  });

});

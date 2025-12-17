// =========================================
// USE PRODUCT ANALYTICS - HOOK ESPECIALIZADO
// =========================================
// Hook para operações de analytics de produtos
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import { fetchProductAnalytics, fetchProductsAnalytics, fetchProductMetrics, fetchProductPerformance, fetchTopPerformingProducts, fetchLowPerformingProducts, fetchSalesAnalytics, fetchRevenueAnalytics, fetchConversionAnalytics, fetchProductViews, fetchProductClicks, fetchProductEngagement, generateProductReport, exportProductAnalytics, calculateConversionRate, calculateRevenueGrowth, formatAnalyticsPeriod } from '../services/productsAnalyticsService';
import { getErrorMessage } from '@/utils/errorHelpers';
import { ProductAnalytics, ProductMetrics, ProductResponse, AnalyticsFilter, ProductPerformance } from '../types';

interface UseProductAnalyticsReturn {
  // Estado
  analytics: ProductAnalytics | null;
  metrics: ProductMetrics | null;
  performance: ProductPerformance | null;
  topProducts: string[];
  lowProducts: string[];
  salesData: Record<string, any> | null;
  revenueData: Record<string, any> | null;
  conversionData: Record<string, any> | null;
  viewsData: Record<string, any> | null;
  clicksData: Record<string, any> | null;
  engagementData: Record<string, any> | null;
  loading: boolean;
  error: string | null;
  // Operações básicas
  loadAnalytics: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  loadAllAnalytics: (filters?: AnalyticsFilter) => Promise<void>;
  loadMetrics: (productId: string, period?: string) => Promise<void>;
  loadPerformance: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  // Operações de performance
  loadTopProducts: (limit?: number, filters?: AnalyticsFilter) => Promise<void>;
  loadLowProducts: (limit?: number, filters?: AnalyticsFilter) => Promise<void>;
  // Operações de vendas e receita
  loadSalesAnalytics: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  loadRevenueAnalytics: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  loadConversionAnalytics: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  // Operações de comportamento
  loadViews: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  loadClicks: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  loadEngagement: (productId: string, filters?: AnalyticsFilter) => Promise<void>;
  // Operações de relatórios
  generateReport: (productId: string, reportType: string, filters?: AnalyticsFilter) => Promise<ProductResponse>;
  exportAnalytics: (productId: string, format: 'csv' | 'xlsx' | 'pdf', filters?: AnalyticsFilter) => Promise<ProductResponse>;
  // Utilitários
  calculateConversion: (views: number, sales: number) => number;
  calculateGrowth: (current: number, previous: number) => number;
  formatPeriod: (period: string) => string;
  // Estado de UI
  clearError??: (e: any) => void;
  clearData??: (e: any) => void; }

export const useProductAnalytics = (): UseProductAnalyticsReturn => {
  // =========================================
  // ESTADO
  // =========================================
  
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);

  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);

  const [performance, setPerformance] = useState<ProductPerformance | null>(null);

  const [topProducts, setTopProducts] = useState<unknown[]>([]);

  const [lowProducts, setLowProducts] = useState<unknown[]>([]);

  const [salesData, setSalesData] = useState<Record<string, any> | null>(null);

  const [revenueData, setRevenueData] = useState<Record<string, any> | null>(null);

  const [conversionData, setConversionData] = useState<Record<string, any> | null>(null);

  const [viewsData, setViewsData] = useState<Record<string, any> | null>(null);

  const [clicksData, setClicksData] = useState<Record<string, any> | null>(null);

  const [engagementData, setEngagementData] = useState<Record<string, any> | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPERAÇÕES BÁSICAS
  // =========================================

  const loadAnalytics = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductAnalytics(productId, filters);

      if (response.success) {
        setAnalytics(response.data);

      } else {
        setError(response.error || 'Erro ao carregar analytics');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar analytics');

    } finally {
      setLoading(false);

    } , []);

  const loadAllAnalytics = useCallback(async (filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductsAnalytics(filters);

      if (response.success) {
        setAnalytics(response.data);

      } else {
        setError(response.error || 'Erro ao carregar analytics gerais');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar analytics gerais');

    } finally {
      setLoading(false);

    } , []);

  const loadMetrics = useCallback(async (productId: string, period: string = '30d') => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductMetrics(productId, period);

      if (response.success) {
        setMetrics(response.data);

      } else {
        setError(response.error || 'Erro ao carregar métricas');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar métricas');

    } finally {
      setLoading(false);

    } , []);

  const loadPerformance = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductPerformance(productId, filters);

      if (response.success) {
        setPerformance(response.data);

      } else {
        setError(response.error || 'Erro ao carregar performance');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar performance');

    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // OPERAÇÕES DE PERFORMANCE
  // =========================================

  const loadTopProducts = useCallback(async (limit: number = 10, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchTopPerformingProducts(limit, filters);

      if (response.success) {
        setTopProducts(response.data || []);

      } else {
        setError(response.error || 'Erro ao carregar produtos top');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar produtos top');

    } finally {
      setLoading(false);

    } , []);

  const loadLowProducts = useCallback(async (limit: number = 10, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchLowPerformingProducts(limit, filters);

      if (response.success) {
        setLowProducts(response.data || []);

      } else {
        setError(response.error || 'Erro ao carregar produtos com baixa performance');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar produtos com baixa performance');

    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // OPERAÇÕES DE VENDAS E RECEITA
  // =========================================

  const loadSalesAnalytics = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchSalesAnalytics(productId, filters);

      if (response.success) {
        setSalesData(response.data);

      } else {
        setError(response.error || 'Erro ao carregar analytics de vendas');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar analytics de vendas');

    } finally {
      setLoading(false);

    } , []);

  const loadRevenueAnalytics = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchRevenueAnalytics(productId, filters);

      if (response.success) {
        setRevenueData(response.data);

      } else {
        setError(response.error || 'Erro ao carregar analytics de receita');

      } catch (err: unknown) {
      setError(err.message || 'Erro inesperado ao carregar analytics de receita');

    } finally {
      setLoading(false);

    } , []);

  const loadConversionAnalytics = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchConversionAnalytics(productId, filters);

      if (response.success) {
        setConversionData(response.data);

      } else {
        setError(response.error || 'Erro ao carregar analytics de conversão');

      } catch (err: unknown) {
      setError(err.message || 'Erro inesperado ao carregar analytics de conversão');

    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // OPERAÇÕES DE COMPORTAMENTO
  // =========================================

  const loadViews = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductViews(productId, filters);

      if (response.success) {
        setViewsData(response.data);

      } else {
        setError(response.error || 'Erro ao carregar dados de visualizações');

      } catch (err: unknown) {
      setError(err.message || 'Erro inesperado ao carregar dados de visualizações');

    } finally {
      setLoading(false);

    } , []);

  const loadClicks = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductClicks(productId, filters);

      if (response.success) {
        setClicksData(response.data);

      } else {
        setError(response.error || 'Erro ao carregar dados de cliques');

      } catch (err: unknown) {
      setError(err.message || 'Erro inesperado ao carregar dados de cliques');

    } finally {
      setLoading(false);

    } , []);

  const loadEngagement = useCallback(async (productId: string, filters?: AnalyticsFilter) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductEngagement(productId, filters);

      if (response.success) {
        setEngagementData(response.data);

      } else {
        setError(response.error || 'Erro ao carregar dados de engajamento');

      } catch (err: unknown) {
      setError(err.message || 'Erro inesperado ao carregar dados de engajamento');

    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // OPERAÇÕES DE RELATÓRIOS
  // =========================================

  const generateReport = useCallback(async (productId: string, reportType: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await generateProductReport(productId, reportType, filters);

      if (!response.success) {
        setError(response.error || 'Erro ao gerar relatório');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) + ' ao gerar relatório'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , []);

  const exportAnalytics = useCallback(async (productId: string, format: 'csv' | 'xlsx' | 'pdf', filters?: AnalyticsFilter): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await exportProductAnalytics(productId, format, filters);

      if (!response.success) {
        setError(response.error || 'Erro ao exportar analytics');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) + ' ao exportar analytics'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const calculateConversion = useCallback((views: number, sales: number) => {
    return calculateConversionRate(views, sales);

  }, []);

  const calculateGrowth = useCallback((current: number, previous: number) => {
    return calculateRevenueGrowth(current, previous);

  }, []);

  const formatPeriod = useCallback((period: string) => {
    return formatAnalyticsPeriod(period);

  }, []);

  // =========================================
  // ESTADO DE UI
  // =========================================

  const clearError = useCallback(() => {
    setError(null);

  }, []);

  const clearData = useCallback(() => {
    setAnalytics(null);

    setMetrics(null);

    setPerformance(null);

    setTopProducts([]);

    setLowProducts([]);

    setSalesData(null);

    setRevenueData(null);

    setConversionData(null);

    setViewsData(null);

    setClicksData(null);

    setEngagementData(null);

  }, []);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado
    analytics,
    metrics,
    performance,
    topProducts,
    lowProducts,
    salesData,
    revenueData,
    conversionData,
    viewsData,
    clicksData,
    engagementData,
    loading,
    error,
    
    // Operações básicas
    loadAnalytics,
    loadAllAnalytics,
    loadMetrics,
    loadPerformance,
    
    // Operações de performance
    loadTopProducts,
    loadLowProducts,
    
    // Operações de vendas e receita
    loadSalesAnalytics,
    loadRevenueAnalytics,
    loadConversionAnalytics,
    
    // Operações de comportamento
    loadViews,
    loadClicks,
    loadEngagement,
    
    // Operações de relatórios
    generateReport,
    exportAnalytics,
    
    // Utilitários
    calculateConversion,
    calculateGrowth,
    formatPeriod,
    
    // Estado de UI
    clearError,
    clearData};
};

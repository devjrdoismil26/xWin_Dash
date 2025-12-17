// =========================================
// PRODUCTS ANALYTICS SERVICE - ANALYTICS DE PRODUTOS
// =========================================
// Serviço para operações de analytics de produtos
// Máximo: 200 linhas

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { ProductAnalytics, ProductMetrics, ProductResponse, AnalyticsFilter, ProductPerformance } from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE ANALYTICS
// =========================================

export const fetchProductAnalytics = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/analytics`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchProductsAnalytics = async (filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/products/analytics', { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchProductMetrics = async (productId: string, period: string = '30d'): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/metrics`, {
      params: { period } );

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE PERFORMANCE
// =========================================

export const fetchProductPerformance = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/performance`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchTopPerformingProducts = async (limit: number = 10, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/products/analytics/top-performing', {
      params: { limit, ...filters } );

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchLowPerformingProducts = async (limit: number = 10, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/products/analytics/low-performing', {
      params: { limit, ...filters } );

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE VENDAS E RECEITA
// =========================================

export const fetchSalesAnalytics = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/sales-analytics`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchRevenueAnalytics = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/revenue-analytics`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchConversionAnalytics = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/conversion-analytics`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE COMPORTAMENTO
// =========================================

export const fetchProductViews = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/views`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchProductClicks = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/clicks`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchProductEngagement = async (productId: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/engagement`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE RELATÓRIOS
// =========================================

export const generateProductReport = async (productId: string, reportType: string, filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${productId}/reports`, {
      report_type: reportType,
      filters
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const exportProductAnalytics = async (productId: string, format: 'csv' | 'xlsx' | 'pdf', filters?: AnalyticsFilter): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${productId}/analytics/export`, {
      format,
      filters
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// UTILITÁRIOS
// =========================================

export const calculateConversionRate = (views: number, sales: number): number => {
  if (views === 0) return 0;
  return Math.round((sales / views) * 100 * 100) / 100;};

export const calculateRevenueGrowth = (currentRevenue: number, previousRevenue: number): number => {
  if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;
  return Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100 * 100) / 100;};

export const formatAnalyticsPeriod = (period: string): string => {
  const periods: Record<string, string> = {
    '1d': 'Último dia',
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '90d': 'Últimos 90 dias',
    '1y': 'Último ano'};

  return periods[period] || period;};

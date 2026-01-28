/**
 * Funções auxiliares para o módulo Dashboard
 */

import { DashboardMetrics, DashboardWidget, DashboardFilters } from '../types/dashboardTypes';

/**
 * Formata número para exibição
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('pt-BR').format(num);
};

/**
 * Formata valor monetário
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(amount);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Calcula crescimento percentual
 */
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Determina tendência baseada no crescimento
 */
export const getTrend = (growth: number): 'up' | 'down' | 'stable' => {
  if (growth > 0) return 'up';
  if (growth < 0) return 'down';
  return 'stable';
};

/**
 * Gera cor baseada na tendência
 */
export const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

/**
 * Valida se um widget está visível
 */
export const isWidgetVisible = (widget: DashboardWidget): boolean => {
  return widget.visible;
};

/**
 * Filtra widgets visíveis
 */
export const getVisibleWidgets = (widgets: DashboardWidget[]): DashboardWidget[] => {
  return widgets.filter(isWidgetVisible);
};

/**
 * Aplica filtros aos dados
 */
export const applyFilters = (data: any, filters: DashboardFilters): any => {
  // Implementação básica - pode ser expandida conforme necessário
  return data;
};

/**
 * Gera ID único para widgets
 */
export const generateWidgetId = (): string => {
  return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Valida configuração de widget
 */
export const validateWidgetConfig = (widget: Partial<DashboardWidget>): boolean => {
  return !!(widget.type && widget.title);
};

/**
 * Calcula métricas de performance
 */
export const calculatePerformanceMetrics = (metrics: DashboardMetrics) => {
  return {
    totalGrowth: calculateGrowth(
      metrics.total_leads + metrics.total_users + metrics.total_projects,
      0 // Valor anterior seria passado como parâmetro
    ),
    conversionRate: metrics.conversion_rate,
    revenueGrowth: metrics.revenue_growth
  };
};

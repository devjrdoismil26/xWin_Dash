/**
 * Formatadores do módulo Dashboard
 *
 * @description
 * Funções de formatação para o módulo Dashboard incluindo formatação
 * de métricas, atividades recentes e cálculos de tempo decorrido.
 *
 * @module modules/Dashboard/utils/dashboardFormatters
 * @since 1.0.0
 */

import { DashboardMetrics, RecentActivity } from '../types/dashboardTypes';
import { formatCurrency } from '@/lib/utils';
import { formatPercentage } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';

/**
 * Formata métricas do dashboard para exibição
 *
 * @description
 * Formata todas as métricas do dashboard incluindo números e moeda.
 *
 * @param {DashboardMetrics} metrics - Métricas a formatar
 * @returns {Object} Métricas formatadas
 */
export const formatDashboardMetrics = (metrics: DashboardMetrics) => {
  return {
    total_leads: formatNumber(metrics.total_leads),
    total_users: formatNumber(metrics.total_users),
    total_projects: formatNumber(metrics.total_projects),
    active_projects: formatNumber(metrics.active_projects),
    total_campaigns: formatNumber(metrics.total_campaigns),
    total_revenue: formatCurrency(metrics.total_revenue),
    conversion_rate: formatPercentage(metrics.conversion_rate),
    leads_growth: formatPercentage(metrics.leads_growth),
    users_growth: formatPercentage(metrics.users_growth),
    projects_growth: formatPercentage(metrics.projects_growth),
    campaigns_growth: formatPercentage(metrics.campaigns_growth),
    revenue_growth: formatPercentage(metrics.revenue_growth)};
};

/**
 * Formata atividade recente para exibição
 */
export const formatRecentActivity = (activity: RecentActivity) => {
  return {
    ...activity,
    formatted_timestamp: new Date(activity.timestamp).toLocaleString('pt-BR'),
    time_ago: getTimeAgo(activity.timestamp)};
};

/**
 * Calcula tempo decorrido
 */
export const getTimeAgo = (timestamp: string): string => {
  const now = new Date();

  const time = new Date(timestamp);

  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora mesmo';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  
  return time.toLocaleDateString('pt-BR');};

/**
 * Formata dados para exportação
 */
export const formatForExport = (data: unknown, format: 'json' | 'csv' = 'json') => {
  if (format === 'csv') {
    return convertToCSV(data);

  }
  return JSON.stringify(data, null, 2);};

/**
 * Converte dados para CSV
 */
export const convertToCSV = (data: string[]): string => {
  if (!data || (data as any).length === 0) return '';
  
  const headers = Object.keys(data[0]);

  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header] || '').join(','))
  ].join('\n');

  return csvContent;};

/**
 * Formata período para exibição
 */
export const formatPeriod = (period: string): string => {
  const periodMap: Record<string, string> = {
    'today': 'Hoje',
    'yesterday': 'Ontem',
    '7days': 'Últimos 7 dias',
    '30days': 'Últimos 30 dias',
    '90days': 'Últimos 90 dias',
    '365days': 'Último ano'};

  return periodMap[period] || period;};

/**
 * Formata status para exibição
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Ativo',
    'inactive': 'Inativo',
    'pending': 'Pendente',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'};

  return statusMap[status] || status;};

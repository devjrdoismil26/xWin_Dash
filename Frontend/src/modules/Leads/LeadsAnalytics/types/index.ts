// ========================================
// EXPORTS - TIPOS DO LEADS ANALYTICS
// ========================================
// Tipos específicos para analytics de leads

export * from '@/types';


export interface LeadMetricsDisplayProps {
  metrics: LeadPerformance;
  period?: 'day' | 'week' | 'month' | 'year';
  [key: string]: unknown; }

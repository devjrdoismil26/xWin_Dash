// ========================================
// TIPOS DE MÉTRICAS
// ========================================

export interface LeadMetrics {
  total_leads: number;
  new_leads: number;
  converted_leads: number;
  conversion_rate: number;
  average_score: number;
  leads_by_status: Record<string, number>;
  leads_by_origin: Record<string, number>;
  leads_by_source: Record<string, number>;
  top_performing_tags: Array<{ tag: string;
  count: number;
}>;
  leads_growth: number;
  conversion_growth: number;
  score_growth: number;
}

export interface LeadMetricsResponse {
  metrics: LeadMetrics;
  period: {
    start: string;
  end: string; };

  generated_at: string;
}

export interface LeadAnalyticsResponse {
  analytics: LeadAnalytics[];
  total_records: number;
  period: {
    start: string;
  end: string; };

  generated_at: string;
}


export interface LeadMetricsDisplayProps {
  metrics: LeadMetrics;
  loading?: boolean;
  [key: string]: unknown; }

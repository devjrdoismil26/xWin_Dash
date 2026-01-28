// ========================================
// TIPOS DE RELATÓRIOS E DASHBOARD
// ========================================

export interface LeadReport {
  id: number;
  name: string;
  description?: string;
  type: 'summary' | 'detailed' | 'analytics' | 'performance';
  filters: LeadFilters;
  fields: string[];
  group_by?: string[];
  created_at: string;
  updated_at: string;
}

export interface LeadDashboard {
  id: number;
  name: string;
  description?: string;
  widgets: LeadDashboardWidget[];
  layout: Record<string, any>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadDashboardWidget {
  id: number;
  dashboard_id: number;
  type: 'metric' | 'chart' | 'table' | 'list';
  title: string;
  configuration: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// Re-export types from other modules
export type { LeadFilters } from '../management/LeadFilters';
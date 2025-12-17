export interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  widgets: AnalyticsWidget[];
  layout: DashboardLayout;
  filters: AnalyticsFilter[];
  refreshInterval: number;
  isPublic: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date; }

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  backgroundColor: string;
  backgroundImage?: string; }

export interface AnalyticsFilter {
  id: string;
  name: string;
  type: FilterType;
  field: string;
  operator: FilterOperator;
  value: unknown;
  isRequired: boolean; }

export type FilterType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'range';
export type FilterOperator = 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn';

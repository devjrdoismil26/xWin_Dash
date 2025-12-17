export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  format: ReportFormat;
  schedule: ReportSchedule;
  recipients: string[];
  filters: ReportFilter[];
  columns: ReportColumn[];
  data: string[];
  generatedAt: Date;
  status: ReportStatus; }

export interface ReportSchedule {
  frequency: ScheduleFrequency;
  time: string;
  timezone: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date; }

export interface ReportFilter {
  field: string;
  operator: string;
  value: unknown; }

export interface ReportColumn {
  field: string;
  label: string;
  type: ColumnType;
  format?: string;
  sortable: boolean;
  filterable: boolean; }

export type ReportType = 'sales' | 'products' | 'customers' | 'inventory' | 'performance' | 'custom';
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';
export type ReportStatus = 'pending' | 'generating' | 'completed' | 'failed';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type ColumnType = 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean';

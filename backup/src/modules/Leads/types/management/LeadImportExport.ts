// ========================================
// TIPOS DE IMPORTAÇÃO E EXPORTAÇÃO
// ========================================

export interface LeadImport {
  id: number;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number;
  processed_rows: number;
  success_rows: number;
  error_rows: number;
  errors: LeadImportError[];
  created_at: string;
  completed_at?: string;
}

export interface LeadImportError {
  row: number;
  field: string;
  value: any;
  error: string;
}

export interface LeadImportResult {
  total_rows: number;
  success_rows: number;
  error_rows: number;
  errors: LeadImportError[];
  imported_leads: Lead[];
}

export interface LeadImportTemplate {
  id: number;
  name: string;
  description?: string;
  fields: LeadImportField[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadImportField {
  field_name: string;
  column_name: string;
  is_required: boolean;
  data_type: 'string' | 'number' | 'date' | 'boolean';
  default_value?: any;
}

export interface LeadImportValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  total_rows: number;
  valid_rows: number;
}

export interface LeadExport {
  id: number;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_records: number;
  exported_records: number;
  filters: LeadFilters;
  format: 'csv' | 'xlsx' | 'json';
  created_at: string;
  completed_at?: string;
}

export interface LeadExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  include_fields: string[];
  filters?: LeadFilters;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface LeadExportTemplate {
  id: number;
  name: string;
  description?: string;
  fields: string[];
  filters?: LeadFilters;
  format: 'csv' | 'xlsx' | 'json';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Re-export types from other modules
export type { Lead } from '../core/Lead';
export type { LeadFilters } from './LeadFilters';
// ========================================
// TIPOS DE FILTROS E BUSCA
// ========================================

export interface LeadFilters {
  search?: string;
  status?: string[];
  origin?: string[];
  tags?: string[];
  assigned_to?: number[];
  score_range?: {
    min: number;
    max: number;
  };
  date_range?: {
    field: string;
    start: string;
    end: string;
  };
  custom_fields?: Record<string, any>;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  position?: string;
  status: LeadStatus;
  origin: LeadOrigin;
  project_id: number;
  assigned_to?: number;
  tags?: number[];
  custom_fields?: Record<string, any>;
  notes?: string;
}

// Re-export types from core
export type { LeadStatus, LeadOrigin } from '../core/Lead';
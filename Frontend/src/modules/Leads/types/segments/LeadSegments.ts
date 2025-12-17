// ========================================
// TIPOS DE SEGMENTAÇÃO
// ========================================

export interface LeadSegment {
  id: number;
  name: string;
  description?: string;
  criteria: SegmentCriteria;
  lead_count: number;
  created_at: string;
  updated_at: string; }

export interface SegmentCriteria {
  status?: string[];
  score_range?: {
    min: number;
  max: number; };

  tags?: string[];
  custom_fields?: Record<string, any>;
  date_range?: {
    field: string;
    start: string;
    end: string;};

  origin?: string[];
  assigned_to?: number[];
}

export interface LeadSegmentRule {
  id: number;
  segment_id: number;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | boolean | null;
  logical_operator?: 'AND' | 'OR'; }


export interface LeadSegmentFormProps {
  segment?: LeadSegment;
  rules?: LeadSegmentRule[];
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  [key: string]: unknown; }

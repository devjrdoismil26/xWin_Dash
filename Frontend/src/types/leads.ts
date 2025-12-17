export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source?: string;
  score?: number;
  created_at: string;
  updated_at: string; }

export interface LeadMetrics {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  conversion_rate: number; }

export interface LeadAnalytics {
  conversions: number;
  revenue: number;
  cost_per_lead: number;
  lifetime_value: number;
  attribution: LeadAttribution[]; }

export interface LeadAttribution {
  source: string;
  medium: string;
  campaign?: string;
  leads_count: number;
  conversion_rate: number;
  revenue?: number; }

export interface LeadForecast {
  period: string;
  predicted_leads: number;
  confidence_interval: [number, number];
  trend: 'up' | 'down' | 'stable'; }

export interface LeadHealthScore {
  score: number;
  factors: {
    engagement: number;
  recency: number;
  fit: number;
  activity: number; };

  status: 'healthy' | 'at_risk' | 'critical';
}

export interface LeadDuplicate {
  id: number;
  lead_id: number;
  duplicate_lead_id: number;
  similarity_score: number;
  matched_fields: string[];
  status: 'pending' | 'merged' | 'ignored'; }

export interface LeadDocument {
  id: number;
  lead_id: number;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: number;
  created_at: string; }

export interface LeadTask {
  id: number;
  lead_id: number;
  title: string;
  description?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent'; }

export interface LeadNote {
  id: number;
  lead_id: number;
  content: string;
  author_id: number;
  is_private: boolean;
  created_at: string; }

export interface LeadTag {
  id: number;
  name: string;
  color?: string; }

export interface LeadSegment {
  id: number;
  name: string;
  description?: string;
  rules: LeadSegmentRule[];
  leads_count: number; }

export interface LeadSegmentRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: unknown; }

export interface LeadCustomField {
  id: number;
  name: string;
  field_type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options?: string[];
  required: boolean; }

export interface LeadFilters {
  status?: string[];
  origin?: string[];
  score_min?: number;
  score_max?: number;
  tags?: number[];
  segments?: number[];
  date_from?: string;
  date_to?: string;
  search?: string; }

export interface LeadSource {
  id: number;
  name: string;
  type: string;
  leads_count: number; }

export interface LeadScoreRule {
  id: number;
  name: string;
  condition: string;
  points: number;
  active: boolean; }

export interface LeadPerformance {
  period: string;
  leads_created: number;
  leads_converted: number;
  conversion_rate: number;
  revenue: number; }

export interface LeadROI {
  total_investment: number;
  total_revenue: number;
  roi_percentage: number;
  cost_per_lead: number;
  cost_per_acquisition: number; }

export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  category?: string; }

// Hook return types
export interface UseLeadAttributionReturn {
  attribution: LeadAttribution[];
  loading: boolean;
  error: string | null;
  refetch??: (e: any) => void; }

export interface UseLeadForecastingReturn {
  forecast: LeadForecast[];
  loading: boolean;
  error: string | null;
  refetch??: (e: any) => void; }

export interface UseLeadHealthReturn {
  health: LeadHealthScore | null;
  loading: boolean;
  error: string | null;
  refetch??: (e: any) => void; }

export interface UseLeadScoringReturn {
  score: number;
  rules: LeadScoreRule[];
  loading: boolean;
  error: string | null;
  updateScore?: (e: any) => void; }

export interface UseLeadPerformanceReturn {
  performance: LeadPerformance[];
  loading: boolean;
  error: string | null;
  refetch??: (e: any) => void; }

export interface UseLeadROIReturn {
  roi: LeadROI | null;
  loading: boolean;
  error: string | null;
  refetch??: (e: any) => void; }

export interface UseLeadEngagementReturn {
  engagement: unknown;
  loading: boolean;
  error: string | null;
  refetch??: (e: any) => void; }

export interface UseLeadAutomationReturn {
  automations: string[];
  loading: boolean;
  error: string | null;
  createAutomation?: (e: any) => void;
  updateAutomation?: (e: any) => void;
  deleteAutomation?: (e: any) => void; }

export const DEFAULT_LEAD_FILTERS: LeadFilters = {
  status: [],
  origin: [],
  tags: [],
  segments: [],};

export interface LeadAutomationFlow {
  id: string;
  name: string;
  trigger: string;
  actions: LeadAutomationAction[];
  active: boolean; }

export interface LeadAutomationAction {
  type: string;
  config: Record<string, any>;
  delay?: number; }

export interface LeadMerge {
  primaryLeadId: string;
  secondaryLeadIds: string[];
  strategy: 'keep_primary' | 'merge_all' | 'custom';
  fieldMapping?: Record<string, string>; }

export interface LeadImportTemplate {
  name: string;
  fields: LeadImportField[];
  mapping: Record<string, string>; }

export interface LeadImportField {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string; }

export interface LeadImportValidation {
  valid: boolean;
  errors: LeadImportError[];
  warnings: LeadImportWarning[]; }

export interface LeadImportError {
  row: number;
  field: string;
  message: string; }

export interface LeadImportWarning {
  row: number;
  field: string;
  message: string; }

export interface LeadExportTemplate {
  name: string;
  fields: string[];
  format: 'csv' | 'xlsx' | 'json';
  filters?: LeadFilters; }


// Additional Lead Types
export interface LeadData {
  lead_id?: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  score?: number;
  [key: string]: unknown; }

export interface LeadFiltersExtended extends LeadFilters {
  memoizedFilter?: string;
  handleSearchChange??: (e: any) => void;
}

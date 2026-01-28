/**
 * Tipos consolidados para o módulo EmailSegments
 * Sistema de segmentação de público
 */

// ===== CORE SEGMENT INTERFACES =====
export interface EmailSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  subscriber_count: number;
  is_active: boolean;
  is_dynamic: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  tags: string[];
  color: string;
  icon: string;
  last_calculated_at?: string;
  calculation_status: 'pending' | 'calculating' | 'completed' | 'failed';
  metadata?: {
    source: string;
    version: number;
    parent_segment_id?: string;
  };
}

export interface SegmentCriteria {
  id: string;
  field: string;
  operator: SegmentOperator;
  value: any;
  logic?: 'and' | 'or';
  group_id?: string;
  is_negated: boolean;
}

export type SegmentOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal' 
  | 'less_than_or_equal' 
  | 'in' 
  | 'not_in' 
  | 'is_empty' 
  | 'is_not_empty' 
  | 'between' 
  | 'not_between';

export interface SegmentField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'email';
  options?: SegmentFieldOption[];
  validation?: SegmentFieldValidation;
  category: 'subscriber' | 'campaign' | 'behavior' | 'custom';
}

export interface SegmentFieldOption {
  value: string;
  label: string;
  count?: number;
}

export interface SegmentFieldValidation {
  required?: boolean;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  min_value?: number;
  max_value?: number;
}

export interface SegmentGroup {
  id: string;
  name: string;
  criteria: SegmentCriteria[];
  logic: 'and' | 'or';
  is_negated: boolean;
}

// ===== SEGMENT BUILDER INTERFACES =====
export interface SegmentBuilder {
  segment: Partial<EmailSegment>;
  criteria: SegmentCriteria[];
  groups: SegmentGroup[];
  available_fields: SegmentField[];
  is_preview_mode: boolean;
  preview_count: number;
  preview_subscribers: SegmentPreviewSubscriber[];
  validation_errors: SegmentValidationError[];
}

export interface SegmentPreviewSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  custom_fields: Record<string, any>;
  match_reason: string;
}

export interface SegmentValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

// ===== SEGMENT ANALYTICS INTERFACES =====
export interface SegmentAnalytics {
  segment_id: string;
  period: string;
  metrics: SegmentMetrics;
  trends: {
    subscriber_count: TimeSeriesData[];
    engagement_rate: TimeSeriesData[];
    conversion_rate: TimeSeriesData[];
  };
  demographics: {
    age_groups: AgeGroupData[];
    locations: LocationData[];
    devices: DeviceData[];
    sources: SourceData[];
  };
  performance: {
    campaigns_sent: number;
    avg_open_rate: number;
    avg_click_rate: number;
    avg_conversion_rate: number;
    total_revenue: number;
  };
}

export interface SegmentMetrics {
  total_subscribers: number;
  active_subscribers: number;
  new_subscribers: number;
  unsubscribed_subscribers: number;
  engagement_rate: number;
  conversion_rate: number;
  avg_campaign_performance: number;
  revenue_generated: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface AgeGroupData {
  age_group: string;
  count: number;
  percentage: number;
}

export interface LocationData {
  country: string;
  region?: string;
  count: number;
  percentage: number;
}

export interface DeviceData {
  device_type: string;
  count: number;
  percentage: number;
}

export interface SourceData {
  source: string;
  count: number;
  percentage: number;
}

// ===== SEGMENT FILTERS INTERFACES =====
export interface SegmentFilter {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  is_saved: boolean;
  created_at: string;
  created_by: string;
}

export interface SegmentFilterBuilder {
  filter: Partial<SegmentFilter>;
  criteria: SegmentCriteria[];
  available_fields: SegmentField[];
  is_preview_mode: boolean;
  preview_count: number;
}

// ===== API RESPONSE INTERFACES =====
export interface SegmentResponse {
  success: boolean;
  data?: EmailSegment | EmailSegment[];
  message?: string;
  error?: string;
}

export interface SegmentAnalyticsResponse {
  success: boolean;
  data?: SegmentAnalytics;
  message?: string;
  error?: string;
}

export interface SegmentPreviewResponse {
  success: boolean;
  data?: {
    count: number;
    subscribers: SegmentPreviewSubscriber[];
  };
  message?: string;
  error?: string;
}

// ===== UTILITY TYPES =====
export interface SegmentFilters {
  is_active?: boolean;
  is_dynamic?: boolean;
  tags?: string[];
  search?: string;
  created_by?: string;
  calculation_status?: string;
}

export interface SegmentSort {
  field: 'name' | 'subscriber_count' | 'created_at' | 'updated_at' | 'last_calculated_at';
  direction: 'asc' | 'desc';
}

// ===== HOOK RETURN TYPES =====
export interface UseEmailSegmentsReturn {
  segments: EmailSegment[];
  fields: SegmentField[];
  loading: boolean;
  error: string | null;
  fetchSegments: (filters?: SegmentFilters) => Promise<void>;
  fetchFields: () => Promise<void>;
  createSegment: (segmentData: Partial<EmailSegment>) => Promise<SegmentResponse>;
  updateSegment: (id: string, segmentData: Partial<EmailSegment>) => Promise<SegmentResponse>;
  deleteSegment: (id: string) => Promise<SegmentResponse>;
  duplicateSegment: (id: string) => Promise<SegmentResponse>;
  calculateSegment: (id: string) => Promise<SegmentResponse>;
  getSegmentAnalytics: (id: string) => Promise<SegmentAnalytics>;
  getSegmentById: (id: string) => EmailSegment | undefined;
  getActiveSegments: () => EmailSegment[];
  getDynamicSegments: () => EmailSegment[];
  formatSegmentMetrics: (metrics: SegmentMetrics) => any;
  validateSegment: (segment: EmailSegment) => { isValid: boolean; errors: string[] };
}

export interface UseSegmentBuilderReturn {
  builder: SegmentBuilder;
  updateSegment: (updates: Partial<EmailSegment>) => void;
  addCriteria: (criteria: SegmentCriteria) => void;
  updateCriteria: (id: string, updates: Partial<SegmentCriteria>) => void;
  removeCriteria: (id: string) => void;
  addGroup: (group: SegmentGroup) => void;
  updateGroup: (id: string, updates: Partial<SegmentGroup>) => void;
  removeGroup: (id: string) => void;
  previewSegment: () => Promise<SegmentPreviewResponse>;
  validateSegment: () => { isValid: boolean; errors: SegmentValidationError[] };
  saveSegment: () => Promise<SegmentResponse>;
  resetBuilder: () => void;
  getSegmentComplexity: () => 'simple' | 'medium' | 'complex';
  canCalculateSegment: () => boolean;
}

// ===== COMPONENT PROPS TYPES =====
export interface SegmentListProps {
  segments: EmailSegment[];
  loading?: boolean;
  error?: string;
  onEdit?: (segment: EmailSegment) => void;
  onDelete?: (segment: EmailSegment) => void;
  onDuplicate?: (segment: EmailSegment) => void;
  onCalculate?: (segment: EmailSegment) => void;
  onViewAnalytics?: (segment: EmailSegment) => void;
  className?: string;
}

export interface SegmentBuilderProps {
  segment?: EmailSegment;
  onSave?: (segment: EmailSegment) => void;
  onCancel?: () => void;
  onPreview?: (segment: EmailSegment) => void;
  className?: string;
}

export interface SegmentAnalyticsProps {
  segment: EmailSegment;
  analytics?: SegmentAnalytics;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface SegmentFiltersProps {
  onFilter?: (filters: SegmentFilters) => void;
  onReset?: () => void;
  className?: string;
}

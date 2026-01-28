// ========================================
// LEADS TYPES - CONSOLIDATED EXPORTS
// ========================================
// Este arquivo substitui o leadsTypes.ts gigante
// Organiza todos os tipos em módulos especializados

// ========================================
// CORE TYPES
// ========================================
export * from './core';

// ========================================
// ANALYTICS TYPES
// ========================================
export * from './analytics';

// ========================================
// MANAGEMENT TYPES
// ========================================
export * from './management';

// ========================================
// SEGMENTS TYPES
// ========================================
export * from './segments';

// ========================================
// CUSTOM FIELDS TYPES
// ========================================
export * from './customFields';

// ========================================
// ADDITIONAL TYPES (from original file)
// ========================================

// Product types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  category?: string;
}

export interface ProductSelectorProps {
  products: Product[];
  selectedProducts: number[];
  onSelectionChange: (productIds: number[]) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

// Response types
export interface LeadResponse {
  success: boolean;
  data: Lead;
  message?: string;
}

export interface LeadListResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  message?: string;
}

export interface LeadMetricsResponse {
  success: boolean;
  data: LeadMetrics;
  message?: string;
}

export interface LeadAnalyticsResponse {
  success: boolean;
  data: LeadAnalytics[];
  message?: string;
}

export interface LeadImportResponse {
  success: boolean;
  data: LeadImportResult;
  message?: string;
}

export interface LeadExportResponse {
  success: boolean;
  data: {
    download_url: string;
    filename: string;
    expires_at: string;
  };
  message?: string;
}

export interface LeadBulkResponse {
  success: boolean;
  data: {
    processed: number;
    successful: number;
    failed: number;
    errors: Array<{
      lead_id: number;
      error: string;
    }>;
  };
  message?: string;
}

// Hook return types
export interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  createLead: (lead: LeadFormData) => Promise<Lead>;
  updateLead: (id: number, lead: Partial<LeadFormData>) => Promise<Lead>;
  deleteLead: (id: number) => Promise<void>;
  getLead: (id: number) => Promise<Lead>;
  searchLeads: (filters: LeadFilters) => Promise<Lead[]>;
  refreshLeads: () => Promise<void>;
}

export interface UseLeadSegmentsReturn {
  segments: LeadSegment[];
  loading: boolean;
  error: string | null;
  createSegment: (segment: Omit<LeadSegment, 'id' | 'created_at' | 'updated_at'>) => Promise<LeadSegment>;
  updateSegment: (id: number, segment: Partial<LeadSegment>) => Promise<LeadSegment>;
  deleteSegment: (id: number) => Promise<void>;
  getSegment: (id: number) => Promise<LeadSegment>;
  refreshSegments: () => Promise<void>;
}

export interface UseLeadTagsReturn {
  tags: LeadTag[];
  loading: boolean;
  error: string | null;
  createTag: (tag: Omit<LeadTag, 'id'>) => Promise<LeadTag>;
  updateTag: (id: number, tag: Partial<LeadTag>) => Promise<LeadTag>;
  deleteTag: (id: number) => Promise<void>;
  getTag: (id: number) => Promise<LeadTag>;
  refreshTags: () => Promise<void>;
}

export interface UseLeadCustomFieldsReturn {
  customFields: LeadCustomField[];
  loading: boolean;
  error: string | null;
  createCustomField: (field: Omit<LeadCustomField, 'id' | 'created_at' | 'updated_at'>) => Promise<LeadCustomField>;
  updateCustomField: (id: number, field: Partial<LeadCustomField>) => Promise<LeadCustomField>;
  deleteCustomField: (id: number) => Promise<void>;
  getCustomField: (id: number) => Promise<LeadCustomField>;
  refreshCustomFields: () => Promise<void>;
}

export interface UseLeadScoringReturn {
  scores: LeadScore[];
  loading: boolean;
  error: string | null;
  calculateScore: (leadId: number) => Promise<LeadScore>;
  updateScore: (leadId: number, score: number, reason: string) => Promise<void>;
  getScore: (leadId: number) => Promise<LeadScore>;
  refreshScores: () => Promise<void>;
}

export interface UseLeadAutomationReturn {
  automations: LeadAutomation[];
  loading: boolean;
  error: string | null;
  createAutomation: (automation: Omit<LeadAutomation, 'id' | 'created_at' | 'updated_at'>) => Promise<LeadAutomation>;
  updateAutomation: (id: number, automation: Partial<LeadAutomation>) => Promise<LeadAutomation>;
  deleteAutomation: (id: number) => Promise<void>;
  getAutomation: (id: number) => Promise<LeadAutomation>;
  refreshAutomations: () => Promise<void>;
}

export interface UseLeadPerformanceReturn {
  performance: LeadPerformance[];
  loading: boolean;
  error: string | null;
  getPerformance: (leadId: number) => Promise<LeadPerformance>;
  refreshPerformance: () => Promise<void>;
}

export interface UseLeadEngagementReturn {
  engagement: LeadEngagement[];
  loading: boolean;
  error: string | null;
  getEngagement: (leadId: number) => Promise<LeadEngagement>;
  refreshEngagement: () => Promise<void>;
}

export interface UseLeadHealthReturn {
  healthScores: LeadHealthScore[];
  loading: boolean;
  error: string | null;
  getHealthScore: (leadId: number) => Promise<LeadHealthScore>;
  refreshHealthScores: () => Promise<void>;
}

export interface UseLeadAttributionReturn {
  attribution: LeadAttribution[];
  loading: boolean;
  error: string | null;
  getAttribution: (leadId: number) => Promise<LeadAttribution>;
  refreshAttribution: () => Promise<void>;
}

export interface UseLeadROIReturn {
  roi: LeadROI[];
  loading: boolean;
  error: string | null;
  getROI: (leadId: number) => Promise<LeadROI>;
  refreshROI: () => Promise<void>;
}

export interface UseLeadForecastingReturn {
  forecasts: LeadForecast[];
  loading: boolean;
  error: string | null;
  generateForecast: (period: string) => Promise<LeadForecast[]>;
  refreshForecasts: () => Promise<void>;
}

// Component props types
export interface LeadFormProps {
  lead?: Lead;
  onSubmit: (lead: LeadFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface LeadFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  onReset: () => void;
}

export interface LeadDetailsProps {
  lead: Lead;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: number) => void;
}

export interface LeadMetricsProps {
  metrics: LeadMetrics;
  loading?: boolean;
  error?: string;
}

export interface LeadMetricsDisplayProps {
  metrics: LeadMetrics;
  period: string;
  onPeriodChange: (period: string) => void;
}

export interface LeadActivityFormProps {
  leadId: number;
  onSubmit: (activity: Omit<LeadActivity, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export interface LeadActivityTimelineProps {
  activities: LeadActivity[];
  loading?: boolean;
  error?: string;
}

export interface LeadTagsProps {
  tags: LeadTag[];
  selectedTags: number[];
  onTagSelect: (tagId: number) => void;
  onTagDeselect: (tagId: number) => void;
  onCreateTag: (tag: Omit<LeadTag, 'id'>) => void;
}

export interface LeadSegmentFormProps {
  segment?: LeadSegment;
  onSubmit: (segment: Omit<LeadSegment, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export interface LeadScoreUpdaterProps {
  leadId: number;
  currentScore: number;
  onScoreUpdate: (score: number, reason: string) => void;
}

export interface AdvancedLeadManagerProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  onLeadSelect: (lead: Lead) => void;
  onLeadUpdate: (lead: Lead) => void;
  onLeadDelete: (id: number) => void;
  onBulkAction: (action: string, leadIds: number[]) => void;
}

export interface CustomFieldFormProps {
  customField?: LeadCustomField;
  onSubmit: (field: Omit<LeadCustomField, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

// Re-export all types for backward compatibility
export type {
  Lead,
  User,
  LeadTag,
  LeadCustomField,
  LeadStatus,
  LeadOrigin,
  LeadStatusUpdate,
  Project,
  ProjectStatus
} from './core';

export type {
  LeadSegment,
  SegmentCriteria,
  LeadSegmentRule
} from './segments';

export type {
  LeadAnalytics,
  LeadPerformance,
  LeadEngagement,
  LeadHealthScore,
  LeadAttribution,
  LeadTouchpoint,
  LeadSource,
  LeadROI,
  LeadForecast,
  LeadMetrics,
  LeadScore,
  LeadScoreFactor,
  LeadScoreRule,
  LeadScoreCondition,
  LeadScoreAction,
  LeadScoreUpdate,
  LeadReport,
  LeadDashboard,
  LeadDashboardWidget
} from './analytics';

export type {
  LeadActivity,
  LeadActivityRecord,
  LeadNote,
  LeadTask,
  LeadPipeline,
  LeadStage,
  LeadAutomation,
  AutomationTrigger,
  AutomationCondition,
  AutomationAction,
  LeadAutomationRule,
  LeadWorkflow,
  WorkflowTrigger,
  WorkflowStep,
  WorkflowCondition,
  LeadAutomationFlow,
  LeadAutomationStep,
  LeadFilters,
  LeadFormData,
  LeadImport,
  LeadImportError,
  LeadImportResult,
  LeadImportTemplate,
  LeadImportField,
  LeadImportValidation,
  LeadExport,
  LeadExportOptions,
  LeadExportTemplate,
  LeadDuplicate,
  LeadMerge,
  LeadIntegration,
  LeadWebhook,
  LeadDocument
} from './management';

export type {
  LeadCustomFieldValue,
  LeadCustomFieldGroup,
  LeadCustomFieldValidation
} from './customFields';
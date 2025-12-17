// Exportar service orquestrador principal
export { workflowsService, default as workflowService } from './workflowsService';

// Exportar services especializados
export { workflowManagementService } from './workflowManagementService';
export { workflowExecutionService } from './workflowExecutionService';
export { workflowQueueService } from './workflowQueueService';
export { workflowMetricsService } from './workflowMetricsService';
export { workflowTemplatesService } from './workflowTemplatesService';
export { workflowValidationService } from './workflowValidationService';
export { workflowCanvasService } from './workflowCanvasService';

// Exportar tipos do service orquestrador
export type {
  WorkflowsServiceConfig,
  GlobalWorkflowStats,
  WorkflowSearchParams,
  WorkflowPaginatedResponse,
  CreateWorkflowData,
  UpdateWorkflowData,
  ExecutionParams,
  ExecutionSearchParams,
  ExecutionPaginatedResponse,
  ExecutionStats,
  AddToQueueParams,
  UpdateQueueItemParams,
  QueueFilterParams,
  MetricsFilterParams,
  PerformanceReport,
  CreateTemplateData,
  UpdateTemplateData,
  TemplateSearchParams,
  TemplatePaginatedResponse,
  UseTemplateParams,
  DetailedValidationResult,
  ExecutionValidationResult,
  TemplateValidationResult,
  OptimizedLayout,
  LayoutConfig,
  CanvasStats
} from './workflowsService';

// Exportar tipos dos services especializados
export type {
  ValidationError,
  ValidationWarning,
  ValidationSuggestion
} from './workflowValidationService';

export type {
  NodePosition,
  NodeDimensions
} from './workflowCanvasService';

export type {
  TemplateCategory
} from './workflowTemplatesService';

export type {
  SystemMetrics,
  PerformanceMetrics
} from './workflowMetricsService';

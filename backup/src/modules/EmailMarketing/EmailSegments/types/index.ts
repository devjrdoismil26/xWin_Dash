/**
 * Exportações centralizadas dos tipos do módulo EmailSegments
 */

// Tipos principais
export * from './emailSegmentsTypes';

// Re-exportar tipos específicos para facilitar importação
export type {
  EmailSegment,
  SegmentCriteria,
  SegmentOperator,
  SegmentField,
  SegmentFieldOption,
  SegmentFieldValidation,
  SegmentGroup,
  SegmentBuilder,
  SegmentPreviewSubscriber,
  SegmentValidationError,
  SegmentAnalytics,
  SegmentMetrics,
  TimeSeriesData,
  AgeGroupData,
  LocationData,
  DeviceData,
  SourceData,
  SegmentFilter,
  SegmentFilterBuilder,
  SegmentResponse,
  SegmentAnalyticsResponse,
  SegmentPreviewResponse,
  SegmentFilters,
  SegmentSort,
  UseEmailSegmentsReturn,
  UseSegmentBuilderReturn,
  SegmentListProps,
  SegmentBuilderProps,
  SegmentAnalyticsProps,
  SegmentFiltersProps
} from './emailSegmentsTypes';

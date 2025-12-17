/**
 * Exportações centralizadas dos tipos do módulo EmailTemplates
 */

// Tipos principais
export * from './emailTemplatesTypes';

// Re-exportar tipos específicos para facilitar importação
export type {
  EmailTemplate,
  TemplateImage,
  TemplateVariable,
  TemplateCategory,
  TemplateUsage,
  TemplateEditor,
  TemplateElement,
  TemplateStyles,
  TemplateState,
  TemplateBuilder,
  TemplateLayout,
  TemplateLayoutStructure,
  TemplateSection,
  TemplateResponse,
  TemplateCategoryResponse,
  TemplateUsageResponse,
  TemplateFilters,
  TemplateSort,
  UseEmailTemplatesReturn,
  UseTemplateEditorReturn,
  TemplateListProps,
  TemplateEditorProps,
  TemplatePreviewProps,
  TemplateBuilderProps
} from './emailTemplatesTypes';

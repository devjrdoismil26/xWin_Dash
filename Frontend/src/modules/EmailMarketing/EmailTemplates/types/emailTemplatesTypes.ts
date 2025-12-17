/**
 * Tipos consolidados para o módulo EmailTemplates
 * Sistema de templates de email
 */

// ===== CORE TEMPLATE INTERFACES =====
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview_text?: string;
  category: string;
  content: {
    html: string;
  text: string;
  images: TemplateImage[]; };

  variables: TemplateVariable[];
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  usage_count: number;
  preview_url?: string;
  thumbnail_url?: string;
  tags: string[];
  description?: string;
  version: number;
  parent_template_id?: string;
}

export interface TemplateImage {
  id: string;
  url: string;
  alt_text: string;
  width: number;
  height: number;
  is_uploaded: boolean; }

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  default_value?: string | number | boolean | Record<string, any> | unknown[];
  required: boolean;
  description?: string;
  validation?: {
    min_length?: number;
  max_length?: number;
  pattern?: string;
  min_value?: number;
  max_value?: number; };

}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  template_count: number;
  is_active: boolean; }

export interface TemplateUsage {
  template_id: string;
  campaign_id: string;
  campaign_name: string;
  used_at: string;
  metrics?: {
    sent: number;
  opened: number;
  clicked: number;
  conversions: number; };

}

// ===== TEMPLATE EDITOR INTERFACES =====
export interface TemplateEditor {
  template: EmailTemplate;
  is_dirty: boolean;
  current_step: 'design' | 'content' | 'variables' | 'preview' | 'settings';
  selected_element?: TemplateElement;
  undo_stack: TemplateState[];
  redo_stack: TemplateState[];
  loading?: boolean; }

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'social' | 'footer';
  content: string;
  styles: TemplateStyles;
  position: {
    x: number;
  y: number;
  width: number;
  height: number; };

  parent_id?: string;
  children?: string[];
}

export interface TemplateStyles {
  font_family?: string;
  font_size?: number;
  font_weight?: 'normal' | 'bold';
  color?: string;
  background_color?: string;
  text_align?: 'left' | 'center' | 'right' | 'justify';
  padding?: {
    top: number;
  right: number;
  bottom: number;
  left: number; };

  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;};

  border?: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: string;};

  border_radius?: number;
}

export interface TemplateState {
  template: EmailTemplate;
  timestamp: number;
  action: string;
  loading?: boolean; }

// ===== TEMPLATE BUILDER INTERFACES =====
export interface TemplateBuilder {
  template: Partial<EmailTemplate>;
  selected_category: string;
  selected_layout: string;
  custom_elements: TemplateElement[];
  is_preview_mode: boolean;
  preview_data: Record<string, any>; }

export interface TemplateLayout {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  structure: TemplateLayoutStructure;
  is_responsive: boolean;
  is_custom: boolean; }

export interface TemplateLayoutStructure {
  sections: TemplateSection[];
  styles: TemplateStyles;
  breakpoints: {
    mobile: TemplateStyles;
  tablet: TemplateStyles;
  desktop: TemplateStyles; };

}

export interface TemplateSection {
  id: string;
  type: 'header' | 'content' | 'footer' | 'sidebar';
  elements: TemplateElement[];
  styles: TemplateStyles;
  background?: {
    color?: string;
  image?: string;
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  position?: 'top' | 'center' | 'bottom'; };

}

// ===== API RESPONSE INTERFACES =====
export interface TemplateResponse {
  success: boolean;
  data?: EmailTemplate | EmailTemplate[];
  message?: string;
  error?: string; }

export interface TemplateCategoryResponse {
  success: boolean;
  data?: TemplateCategory | TemplateCategory[];
  message?: string;
  error?: string; }

export interface TemplateUsageResponse {
  success: boolean;
  data?: TemplateUsage[];
  message?: string;
  error?: string; }

// ===== UTILITY TYPES =====
export interface TemplateFilters {
  category?: string;
  is_active?: boolean;
  is_public?: boolean;
  tags?: string[];
  search?: string;
  created_by?: string; }

export interface TemplateSort {
  field: 'name' | 'category' | 'created_at' | 'updated_at' | 'usage_count';
  direction: 'asc' | 'desc'; }

// ===== HOOK RETURN TYPES =====
export interface UseEmailTemplatesReturn {
  templates: EmailTemplate[];
  categories: TemplateCategory[];
  loading: boolean;
  error: string | null;
  fetchTemplates: (filters?: TemplateFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createTemplate: (templateData: Partial<EmailTemplate>) => Promise<TemplateResponse>;
  updateTemplate: (id: string, templateData: Partial<EmailTemplate>) => Promise<TemplateResponse>;
  deleteTemplate: (id: string) => Promise<TemplateResponse>;
  duplicateTemplate: (id: string) => Promise<TemplateResponse>;
  publishTemplate: (id: string) => Promise<TemplateResponse>;
  unpublishTemplate: (id: string) => Promise<TemplateResponse>;
  getTemplateUsage: (id: string) => Promise<TemplateUsage[]>;
  getTemplateById: (id: string) => EmailTemplate | undefined;
  getTemplatesByCategory: (category: string) => EmailTemplate[];
  getPublicTemplates: () => EmailTemplate[];
  formatTemplateMetrics: (template: EmailTemplate) => Record<string, any>;
  validateTemplate: (template: EmailTemplate) => { isValid: boolean;
  errors: string[] 
  data?: string;
  success?: boolean;
  message?: string; };

}

export interface UseTemplateEditorReturn {
  editor: TemplateEditor;
  updateTemplate?: (e: any) => void;
  updateElement?: (e: any) => void;
  addElement?: (e: any) => void;
  removeElement?: (e: any) => void;
  selectElement?: (e: any) => void;
  deselectElement??: (e: any) => void;
  undo??: (e: any) => void;
  redo??: (e: any) => void;
  canUndo: boolean;
  canRedo: boolean;
  saveTemplate: () => Promise<TemplateResponse>;
  previewTemplate: (data: Record<string, any>) => string;
  exportTemplate: (format: 'html' | 'json') => string;
  importTemplate?: (e: any) => void;
  resetEditor??: (e: any) => void;
  success?: boolean;
  message?: string;
  error?: string; }

// ===== COMPONENT PROPS TYPES =====
export interface TemplateListProps {
  templates: EmailTemplate[];
  categories: TemplateCategory[];
  loading?: boolean;
  error?: string;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onDuplicate??: (e: any) => void;
  onUse??: (e: any) => void;
  onPreview??: (e: any) => void;
  className?: string;
  [key: string]: unknown; }

export interface TemplateEditorProps {
  template?: EmailTemplate;
  onSave??: (e: any) => void;
  onCancel???: (e: any) => void;
  onPreview??: (e: any) => void;
  className?: string;
  [key: string]: unknown; }

export interface TemplatePreviewProps {
  template: EmailTemplate;
  previewData?: Record<string, any>;
  isFullscreen?: boolean;
  onClose???: (e: any) => void;
  className?: string;
  [key: string]: unknown; }

export interface TemplateBuilderProps {
  onSave??: (e: any) => void;
  onCancel???: (e: any) => void;
  initialTemplate?: Partial<EmailTemplate>;
  className?: string;
  [key: string]: unknown; }

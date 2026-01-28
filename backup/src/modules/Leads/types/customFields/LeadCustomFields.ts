// ========================================
// TIPOS DE CAMPOS CUSTOMIZADOS
// ========================================

export interface LeadCustomField {
  id: number;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  required: boolean;
  options?: string[];
  default_value?: any;
  validation_rules?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LeadCustomFieldValue {
  id: number;
  lead_id: number;
  custom_field_id: number;
  value: any;
  created_at: string;
  updated_at: string;
}

export interface LeadCustomFieldGroup {
  id: number;
  name: string;
  description?: string;
  fields: LeadCustomField[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadCustomFieldValidation {
  field_id: number;
  rules: {
    required?: boolean;
    min_length?: number;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    pattern?: string;
    custom?: (value: any) => boolean;
  };
  error_messages: Record<string, string>;
}
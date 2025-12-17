import { LeadCustomField } from '@/types/leads-extended';
// ========================================
// EXPORTS - TIPOS DO LEADS CUSTOM FIELDS
// ========================================
// Tipos específicos para campos customizados de leads

export * from '@/types';


export interface CustomFieldFormProps {
  field?: LeadCustomField;
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  [key: string]: unknown; }

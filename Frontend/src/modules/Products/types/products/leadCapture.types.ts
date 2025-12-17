export interface LeadCaptureForm {
  id: string;
  name: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: FormSettings;
  design: FormDesign;
  integrations: FormIntegration[];
  analytics: FormAnalytics;
  status: FormStatus;
  productId?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date; }

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  validation: FieldValidation;
  options?: FieldOption[];
  order: number; }

export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  customValidator?: string; }

export interface FieldOption {
  label: string;
  value: string; }

export interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
  redirectUrl?: string;
  sendEmail: boolean;
  emailRecipients: string[];
  allowMultipleSubmissions: boolean;
  [key: string]: unknown; }

export interface FormDesign {
  theme: string;
  colors: FormColors;
  layout: FormLayout;
  customCSS?: string; }

export interface FormColors {
  primary: string;
  background: string;
  text: string;
  border: string; }

export interface FormLayout {
  columns: number;
  spacing: number;
  alignment: 'left' | 'center' | 'right'; }

export interface FormIntegration {
  id: string;
  type: IntegrationType;
  config: Record<string, any>;
  enabled: boolean; }

export interface FormAnalytics {
  views: number;
  submissions: number;
  conversionRate: number;
  averageTime: number; }

export type FormStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
export type IntegrationType = 'email' | 'crm' | 'webhook' | 'zapier' | 'custom';

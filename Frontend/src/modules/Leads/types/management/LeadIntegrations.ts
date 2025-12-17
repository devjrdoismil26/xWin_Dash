// ========================================
// TIPOS DE INTEGRAÇÕES E WEBHOOKS
// ========================================

export interface LeadIntegration {
  id: number;
  name: string;
  type: 'crm' | 'email' | 'analytics' | 'social' | 'phone';
  provider: string;
  configuration: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export interface LeadWebhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export interface LeadDocument {
  id: number;
  lead_id: number;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_by: number;
  uploaded_at: string; }

export interface LeadDuplicate {
  lead_id: number;
  duplicate_lead_id: number;
  similarity_score: number;
  matching_fields: string[];
  created_at: string; }

export interface LeadMerge {
  primary_lead_id: number;
  secondary_lead_id: number;
  merged_data: Record<string, any>;
  merged_by: number;
  merged_at: string; }
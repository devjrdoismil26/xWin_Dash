import { LeadFilters } from '@/types/leads';
// ========================================
// TIPOS DE GESTÃO
// ========================================

export interface LeadPipeline {
  id: number;
  name: string;
  description?: string;
  stages: LeadStage[];
  is_default: boolean;
  created_at: string;
  updated_at: string; }

export interface LeadStage {
  id: number;
  pipeline_id: number;
  name: string;
  description?: string;
  order: number;
  probability: number;
  is_final: boolean;
  color?: string;
  created_at: string;
  updated_at: string; }

export interface LeadTask {
  id: number;
  lead_id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  assigned_user?: User;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string; }

export interface LeadNote {
  id: number;
  lead_id: number;
  content: string;
  author_id: number;
  author?: User;
  is_private: boolean;
  created_at: string;
  updated_at: string; }

export interface LeadActivity {
  id: number;
  lead_id: number;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change' | 'score_update' | 'tag_added' | 'tag_removed';
  description: string;
  user_id?: number;
  user?: User;
  metadata?: Record<string, any>;
  created_at: string; }

export interface LeadActivityRecord {
  id: number;
  lead_id: number;
  activity_type: string;
  description: string;
  user_id?: number;
  metadata?: Record<string, any>;
  created_at: string; }

// Re-export User from core
export type { User } from '../core/Lead';

// Additional exports

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type LeadOrigin = 'website' | 'social_media' | 'email' | 'referral' | 'direct' | 'advertising' | 'other';

export const LEAD_STATUSES = [
  { value: 'new', label: 'Novo' },
  { value: 'contacted', label: 'Contatado' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'won', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
] as const;

export const LEAD_ORIGINS = [
  { value: 'website', label: 'Website' },
  { value: 'social_media', label: 'Redes Sociais' },
  { value: 'email', label: 'Email' },
  { value: 'referral', label: 'Indicação' },
  { value: 'direct', label: 'Direto' },
  { value: 'advertising', label: 'Publicidade' },
  { value: 'other', label: 'Outro' },
] as const;

export const ACTIVITY_TYPES = [
  { value: 'note', label: 'Nota' },
  { value: 'call', label: 'Ligação' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'status_change', label: 'Mudança de Status' },
  { value: 'score_update', label: 'Atualização de Score' },
  { value: 'tag_added', label: 'Tag Adicionada' },
  { value: 'tag_removed', label: 'Tag Removida' },
] as const;

// Additional exports

export interface LeadFormProps {
  lead?: Lead;
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  statuses?: LeadStatus[];
  origins?: LeadOrigin[];
  [key: string]: unknown; }

export interface LeadDetailsProps {
  lead: Lead;
  onUpdate?: (e: any) => void;
  statuses?: LeadStatus[];
  origins?: LeadOrigin[];
  [key: string]: unknown; }

export interface LeadActivityFormProps {
  leadId: number;
  activity?: LeadActivity;
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  [key: string]: unknown; }

export interface LeadActivityTimelineProps {
  activities: LeadActivity[];
  onActivityClick??: (e: any) => void;
  [key: string]: unknown; }

export interface LeadScoreUpdaterProps {
  leadId: number;
  currentScore: number;
  onScoreUpdate?: (e: any) => void;
  [key: string]: unknown; }

export interface AdvancedLeadManagerProps {
  projectId: number;
  initialFilters?: LeadFilters;
  [key: string]: unknown; }

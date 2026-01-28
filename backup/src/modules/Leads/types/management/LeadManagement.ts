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
  updated_at: string;
}

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
  updated_at: string;
}

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
  updated_at: string;
}

export interface LeadNote {
  id: number;
  lead_id: number;
  content: string;
  author_id: number;
  author?: User;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: number;
  lead_id: number;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change' | 'score_update' | 'tag_added' | 'tag_removed';
  description: string;
  user_id?: number;
  user?: User;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LeadActivityRecord {
  id: number;
  lead_id: number;
  activity_type: string;
  description: string;
  user_id?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

// Re-export User from core
export type { User } from '../core/Lead';
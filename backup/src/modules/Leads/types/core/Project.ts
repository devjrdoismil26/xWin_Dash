// ========================================
// TIPOS CORE - PROJECT
// ========================================

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled';
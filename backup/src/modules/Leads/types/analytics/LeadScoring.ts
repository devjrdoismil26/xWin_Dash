// ========================================
// TIPOS DE SCORING
// ========================================

export interface LeadScore {
  id: number;
  lead_id: number;
  score: number;
  factors: LeadScoreFactor[];
  calculated_at: string;
}

export interface LeadScoreFactor {
  factor: string;
  weight: number;
  value: number;
  contribution: number;
}

export interface LeadScoreRule {
  id: number;
  name: string;
  description?: string;
  conditions: LeadScoreCondition[];
  actions: LeadScoreAction[];
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface LeadScoreCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
  weight: number;
}

export interface LeadScoreAction {
  type: 'add_points' | 'subtract_points' | 'multiply_points' | 'set_score';
  value: number;
  description?: string;
}

export interface LeadScoreUpdate {
  lead_id: number;
  new_score: number;
  reason: string;
  user_id?: number;
}
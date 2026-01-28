// ========================================
// TIPOS DE AUTOMAÇÃO
// ========================================

export interface LeadAutomation {
  id: number;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AutomationTrigger {
  type: 'lead_created' | 'lead_updated' | 'score_threshold' | 'status_change' | 'manual' | 'schedule';
  conditions?: Record<string, any>;
  schedule?: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in';
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface AutomationAction {
  type: 'send_email' | 'assign_user' | 'update_status' | 'update_score' | 'add_tag' | 'create_task' | 'webhook';
  parameters: Record<string, any>;
}

export interface LeadAutomationRule {
  id: number;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface LeadWorkflow {
  id: number;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTrigger {
  type: 'lead_created' | 'lead_updated' | 'score_threshold' | 'status_change' | 'manual';
  conditions?: Record<string, any>;
}

export interface WorkflowStep {
  id: number;
  workflow_id: number;
  name: string;
  type: 'condition' | 'action' | 'delay' | 'webhook';
  parameters: Record<string, any>;
  order: number;
  next_step_id?: number;
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface LeadAutomationFlow {
  id: number;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  steps: LeadAutomationStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadAutomationStep {
  id: number;
  flow_id: number;
  name: string;
  type: 'condition' | 'action' | 'delay' | 'webhook';
  parameters: Record<string, any>;
  order: number;
  next_step_id?: number;
  conditions?: WorkflowCondition[];
  actions?: AutomationAction[];
}
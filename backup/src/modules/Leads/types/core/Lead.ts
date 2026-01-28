// ========================================
// TIPOS CORE - LEAD
// ========================================

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  position?: string;
  status: LeadStatus;
  score: number;
  origin: LeadOrigin;
  project_id: number;
  assigned_to?: User;
  tags: LeadTag[];
  custom_fields: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface LeadTag {
  id: number;
  name: string;
  color?: string;
  description?: string;
}

export interface LeadCustomField {
  id: number;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  required: boolean;
  options?: string[];
  default_value?: any;
  validation_rules?: Record<string, any>;
}

// ========================================
// ENUMS E TYPES
// ========================================

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'
  | 'nurturing'
  | 'unqualified'
  | 'recycled';

export type LeadOrigin = 
  | 'website'
  | 'social_media'
  | 'email_campaign'
  | 'referral'
  | 'cold_call'
  | 'event'
  | 'advertisement'
  | 'search_engine'
  | 'direct_mail'
  | 'other';

export type LeadStatusUpdate = {
  lead_id: number;
  old_status: LeadStatus;
  new_status: LeadStatus;
  reason?: string;
  user_id?: number;
  created_at: string;
};

// ========================================
// CONSTANTS
// ========================================

export const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
  'nurturing',
  'unqualified',
  'recycled'
];

export const LEAD_ORIGINS: LeadOrigin[] = [
  'website',
  'social_media',
  'email_campaign',
  'referral',
  'cold_call',
  'event',
  'advertisement',
  'search_engine',
  'direct_mail',
  'other'
];

export const ACTIVITY_TYPES = [
  'call',
  'email',
  'meeting',
  'note',
  'task',
  'proposal',
  'demo',
  'follow_up',
  'other'
] as const;

export type ActivityType = typeof ACTIVITY_TYPES[number];
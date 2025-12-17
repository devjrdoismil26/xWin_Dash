// ========================================
// TIPOS DE TAGS
// ========================================

export interface LeadTag {
  id: number;
  name: string;
  color?: string;
  description?: string;
  usage_count?: number;
  created_at: string;
  updated_at: string; }

export interface LeadTagGroup {
  id: number;
  name: string;
  description?: string;
  tags: LeadTag[];
  color?: string;
  created_at: string;
  updated_at: string; }

export interface LeadTagAssignment {
  lead_id: number;
  tag_id: number;
  assigned_by: number;
  assigned_at: string; }


export interface LeadTagsProps {
  leadId: number;
  tags: LeadTag[];
  onTagsChange?: (e: any) => void;
  [key: string]: unknown; }

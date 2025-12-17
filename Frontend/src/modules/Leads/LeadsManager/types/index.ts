import { LeadFilters } from '@/types/leads';
import { LeadActivity } from '@/types/leads-extended';
// ========================================
// EXPORTS - TIPOS DO LEADS MANAGER
// ========================================
// Tipos específicos para gerenciamento de leads

export * from '@/types';


// Component Props
export interface AdvancedLeadManagerProps {
  projectId: string;
  filters?: LeadFilters;
  onLeadSelect??: (e: any) => void;
  [key: string]: unknown; }

export interface LeadActivityFormProps {
  leadId: string;
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  [key: string]: unknown; }

export interface LeadActivityTimelineProps {
  leadId: string;
  activities: LeadActivity[];
  onActivityClick??: (e: any) => void;
  [key: string]: unknown; }

export interface LeadDetailsProps {
  lead: Lead;
  onEdit???: (e: any) => void;
  onDelete???: (e: any) => void;
  [key: string]: unknown; }

export interface LeadFormProps {
  lead?: Lead;
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  [key: string]: unknown; }

export interface LeadScoreUpdaterProps {
  leadId: string;
  currentScore: number;
  onUpdate?: (e: any) => void;
  [key: string]: unknown; }

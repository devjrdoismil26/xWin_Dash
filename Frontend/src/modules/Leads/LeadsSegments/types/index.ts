import { LeadSegment } from '@/types/leads-extended';
import { LeadTag } from '@/types/leads-extended';
// ========================================
// EXPORTS - TIPOS DO LEADS SEGMENTS
// ========================================
// Tipos específicos para segmentação de leads

export * from '@/types';


export interface LeadSegmentFormProps {
  segment?: LeadSegment;
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  [key: string]: unknown; }

export interface LeadTagsProps {
  leadId: string;
  tags: LeadTag[];
  onTagAdd?: (e: any) => void;
  onTagRemove?: (e: any) => void;
  [key: string]: unknown; }

// Extended Lead Types
import { Lead, LeadFilters } from './leads';

export interface LeadSegment {
  id: string;
  name: string;
  description?: string;
  rules: LeadSegmentRule[];
  leadCount?: number;
  createdAt: Date;
  updatedAt: Date; }

export interface LeadSegmentRule {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: unknown; }

export interface LeadCustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  required?: boolean;
  defaultValue?: string; }

export interface LeadTag {
  id: string;
  name: string;
  color?: string;
  count?: number; }

export interface LeadActivity {
  id: string;
  leadId: string;
  type: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  userId?: string; }

export interface LeadAutomation {
  id: string;
  name: string;
  trigger: string;
  conditions: LeadAutomationCondition[];
  actions: LeadAutomationAction[];
  active: boolean; }

export interface LeadAutomationCondition {
  field: string;
  operator: string;
  value: unknown; }

export interface LeadAutomationAction {
  type: string;
  config: Record<string, any>; }

// Re-export for convenience
export type { Lead, LeadFilters};

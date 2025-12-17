import React from 'react';

// Common API Response Types
export interface ApiResponse<T = any> {
  meta?: Record<string, any>;
  data?: T;
  success: boolean;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number; }

export interface BaseEntity {
  id: string | number;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date; }

export interface NamedEntity extends BaseEntity {
  name: string;
  description?: string;
}

export interface TaggedEntity {
  tags?: string[] | Tag[]; }

export interface Tag {
  id: string | number;
  name: string;
  color?: string; }

export interface FilterableEntity {
  filters?: Record<string, any>;
  filter?: string; }

export interface LoadingState {
  loading: boolean;
  error?: string | null; }

export interface StatsEntity {
  stats?: Record<string, number>;
  metrics?: Record<string, any>; }


// Workflow Node Types
export interface WorkflowNode {
  id: string;
  type: string;
  data: unknown;
  position: { x: number;
  y: number;
};

  isConnectable?: boolean;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string; }

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges?: WorkflowEdge[];
  [key: string]: unknown; }


// Social Account Types
export interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  username?: string;
  status: 'connected' | 'disconnected' | 'error';
  avatar?: string; }

export interface SocialPost {
  id: string;
  content: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_at?: string | Date;
  published_at?: string | Date; }


// Email Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category?: string; }

export interface EmailCampaignData {
  id: string;
  name: string;
  subject: string;
  status: string;
  recipients?: number;
  sent?: number;
  opened?: number;
  clicked?: number;
  [key: string]: unknown; }


// Common Component Props
export interface SelectProps {
  Trigger?: React.ComponentType<any>;
  Content?: React.ComponentType<any>;
  value?: string;
  onChange?: (e: any) => void;
  options?: Array<{ value: unknown;
  label: string
  [key: string]: unknown; }>;
}

export interface CardProps {
  Content?: React.ComponentType<any>;
  Header?: React.ComponentType<any>;
  Footer?: React.ComponentType<any>;
  children?: React.ReactNode;
  [key: string]: unknown; }

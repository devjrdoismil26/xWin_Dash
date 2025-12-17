import React from 'react';
// Base Props for Components
import { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  style?: React.CSSProperties;
  [key: string]: unknown; }

export interface BaseFormProps extends BaseComponentProps {
  onSubmit?: (e: any) => void;
  onCancel???: (e: any) => void;
  onReset???: (e: any) => void;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
}

export interface BaseListProps extends BaseComponentProps {
  data?: string[];
  loading?: boolean;
  error?: string | null;
  onItemClick??: (e: any) => void;
  onItemSelect??: (e: any) => void;
  emptyMessage?: string;
}

export interface BaseModalProps extends BaseComponentProps {
  isOpen?: boolean;
  onClose???: (e: any) => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface BaseFilterProps extends BaseComponentProps {
  filters?: Record<string, any>;
  onFilterChange??: (e: any) => void;
  onReset???: (e: any) => void;
}

export interface BaseSchedulerProps extends BaseComponentProps {
  onSchedulerCreate??: (e: any) => void;
  onSchedulerUpdate??: (e: any) => void;
  onSchedulerDelete??: (e: any) => void;
  schedulers?: string[];
}

export interface BaseIntegrationProps extends BaseComponentProps {
  onIntegrationCreate??: (e: any) => void;
  onIntegrationUpdate??: (e: any) => void;
  onIntegrationDelete??: (e: any) => void;
  integrations?: string[];
}

export interface BaseManagerProps extends BaseComponentProps {
  onAdd???: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onRefresh???: (e: any) => void;
  items?: string[];
}

// Campaign Props
export interface CampaignData {
  id?: string;
  name: string;
  status: 'active' | 'draft' | 'paused' | 'completed';
  platform: string;
  budget?: number;
  daily_budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  roas?: number;
  objective?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  created_at?: string | Date;
  updated_at?: string | Date;
  total_spend?: number;
  [key: string]: unknown; }

// Account Props
export interface AccountData {
  id?: string;
  name: string;
  email?: string;
  status?: string;
  balance?: number;
  currency?: string;
  timezone?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  [key: string]: unknown; }

// User Props
export interface UserData {
  id?: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  status?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  user?: UserData;
  // For nested user objects
  [key: string]: unknown; }

// Response Props
export interface ResponseData {
  response?: string;
  data?: string;
  success?: boolean;
  error?: string | null;
  message?: string;
  status?: number;
  [key: string]: unknown; }

// Hook Return Props
export interface BaseHookReturn {
  loading: boolean;
  error: string | null;
  clearError???: (e: any) => void;
  refresh?: () => Promise<void>; }

export interface DataHookReturn<T = any> extends BaseHookReturn {
  data: T[];
  setData??: (e: any) => void;
  fetchData?: () => Promise<void>;
}

export interface CrudHookReturn<T = any> extends DataHookReturn<T> {
  create?: (data: Partial<T>) => Promise<T>;
  update?: (id: string, data: Partial<T>) => Promise<T>;
  delete?: (id: string) => Promise<void>;
  get?: (id: string) => Promise<T>;
}

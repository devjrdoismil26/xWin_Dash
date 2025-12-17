// Aura Module Types
export interface AuraConnection {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  config?: AuraConnectionConfig;
  created_at: string;
  updated_at: string; }

export interface AuraConnectionConfig {
  webhook_url?: string;
  api_key?: string;
  auto_reply?: boolean;
  business_hours?: {
    enabled: boolean;
  schedule: Record<string, { start: string;
  end: string
  [key: string]: unknown; }>;};

}

export interface AuraChat {
  id: string;
  connection_id: string;
  contact_name: string;
  contact_phone: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string; }

export interface AuraMessage {
  id: string;
  chat_id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  content: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  media_url?: string;
  created_at: string; }

export interface AuraFlow {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  actions: AuraFlowAction[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string; }

export interface AuraFlowAction {
  id: string;
  type: string;
  config: Record<string, any>;
  order: number; }

export interface AuraConversationsData {
  total: number;
  active: number;
  pending: number;
  closed: number;
  recent: AuraChat[];
  [key: string]: unknown; }

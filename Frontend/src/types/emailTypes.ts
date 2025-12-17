export interface EmailType {
  id: number;
  subject: string;
  body: string;
  [key: string]: unknown; }

export interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  status: EmailCampaignStatus;
  list_id: number;
  scheduled_at?: string;
  sent_at?: string;
  stats?: EmailCampaignStats;
  created_at: string;
  updated_at: string; }

export type EmailCampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';

export interface EmailCampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number; }

export interface EmailList {
  id: number;
  name: string;
  description?: string;
  subscribers_count: number;
  active_subscribers: number;
  created_at: string;
  updated_at: string; }

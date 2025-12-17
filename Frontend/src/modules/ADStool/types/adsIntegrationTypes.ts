/**
 * Tipos relacionados a integrações e configurações de API
 * @module modules/ADStool/types/adsIntegrationTypes
 * @description
 * Definições de tipos e interfaces para integrações e configurações de API.
 * @since 1.0.0
 */

import { AdsPlatform } from './adsAccountTypes';

export interface AdsApiConfig {
  api_key?: string;
  access_token?: string;
  refresh_token?: string;
  client_id?: string;
  client_secret?: string;
  account_id?: string;
  webhook_url?: string;
  rate_limit?: number;
  timeout?: number;
  retry_attempts?: number;
  custom_headers?: Record<string, string>;
  environment?: 'sandbox' | 'production';
  version?: string;
  endpoints?: Record<string, string>;
  credentials?: {
    username?: string;
  password?: string;
  certificate?: string;
  private_key?: string;
  [key: string]: unknown; };

  oauth?: {
    authorization_url?: string;
    token_url?: string;
    scope?: string[];
    redirect_uri?: string;};

  webhook?: {
    url?: string;
    secret?: string;
    events?: string[];};

  cache?: {
    enabled?: boolean;
    ttl?: number;
    strategy?: 'memory' | 'redis' | 'database';};

  monitoring?: {
    enabled?: boolean;
    metrics?: string[];
    alerts?: {
      threshold?: number;
      channels?: string[];};
};

}

export interface AdsIntegration {
  id: number;
  platform: AdsPlatform;
  name: string;
  api_config: AdsApiConfig;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
  updated_at: string; }

export interface AdsIntegrationTestResult {
  success: boolean;
  message: string;
  data?: Record<string, any>; }

export interface AdsIntegrationTestProps {
  integration: AdsIntegration;
  onTestComplete??: (e: any) => void;
  onTestError??: (e: any) => void;
  [key: string]: unknown; }

export interface AdsApiConfigurationManagerProps {
  integrations: AdsIntegration[];
  loading?: boolean;
  error?: string | null;
  onIntegrationUpdate??: (e: any) => void;
  onIntegrationDelete??: (e: any) => void;
  onIntegrationTest??: (e: any) => void;
  [key: string]: unknown; }

export interface GoogleAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate??: (e: any) => void;
  [key: string]: unknown; }

export interface LinkedInAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate??: (e: any) => void;
  [key: string]: unknown; }

export interface FacebookAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate??: (e: any) => void;
  [key: string]: unknown; }

export interface TwitterAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate??: (e: any) => void;
  [key: string]: unknown; }

export interface TikTokAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate??: (e: any) => void;
  [key: string]: unknown; }

export interface AdsCampaignSchedule {
  id: string;
  campaign_id: string;
  name: string;
  status: 'active' | 'paused' | 'scheduled' | 'completed';
  platform: AdsPlatform; }

export interface AdsSchedulerProps {
  campaigns: AdsCampaignSchedule[];
  onScheduleUpdate??: (e: any) => void;
  onScheduleDelete??: (e: any) => void;
  loading?: boolean;
  error?: string | null;
  [key: string]: unknown; }

export interface AdsSchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  resource: {
    campaign: Record<string, any>;
  type: 'start' | 'pause' | 'resume' | 'end'; };

  color?: string;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  extendedProps?: {
    campaign_id: string;
    action: string;
    description?: string;
    recurring?: boolean;
    timezone: string;
    recurring_type?: 'daily' | 'weekly' | 'monthly';};

}

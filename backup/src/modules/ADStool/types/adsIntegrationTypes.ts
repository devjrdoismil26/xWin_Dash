/**
 * Tipos relacionados a integrações e configurações de API
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
  };
  oauth?: {
    authorization_url?: string;
    token_url?: string;
    scope?: string[];
    redirect_uri?: string;
  };
  webhook?: {
    url?: string;
    secret?: string;
    events?: string[];
  };
  cache?: {
    enabled?: boolean;
    ttl?: number;
    strategy?: 'memory' | 'redis' | 'database';
  };
  monitoring?: {
    enabled?: boolean;
    metrics?: string[];
    alerts?: {
      threshold?: number;
      channels?: string[];
    };
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
  updated_at: string;
}

export interface AdsIntegrationTestProps {
  integration: AdsIntegration;
  onTestComplete?: (result: any) => void;
  onTestError?: (error: any) => void;
}

export interface AdsApiConfigurationManagerProps {
  integrations: AdsIntegration[];
  loading?: boolean;
  error?: string | null;
  onIntegrationUpdate?: (integration: AdsIntegration) => void;
  onIntegrationDelete?: (integration: AdsIntegration) => void;
  onIntegrationTest?: (integration: AdsIntegration) => void;
}

export interface GoogleAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate?: (integration: AdsIntegration) => void;
}

export interface LinkedInAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate?: (integration: AdsIntegration) => void;
}

export interface FacebookAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate?: (integration: AdsIntegration) => void;
}

export interface TwitterAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate?: (integration: AdsIntegration) => void;
}

export interface TikTokAdsIntegrationProps {
  integration: AdsIntegration;
  onUpdate?: (integration: AdsIntegration) => void;
}

export interface AdsSchedulerProps {
  campaigns: any[];
  onScheduleUpdate?: (campaign: any) => void;
  onScheduleDelete?: (campaign: any) => void;
  loading?: boolean;
  error?: string | null;
}

export interface AdsSchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  resource: {
    campaign: any;
    type: 'start' | 'pause' | 'resume' | 'end';
  };
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
    recurring_type?: 'daily' | 'weekly' | 'monthly';
  };
}

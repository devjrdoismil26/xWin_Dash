/**
 * Tipos consolidados para o módulo EmailCampaigns
 * Sistema de campanhas de email
 */

// ===== CORE CAMPAIGN INTERFACES =====
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  preview_text?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  type: 'regular' | 'automated' | 'ab_test' | 'remarketing' | 'welcome' | 'nurture';
  template_id?: string;
  segment_id?: string;
  list_id?: string;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  content?: {
    html: string;
    text: string;
    images: CampaignImage[];
  };
  settings?: {
    from_name: string;
    from_email: string;
    reply_to: string;
    track_opens: boolean;
    track_clicks: boolean;
    auto_responder: boolean;
  };
  ab_test?: {
    enabled: boolean;
    variants: CampaignVariant[];
    winner_criteria: 'open_rate' | 'click_rate' | 'conversion_rate';
    test_duration: number;
  };
  metrics?: CampaignMetrics;
}

export interface CampaignVariant {
  id: string;
  name: string;
  subject: string;
  content: string;
  percentage: number;
  metrics?: CampaignMetrics;
}

export interface CampaignImage {
  id: string;
  url: string;
  alt_text: string;
  width: number;
  height: number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  complained: number;
  revenue: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  complaint_rate: number;
  conversion_rate: number;
  roi: number;
}

export interface CampaignAnalytics {
  campaign_id: string;
  period: string;
  metrics: CampaignMetrics;
  trends: {
    opens: TimeSeriesData[];
    clicks: TimeSeriesData[];
    conversions: TimeSeriesData[];
    revenue: TimeSeriesData[];
  };
  top_links: LinkPerformance[];
  device_stats: DeviceStats;
  location_stats: LocationStats;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface LinkPerformance {
  url: string;
  clicks: number;
  unique_clicks: number;
  click_rate: number;
}

export interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
  other: number;
}

export interface LocationStats {
  country: string;
  opens: number;
  clicks: number;
  conversions: number;
}

// ===== CAMPAIGN BUILDER INTERFACES =====
export interface CampaignBuilder {
  step: 'details' | 'content' | 'recipients' | 'schedule' | 'review';
  data: CampaignBuilderData;
  errors: CampaignBuilderErrors;
}

export interface CampaignBuilderData {
  details: {
    name: string;
    subject: string;
    preview_text: string;
    type: string;
  };
  content: {
    template_id?: string;
    html: string;
    text: string;
    images: CampaignImage[];
  };
  recipients: {
    segment_id?: string;
    list_id?: string;
    custom_recipients: string[];
  };
  schedule: {
    send_immediately: boolean;
    scheduled_at?: string;
    timezone: string;
  };
  settings: {
    from_name: string;
    from_email: string;
    reply_to: string;
    track_opens: boolean;
    track_clicks: boolean;
  };
}

export interface CampaignBuilderErrors {
  details: Record<string, string>;
  content: Record<string, string>;
  recipients: Record<string, string>;
  schedule: Record<string, string>;
  settings: Record<string, string>;
}

// ===== API RESPONSE INTERFACES =====
export interface CampaignResponse {
  success: boolean;
  data?: EmailCampaign | EmailCampaign[];
  message?: string;
  error?: string;
}

export interface CampaignAnalyticsResponse {
  success: boolean;
  data?: CampaignAnalytics;
  message?: string;
  error?: string;
}

// ===== UTILITY TYPES =====
export interface CampaignFilters {
  status?: string;
  type?: string;
  date_range?: {
    start: string;
    end: string;
  };
  created_by?: string;
  search?: string;
}

export interface CampaignSort {
  field: 'name' | 'status' | 'created_at' | 'sent_at' | 'open_rate' | 'click_rate';
  direction: 'asc' | 'desc';
}

// ===== HOOK RETURN TYPES =====
export interface UseEmailCampaignsReturn {
  campaigns: EmailCampaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: (filters?: CampaignFilters) => Promise<void>;
  createCampaign: (campaignData: Partial<EmailCampaign>) => Promise<CampaignResponse>;
  updateCampaign: (id: string, campaignData: Partial<EmailCampaign>) => Promise<CampaignResponse>;
  deleteCampaign: (id: string) => Promise<CampaignResponse>;
  duplicateCampaign: (id: string) => Promise<CampaignResponse>;
  sendCampaign: (id: string) => Promise<CampaignResponse>;
  pauseCampaign: (id: string) => Promise<CampaignResponse>;
  resumeCampaign: (id: string) => Promise<CampaignResponse>;
  getCampaignAnalytics: (id: string) => Promise<CampaignAnalytics>;
  getCampaignById: (id: string) => EmailCampaign | undefined;
  getCampaignsByStatus: (status: string) => EmailCampaign[];
  getCampaignsByType: (type: string) => EmailCampaign[];
  formatCampaignMetrics: (metrics: CampaignMetrics) => any;
  calculateCampaignROI: (metrics: CampaignMetrics) => number;
}

export interface UseCampaignBuilderReturn {
  builder: CampaignBuilder;
  updateStep: (step: CampaignBuilder['step']) => void;
  updateData: (step: keyof CampaignBuilderData, data: any) => void;
  validateStep: (step: keyof CampaignBuilderData) => boolean;
  validateAll: () => boolean;
  saveDraft: () => Promise<void>;
  createCampaign: () => Promise<CampaignResponse>;
  resetBuilder: () => void;
  getStepProgress: () => number;
  canProceedToNext: () => boolean;
}

// ===== COMPONENT PROPS TYPES =====
export interface CampaignListProps {
  campaigns: EmailCampaign[];
  loading?: boolean;
  error?: string;
  onEdit?: (campaign: EmailCampaign) => void;
  onDelete?: (campaign: EmailCampaign) => void;
  onDuplicate?: (campaign: EmailCampaign) => void;
  onSend?: (campaign: EmailCampaign) => void;
  onPause?: (campaign: EmailCampaign) => void;
  onResume?: (campaign: EmailCampaign) => void;
  onViewAnalytics?: (campaign: EmailCampaign) => void;
  className?: string;
}

export interface CampaignCreatorProps {
  onSave?: (campaign: EmailCampaign) => void;
  onCancel?: () => void;
  initialData?: Partial<EmailCampaign>;
  className?: string;
}

export interface CampaignAnalyticsProps {
  campaign: EmailCampaign;
  analytics?: CampaignAnalytics;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface CampaignBuilderProps {
  onSave?: (campaign: EmailCampaign) => void;
  onCancel?: () => void;
  initialData?: Partial<EmailCampaign>;
  className?: string;
}

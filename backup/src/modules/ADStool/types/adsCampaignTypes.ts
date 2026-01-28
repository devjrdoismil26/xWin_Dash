/**
 * Tipos relacionados a campanhas de anúncios
 */

import { AdsPlatform } from './adsAccountTypes';

export interface AdsCampaign {
  id: number;
  name: string;
  account_id: number;
  platform: AdsPlatform;
  status: AdsCampaignStatus;
  budget?: number;
  daily_budget?: number;
  start_date?: string;
  end_date?: string;
  objective: AdsObjective;
  targeting: AdsTargeting;
  created_at: string;
  updated_at: string;
}

export type AdsCampaignStatus = 
  | 'active' 
  | 'paused' 
  | 'deleted' 
  | 'pending';

export type AdsObjective = 
  | 'awareness'
  | 'traffic'
  | 'engagement'
  | 'leads'
  | 'sales'
  | 'app_installs'
  | 'video_views'
  | 'conversions'
  | 'catalog_sales'
  | 'store_visits';

export interface AdsTargeting {
  age_min?: number;
  age_max?: number;
  genders?: string[];
  locations?: AdsLocation[];
  languages?: string[];
  interests?: string[];
  behaviors?: string[];
  demographics?: AdsDemographics;
  custom_audiences?: string[];
  lookalike_audiences?: string[];
  keywords?: string[];
  placements?: string[];
  devices?: string[];
  operating_systems?: string[];
  connection_types?: string[];
  time_of_day?: string[];
  days_of_week?: string[];
}

export interface AdsLocation {
  country?: string;
  region?: string;
  city?: string;
  postal_code?: string;
  radius?: number;
  latitude?: number;
  longitude?: number;
}

export interface AdsDemographics {
  education?: string[];
  relationship_status?: string[];
  work_employers?: string[];
  work_positions?: string[];
  income?: string[];
  home_ownership?: string[];
  home_type?: string[];
  life_events?: string[];
}

export interface AdsCampaignBudget {
  id: number;
  campaign_id: number;
  budget_type: 'daily' | 'lifetime' | 'monthly';
  amount: number;
  currency: string;
  delivery_method: 'standard' | 'accelerated';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignSchedule {
  id: number;
  campaign_id: number;
  schedule_type: AdsScheduleType;
  schedule_data: AdsScheduleData;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AdsScheduleType = 
  | 'always_on'
  | 'specific_times'
  | 'business_hours'
  | 'custom';

export interface AdsScheduleData {
  days_of_week: number[];
  start_time: string;
  end_time: string;
  timezone: string;
  exceptions?: AdsScheduleException[];
}

export interface AdsScheduleException {
  date: string;
  start_time?: string;
  end_time?: string;
  is_paused: boolean;
  reason?: string;
}

export interface AdsCampaignBidding {
  id: number;
  campaign_id: number;
  bidding_strategy: AdsBiddingStrategy;
  bid_amount?: number;
  target_cpa?: number;
  target_roas?: number;
  bid_adjustments?: AdsBidAdjustment[];
  created_at: string;
  updated_at: string;
}

export type AdsBiddingStrategy = 
  | 'manual_cpc'
  | 'manual_cpm'
  | 'target_cpa'
  | 'target_roas'
  | 'maximize_conversions'
  | 'maximize_clicks'
  | 'maximize_impressions'
  | 'target_cost_per_impression'
  | 'target_cost_per_click'
  | 'target_cost_per_action';

export interface AdsBidAdjustment {
  criterion_type: string;
  criterion_id: string;
  bid_modifier: number;
  is_negative: boolean;
}

export interface AdsCampaignCreative {
  id: number;
  campaign_id: number;
  creative_id: number;
  ad_group_id?: number;
  status: 'active' | 'paused' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignAudience {
  id: number;
  campaign_id: number;
  audience_type: 'custom' | 'lookalike' | 'saved' | 'website' | 'app';
  audience_id: string;
  audience_name: string;
  inclusion: boolean;
  created_at: string;
}

export interface AdsCampaignPlacement {
  id: number;
  campaign_id: number;
  placement_type: 'automatic' | 'manual';
  placements: string[];
  exclusions: string[];
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignDevice {
  id: number;
  campaign_id: number;
  device_type: 'mobile' | 'desktop' | 'tablet' | 'tv' | 'other';
  bid_modifier: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignLocation {
  id: number;
  campaign_id: number;
  location_type: 'include' | 'exclude';
  location_id: string;
  location_name: string;
  radius?: number;
  created_at: string;
}

export interface AdsCampaignLanguage {
  id: number;
  campaign_id: number;
  language_code: string;
  language_name: string;
  is_primary: boolean;
  created_at: string;
}

export interface AdsCampaignAge {
  id: number;
  campaign_id: number;
  age_min: number;
  age_max: number;
  created_at: string;
}

export interface AdsCampaignGender {
  id: number;
  campaign_id: number;
  gender: 'male' | 'female' | 'all';
  created_at: string;
}

export interface AdsCampaignInterest {
  id: number;
  campaign_id: number;
  interest_id: string;
  interest_name: string;
  created_at: string;
}

export interface AdsCampaignBehavior {
  id: number;
  campaign_id: number;
  behavior_id: string;
  behavior_name: string;
  created_at: string;
}

export interface AdsCampaignCustomAudience {
  id: number;
  campaign_id: number;
  audience_id: string;
  audience_name: string;
  audience_type: 'customer_list' | 'website_visitors' | 'app_users' | 'engagement';
  created_at: string;
}

export interface AdsCampaignLookalikeAudience {
  id: number;
  campaign_id: number;
  source_audience_id: string;
  lookalike_audience_id: string;
  similarity_percentage: number;
  country: string;
  created_at: string;
}

export interface AdsCampaignKeyword {
  id: number;
  campaign_id: number;
  keyword: string;
  match_type: 'exact' | 'phrase' | 'broad' | 'broad_match_modifier';
  bid?: number;
  status: 'active' | 'paused' | 'deleted';
  quality_score?: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignNegativeKeyword {
  id: number;
  campaign_id: number;
  keyword: string;
  match_type: 'exact' | 'phrase' | 'broad';
  created_at: string;
}

export interface AdsCampaignAdGroup {
  id: number;
  campaign_id: number;
  name: string;
  status: 'active' | 'paused' | 'deleted';
  default_bid?: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignAd {
  id: number;
  campaign_id: number;
  ad_group_id?: number;
  name: string;
  status: 'active' | 'paused' | 'deleted';
  creative_id: number;
  final_url: string;
  display_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignExtension {
  id: number;
  campaign_id: number;
  extension_type: 'sitelink' | 'callout' | 'structured_snippet' | 'call' | 'message' | 'price' | 'promotion';
  extension_data: any;
  status: 'active' | 'paused' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignConversion {
  id: number;
  campaign_id: number;
  conversion_action: string;
  conversion_value?: number;
  conversion_currency?: string;
  attribution_model: string;
  created_at: string;
}

export interface AdsCampaignRemarketing {
  id: number;
  campaign_id: number;
  remarketing_list_id: string;
  remarketing_list_name: string;
  membership_duration: number;
  created_at: string;
}

export interface AdsCampaignFrequency {
  id: number;
  campaign_id: number;
  frequency_cap: number;
  frequency_cap_period: 'day' | 'week' | 'month';
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignDelivery {
  id: number;
  campaign_id: number;
  delivery_method: 'standard' | 'accelerated';
  pacing_type: 'even' | 'front_loaded' | 'back_loaded';
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignRotation {
  id: number;
  campaign_id: number;
  rotation_type: 'optimize' | 'rotate_evenly' | 'rotate_indefinitely';
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignOptimization {
  id: number;
  campaign_id: number;
  optimization_goal: string;
  optimization_type: 'conversion' | 'clicks' | 'impressions' | 'reach';
  target_value?: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignExperiment {
  id: number;
  campaign_id: number;
  experiment_name: string;
  experiment_type: 'a_b' | 'multivariate';
  traffic_split: number;
  status: 'draft' | 'running' | 'completed' | 'paused';
  start_date: string;
  end_date?: string;
  results?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignDraft {
  id: number;
  campaign_id: number;
  draft_name: string;
  draft_data: any;
  status: 'draft' | 'approved' | 'rejected';
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignTemplate {
  id: number;
  template_name: string;
  template_type: 'awareness' | 'traffic' | 'engagement' | 'leads' | 'sales';
  platform: AdsPlatform;
  template_data: any;
  is_public: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaignPerformance {
  campaign_id: number;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  cost_per_conversion: number;
  conversion_rate: number;
}

export interface AdsCampaignAlert {
  id: number;
  campaign_id: number;
  alert_type: 'budget' | 'performance' | 'policy' | 'billing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  is_read: boolean;
  metadata?: any;
  created_at: string;
}

export interface AdsCampaignHistory {
  id: number;
  campaign_id: number;
  action: string;
  old_value?: any;
  new_value?: any;
  changed_by: number;
  changed_at: string;
  reason?: string;
}

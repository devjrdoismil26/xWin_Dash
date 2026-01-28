/**
 * Tipos relacionados a criativos de anúncios
 */

export interface AdsCreative {
  id: number;
  name: string;
  campaign_id: number;
  ad_group_id?: number;
  type: AdsCreativeType;
  status: AdsCreativeStatus;
  content: AdsCreativeContent;
  created_at: string;
  updated_at: string;
}

export type AdsCreativeType = 
  | 'image'
  | 'video'
  | 'carousel'
  | 'collection'
  | 'slideshow'
  | 'canvas'
  | 'story'
  | 'text'
  | 'html5'
  | 'playable';

export type AdsCreativeStatus = 
  | 'active'
  | 'paused'
  | 'deleted'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'disapproved';

export interface AdsCreativeContent {
  headline?: string;
  description?: string;
  call_to_action?: string;
  images?: AdsCreativeImage[];
  videos?: AdsCreativeVideo[];
  links?: AdsCreativeLink[];
  text?: string;
  html?: string;
  media?: AdsCreativeMedia[];
}

export interface AdsCreativeImage {
  id: string;
  url: string;
  width: number;
  height: number;
  alt_text?: string;
  caption?: string;
  thumbnail_url?: string;
  format: string;
  size: number;
  created_at: string;
}

export interface AdsCreativeVideo {
  id: string;
  url: string;
  thumbnail_url?: string;
  duration: number;
  width: number;
  height: number;
  format: string;
  size: number;
  title?: string;
  description?: string;
  created_at: string;
}

export interface AdsCreativeLink {
  id: string;
  url: string;
  display_url?: string;
  title?: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface AdsCreativeMedia {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: number;
  format: string;
  size: number;
  metadata?: any;
  created_at: string;
}

export interface AdsCreativeText {
  id: number;
  creative_id: number;
  text_type: 'headline' | 'description' | 'call_to_action' | 'body' | 'caption';
  text: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeAsset {
  id: number;
  creative_id: number;
  asset_type: 'image' | 'video' | 'audio' | 'document' | 'html5';
  asset_url: string;
  asset_name: string;
  asset_size: number;
  asset_format: string;
  width?: number;
  height?: number;
  duration?: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeTemplate {
  id: number;
  template_name: string;
  template_type: AdsCreativeType;
  platform: string;
  template_data: any;
  preview_url?: string;
  is_public: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeVariation {
  id: number;
  creative_id: number;
  variation_name: string;
  variation_data: any;
  is_active: boolean;
  performance_score?: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeTest {
  id: number;
  creative_id: number;
  test_name: string;
  test_type: 'a_b' | 'multivariate';
  test_config: any;
  status: 'draft' | 'running' | 'completed' | 'paused';
  start_date: string;
  end_date?: string;
  results?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeApproval {
  id: number;
  creative_id: number;
  approval_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativePerformance {
  creative_id: number;
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
  engagement_rate?: number;
  video_views?: number;
  video_completion_rate?: number;
}

export interface AdsCreativeInsight {
  id: number;
  creative_id: number;
  insight_type: 'performance' | 'audience' | 'placement' | 'time';
  insight_data: any;
  confidence_score: number;
  recommendation?: string;
  created_at: string;
}

export interface AdsCreativeOptimization {
  id: number;
  creative_id: number;
  optimization_type: 'headline' | 'description' | 'image' | 'video' | 'call_to_action';
  current_value: any;
  suggested_value: any;
  confidence_score: number;
  potential_improvement: number;
  status: 'pending' | 'applied' | 'rejected' | 'expired';
  created_at: string;
  applied_at?: string;
}

export interface AdsCreativeAudience {
  id: number;
  creative_id: number;
  audience_id: string;
  audience_name: string;
  audience_type: 'custom' | 'lookalike' | 'saved' | 'website' | 'app';
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativePlacement {
  id: number;
  creative_id: number;
  placement_type: 'feed' | 'story' | 'reels' | 'search' | 'display' | 'video';
  placement_name: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeDevice {
  id: number;
  creative_id: number;
  device_type: 'mobile' | 'desktop' | 'tablet' | 'tv' | 'other';
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeLocation {
  id: number;
  creative_id: number;
  location_type: 'country' | 'region' | 'city' | 'postal_code';
  location_id: string;
  location_name: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeTime {
  id: number;
  creative_id: number;
  time_period: 'hour' | 'day' | 'week' | 'month';
  time_value: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeDemographic {
  id: number;
  creative_id: number;
  demographic_type: 'age' | 'gender' | 'education' | 'income' | 'relationship';
  demographic_value: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeInterest {
  id: number;
  creative_id: number;
  interest_id: string;
  interest_name: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeBehavior {
  id: number;
  creative_id: number;
  behavior_id: string;
  behavior_name: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeCustomAudience {
  id: number;
  creative_id: number;
  audience_id: string;
  audience_name: string;
  audience_type: 'customer_list' | 'website_visitors' | 'app_users' | 'engagement';
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeLookalikeAudience {
  id: number;
  creative_id: number;
  source_audience_id: string;
  lookalike_audience_id: string;
  similarity_percentage: number;
  country: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeRemarketing {
  id: number;
  creative_id: number;
  remarketing_list_id: string;
  remarketing_list_name: string;
  membership_duration: number;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeFrequency {
  id: number;
  creative_id: number;
  frequency_cap: number;
  frequency_cap_period: 'day' | 'week' | 'month';
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeRotation {
  id: number;
  creative_id: number;
  rotation_type: 'optimize' | 'rotate_evenly' | 'rotate_indefinitely';
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeDelivery {
  id: number;
  creative_id: number;
  delivery_method: 'standard' | 'accelerated';
  pacing_type: 'even' | 'front_loaded' | 'back_loaded';
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeBidding {
  id: number;
  creative_id: number;
  bidding_strategy: string;
  bid_amount?: number;
  target_cpa?: number;
  target_roas?: number;
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeBudget {
  id: number;
  creative_id: number;
  budget_type: 'daily' | 'lifetime' | 'monthly';
  amount: number;
  currency: string;
  delivery_method: 'standard' | 'accelerated';
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeSchedule {
  id: number;
  creative_id: number;
  schedule_type: string;
  schedule_data: any;
  timezone: string;
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeExtension {
  id: number;
  creative_id: number;
  extension_type: 'sitelink' | 'callout' | 'structured_snippet' | 'call' | 'message' | 'price' | 'promotion';
  extension_data: any;
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeConversion {
  id: number;
  creative_id: number;
  conversion_action: string;
  conversion_value?: number;
  conversion_currency?: string;
  attribution_model: string;
  performance_data?: any;
  created_at: string;
}

export interface AdsCreativeAlert {
  id: number;
  creative_id: number;
  alert_type: 'performance' | 'policy' | 'billing' | 'approval';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  is_read: boolean;
  metadata?: any;
  created_at: string;
}

export interface AdsCreativeHistory {
  id: number;
  creative_id: number;
  action: string;
  old_value?: any;
  new_value?: any;
  changed_by: number;
  changed_at: string;
  reason?: string;
}

export interface AdsCreativeDraft {
  id: number;
  creative_id: number;
  draft_name: string;
  draft_data: any;
  status: 'draft' | 'approved' | 'rejected';
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface AdsCreativeExperiment {
  id: number;
  creative_id: number;
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

export interface AdsCreativeValidation {
  id: number;
  creative_id: number;
  validation_type: 'policy' | 'technical' | 'performance' | 'creative_guidelines';
  validation_status: 'passed' | 'failed' | 'warning' | 'pending';
  validation_results: any;
  validated_at: string;
  created_at: string;
}

export interface AdsCreativePreview {
  id: number;
  creative_id: number;
  platform: string;
  placement: string;
  preview_url: string;
  preview_data: any;
  created_at: string;
}

export interface AdsCreativeBackup {
  id: number;
  creative_id: number;
  backup_type: 'full' | 'incremental' | 'differential';
  backup_data: any;
  backup_size: number;
  created_at: string;
  expires_at: string;
}

export interface AdsCreativeAudit {
  id: number;
  creative_id: number;
  audit_type: 'policy' | 'performance' | 'creative_guidelines' | 'technical';
  findings: any[];
  recommendations: any[];
  score: number;
  performed_by: number;
  performed_at: string;
}

export interface AdsCreativeCompliance {
  id: number;
  creative_id: number;
  compliance_type: 'platform_policy' | 'advertising_standards' | 'legal' | 'brand_guidelines';
  status: 'compliant' | 'non_compliant' | 'pending_review';
  last_review: string;
  next_review: string;
  issues: any[];
  actions_taken: any[];
}

export interface AdsCreativeApiUsage {
  id: number;
  creative_id: number;
  api_endpoint: string;
  request_count: number;
  success_count: number;
  error_count: number;
  rate_limit_hits: number;
  date: string;
  created_at: string;
}

export interface AdsCreativeCost {
  id: number;
  creative_id: number;
  date: string;
  platform_cost: number;
  management_fee: number;
  total_cost: number;
  currency: string;
  created_at: string;
}

export interface AdsCreativeGoal {
  id: number;
  creative_id: number;
  goal_name: string;
  goal_type: 'revenue' | 'conversions' | 'traffic' | 'awareness' | 'engagement';
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Tipos relacionados a templates e otimizações de anúncios
 */

import { AdsPlatform } from './adsAccountTypes';

export interface AdsTemplate {
  id: number;
  template_name: string;
  template_type: AdsTemplateType;
  platform: AdsPlatform;
  category: string;
  description: string;
  content: any;
  is_public: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export type AdsTemplateType = 
  | 'campaign'
  | 'creative'
  | 'account'
  | 'ad_group'
  | 'keyword'
  | 'audience'
  | 'placement'
  | 'bidding'
  | 'budget'
  | 'schedule';

export interface AdsTemplateCategory {
  id: number;
  category_name: string;
  category_description: string;
  parent_category_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateTag {
  id: number;
  tag_name: string;
  tag_description?: string;
  color?: string;
  created_at: string;
}

export interface AdsTemplateTagAssignment {
  id: number;
  template_id: number;
  tag_id: number;
  created_at: string;
}

export interface AdsTemplateUsage {
  id: number;
  template_id: number;
  used_by: number;
  entity_type: 'campaign' | 'creative' | 'account';
  entity_id: number;
  usage_data?: any;
  created_at: string;
}

export interface AdsTemplateRating {
  id: number;
  template_id: number;
  user_id: number;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateFavorite {
  id: number;
  template_id: number;
  user_id: number;
  created_at: string;
}

export interface AdsTemplateShare {
  id: number;
  template_id: number;
  shared_by: number;
  shared_with: number;
  permission: 'view' | 'edit' | 'admin';
  expires_at?: string;
  created_at: string;
}

export interface AdsTemplateVersion {
  id: number;
  template_id: number;
  version_number: string;
  version_notes?: string;
  template_data: any;
  is_current: boolean;
  created_by: number;
  created_at: string;
}

export interface AdsTemplateBackup {
  id: number;
  template_id: number;
  backup_data: any;
  backup_reason: string;
  created_by: number;
  created_at: string;
}

export interface AdsTemplateValidation {
  id: number;
  template_id: number;
  validation_type: 'policy' | 'technical' | 'performance' | 'creative_guidelines';
  validation_status: 'passed' | 'failed' | 'warning' | 'pending';
  validation_results: any;
  validated_at: string;
  created_at: string;
}

export interface AdsTemplatePreview {
  id: number;
  template_id: number;
  platform: AdsPlatform;
  placement: string;
  preview_url: string;
  preview_data: any;
  created_at: string;
}

export interface AdsTemplateTest {
  id: number;
  template_id: number;
  test_name: string;
  test_config: any;
  test_results?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateOptimization {
  id: number;
  template_id: number;
  optimization_type: 'performance' | 'cost' | 'conversion' | 'engagement';
  optimization_config: any;
  optimization_results?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateInsight {
  id: number;
  template_id: number;
  insight_type: 'performance' | 'usage' | 'feedback' | 'trend';
  insight_data: any;
  confidence_score: number;
  recommendation?: string;
  created_at: string;
}

export interface AdsTemplateAnalytics {
  id: number;
  template_id: number;
  date: string;
  views: number;
  downloads: number;
  uses: number;
  ratings: number;
  average_rating: number;
  created_at: string;
}

export interface AdsTemplateComment {
  id: number;
  template_id: number;
  user_id: number;
  comment_text: string;
  parent_comment_id?: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateReport {
  id: number;
  template_id: number;
  report_type: 'usage' | 'performance' | 'feedback' | 'analytics';
  report_data: any;
  generated_at: string;
  created_at: string;
}

export interface AdsTemplateNotification {
  id: number;
  template_id: number;
  user_id: number;
  notification_type: 'update' | 'comment' | 'rating' | 'usage' | 'approval';
  notification_data: any;
  is_read: boolean;
  created_at: string;
}

export interface AdsTemplatePermission {
  id: number;
  template_id: number;
  user_id: number;
  permission_type: 'view' | 'edit' | 'admin' | 'owner';
  granted_by: number;
  granted_at: string;
  expires_at?: string;
}

export interface AdsTemplateWorkflow {
  id: number;
  template_id: number;
  workflow_name: string;
  workflow_type: 'approval' | 'review' | 'publishing' | 'optimization';
  workflow_config: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateIntegration {
  id: number;
  template_id: number;
  integration_type: 'api' | 'webhook' | 'sftp' | 'email';
  integration_config: any;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateAudit {
  id: number;
  template_id: number;
  audit_type: 'security' | 'compliance' | 'performance' | 'quality';
  audit_results: any;
  recommendations: any[];
  score: number;
  performed_by: number;
  performed_at: string;
}

export interface AdsTemplateCompliance {
  id: number;
  template_id: number;
  compliance_type: 'platform_policy' | 'advertising_standards' | 'legal' | 'brand_guidelines';
  compliance_status: 'compliant' | 'non_compliant' | 'pending_review';
  last_review: string;
  next_review: string;
  issues: any[];
  actions_taken: any[];
}

export interface AdsTemplateCost {
  id: number;
  template_id: number;
  cost_type: 'creation' | 'maintenance' | 'optimization' | 'testing';
  cost_amount: number;
  cost_currency: string;
  cost_period: 'one_time' | 'monthly' | 'yearly';
  created_at: string;
}

export interface AdsTemplateGoal {
  id: number;
  template_id: number;
  goal_name: string;
  goal_type: 'performance' | 'usage' | 'quality' | 'engagement';
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateMilestone {
  id: number;
  template_id: number;
  milestone_name: string;
  milestone_description: string;
  milestone_date: string;
  milestone_type: 'creation' | 'approval' | 'publishing' | 'optimization' | 'milestone';
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface AdsTemplateDependency {
  id: number;
  template_id: number;
  dependency_type: 'prerequisite' | 'blocking' | 'related';
  dependency_template_id: number;
  dependency_description: string;
  is_required: boolean;
  created_at: string;
}

export interface AdsTemplateRelationship {
  id: number;
  template_id: number;
  related_template_id: number;
  relationship_type: 'similar' | 'complementary' | 'alternative' | 'upgrade' | 'downgrade';
  relationship_strength: number;
  created_at: string;
}

export interface AdsTemplateRecommendation {
  id: number;
  template_id: number;
  recommendation_type: 'similar' | 'complementary' | 'upgrade' | 'alternative';
  recommended_template_id: number;
  recommendation_reason: string;
  confidence_score: number;
  created_at: string;
}

export interface AdsTemplateTrend {
  id: number;
  template_id: number;
  trend_type: 'usage' | 'performance' | 'popularity' | 'rating';
  trend_direction: 'up' | 'down' | 'stable' | 'volatile';
  trend_strength: number;
  trend_period: string;
  trend_data: any;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateForecast {
  id: number;
  template_id: number;
  forecast_type: 'usage' | 'performance' | 'popularity' | 'rating';
  forecast_period: string;
  forecast_data: any;
  confidence_interval: { lower: number; upper: number };
  forecast_accuracy?: number;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateAlert {
  id: number;
  template_id: number;
  alert_type: 'usage_spike' | 'performance_drop' | 'policy_violation' | 'quality_issue';
  alert_severity: 'low' | 'medium' | 'high' | 'critical';
  alert_title: string;
  alert_message: string;
  alert_data: any;
  is_read: boolean;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export interface AdsTemplateHistory {
  id: number;
  template_id: number;
  action: string;
  old_value?: any;
  new_value?: any;
  changed_by: number;
  changed_at: string;
  reason?: string;
  metadata?: any;
}

export interface AdsTemplateBackup {
  id: number;
  template_id: number;
  backup_type: 'full' | 'incremental' | 'differential';
  backup_data: any;
  backup_size: number;
  backup_reason: string;
  created_by: number;
  created_at: string;
  expires_at: string;
}

export interface AdsTemplateExport {
  id: number;
  template_id: number;
  export_format: 'json' | 'xml' | 'csv' | 'pdf';
  export_data: any;
  export_size: number;
  exported_by: number;
  exported_at: string;
  expires_at: string;
}

export interface AdsTemplateImport {
  id: number;
  template_name: string;
  import_source: string;
  import_data: any;
  import_status: 'pending' | 'processing' | 'completed' | 'failed';
  import_results?: any;
  imported_by: number;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateMigration {
  id: number;
  template_id: number;
  migration_type: 'platform' | 'version' | 'format' | 'structure';
  migration_config: any;
  migration_status: 'pending' | 'running' | 'completed' | 'failed';
  migration_results?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsTemplateSync {
  id: number;
  template_id: number;
  sync_type: 'platform' | 'external' | 'internal';
  sync_config: any;
  sync_status: 'pending' | 'running' | 'completed' | 'failed';
  sync_results?: any;
  last_sync: string;
  next_sync?: string;
  created_at: string;
  updated_at: string;
}

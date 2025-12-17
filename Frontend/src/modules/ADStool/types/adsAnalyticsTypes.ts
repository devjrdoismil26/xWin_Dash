/**
 * Tipos relacionados a analytics e relatórios de anúncios
 * @module modules/ADStool/types/adsAnalyticsTypes
 * @description
 * Definições de tipos e interfaces para analytics e relatórios de anúncios,
 * incluindo métricas, performance, relatórios, insights, alertas, dashboards,
 * widgets, KPIs, benchmarks, atribuição, funis, coortes, retenção, valor vitalício,
 * caminhos, anomalias, tendências, competidores, oportunidades, riscos, previsões,
 * experimentos, otimizações e automações.
 * @since 1.0.0
 */

/**
 * Interface AdsAnalytics - Analytics de Anúncios
 * @interface AdsAnalytics
 * @description
 * Representa dados de analytics de anúncios, contendo métricas de impressões,
 * cliques, gastos, conversões, receita, CTR, CPC, CPM, ROAS e taxa de conversão.
 */
export interface AdsAnalytics {
  id: number;
  account_id: number;
  campaign_id?: number;
  creative_id?: number;
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
  created_at: string; }

export interface AdsPerformance {
  id: number;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
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
  created_at: string; }

export interface AdsReport {
  id: number;
  report_name: string;
  report_type: AdsReportType;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id?: number;
  date_range: AdsDateRange;
  metrics: string[];
  dimensions: string[];
  filters?: Record<string, any>;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  file_url?: string;
  generated_at?: string;
  expires_at?: string;
  created_by: number;
  created_at: string; }

export type AdsReportType = 
  | 'performance'
  | 'audience'
  | 'placement'
  | 'keyword'
  | 'demographic'
  | 'device'
  | 'location'
  | 'time'
  | 'conversion'
  | 'attribution'
  | 'path'
  | 'funnel'
  | 'cohort'
  | 'retention'
  | 'lifetime_value'
  | 'custom';

export interface AdsDateRange {
  start_date: string;
  end_date: string;
  timezone: string;
  granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'; }

export interface AdsMetric {
  name: string;
  display_name: string;
  type: 'number' | 'percentage' | 'currency' | 'duration';
  format?: string;
  description?: string;
  category: 'performance' | 'engagement' | 'conversion' | 'financial' | 'quality'; }

export interface AdsDimension {
  name: string;
  display_name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description?: string;
  category: 'audience' | 'placement' | 'time' | 'geographic' | 'demographic'; }

export interface AdsInsight {
  id: number;
  insight_type: AdsInsightType;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  insight_data: Record<string, any>;
  confidence_score: number;
  impact_score: number;
  recommendation?: string;
  action_required: boolean;
  created_at: string;
  expires_at?: string; }

export type AdsInsightType = 
  | 'performance'
  | 'audience'
  | 'placement'
  | 'time'
  | 'budget'
  | 'bidding'
  | 'targeting'
  | 'creative'
  | 'competitor'
  | 'trend'
  | 'anomaly'
  | 'opportunity'
  | 'risk';

export interface AdsAlert {
  id: number;
  alert_type: AdsAlertType;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  threshold?: number;
  current_value?: number;
  is_read: boolean;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: number;
  metadata?: string;
  created_at: string; }

export type AdsAlertType = 
  | 'budget'
  | 'performance'
  | 'policy'
  | 'billing'
  | 'connection'
  | 'approval'
  | 'error'
  | 'threshold'
  | 'anomaly'
  | 'competitor';

export interface AdsDashboard {
  id: number;
  dashboard_name: string;
  dashboard_type: 'overview' | 'performance' | 'audience' | 'placement' | 'custom';
  widgets: AdsWidget[];
  layout: Record<string, any>;
  filters?: Record<string, any>;
  is_public: boolean;
  created_by: number;
  created_at: string;
  updated_at: string; }

export interface AdsWidget {
  id: number;
  widget_type: AdsWidgetType;
  widget_name: string;
  widget_config: Record<string, any>;
  position: { x: number;
  y: number;
  width: number;
  height: number;
};

  is_visible: boolean;
  refresh_interval?: number;
  created_at: string;
  updated_at: string;
}

export type AdsWidgetType = 
  | 'metric_card'
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'table'
  | 'funnel'
  | 'cohort'
  | 'heatmap'
  | 'scatter_plot'
  | 'gauge'
  | 'treemap'
  | 'sankey'
  | 'custom';

export interface AdsKPI {
  id: number;
  kpi_name: string;
  kpi_type: AdsKPIType;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id?: number;
  target_value: number;
  current_value: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export type AdsKPIType = 
  | 'revenue'
  | 'conversions'
  | 'traffic'
  | 'awareness'
  | 'engagement'
  | 'roas'
  | 'cpa'
  | 'ctr'
  | 'cpc'
  | 'cpm'
  | 'conversion_rate'
  | 'engagement_rate'
  | 'video_completion_rate'
  | 'custom';

export interface AdsBenchmark {
  id: number;
  benchmark_type: AdsBenchmarkType;
  industry: string;
  platform: string;
  metric_name: string;
  benchmark_value: number;
  percentile_25: number;
  percentile_50: number;
  percentile_75: number;
  percentile_90: number;
  sample_size: number;
  last_updated: string;
  created_at: string; }

export type AdsBenchmarkType = 
  | 'industry'
  | 'platform'
  | 'geographic'
  | 'demographic'
  | 'seasonal'
  | 'competitive';

export interface AdsAttribution {
  id: number;
  conversion_id: string;
  user_id: string;
  touchpoints: AdsTouchpoint[];
  attribution_model: AdsAttributionModel;
  conversion_value: number;
  conversion_currency: string;
  conversion_date: string;
  created_at: string; }

export interface AdsTouchpoint {
  id: string;
  touchpoint_type: 'impression' | 'click' | 'view' | 'engagement';
  campaign_id: number;
  creative_id?: number;
  ad_group_id?: number;
  keyword_id?: number;
  touchpoint_date: string;
  touchpoint_value?: number;
  position?: number; }

export type AdsAttributionModel = 
  | 'first_click'
  | 'last_click'
  | 'linear'
  | 'time_decay'
  | 'position_based'
  | 'data_driven'
  | 'custom';

export interface AdsFunnel {
  id: number;
  funnel_name: string;
  funnel_type: 'awareness' | 'consideration' | 'conversion' | 'retention' | 'custom';
  stages: AdsFunnelStage[];
  conversion_goals: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export interface AdsFunnelStage {
  id: number;
  stage_name: string;
  stage_order: number;
  stage_type: 'impression' | 'click' | 'view' | 'engagement' | 'conversion';
  stage_conditions: Record<string, any>;
  conversion_rate?: number;
  drop_off_rate?: number; }

export interface AdsCohort {
  id: number;
  cohort_name: string;
  cohort_type: 'acquisition' | 'behavioral' | 'retention' | 'revenue';
  cohort_period: 'day' | 'week' | 'month';
  cohort_data: unknown;
  created_at: string;
  updated_at: string; }

export interface AdsRetention {
  id: number;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  cohort_date: string;
  period: number;
  retention_rate: number;
  cohort_size: number;
  created_at: string; }

export interface AdsLifetimeValue {
  id: number;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  cohort_date: string;
  period: number;
  lifetime_value: number;
  cohort_size: number;
  created_at: string; }

export interface AdsPath {
  id: number;
  user_id: string;
  session_id: string;
  touchpoints: AdsTouchpoint[];
  conversion_goal: string;
  conversion_value: number;
  conversion_date: string;
  path_length: number;
  path_duration: number;
  created_at: string; }

export interface AdsAnomaly {
  id: number;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  anomaly_type: 'spike' | 'drop' | 'trend_change' | 'seasonal' | 'outlier';
  metric_name: string;
  expected_value: number;
  actual_value: number;
  deviation_percentage: number;
  confidence_score: number;
  anomaly_date: string;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string; }

export interface AdsTrend {
  id: number;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  metric_name: string;
  trend_direction: 'up' | 'down' | 'stable' | 'volatile';
  trend_strength: number;
  trend_period: string;
  trend_data: unknown;
  forecast?: string;
  created_at: string;
  updated_at: string; }

export interface AdsCompetitor {
  id: number;
  competitor_name: string;
  competitor_domain?: string;
  industry: string;
  market_share?: number;
  ad_spend_estimate?: number;
  ad_frequency?: number;
  top_keywords?: string[];
  top_placements?: string[];
  competitive_analysis?: Record<string, any>;
  last_updated: string;
  created_at: string; }

export interface AdsOpportunity {
  id: number;
  opportunity_type: AdsOpportunityType;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  opportunity_name: string;
  opportunity_description: string;
  potential_impact: number;
  confidence_score: number;
  effort_required: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string; }

export type AdsOpportunityType = 
  | 'budget_optimization'
  | 'bidding_optimization'
  | 'targeting_expansion'
  | 'creative_optimization'
  | 'keyword_expansion'
  | 'audience_expansion'
  | 'placement_optimization'
  | 'schedule_optimization'
  | 'competitor_opportunity'
  | 'market_opportunity';

export interface AdsRisk {
  id: number;
  risk_type: AdsRiskType;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  risk_name: string;
  risk_description: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  mitigation_plan?: string;
  status: 'identified' | 'monitoring' | 'mitigated' | 'resolved';
  created_at: string;
  updated_at: string; }

export type AdsRiskType = 
  | 'budget_exhaustion'
  | 'performance_decline'
  | 'policy_violation'
  | 'competitor_threat'
  | 'market_change'
  | 'technical_issue'
  | 'billing_issue'
  | 'approval_delay'
  | 'audience_fatigue'
  | 'creative_fatigue';

export interface AdsForecast {
  id: number;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  metric_name: string;
  forecast_period: string;
  forecast_data: Record<string, any>;
  confidence_interval: { lower: number;
  upper: number;
};

  forecast_accuracy?: number;
  created_at: string;
  updated_at: string;
}

export interface AdsExperiment {
  id: number;
  experiment_name: string;
  experiment_type: 'a_b' | 'multivariate' | 'sequential';
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  variants: AdsExperimentVariant[];
  traffic_split: number;
  status: 'draft' | 'running' | 'completed' | 'paused';
  start_date: string;
  end_date?: string;
  results?: string;
  created_at: string;
  updated_at: string; }

export interface AdsExperimentVariant {
  id: number;
  variant_name: string;
  variant_config: unknown;
  traffic_percentage: number;
  performance_data?: string; }

export interface AdsOptimization {
  id: number;
  optimization_type: AdsOptimizationType;
  entity_type: 'account' | 'campaign' | 'creative' | 'ad_group' | 'keyword';
  entity_id: number;
  optimization_name: string;
  optimization_config: unknown;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: string;
  created_at: string;
  updated_at: string; }

export type AdsOptimizationType = 
  | 'budget'
  | 'bidding'
  | 'targeting'
  | 'creative'
  | 'placement'
  | 'schedule'
  | 'audience'
  | 'keyword'
  | 'ad_copy'
  | 'landing_page';

export interface AdsAutomation {
  id: number;
  automation_name: string;
  automation_type: AdsAutomationType;
  automation_config: unknown;
  triggers: AdsAutomationTrigger[];
  actions: AdsAutomationAction[];
  status: 'active' | 'paused' | 'disabled';
  last_run?: string;
  next_run?: string;
  created_at: string;
  updated_at: string; }

export type AdsAutomationType = 
  | 'budget_management'
  | 'bidding_optimization'
  | 'performance_monitoring'
  | 'alert_management'
  | 'report_generation'
  | 'campaign_management'
  | 'creative_rotation'
  | 'audience_management';

export interface AdsAutomationTrigger {
  id: number;
  trigger_type: string;
  trigger_conditions: unknown;
  is_active: boolean; }

export interface AdsAutomationAction {
  id: number;
  action_type: string;
  action_config: Record<string, any>;
  is_active: boolean; }

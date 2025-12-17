// ========================================
// TIPOS DE ANALYTICS
// ========================================

export interface LeadAnalytics {
  id: number;
  lead_id: number;
  metric_type: 'view' | 'click' | 'email_open' | 'email_click' | 'form_submit' | 'page_visit';
  value: number;
  metadata?: Record<string, any>;
  timestamp: string; }

export interface LeadPerformance {
  lead_id: number;
  total_views: number;
  total_clicks: number;
  email_opens: number;
  email_clicks: number;
  form_submissions: number;
  page_visits: number;
  engagement_score: number;
  last_activity: string; }

export interface LeadEngagement {
  lead_id: number;
  engagement_score: number;
  last_activity: string;
  activity_count: number;
  response_rate: number;
  time_to_response: number;
  preferred_channel: string; }

export interface LeadHealthScore {
  lead_id: number;
  health_score: number;
  factors: {
    engagement: number;
  recency: number;
  frequency: number;
  quality: number; };

  recommendations: string[];
  calculated_at: string;
}

export interface LeadAttribution {
  lead_id: number;
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  first_touch: string;
  last_touch: string;
  touchpoints: LeadTouchpoint[]; }

export interface LeadTouchpoint {
  id: number;
  lead_id: number;
  touchpoint_type: string;
  touchpoint_value: string;
  timestamp: string;
  metadata?: Record<string, any>; }

export interface LeadSource {
  id: number;
  name: string;
  type: 'organic' | 'paid' | 'social' | 'email' | 'direct' | 'referral';
  cost?: number;
  conversion_rate?: number; }

export interface LeadROI {
  lead_id: number;
  acquisition_cost: number;
  lifetime_value: number;
  roi: number;
  payback_period: number;
  calculated_at: string; }

export interface LeadForecast {
  period: string;
  predicted_leads: number;
  predicted_conversions: number;
  confidence_level: number;
  factors: {
    historical_trend: number;
  seasonality: number;
  marketing_activity: number;
  market_conditions: number; };

  created_at: string;
}
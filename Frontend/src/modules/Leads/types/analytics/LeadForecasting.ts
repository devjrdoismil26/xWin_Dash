// ========================================
// TIPOS DE PREVISÃO
// ========================================

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

export interface LeadForecastModel {
  id: number;
  name: string;
  description?: string;
  algorithm: 'linear_regression' | 'time_series' | 'machine_learning';
  parameters: Record<string, any>;
  accuracy: number;
  last_trained: string;
  is_active: boolean; }

export interface LeadForecastResult {
  model_id: number;
  forecast: LeadForecast[];
  accuracy_metrics: {
    mae: number;
  rmse: number;
  mape: number; };

  generated_at: string;
}
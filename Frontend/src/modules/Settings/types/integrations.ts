/**
 * Tipos de configurações de integrações
 */

export interface GoogleAnalyticsConfig {
  enabled: boolean;
  tracking_id: string;
  enhanced_ecommerce: boolean;
  anonymize_ip: boolean; }

export interface GoogleMapsConfig {
  enabled: boolean;
  api_key: string;
  default_zoom: number;
  default_center: {
    lat: number;
  lng: number; };

}

export interface GoogleDriveConfig {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  folder_id?: string; }

export interface GoogleCalendarConfig {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  calendar_id?: string; }

export interface FacebookPixelConfig {
  enabled: boolean;
  pixel_id: string;
  advanced_matching: boolean; }

export interface IntegrationSettings {
  google: {
    analytics: GoogleAnalyticsConfig;
  maps: GoogleMapsConfig;
  drive: GoogleDriveConfig;
  calendar: GoogleCalendarConfig; };

  facebook: {
    pixel: FacebookPixelConfig;};

  whatsapp: {
    enabled: boolean;
    api_key: string;
    webhook_url: string;};

  stripe: {
    enabled: boolean;
    public_key: string;
    secret_key: string;
    webhook_secret: string;};

}

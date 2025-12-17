/**
 * Tipos de configurações de notificações
 */

export interface NotificationPreferences {
  email: {
    marketing: boolean;
  updates: boolean;
  security: boolean;
  social: boolean; };

  push: {
    marketing: boolean;
    updates: boolean;
    security: boolean;
    social: boolean;};

  sms: {
    security: boolean;
    urgent: boolean;};

}

export interface NotificationSettings {
  email: {
    enabled: boolean;
  driver: 'smtp' | 'mailgun' | 'ses';
  from_name: string;
  from_email: string; };

  push: {
    enabled: boolean;
    firebase_key: string;
    vapid_public_key: string;
    vapid_private_key: string;};

  sms: {
    enabled: boolean;
    provider: 'twilio' | 'nexmo' | 'aws_sns';
    api_key: string;
    api_secret: string;
    from_number: string;};

  slack: {
    enabled: boolean;
    webhook_url: string;
    channel: string;};

}

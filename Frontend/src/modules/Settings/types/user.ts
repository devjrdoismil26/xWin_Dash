/**
 * Tipos de configurações de usuário
 */

export interface UserSettings {
  default_role: string;
  default_permissions: string[];
  profile_fields: {
    required: string[];
  optional: string[];
  hidden: string[];
  [key: string]: unknown; };

  avatar: {
    enabled: boolean;
    max_size: number;
    allowed_types: string[];
    default_avatar?: string;};

  notifications: {
    email_enabled: boolean;
    push_enabled: boolean;
    sms_enabled: boolean;
    default_preferences: NotificationPreferences;};

  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_email: boolean;
    show_phone: boolean;
    show_last_seen: boolean;};

  activity: {
    track_login: boolean;
    track_actions: boolean;
    retention_days: number;};

}

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

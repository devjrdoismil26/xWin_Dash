/**
 * Tipos de configurações de sistema
 */

export interface GeneralSettings {
  site_name: string;
  site_description: string;
  site_keywords: string[];
  site_logo?: string;
  site_favicon?: string;
  default_language: string;
  default_timezone: string;
  default_currency: string;
  date_format: string;
  time_format: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  allow_registration: boolean;
  require_email_verification: boolean;
  default_user_role: string;
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number; }

export interface DatabaseSettings {
  connection: {
    driver: 'mysql' | 'postgresql' | 'sqlite' | 'mongodb';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  charset: string;
  collation: string; };

  pool: {
    min_connections: number;
    max_connections: number;
    connection_timeout: number;
    idle_timeout: number;};

  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention_days: number;
    compression: boolean;
    encryption: boolean;};

  performance: {
    query_cache: boolean;
    query_log: boolean;
    slow_query_threshold: number;
    connection_pooling: boolean;};

}

export interface EmailSettings {
  driver: 'smtp' | 'sendmail' | 'mailgun' | 'ses' | 'postmark';
  smtp: {
    host: string;
  port: number;
  encryption: 'tls' | 'ssl' | 'none';
  username: string;
  password: string;
  timeout: number; };

  from: {
    name: string;
    email: string;};

  reply_to: {
    name: string;
    email: string;};

  templates: {
    welcome: string;
    password_reset: string;
    email_verification: string;
    notification: string;};

  queue: {
    enabled: boolean;
    connection: string;
    queue: string;
    retry_after: number;
    max_tries: number;};

  rate_limiting: {
    enabled: boolean;
    max_emails_per_minute: number;
    max_emails_per_hour: number;};

}

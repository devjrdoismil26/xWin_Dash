/**
 * Tipos TypeScript para o módulo Settings
 * Consolida todas as interfaces e tipos relacionados a configurações do sistema
 */

// ===== TIPOS BÁSICOS =====

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsCategory {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  groups: SettingsGroup[];
  is_visible: boolean;
  permissions: string[];
}

export interface SettingsGroup {
  id: string;
  name: string;
  label: string;
  description: string;
  category_id: string;
  order: number;
  settings: SystemSetting[];
  is_collapsible: boolean;
  is_collapsed: boolean;
}

// ===== CONFIGURAÇÕES GERAIS =====

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
  lockout_duration: number;
}

// ===== CONFIGURAÇÕES DE AUTENTICAÇÃO =====

export interface AuthSettings {
  provider: 'local' | 'oauth' | 'saml' | 'ldap';
  oauth_providers: {
    google: OAuthProvider;
    facebook: OAuthProvider;
    github: OAuthProvider;
    linkedin: OAuthProvider;
    twitter: OAuthProvider;
  };
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
    prevent_reuse: number;
    expiration_days?: number;
  };
  two_factor: {
    enabled: boolean;
    required: boolean;
    providers: ('email' | 'sms' | 'totp' | 'backup_codes')[];
  };
  session: {
    timeout: number;
    extend_on_activity: boolean;
    max_concurrent: number;
  };
  saml: {
    enabled: boolean;
    entity_id: string;
    sso_url: string;
    slo_url: string;
    certificate: string;
    private_key: string;
  };
  ldap: {
    enabled: boolean;
    server: string;
    port: number;
    base_dn: string;
    bind_dn: string;
    bind_password: string;
    user_filter: string;
    group_filter: string;
  };
}

export interface OAuthProvider {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
  auto_register: boolean;
  default_role: string;
}

// ===== CONFIGURAÇÕES DE USUÁRIOS =====

export interface UserSettings {
  default_role: string;
  default_permissions: string[];
  profile_fields: {
    required: string[];
    optional: string[];
    hidden: string[];
  };
  avatar: {
    enabled: boolean;
    max_size: number;
    allowed_types: string[];
    default_avatar?: string;
  };
  notifications: {
    email_enabled: boolean;
    push_enabled: boolean;
    sms_enabled: boolean;
    default_preferences: NotificationPreferences;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_email: boolean;
    show_phone: boolean;
    show_last_seen: boolean;
  };
  activity: {
    track_login: boolean;
    track_actions: boolean;
    retention_days: number;
  };
}

export interface NotificationPreferences {
  email: {
    marketing: boolean;
    updates: boolean;
    security: boolean;
    social: boolean;
  };
  push: {
    marketing: boolean;
    updates: boolean;
    security: boolean;
    social: boolean;
  };
  sms: {
    security: boolean;
    urgent: boolean;
  };
}

// ===== CONFIGURAÇÕES DE BANCO DE DADOS =====

export interface DatabaseSettings {
  connection: {
    driver: 'mysql' | 'postgresql' | 'sqlite' | 'mongodb';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    charset: string;
    collation: string;
  };
  pool: {
    min_connections: number;
    max_connections: number;
    connection_timeout: number;
    idle_timeout: number;
  };
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention_days: number;
    compression: boolean;
    encryption: boolean;
  };
  performance: {
    query_cache: boolean;
    query_log: boolean;
    slow_query_threshold: number;
    connection_pooling: boolean;
  };
}

// ===== CONFIGURAÇÕES DE EMAIL =====

export interface EmailSettings {
  driver: 'smtp' | 'sendmail' | 'mailgun' | 'ses' | 'postmark';
  smtp: {
    host: string;
    port: number;
    encryption: 'tls' | 'ssl' | 'none';
    username: string;
    password: string;
    timeout: number;
  };
  from: {
    name: string;
    email: string;
  };
  reply_to: {
    name: string;
    email: string;
  };
  templates: {
    welcome: string;
    password_reset: string;
    email_verification: string;
    notification: string;
  };
  queue: {
    enabled: boolean;
    connection: string;
    queue: string;
    retry_after: number;
    max_tries: number;
  };
  rate_limiting: {
    enabled: boolean;
    max_emails_per_minute: number;
    max_emails_per_hour: number;
  };
}

// ===== CONFIGURAÇÕES DE INTEGRAÇÕES =====

export interface IntegrationSettings {
  google: {
    analytics: GoogleAnalyticsConfig;
    maps: GoogleMapsConfig;
    drive: GoogleDriveConfig;
    calendar: GoogleCalendarConfig;
  };
  facebook: {
    pixel: FacebookPixelConfig;
    api: FacebookApiConfig;
  };
  stripe: {
    enabled: boolean;
    public_key: string;
    secret_key: string;
    webhook_secret: string;
    currency: string;
  };
  paypal: {
    enabled: boolean;
    client_id: string;
    client_secret: string;
    mode: 'sandbox' | 'live';
  };
  webhooks: WebhookConfig[];
  apis: ApiConfig[];
}

export interface GoogleAnalyticsConfig {
  enabled: boolean;
  tracking_id: string;
  measurement_id: string;
  api_key: string;
  view_id: string;
}

export interface GoogleMapsConfig {
  enabled: boolean;
  api_key: string;
  default_zoom: number;
  default_center: {
    lat: number;
    lng: number;
  };
}

export interface GoogleDriveConfig {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  folder_id: string;
}

export interface GoogleCalendarConfig {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  calendar_id: string;
}

export interface FacebookPixelConfig {
  enabled: boolean;
  pixel_id: string;
  access_token: string;
}

export interface FacebookApiConfig {
  enabled: boolean;
  app_id: string;
  app_secret: string;
  access_token: string;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  retry_count: number;
  timeout: number;
  headers: { [key: string]: string };
}

export interface ApiConfig {
  id: string;
  name: string;
  base_url: string;
  api_key: string;
  timeout: number;
  rate_limit: number;
  is_active: boolean;
  headers: { [key: string]: string };
}

// ===== CONFIGURAÇÕES DE IA =====

export interface AISettings {
  openai: {
    enabled: boolean;
    api_key: string;
    model: string;
    max_tokens: number;
    temperature: number;
    timeout: number;
  };
  anthropic: {
    enabled: boolean;
    api_key: string;
    model: string;
    max_tokens: number;
    temperature: number;
    timeout: number;
  };
  google_ai: {
    enabled: boolean;
    api_key: string;
    model: string;
    max_tokens: number;
    temperature: number;
    timeout: number;
  };
  features: {
    text_generation: boolean;
    image_generation: boolean;
    text_analysis: boolean;
    translation: boolean;
    summarization: boolean;
    chat: boolean;
  };
  moderation: {
    enabled: boolean;
    provider: 'openai' | 'anthropic' | 'google' | 'custom';
    filters: string[];
    auto_block: boolean;
  };
}

// ===== CONFIGURAÇÕES DE API =====

export interface APISettings {
  version: string;
  base_url: string;
  rate_limiting: {
    enabled: boolean;
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
  authentication: {
    methods: ('api_key' | 'oauth' | 'jwt')[];
    api_key_header: string;
    jwt_secret: string;
    jwt_expiry: number;
  };
  cors: {
    enabled: boolean;
    origins: string[];
    methods: string[];
    headers: string[];
    credentials: boolean;
  };
  documentation: {
    enabled: boolean;
    theme: 'default' | 'dark' | 'custom';
    custom_css?: string;
  };
  monitoring: {
    enabled: boolean;
    log_requests: boolean;
    log_responses: boolean;
    alert_on_errors: boolean;
    alert_threshold: number;
  };
}

// ===== CONFIGURAÇÕES DE SEGURANÇA =====

export interface SecuritySettings {
  encryption: {
    algorithm: string;
    key_size: number;
    iv_size: number;
  };
  ssl: {
    enabled: boolean;
    certificate_path: string;
    private_key_path: string;
    force_https: boolean;
    hsts_enabled: boolean;
    hsts_max_age: number;
  };
  headers: {
    x_frame_options: string;
    x_content_type_options: string;
    x_xss_protection: string;
    strict_transport_security: string;
    content_security_policy: string;
  };
  firewall: {
    enabled: boolean;
    rules: FirewallRule[];
    whitelist: string[];
    blacklist: string[];
  };
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention_days: number;
    encryption: boolean;
    compression: boolean;
    location: string;
  };
  monitoring: {
    enabled: boolean;
    log_level: 'debug' | 'info' | 'warning' | 'error';
    alert_on_suspicious_activity: boolean;
    alert_threshold: number;
  };
}

export interface FirewallRule {
  id: string;
  name: string;
  type: 'allow' | 'deny';
  source: string;
  destination: string;
  port: number;
  protocol: 'tcp' | 'udp' | 'icmp';
  action: 'accept' | 'reject' | 'drop';
  is_active: boolean;
}

// ===== CONFIGURAÇÕES DE CACHE =====

export interface CacheSettings {
  driver: 'file' | 'redis' | 'memcached' | 'database';
  redis: {
    host: string;
    port: number;
    password?: string;
    database: number;
    timeout: number;
  };
  memcached: {
    servers: Array<{
      host: string;
      port: number;
      weight: number;
    }>;
    timeout: number;
  };
  ttl: {
    default: number;
    user_sessions: number;
    api_responses: number;
    static_content: number;
  };
  tags: {
    enabled: boolean;
    user_data: string[];
    system_data: string[];
  };
  compression: {
    enabled: boolean;
    algorithm: 'gzip' | 'brotli';
    level: number;
  };
}

// ===== CONFIGURAÇÕES DE LOGS =====

export interface LogSettings {
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  channels: {
    file: FileLogChannel;
    database: DatabaseLogChannel;
    email: EmailLogChannel;
    slack: SlackLogChannel;
  };
  retention: {
    days: number;
    max_files: number;
    max_size: string;
  };
  formatting: {
    date_format: string;
    include_context: boolean;
    include_stack_trace: boolean;
  };
}

export interface FileLogChannel {
  enabled: boolean;
  path: string;
  max_size: string;
  max_files: number;
  level: string;
}

export interface DatabaseLogChannel {
  enabled: boolean;
  table: string;
  level: string;
  connection: string;
}

export interface EmailLogChannel {
  enabled: boolean;
  to: string[];
  subject: string;
  level: string;
  batch_size: number;
}

export interface SlackLogChannel {
  enabled: boolean;
  webhook_url: string;
  channel: string;
  level: string;
  username: string;
}

// ===== CONFIGURAÇÕES DE NOTIFICAÇÕES =====

export interface NotificationSettings {
  channels: {
    email: EmailNotificationChannel;
    push: PushNotificationChannel;
    sms: SmsNotificationChannel;
    webhook: WebhookNotificationChannel;
  };
  templates: NotificationTemplate[];
  preferences: {
    default_channels: string[];
    quiet_hours: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    };
  };
}

export interface EmailNotificationChannel {
  enabled: boolean;
  driver: string;
  from: {
    name: string;
    email: string;
  };
  queue: boolean;
  batch_size: number;
}

export interface PushNotificationChannel {
  enabled: boolean;
  provider: 'fcm' | 'apns' | 'web_push';
  fcm: {
    server_key: string;
    project_id: string;
  };
  apns: {
    certificate_path: string;
    private_key_path: string;
    passphrase: string;
    production: boolean;
  };
  web_push: {
    public_key: string;
    private_key: string;
  };
}

export interface SmsNotificationChannel {
  enabled: boolean;
  provider: 'twilio' | 'nexmo' | 'aws_sns';
  twilio: {
    account_sid: string;
    auth_token: string;
    from_number: string;
  };
  nexmo: {
    api_key: string;
    api_secret: string;
    from: string;
  };
  aws_sns: {
    access_key_id: string;
    secret_access_key: string;
    region: string;
  };
}

export interface WebhookNotificationChannel {
  enabled: boolean;
  url: string;
  secret: string;
  timeout: number;
  retry_count: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  body: string;
  variables: string[];
  channels: string[];
  is_active: boolean;
}

// ===== CONFIGURAÇÕES DE ARMAZENAMENTO =====

export interface StorageSettings {
  default_disk: 'local' | 's3' | 'gcs' | 'azure';
  local: {
    root: string;
    url: string;
    visibility: 'public' | 'private';
  };
  s3: {
    key: string;
    secret: string;
    region: string;
    bucket: string;
    url: string;
    endpoint?: string;
    use_path_style_endpoint: boolean;
  };
  gcs: {
    project_id: string;
    key_file: string;
    bucket: string;
    url: string;
  };
  azure: {
    account_name: string;
    account_key: string;
    container: string;
    url: string;
  };
  cloudinary: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
    secure: boolean;
  };
}

// ===== CONFIGURAÇÕES DE PERFORMANCE =====

export interface PerformanceSettings {
  optimization: {
    minify_css: boolean;
    minify_js: boolean;
    minify_html: boolean;
    compress_images: boolean;
    lazy_loading: boolean;
    cdn_enabled: boolean;
    cdn_url: string;
  };
  database: {
    query_cache: boolean;
    connection_pooling: boolean;
    slow_query_log: boolean;
    slow_query_threshold: number;
  };
  memory: {
    opcache_enabled: boolean;
    opcache_memory_consumption: number;
    opcache_max_accelerated_files: number;
  };
  monitoring: {
    enabled: boolean;
    slow_request_threshold: number;
    memory_limit_warning: number;
    cpu_limit_warning: number;
  };
}

// ===== TIPOS DE RESPOSTA DA API =====

export interface SettingsApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validation_errors?: { [key: string]: string[] };
  meta?: {
    timestamp: string;
    request_id: string;
    version: string;
  };
}

export interface SettingsBulkResponse<T> {
  success: boolean;
  data: {
    created: T[];
    updated: T[];
    deleted: string[];
    failed: {
      id: string;
      error: string;
    }[];
  };
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// ===== TIPOS DE UTILITÁRIOS =====

export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array' | 'object' | 'file' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'textarea' | 'password' | 'email' | 'url' | 'date' | 'time' | 'datetime';

export type SettingCategory = 'general' | 'auth' | 'users' | 'database' | 'email' | 'integrations' | 'ai' | 'api' | 'security' | 'cache' | 'logs' | 'notifications' | 'storage' | 'performance';

export type SettingGroup = 'basic' | 'advanced' | 'security' | 'performance' | 'integrations' | 'notifications' | 'backup' | 'monitoring';

export type ValidationRule = 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'numeric' | 'alpha' | 'alphanumeric' | 'in' | 'not_in' | 'between' | 'size' | 'mimes' | 'image' | 'file';

// ===== TIPOS DE EVENTOS =====

export interface SettingsEvent {
  type: 'setting_updated' | 'setting_created' | 'setting_deleted' | 'category_updated' | 'group_updated' | 'bulk_update' | 'import' | 'export' | 'reset';
  setting_key?: string;
  category?: string;
  group?: string;
  old_value?: any;
  new_value?: any;
  user_id?: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

// ===== TIPOS DE AUDITORIA =====

export interface SettingsAudit {
  id: string;
  setting_key: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'import';
  old_value?: any;
  new_value?: any;
  user_id?: string;
  user_name?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
}

// ===== TIPOS DE BACKUP E RESTORE =====

export interface SettingsBackup {
  id: string;
  name: string;
  description?: string;
  settings: { [key: string]: any };
  categories: string[];
  groups: string[];
  created_at: string;
  created_by: string;
  file_size: number;
  checksum: string;
  is_encrypted: boolean;
}

export interface SettingsRestore {
  id: string;
  backup_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  duration?: number;
  settings_restored: number;
  errors: string[];
  created_by: string;
}

// ===== TIPOS DE TEMPLATES =====

export interface SettingsTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  settings: { [key: string]: any };
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  rating: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  author_id: string;
}

// ===== TIPOS DE VALIDAÇÃO =====

export interface SettingValidation {
  rule: ValidationRule;
  value: any;
  message?: string;
  custom_validator?: (value: any) => boolean | string;
}

export interface SettingDependency {
  setting_key: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in';
  value: any;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'optional';
}

// ===== TIPOS DE CONFIGURAÇÃO DE AMBIENTE =====

export interface EnvironmentConfig {
  app_name: string;
  app_env: 'local' | 'development' | 'staging' | 'production';
  app_debug: boolean;
  app_url: string;
  app_timezone: string;
  app_locale: string;
  app_fallback_locale: string;
  app_key: string;
  app_cipher: string;
  db_connection: string;
  db_host: string;
  db_port: number;
  db_database: string;
  db_username: string;
  db_password: string;
  cache_driver: string;
  queue_connection: string;
  session_driver: string;
  session_lifetime: number;
  mail_driver: string;
  mail_host: string;
  mail_port: number;
  mail_username: string;
  mail_password: string;
  mail_encryption: string;
  pusher_app_id: string;
  pusher_app_key: string;
  pusher_app_secret: string;
  pusher_app_cluster: string;
}

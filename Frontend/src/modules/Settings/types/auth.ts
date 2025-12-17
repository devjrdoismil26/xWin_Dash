/**
 * Tipos de autenticação e segurança
 */

export interface AuthSettings {
  oauth: {
    google: OAuthProvider;
  facebook: OAuthProvider;
  github: OAuthProvider;
  microsoft: OAuthProvider; };

  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
    prevent_reuse: number;
    expiration_days?: number;};

  two_factor: {
    enabled: boolean;
    required: boolean;
    providers: ('email' | 'sms' | 'totp' | 'backup_codes')[];};

  session: {
    timeout: number;
    extend_on_activity: boolean;
    max_concurrent: number;};

  saml: {
    enabled: boolean;
    entity_id: string;
    sso_url: string;
    slo_url: string;
    certificate: string;
    private_key: string;};

  ldap: {
    enabled: boolean;
    server: string;
    port: number;
    base_dn: string;
    bind_dn: string;
    bind_password: string;
    user_filter: string;
    group_filter: string;};

}

export interface OAuthProvider {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
  auto_register: boolean;
  default_role: string; }

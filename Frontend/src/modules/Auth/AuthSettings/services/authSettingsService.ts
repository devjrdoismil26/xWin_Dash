import { apiClient } from '@/services';
// import { withCache, invalidateSettingsCache } from '../services/settingsCacheService';
// import { validateAuthSettingsData, handleSettingsError, withErrorHandling, withRetry } from '../services/settingsErrorService';

// =========================================
// TIPOS - CONFIGURAÇÕES DE AUTENTICAÇÃO
// =========================================

export interface AuthSettings {
  id?: string;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
  password_expiry_days: number;
  password_history_count: number;
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number;
  two_factor_enabled: boolean;
  two_factor_method: 'email' | 'sms' | 'app' | 'backup_codes';
  two_factor_backup_codes_count: number;
  oauth_providers: string[];
  jwt_secret_key: string;
  jwt_expiry_time: number;
  refresh_token_expiry_time: number;
  remember_me_enabled: boolean;
  remember_me_duration: number;
  auto_logout_enabled: boolean;
  auto_logout_warning_time: number;
  ip_whitelist: string[];
  ip_blacklist: string[];
  rate_limiting_enabled: boolean;
  rate_limiting_requests: number;
  rate_limiting_window: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSettingsFormData {
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
  password_expiry_days: number;
  password_history_count: number;
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number;
  two_factor_enabled: boolean;
  two_factor_method: 'email' | 'sms' | 'app' | 'backup_codes';
  two_factor_backup_codes_count: number;
  oauth_providers: string[];
  jwt_secret_key: string;
  jwt_expiry_time: number;
  refresh_token_expiry_time: number;
  remember_me_enabled: boolean;
  remember_me_duration: number;
  auto_logout_enabled: boolean;
  auto_logout_warning_time: number;
  ip_whitelist: string[];
  ip_blacklist: string[];
  rate_limiting_enabled: boolean;
  rate_limiting_requests: number;
  rate_limiting_window: number;
}

export interface AuthSettingsResponse {
  success: boolean;
  data?: AuthSettings | AuthSettings[];
  message?: string;
  error?: string;
}

export interface AuthSettingsFilters {
  search?: string;
  two_factor_enabled?: boolean;
  oauth_enabled?: boolean;
  rate_limiting_enabled?: boolean;
}

// =========================================
// SERVIÇO - CONFIGURAÇÕES DE AUTENTICAÇÃO
// =========================================

class AuthSettingsService {
  private api = apiClient;

  // ===== CONFIGURAÇÕES DE AUTENTICAÇÃO =====
  
  /**
   * Buscar todas as configurações de autenticação
   */
  async getAuthSettings(filters: AuthSettingsFilters = {}): Promise<AuthSettingsResponse> {
    return withCache('auth-settings', async () => {
      try {
        const response = await this.api.get('/settings/auth', { params: filters });
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSettingsError(error, 'getAuthSettings', { filters });
      }
    });
  }

  /**
   * Buscar configuração de autenticação por ID
   */
  async getAuthSettingById(id: string): Promise<AuthSettingsResponse> {
    return withCache(`auth-setting-${id}`, async () => {
      try {
        const response = await this.api.get(`/settings/auth/${id}`);
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSettingsError(error, 'getAuthSettingById', { id });
      }
    });
  }

  /**
   * Criar nova configuração de autenticação
   */
  async createAuthSetting(data: AuthSettingsFormData): Promise<AuthSettingsResponse> {
    // Validar dados antes de enviar
    const validation = validateAuthSettingsData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/auth', data));
      
      // Invalidar cache de configurações de autenticação
      invalidateSettingsCache('auth-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'createAuthSetting', { settingId: 'auth' });
  }

  /**
   * Atualizar configuração de autenticação
   */
  async updateAuthSetting(id: string, data: Partial<AuthSettingsFormData>): Promise<AuthSettingsResponse> {
    // Validar dados antes de enviar
    const validation = validateAuthSettingsData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put(`/settings/auth/${id}`, data));
      
      // Invalidar cache específico e geral
      invalidateSettingsCache(`auth-setting-${id}`);
      invalidateSettingsCache('auth-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'updateAuthSetting', { settingId: id });
  }

  /**
   * Deletar configuração de autenticação
   */
  async deleteAuthSetting(id: string): Promise<AuthSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.delete(`/settings/auth/${id}`));
      
      // Invalidar cache específico e geral
      invalidateSettingsCache(`auth-setting-${id}`);
      invalidateSettingsCache('auth-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'deleteAuthSetting', { settingId: id });
  }

  /**
   * Atualizar múltiplas configurações de autenticação
   */
  async updateMultipleAuthSettings(settings: Record<string, any>): Promise<AuthSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put('/settings/auth/bulk', { settings }));
      
      // Invalidar cache de configurações de autenticação
      invalidateSettingsCache('auth-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'updateMultipleAuthSettings', { settingsCount: Object.keys(settings).length });
  }

  /**
   * Resetar configurações de autenticação para padrão
   */
  async resetAuthSettings(): Promise<AuthSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/auth/reset'));
      
      // Invalidar cache de configurações de autenticação
      invalidateSettingsCache('auth-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'resetAuthSettings', {});
  }

  // ===== CONFIGURAÇÕES ESPECÍFICAS =====

  /**
   * Atualizar configurações de senha
   */
  async updatePasswordSettings(settings: {
    min_length?: number;
    require_uppercase?: boolean;
    require_lowercase?: boolean;
    require_numbers?: boolean;
    require_symbols?: boolean;
    expiry_days?: number;
    history_count?: number;
  }): Promise<AuthSettingsResponse> {
    return this.updateAuthSetting('password', settings);
  }

  /**
   * Atualizar configurações de sessão
   */
  async updateSessionSettings(settings: {
    timeout?: number;
    max_attempts?: number;
    lockout_duration?: number;
    remember_me_enabled?: boolean;
    remember_me_duration?: number;
    auto_logout_enabled?: boolean;
    auto_logout_warning_time?: number;
  }): Promise<AuthSettingsResponse> {
    return this.updateAuthSetting('session', settings);
  }

  /**
   * Atualizar configurações de 2FA
   */
  async updateTwoFactorSettings(settings: {
    enabled?: boolean;
    method?: 'email' | 'sms' | 'app' | 'backup_codes';
    backup_codes_count?: number;
  }): Promise<AuthSettingsResponse> {
    return this.updateAuthSetting('two_factor', settings);
  }

  /**
   * Atualizar configurações de OAuth
   */
  async updateOAuthSettings(providers: string[]): Promise<AuthSettingsResponse> {
    return this.updateAuthSetting('oauth', { oauth_providers: providers });
  }

  /**
   * Atualizar configurações de JWT
   */
  async updateJWTSettings(settings: {
    secret_key?: string;
    expiry_time?: number;
    refresh_token_expiry_time?: number;
  }): Promise<AuthSettingsResponse> {
    return this.updateAuthSetting('jwt', settings);
  }

  /**
   * Atualizar configurações de IP
   */
  async updateIPSettings(settings: {
    whitelist?: string[];
    blacklist?: string[];
  }): Promise<AuthSettingsResponse> {
    return this.updateAuthSetting('ip', settings);
  }

  /**
   * Atualizar configurações de rate limiting
   */
  async updateRateLimitingSettings(settings: {
    enabled?: boolean;
    requests?: number;
    window?: number;
  }): Promise<AuthSettingsResponse> {
    return this.updateAuthSetting('rate_limiting', settings);
  }

  // ===== TESTES E VALIDAÇÕES =====

  /**
   * Testar configurações de autenticação
   */
  async testAuthSettings(): Promise<AuthSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/auth/test'));
      return {
        success: true,
        data: response.data
      };
    }, 'testAuthSettings', {});
  }

  /**
   * Validar força da senha
   */
  async validatePasswordStrength(password: string): Promise<AuthSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/auth/validate-password', { password }));
      return {
        success: true,
        data: response.data
      };
    }, 'validatePasswordStrength', {});
  }

  /**
   * Gerar códigos de backup para 2FA
   */
  async generateBackupCodes(): Promise<AuthSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/auth/generate-backup-codes'));
      return {
        success: true,
        data: response.data
      };
    }, 'generateBackupCodes', {});
  }

  // ===== UTILITÁRIOS =====

  /**
   * Obter configurações padrão
   */
  getDefaultAuthSettings(): AuthSettings {
    return {
      password_min_length: 8,
      password_require_uppercase: true,
      password_require_lowercase: true,
      password_require_numbers: true,
      password_require_symbols: false,
      password_expiry_days: 90,
      password_history_count: 5,
      session_timeout: 3600, // 1 hora
      max_login_attempts: 5,
      lockout_duration: 900, // 15 minutos
      two_factor_enabled: false,
      two_factor_method: 'email',
      two_factor_backup_codes_count: 10,
      oauth_providers: [],
      jwt_secret_key: '',
      jwt_expiry_time: 3600, // 1 hora
      refresh_token_expiry_time: 604800, // 7 dias
      remember_me_enabled: true,
      remember_me_duration: 2592000, // 30 dias
      auto_logout_enabled: true,
      auto_logout_warning_time: 300, // 5 minutos
      ip_whitelist: [],
      ip_blacklist: [],
      rate_limiting_enabled: true,
      rate_limiting_requests: 100,
      rate_limiting_window: 900 // 15 minutos
    };
  }

  /**
   * Validar configuração de senha
   */
  validatePasswordSettings(settings: Partial<AuthSettings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (settings.password_min_length && settings.password_min_length < 6) {
      errors.push('Tamanho mínimo da senha deve ser pelo menos 6 caracteres');
    }

    if (settings.password_expiry_days && settings.password_expiry_days < 30) {
      errors.push('Expiração da senha deve ser pelo menos 30 dias');
    }

    if (settings.password_history_count && settings.password_history_count < 1) {
      errors.push('Histórico de senhas deve ser pelo menos 1');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar configuração de sessão
   */
  validateSessionSettings(settings: Partial<AuthSettings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (settings.session_timeout && settings.session_timeout < 300) {
      errors.push('Timeout de sessão deve ser pelo menos 5 minutos');
    }

    if (settings.max_login_attempts && settings.max_login_attempts < 1) {
      errors.push('Máximo de tentativas de login deve ser pelo menos 1');
    }

    if (settings.lockout_duration && settings.lockout_duration < 60) {
      errors.push('Duração do bloqueio deve ser pelo menos 1 minuto');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Formatar configuração para exibição
   */
  formatAuthSetting(setting: AuthSettings): Record<string, any> {
    return {
      ...setting,
      formatted_created_at: setting.created_at ? new Date(setting.created_at).toLocaleString('pt-BR') : '',
      formatted_updated_at: setting.updated_at ? new Date(setting.updated_at).toLocaleString('pt-BR') : '',
      formatted_session_timeout: `${Math.floor(setting.session_timeout / 60)} minutos`,
      formatted_lockout_duration: `${Math.floor(setting.lockout_duration / 60)} minutos`,
      formatted_jwt_expiry_time: `${Math.floor(setting.jwt_expiry_time / 60)} minutos`,
      formatted_refresh_token_expiry_time: `${Math.floor(setting.refresh_token_expiry_time / 86400)} dias`,
      formatted_remember_me_duration: `${Math.floor(setting.remember_me_duration / 86400)} dias`,
      formatted_auto_logout_warning_time: `${Math.floor(setting.auto_logout_warning_time / 60)} minutos`,
      formatted_rate_limiting_window: `${Math.floor(setting.rate_limiting_window / 60)} minutos`
    };
  }

  /**
   * Obter estatísticas das configurações de autenticação
   */
  async getAuthSettingsStats(): Promise<AuthSettingsResponse> {
    return withCache('auth-settings-stats', async () => {
      try {
        const response = await this.api.get('/settings/auth/stats');
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSettingsError(error, 'getAuthSettingsStats', {});
      }
    });
  }
}

// =========================================
// EXPORTS - SERVIÇO DE CONFIGURAÇÕES DE AUTENTICAÇÃO
// =========================================

const authSettingsService = new AuthSettingsService();
export { authSettingsService };
export default authSettingsService;

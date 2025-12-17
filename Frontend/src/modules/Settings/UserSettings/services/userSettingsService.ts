import { apiClient } from '@/services';
import { withCache } from '@/services/settingsCacheService';
import { handleSettingsError } from '@/services/settingsErrorService';
import { withRetry } from '@/lib/utils';
import { withErrorHandling } from '@/lib/utils';
import { invalidateSettingsCache } from '@/services/settingsCacheService';

// =========================================
// TIPOS - CONFIGURAÇÕES DE USUÁRIO
// =========================================

export interface UserSettings {
  id?: string;
  default_role: string;
  auto_approve_users: boolean;
  require_email_verification: boolean;
  allow_self_registration: boolean;
  registration_approval_required: boolean;
  default_user_status: 'active' | 'inactive' | 'pending';
  user_profile_fields: string[];
  required_profile_fields: string[];
  optional_profile_fields: string[];
  avatar_upload_enabled: boolean;
  avatar_max_size: number;
  avatar_allowed_types: string[];
  profile_picture_required: boolean;
  username_requirements: {
    min_length: number;
  max_length: number;
  allowed_characters: string;
  unique_required: boolean;
  [key: string]: unknown; };

  password_requirements: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;};

  account_locking: {
    enabled: boolean;
    max_attempts: number;
    lockout_duration: number;
    unlock_after: number;};

  session_management: {
    max_concurrent_sessions: number;
    session_timeout: number;
    remember_me_enabled: boolean;
    remember_me_duration: number;};

  privacy_settings: {
    profile_visibility: 'public' | 'private' | 'friends';
    activity_visibility: 'public' | 'private' | 'friends';
    data_sharing: boolean;
    analytics_tracking: boolean;};

  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    desktop_notifications: boolean;};

  created_at?: string;
  updated_at?: string;
}

export interface UserSettingsFormData {
  default_role: string;
  auto_approve_users: boolean;
  require_email_verification: boolean;
  allow_self_registration: boolean;
  registration_approval_required: boolean;
  default_user_status: 'active' | 'inactive' | 'pending';
  user_profile_fields: string[];
  required_profile_fields: string[];
  optional_profile_fields: string[];
  avatar_upload_enabled: boolean;
  avatar_max_size: number;
  avatar_allowed_types: string[];
  profile_picture_required: boolean;
  username_requirements: {
    min_length: number;
  max_length: number;
  allowed_characters: string;
  unique_required: boolean;
  [key: string]: unknown; };

  password_requirements: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;};

  account_locking: {
    enabled: boolean;
    max_attempts: number;
    lockout_duration: number;
    unlock_after: number;};

  session_management: {
    max_concurrent_sessions: number;
    session_timeout: number;
    remember_me_enabled: boolean;
    remember_me_duration: number;};

  privacy_settings: {
    profile_visibility: 'public' | 'private' | 'friends';
    activity_visibility: 'public' | 'private' | 'friends';
    data_sharing: boolean;
    analytics_tracking: boolean;};

  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    desktop_notifications: boolean;};

}

export interface UserSettingsResponse {
  success: boolean;
  data?: UserSettings | UserSettings[];
  message?: string;
  error?: string;
  [key: string]: unknown; }

export interface UserSettingsFilters {
  search?: string;
  role?: string;
  status?: string;
  registration_enabled?: boolean;
  [key: string]: unknown; }

// =========================================
// SERVIÇO - CONFIGURAÇÕES DE USUÁRIO
// =========================================

class UserSettingsService {
  private api = apiClient;

  // ===== CONFIGURAÇÕES DE USUÁRIO =====
  
  /**
   * Buscar todas as configurações de usuário
   */
  async getUserSettings(filters: UserSettingsFilters = {}): Promise<UserSettingsResponse> {
    return withCache('user-settings', async () => {
      try {
        const response = await this.api.get('/settings/users', { params: filters });

        return {
          success: true,
          data: (response as any).data};

      } catch (error: unknown) {
        return handleSettingsError(error, 'getUserSettings', { filters });

      } );

  }

  /**
   * Buscar configuração de usuário por ID
   */
  async getUserSettingById(id: string): Promise<UserSettingsResponse> {
    return withCache(`user-setting-${id}`, async () => {
      try {
        const response = await this.api.get(`/settings/users/${id}`);

        return {
          success: true,
          data: (response as any).data};

      } catch (error: unknown) {
        return handleSettingsError(error, 'getUserSettingById', { id });

      } );

  }

  /**
   * Criar nova configuração de usuário
   */
  async createUserSetting(data: UserSettingsFormData): Promise<UserSettingsResponse> {
    // Validar dados antes de enviar
    const validation = validateUserSettingsData(data);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')};

    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/users', data));

      // Invalidar cache de configurações de usuário
      invalidateSettingsCache('user-settings');

      return {
        success: true,
        data: (response as any).data};

    }, 'createUserSetting', { settingId: 'users' });

  }

  /**
   * Atualizar configuração de usuário
   */
  async updateUserSetting(id: string, data: Partial<UserSettingsFormData>): Promise<UserSettingsResponse> {
    // Validar dados antes de enviar
    const validation = validateUserSettingsData(data);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')};

    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put(`/settings/users/${id}`, data));

      // Invalidar cache específico e geral
      invalidateSettingsCache(`user-setting-${id}`);

      invalidateSettingsCache('user-settings');

      return {
        success: true,
        data: (response as any).data};

    }, 'updateUserSetting', { settingId: id });

  }

  /**
   * Deletar configuração de usuário
   */
  async deleteUserSetting(id: string): Promise<UserSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.delete(`/settings/users/${id}`));

      // Invalidar cache específico e geral
      invalidateSettingsCache(`user-setting-${id}`);

      invalidateSettingsCache('user-settings');

      return {
        success: true,
        data: (response as any).data};

    }, 'deleteUserSetting', { settingId: id });

  }

  /**
   * Atualizar múltiplas configurações de usuário
   */
  async updateMultipleUserSettings(settings: Record<string, any>): Promise<UserSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put('/settings/users/bulk', { settings }));

      // Invalidar cache de configurações de usuário
      invalidateSettingsCache('user-settings');

      return {
        success: true,
        data: (response as any).data};

    }, 'updateMultipleUserSettings', { settingsCount: Object.keys(settings).length });

  }

  /**
   * Resetar configurações de usuário para padrão
   */
  async resetUserSettings(): Promise<UserSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/users/reset'));

      // Invalidar cache de configurações de usuário
      invalidateSettingsCache('user-settings');

      return {
        success: true,
        data: (response as any).data};

    }, 'resetUserSettings', {});

  }

  // ===== CONFIGURAÇÕES ESPECÍFICAS =====

  /**
   * Atualizar configurações de registro
   */
  async updateRegistrationSettings(settings: {
    allow_self_registration?: boolean;
    require_email_verification?: boolean;
    registration_approval_required?: boolean;
    auto_approve_users?: boolean;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('registration', settings);

  }

  /**
   * Atualizar configurações de perfil
   */
  async updateProfileSettings(settings: {
    user_profile_fields?: string[];
    required_profile_fields?: string[];
    optional_profile_fields?: string[];
    avatar_upload_enabled?: boolean;
    avatar_max_size?: number;
    avatar_allowed_types?: string[];
    profile_picture_required?: boolean;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('profile', settings);

  }

  /**
   * Atualizar configurações de username
   */
  async updateUsernameSettings(settings: {
    min_length?: number;
    max_length?: number;
    allowed_characters?: string;
    unique_required?: boolean;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('username', { username_requirements: settings });

  }

  /**
   * Atualizar configurações de senha
   */
  async updatePasswordSettings(settings: {
    min_length?: number;
    require_uppercase?: boolean;
    require_lowercase?: boolean;
    require_numbers?: boolean;
    require_symbols?: boolean;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('password', { password_requirements: settings });

  }

  /**
   * Atualizar configurações de bloqueio de conta
   */
  async updateAccountLockingSettings(settings: {
    enabled?: boolean;
    max_attempts?: number;
    lockout_duration?: number;
    unlock_after?: number;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('account_locking', { account_locking: settings });

  }

  /**
   * Atualizar configurações de sessão
   */
  async updateSessionSettings(settings: {
    max_concurrent_sessions?: number;
    session_timeout?: number;
    remember_me_enabled?: boolean;
    remember_me_duration?: number;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('session', { session_management: settings });

  }

  /**
   * Atualizar configurações de privacidade
   */
  async updatePrivacySettings(settings: {
    profile_visibility?: 'public' | 'private' | 'friends';
    activity_visibility?: 'public' | 'private' | 'friends';
    data_sharing?: boolean;
    analytics_tracking?: boolean;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('privacy', { privacy_settings: settings });

  }

  /**
   * Atualizar configurações de notificação
   */
  async updateNotificationSettings(settings: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    sms_notifications?: boolean;
    desktop_notifications?: boolean;
  }): Promise<UserSettingsResponse> {
    return this.updateUserSetting('notifications', { notification_preferences: settings });

  }

  // ===== TESTES E VALIDAÇÕES =====

  /**
   * Testar configurações de usuário
   */
  async testUserSettings(): Promise<UserSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/users/test'));

      return {
        success: true,
        data: (response as any).data};

    }, 'testUserSettings', {});

  }

  /**
   * Validar username
   */
  async validateUsername(username: string): Promise<UserSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/users/validate-username', { username }));

      return {
        success: true,
        data: (response as any).data};

    }, 'validateUsername', {});

  }

  /**
   * Verificar disponibilidade de username
   */
  async checkUsernameAvailability(username: string): Promise<UserSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.get(`/settings/users/check-username/${username}`));

      return {
        success: true,
        data: (response as any).data};

    }, 'checkUsernameAvailability', {});

  }

  // ===== UTILITÁRIOS =====

  /**
   * Obter configurações padrão
   */
  getDefaultUserSettings(): UserSettings {
    return {
      default_role: 'user',
      auto_approve_users: false,
      require_email_verification: true,
      allow_self_registration: true,
      registration_approval_required: false,
      default_user_status: 'pending',
      user_profile_fields: ['name', 'email', 'phone', 'bio', 'avatar'],
      required_profile_fields: ['name', 'email'],
      optional_profile_fields: ['phone', 'bio', 'avatar'],
      avatar_upload_enabled: true,
      avatar_max_size: 2097152, // 2MB
      avatar_allowed_types: ['jpg', 'jpeg', 'png', 'gif'],
      profile_picture_required: false,
      username_requirements: {
        min_length: 3,
        max_length: 20,
        allowed_characters: 'a-zA-Z0-9_-',
        unique_required: true
      },
      password_requirements: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: false
      },
      account_locking: {
        enabled: true,
        max_attempts: 5,
        lockout_duration: 900, // 15 minutos
        unlock_after: 3600 // 1 hora
      },
      session_management: {
        max_concurrent_sessions: 3,
        session_timeout: 3600, // 1 hora
        remember_me_enabled: true,
        remember_me_duration: 2592000 // 30 dias
      },
      privacy_settings: {
        profile_visibility: 'public',
        activity_visibility: 'public',
        data_sharing: false,
        analytics_tracking: true
      },
      notification_preferences: {
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        desktop_notifications: true
      } ;

  }

  /**
   * Validar configurações de usuário
   */
  validateUserSettings(settings: Partial<UserSettings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (settings.username_requirements) {
      const req = settings.username_requirements;
      if (req.min_length && req.min_length < 2) {
        errors.push('Tamanho mínimo do username deve ser pelo menos 2 caracteres');

      }
      if (req.max_length && req.max_length > 50) {
        errors.push('Tamanho máximo do username deve ser no máximo 50 caracteres');

      } if (settings.password_requirements) {
      const req = settings.password_requirements;
      if (req.min_length && req.min_length < 6) {
        errors.push('Tamanho mínimo da senha deve ser pelo menos 6 caracteres');

      } if (settings.account_locking) {
      const lock = settings.account_locking;
      if (lock.max_attempts && lock.max_attempts < 1) {
        errors.push('Máximo de tentativas deve ser pelo menos 1');

      }
      if (lock.lockout_duration && lock.lockout_duration < 60) {
        errors.push('Duração do bloqueio deve ser pelo menos 1 minuto');

      } return {
      isValid: errors.length === 0,
      errors};

  }

  /**
   * Formatar configuração para exibição
   */
  formatUserSetting(setting: UserSettings): Record<string, any> {
    return {
      ...setting,
      formatted_created_at: setting.created_at ? new Date(setting.created_at).toLocaleString('pt-BR') : '',
      formatted_updated_at: setting.updated_at ? new Date(setting.updated_at).toLocaleString('pt-BR') : '',
      formatted_avatar_max_size: `${(setting.avatar_max_size / 1048576).toFixed(1)} MB`,
      formatted_session_timeout: `${Math.floor(setting.session_management.session_timeout / 60)} minutos`,
      formatted_lockout_duration: `${Math.floor(setting.account_locking.lockout_duration / 60)} minutos`,
      formatted_remember_me_duration: `${Math.floor(setting.session_management.remember_me_duration / 86400)} dias`};

  }

  /**
   * Obter estatísticas das configurações de usuário
   */
  async getUserSettingsStats(): Promise<UserSettingsResponse> {
    return withCache('user-settings-stats', async () => {
      try {
        const response = await this.api.get('/settings/users/stats');

        return {
          success: true,
          data: (response as any).data};

      } catch (error: unknown) {
        return handleSettingsError(error, 'getUserSettingsStats', {});

      } );

  } // =========================================
// EXPORTS - SERVIÇO DE CONFIGURAÇÕES DE USUÁRIO
// =========================================

const userSettingsService = new UserSettingsService();

export { userSettingsService };

export default userSettingsService;

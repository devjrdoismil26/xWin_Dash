import { apiClient } from '@/services';
import { withCache, invalidateSocialCache } from '../services/socialCacheService';
import { validateAccountData, handleSocialError, withErrorHandling, withRetry } from '../services/socialErrorService';

// =========================================
// TIPOS - CONTAS SOCIAIS
// =========================================

export interface SocialAccount {
  id?: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest';
  username: string;
  display_name: string;
  profile_picture?: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  status: 'connected' | 'disconnected' | 'error' | 'expired';
  is_active: boolean;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  last_sync_at?: string;
  permissions: string[];
  metadata?: {
    page_id?: string;
    business_account_id?: string;
    category?: string;
    website?: string;
    bio?: string;
    location?: string;
    verified?: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface SocialAccountFormData {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest';
  username: string;
  display_name: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  is_active: boolean;
  permissions: string[];
  metadata?: {
    page_id?: string;
    business_account_id?: string;
    category?: string;
    website?: string;
    bio?: string;
    location?: string;
    verified?: boolean;
  };
}

export interface SocialAccountResponse {
  success: boolean;
  data?: SocialAccount | SocialAccount[];
  message?: string;
  error?: string;
}

export interface SocialAccountFilters {
  platform?: string;
  status?: string;
  is_active?: boolean;
  search?: string;
}

// =========================================
// SERVIÇO - CONTAS SOCIAIS
// =========================================

class AccountsService {
  private api = apiClient;

  // ===== CONTAS SOCIAIS =====
  
  /**
   * Buscar todas as contas sociais
   */
  async getSocialAccounts(filters: SocialAccountFilters = {}): Promise<SocialAccountResponse> {
    return withCache('social-accounts', async () => {
      try {
        const response = await this.api.get('/social-buffer/social-accounts', { params: filters });
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSocialError(error, 'getSocialAccounts', { filters });
      }
    });
  }

  /**
   * Buscar conta social por ID
   */
  async getSocialAccount(id: string): Promise<SocialAccountResponse> {
    return withCache(`social-account-${id}`, async () => {
      try {
        const response = await this.api.get(`/social-buffer/social-accounts/${id}`);
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSocialError(error, 'getSocialAccount', { id });
      }
    });
  }

  /**
   * Criar nova conta social
   */
  async createSocialAccount(data: SocialAccountFormData): Promise<SocialAccountResponse> {
    // Validar dados antes de enviar
    const validation = validateAccountData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/social-buffer/social-accounts', data));
      
      // Invalidar cache de contas sociais
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'createSocialAccount', { accountId: data.username });
  }

  /**
   * Atualizar conta social
   */
  async updateSocialAccount(id: string, data: Partial<SocialAccountFormData>): Promise<SocialAccountResponse> {
    // Validar dados antes de enviar
    const validation = validateAccountData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put(`/social-buffer/social-accounts/${id}`, data));
      
      // Invalidar cache específico e geral
      invalidateSocialCache(`social-account-${id}`);
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'updateSocialAccount', { accountId: id });
  }

  /**
   * Deletar conta social
   */
  async deleteSocialAccount(id: string): Promise<SocialAccountResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.delete(`/social-buffer/social-accounts/${id}`));
      
      // Invalidar cache específico e geral
      invalidateSocialCache(`social-account-${id}`);
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'deleteSocialAccount', { accountId: id });
  }

  /**
   * Atualizar múltiplas contas sociais
   */
  async updateMultipleSocialAccounts(accounts: Record<string, any>): Promise<SocialAccountResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put('/social-buffer/social-accounts/bulk', { accounts }));
      
      // Invalidar cache de contas sociais
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'updateMultipleSocialAccounts', { accountsCount: Object.keys(accounts).length });
  }

  /**
   * Conectar conta social
   */
  async connectAccount(platform: string, authData: any): Promise<SocialAccountResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post(`/social-buffer/social-accounts/connect/${platform}`, authData));
      
      // Invalidar cache de contas sociais
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'connectAccount', { platform });
  }

  /**
   * Desconectar conta social
   */
  async disconnectAccount(id: string): Promise<SocialAccountResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post(`/social-buffer/social-accounts/${id}/disconnect`));
      
      // Invalidar cache específico e geral
      invalidateSocialCache(`social-account-${id}`);
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'disconnectAccount', { accountId: id });
  }

  /**
   * Renovar token de acesso
   */
  async refreshToken(id: string): Promise<SocialAccountResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post(`/social-buffer/social-accounts/${id}/refresh-token`));
      
      // Invalidar cache específico e geral
      invalidateSocialCache(`social-account-${id}`);
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'refreshToken', { accountId: id });
  }

  /**
   * Sincronizar dados da conta
   */
  async syncAccount(id: string): Promise<SocialAccountResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post(`/social-buffer/social-accounts/${id}/sync`));
      
      // Invalidar cache específico e geral
      invalidateSocialCache(`social-account-${id}`);
      invalidateSocialCache('social-accounts');
      
      return {
        success: true,
        data: response.data
      };
    }, 'syncAccount', { accountId: id });
  }

  /**
   * Testar conexão da conta
   */
  async testConnection(id: string): Promise<SocialAccountResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post(`/social-buffer/social-accounts/${id}/test`));
      return {
        success: true,
        data: response.data
      };
    }, 'testConnection', { accountId: id });
  }

  /**
   * Obter estatísticas da conta
   */
  async getAccountStats(id: string): Promise<SocialAccountResponse> {
    return withCache(`social-account-stats-${id}`, async () => {
      try {
        const response = await this.api.get(`/social-buffer/social-accounts/${id}/stats`);
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSocialError(error, 'getAccountStats', { id });
      }
    });
  }

  /**
   * Obter insights da conta
   */
  async getAccountInsights(id: string, params: any = {}): Promise<SocialAccountResponse> {
    return withCache(`social-account-insights-${id}`, async () => {
      try {
        const response = await this.api.get(`/social-buffer/social-accounts/${id}/insights`, { params });
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSocialError(error, 'getAccountInsights', { id, params });
      }
    });
  }

  // ===== UTILITÁRIOS =====

  /**
   * Obter configurações padrão para uma plataforma
   */
  getDefaultAccountSettings(platform: string): Partial<SocialAccountFormData> {
    const defaults: Record<string, Partial<SocialAccountFormData>> = {
      facebook: {
        platform: 'facebook',
        is_active: true,
        permissions: ['pages_manage_posts', 'pages_read_engagement']
      },
      twitter: {
        platform: 'twitter',
        is_active: true,
        permissions: ['tweet.read', 'tweet.write', 'users.read']
      },
      instagram: {
        platform: 'instagram',
        is_active: true,
        permissions: ['instagram_basic', 'instagram_content_publish']
      },
      linkedin: {
        platform: 'linkedin',
        is_active: true,
        permissions: ['w_member_social', 'r_liteprofile']
      },
      youtube: {
        platform: 'youtube',
        is_active: true,
        permissions: ['youtube.upload', 'youtube.readonly']
      },
      tiktok: {
        platform: 'tiktok',
        is_active: true,
        permissions: ['user.info.basic', 'video.publish']
      },
      pinterest: {
        platform: 'pinterest',
        is_active: true,
        permissions: ['boards:read', 'pins:write']
      }
    };

    return defaults[platform] || {
      platform: platform as any,
      is_active: true,
      permissions: []
    };
  }

  /**
   * Validar configuração de conta
   */
  validateAccountSettings(account: Partial<SocialAccount>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!account.platform) {
      errors.push('Plataforma é obrigatória');
    }

    if (!account.username || account.username.trim().length === 0) {
      errors.push('Username é obrigatório');
    }

    if (!account.display_name || account.display_name.trim().length === 0) {
      errors.push('Nome de exibição é obrigatório');
    }

    if (!account.access_token || account.access_token.trim().length === 0) {
      errors.push('Token de acesso é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Formatar conta para exibição
   */
  formatAccount(account: SocialAccount): Record<string, any> {
    return {
      ...account,
      formatted_created_at: account.created_at ? new Date(account.created_at).toLocaleString('pt-BR') : '',
      formatted_updated_at: account.updated_at ? new Date(account.updated_at).toLocaleString('pt-BR') : '',
      formatted_last_sync: account.last_sync_at ? new Date(account.last_sync_at).toLocaleString('pt-BR') : 'Nunca',
      formatted_followers: account.followers_count ? this.formatNumber(account.followers_count) : '0',
      formatted_following: account.following_count ? this.formatNumber(account.following_count) : '0',
      formatted_posts: account.posts_count ? this.formatNumber(account.posts_count) : '0',
      platform_icon: this.getPlatformIcon(account.platform),
      platform_color: this.getPlatformColor(account.platform)
    };
  }

  /**
   * Formatar número para exibição
   */
  formatNumber(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }

  /**
   * Obter ícone da plataforma
   */
  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      linkedin: '💼',
      youtube: '📺',
      tiktok: '🎵',
      pinterest: '📌'
    };
    return icons[platform] || '📱';
  }

  /**
   * Obter cor da plataforma
   */
  getPlatformColor(platform: string): string {
    const colors: Record<string, string> = {
      facebook: 'blue',
      twitter: 'sky',
      instagram: 'pink',
      linkedin: 'blue',
      youtube: 'red',
      tiktok: 'black',
      pinterest: 'red'
    };
    return colors[platform] || 'gray';
  }

  /**
   * Obter estatísticas das contas sociais
   */
  async getAccountsStats(): Promise<SocialAccountResponse> {
    return withCache('social-accounts-stats', async () => {
      try {
        const response = await this.api.get('/social-buffer/social-accounts/stats');
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSocialError(error, 'getAccountsStats', {});
      }
    });
  }
}

// =========================================
// EXPORTS - SERVIÇO DE CONTAS SOCIAIS
// =========================================

const accountsService = new AccountsService();
export { accountsService };
export default accountsService;

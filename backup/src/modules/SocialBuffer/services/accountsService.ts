import { apiClient } from '@/services';
import {
  SocialAccount,
  SocialPlatform,
  SocialAccountStatus
} from '../types/socialTypes';

// Cache para contas sociais
const accountsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Interface para parâmetros de busca
export interface AccountsSearchParams {
  platform?: SocialPlatform;
  status?: SocialAccountStatus;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para resposta paginada
export interface AccountsPaginatedResponse {
  data: SocialAccount[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Interface para criação de conta
export interface CreateAccountData {
  name: string;
  platform: SocialPlatform;
  username: string;
  account_id: string;
  access_token: string;
  refresh_token?: string;
  profile_picture?: string;
}

// Interface para atualização de conta
export interface UpdateAccountData {
  name?: string;
  username?: string;
  status?: SocialAccountStatus;
  profile_picture?: string;
}

// Interface para estatísticas de conta
export interface AccountStats {
  total_accounts: number;
  active_accounts: number;
  inactive_accounts: number;
  error_accounts: number;
  pending_accounts: number;
  accounts_by_platform: Record<SocialPlatform, number>;
  total_followers: number;
  total_posts: number;
}

// Interface para sincronização
export interface SyncResult {
  success: boolean;
  synced_accounts: number;
  failed_accounts: number;
  errors: string[];
  last_sync: string;
}

/**
 * Service para gerenciamento de contas sociais
 * Responsável por operações CRUD, conexão e sincronização
 */
class AccountsService {
  private baseUrl = '/api/social-buffer/accounts';

  /**
   * Busca contas sociais com filtros
   */
  async getAccounts(params: AccountsSearchParams = {}): Promise<AccountsPaginatedResponse> {
    try {
      const cacheKey = `accounts_${JSON.stringify(params)}`;
      const cached = accountsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });
      
      const result = {
        data: response.data.data || response.data,
        total: response.data.total || response.data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || response.data.length) / (params.limit || 10))
      };

      // Cache do resultado
      accountsCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar contas sociais:', error);
      throw new Error('Falha ao carregar contas sociais');
    }
  }

  /**
   * Busca uma conta específica por ID
   */
  async getAccountById(id: number): Promise<SocialAccount> {
    try {
      const cacheKey = `account_${id}`;
      const cached = accountsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      
      // Cache do resultado
      accountsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar conta ${id}:`, error);
      throw new Error('Falha ao carregar conta social');
    }
  }

  /**
   * Cria uma nova conta social
   */
  async createAccount(data: CreateAccountData): Promise<SocialAccount> {
    try {
      // Validação básica
      this.validateAccountData(data);

      const response = await apiClient.post(this.baseUrl, data);
      
      // Limpar cache relacionado
      this.clearAccountsCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta social:', error);
      throw new Error('Falha ao criar conta social');
    }
  }

  /**
   * Atualiza uma conta existente
   */
  async updateAccount(id: number, data: UpdateAccountData): Promise<SocialAccount> {
    try {
      // Validação básica
      if (data.name !== undefined) {
        this.validateAccountName(data.name);
      }

      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      
      // Limpar cache relacionado
      this.clearAccountsCache();
      accountsCache.delete(`account_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar conta ${id}:`, error);
      throw new Error('Falha ao atualizar conta social');
    }
  }

  /**
   * Remove uma conta social
   */
  async deleteAccount(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      
      // Limpar cache relacionado
      this.clearAccountsCache();
      accountsCache.delete(`account_${id}`);
    } catch (error) {
      console.error(`Erro ao remover conta ${id}:`, error);
      throw new Error('Falha ao remover conta social');
    }
  }

  /**
   * Conecta uma conta social
   */
  async connectAccount(platform: SocialPlatform, authData: any): Promise<SocialAccount> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/connect`, {
        platform,
        ...authData
      });
      
      // Limpar cache relacionado
      this.clearAccountsCache();
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao conectar conta ${platform}:`, error);
      throw new Error('Falha ao conectar conta social');
    }
  }

  /**
   * Desconecta uma conta social
   */
  async disconnectAccount(id: number): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${id}/disconnect`);
      
      // Limpar cache relacionado
      this.clearAccountsCache();
      accountsCache.delete(`account_${id}`);
    } catch (error) {
      console.error(`Erro ao desconectar conta ${id}:`, error);
      throw new Error('Falha ao desconectar conta social');
    }
  }

  /**
   * Sincroniza dados de uma conta
   */
  async syncAccount(id: number): Promise<SocialAccount> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/sync`);
      
      // Limpar cache relacionado
      this.clearAccountsCache();
      accountsCache.delete(`account_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao sincronizar conta ${id}:`, error);
      throw new Error('Falha ao sincronizar conta social');
    }
  }

  /**
   * Sincroniza todas as contas
   */
  async syncAllAccounts(): Promise<SyncResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/sync-all`);
      
      // Limpar cache relacionado
      this.clearAccountsCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar todas as contas:', error);
      throw new Error('Falha ao sincronizar contas sociais');
    }
  }

  /**
   * Obtém estatísticas das contas
   */
  async getAccountStats(): Promise<AccountStats> {
    try {
      const cacheKey = 'account_stats';
      const cached = accountsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);
      
      // Cache do resultado
      accountsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas das contas:', error);
      throw new Error('Falha ao obter estatísticas das contas');
    }
  }

  /**
   * Busca contas por plataforma
   */
  async getAccountsByPlatform(platform: SocialPlatform): Promise<SocialAccount[]> {
    try {
      const result = await this.getAccounts({ platform, limit: 1000 });
      return result.data;
    } catch (error) {
      console.error(`Erro ao buscar contas da plataforma ${platform}:`, error);
      throw new Error('Falha ao buscar contas da plataforma');
    }
  }

  /**
   * Busca contas ativas
   */
  async getActiveAccounts(): Promise<SocialAccount[]> {
    try {
      const result = await this.getAccounts({ status: 'active', limit: 1000 });
      return result.data;
    } catch (error) {
      console.error('Erro ao buscar contas ativas:', error);
      throw new Error('Falha ao buscar contas ativas');
    }
  }

  /**
   * Verifica status de conexão de uma conta
   */
  async checkConnectionStatus(id: number): Promise<{ connected: boolean; last_check: string; error?: string }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}/connection-status`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao verificar status da conexão ${id}:`, error);
      throw new Error('Falha ao verificar status da conexão');
    }
  }

  /**
   * Atualiza token de acesso
   */
  async refreshAccessToken(id: number): Promise<{ access_token: string; expires_in: number }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/refresh-token`);
      
      // Limpar cache relacionado
      accountsCache.delete(`account_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar token da conta ${id}:`, error);
      throw new Error('Falha ao atualizar token de acesso');
    }
  }

  /**
   * Obtém permissões de uma conta
   */
  async getAccountPermissions(id: number): Promise<string[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}/permissions`);
      return response.data.permissions || [];
    } catch (error) {
      console.error(`Erro ao obter permissões da conta ${id}:`, error);
      throw new Error('Falha ao obter permissões da conta');
    }
  }

  /**
   * Valida dados básicos da conta
   */
  private validateAccountData(data: CreateAccountData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Nome da conta é obrigatório');
    }

    if (data.name.length > 100) {
      throw new Error('Nome da conta deve ter no máximo 100 caracteres');
    }

    if (!data.platform) {
      throw new Error('Plataforma é obrigatória');
    }

    if (!data.username || data.username.trim().length === 0) {
      throw new Error('Username é obrigatório');
    }

    if (!data.account_id || data.account_id.trim().length === 0) {
      throw new Error('ID da conta é obrigatório');
    }

    if (!data.access_token || data.access_token.trim().length === 0) {
      throw new Error('Token de acesso é obrigatório');
    }
  }

  /**
   * Valida nome da conta
   */
  private validateAccountName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome da conta é obrigatório');
    }

    if (name.length > 100) {
      throw new Error('Nome da conta deve ter no máximo 100 caracteres');
    }
  }

  /**
   * Limpa cache de contas
   */
  private clearAccountsCache(): void {
    accountsCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of accountsCache.keys()) {
        if (key.includes(pattern)) {
          accountsCache.delete(key);
        }
      }
    } else {
      accountsCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: accountsCache.size,
      keys: Array.from(accountsCache.keys())
    };
  }
}

// Instância singleton
export const accountsService = new AccountsService();
export default accountsService;

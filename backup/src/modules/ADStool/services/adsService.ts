/**
 * Service principal do módulo ADStool
 * Orquestrador que coordena os serviços especializados
 */

import { AdsResponse } from '../types';
import adsAccountService from './adsAccountService';
import adsCampaignService from './adsCampaignService';
import adsCreativeService from './adsCreativeService';
import adsAnalyticsService from './adsAnalyticsService';
import adsTemplateService from './adsTemplateService';

class AdsService {
  // Services especializados
  public accounts = adsAccountService;
  public campaigns = adsCampaignService;
  public creatives = adsCreativeService;
  public analytics = adsAnalyticsService;
  public templates = adsTemplateService;

  /**
   * Busca dashboard completo
   */
  async getDashboard(): Promise<AdsResponse> {
    try {
      const [accountsResponse, campaignsResponse, analyticsResponse] = await Promise.all([
        this.accounts.getAccounts(),
        this.campaigns.getCampaigns(),
        this.analytics.getAnalytics()
      ]);

      return {
        success: true,
        data: {
          accounts: accountsResponse.success ? accountsResponse.data : [],
          campaigns: campaignsResponse.success ? campaignsResponse.data : [],
          analytics: analyticsResponse.success ? analyticsResponse.data : null
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca estatísticas gerais
   */
  async getGeneralStats(): Promise<AdsResponse> {
    try {
      const [accountsResponse, campaignsResponse, creativesResponse] = await Promise.all([
        this.accounts.getAccounts(),
        this.campaigns.getCampaigns(),
        this.creatives.getCreatives()
      ]);

      const accounts = accountsResponse.success ? accountsResponse.data : [];
      const campaigns = campaignsResponse.success ? campaignsResponse.data : [];
      const creatives = creativesResponse.success ? creativesResponse.data : [];

      return {
        success: true,
        data: {
          total_accounts: Array.isArray(accounts) ? accounts.length : 0,
          total_campaigns: Array.isArray(campaigns) ? campaigns.length : 0,
          total_creatives: Array.isArray(creatives) ? creatives.length : 0,
          active_accounts: Array.isArray(accounts) ? accounts.filter((acc: any) => acc.status === 'active').length : 0,
          active_campaigns: Array.isArray(campaigns) ? campaigns.filter((camp: any) => camp.status === 'active').length : 0
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sincroniza dados de todas as contas
   */
  async syncAllAccounts(): Promise<AdsResponse> {
    try {
      const accountsResponse = await this.accounts.getAccounts();
      
      if (!accountsResponse.success || !Array.isArray(accountsResponse.data)) {
        return {
          success: false,
          error: 'Falha ao buscar contas'
        };
      }

      const syncPromises = accountsResponse.data.map((account: any) => 
        this.accounts.syncAccount(account.id)
      );

      const results = await Promise.allSettled(syncPromises);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      return {
        success: true,
        data: {
          total: results.length,
          successful,
          failed
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Otimiza todas as campanhas ativas
   */
  async optimizeAllCampaigns(): Promise<AdsResponse> {
    try {
      const campaignsResponse = await this.campaigns.getCampaigns();
      
      if (!campaignsResponse.success || !Array.isArray(campaignsResponse.data)) {
        return {
          success: false,
          error: 'Falha ao buscar campanhas'
        };
      }

      const activeCampaigns = campaignsResponse.data.filter((campaign: any) => campaign.status === 'active');
      const optimizePromises = activeCampaigns.map((campaign: any) => 
        this.campaigns.optimizeCampaign(campaign.id)
      );

      const results = await Promise.allSettled(optimizePromises);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      return {
        success: true,
        data: {
          total: results.length,
          successful,
          failed
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Gera relatório completo
   */
  async generateFullReport(period?: string): Promise<AdsResponse> {
    try {
      const [accountsResponse, campaignsResponse, analyticsResponse] = await Promise.all([
        this.accounts.getAccounts(),
        this.campaigns.getCampaigns(),
        this.analytics.getAnalytics({ period })
      ]);

      return {
        success: true,
        data: {
          period,
          accounts: accountsResponse.success ? accountsResponse.data : [],
          campaigns: campaignsResponse.success ? campaignsResponse.data : [],
          analytics: analyticsResponse.success ? analyticsResponse.data : null,
          generated_at: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Testa conectividade de todas as contas
   */
  async testAllConnections(): Promise<AdsResponse> {
    try {
      const accountsResponse = await this.accounts.getAccounts();
      
      if (!accountsResponse.success || !Array.isArray(accountsResponse.data)) {
        return {
          success: false,
          error: 'Falha ao buscar contas'
        };
      }

      const testPromises = accountsResponse.data.map((account: any) => 
        this.accounts.testAccountConnection(account.id)
      );

      const results = await Promise.allSettled(testPromises);
      const successful = results.filter(result => 
        result.status === 'fulfilled' && (result.value as any).success
      ).length;
      const failed = results.length - successful;

      return {
        success: true,
        data: {
          total: results.length,
          successful,
          failed,
          results: results.map((result, index) => ({
            account_id: accountsResponse.data[index].id,
            account_name: accountsResponse.data[index].name,
            status: result.status === 'fulfilled' ? 'success' : 'failed',
            error: result.status === 'rejected' ? (result.reason as any).message : null
          }))
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca insights de otimização global
   */
  async getGlobalOptimizationInsights(): Promise<AdsResponse> {
    try {
      const [accountsResponse, campaignsResponse, analyticsResponse] = await Promise.all([
        this.accounts.getAccounts(),
        this.campaigns.getCampaigns(),
        this.analytics.getOptimizationInsights()
      ]);

      return {
        success: true,
        data: {
          accounts: accountsResponse.success ? accountsResponse.data : [],
          campaigns: campaignsResponse.success ? campaignsResponse.data : [],
          insights: analyticsResponse.success ? analyticsResponse.data : null
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Aplica otimizações globais
   */
  async applyGlobalOptimizations(): Promise<AdsResponse> {
    try {
      const insightsResponse = await this.analytics.getOptimizationInsights();
      
      if (!insightsResponse.success) {
        return {
          success: false,
          error: 'Falha ao buscar insights de otimização'
        };
      }

      // Aqui você implementaria a lógica para aplicar as otimizações
      // baseadas nos insights retornados

      return {
        success: true,
        data: {
          applied: true,
          insights: insightsResponse.data
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Limpa dados antigos
   */
  async cleanupOldData(daysToKeep: number = 30): Promise<AdsResponse> {
    try {
      // Implementar limpeza de dados antigos
      // Por exemplo, remover campanhas antigas, criativos não utilizados, etc.
      
      return {
        success: true,
        data: {
          cleaned: true,
          days_kept: daysToKeep
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Exporta dados completos
   */
  async exportAllData(format: string = 'json'): Promise<AdsResponse> {
    try {
      const [accountsResponse, campaignsResponse, creativesResponse] = await Promise.all([
        this.accounts.getAccounts(),
        this.campaigns.getCampaigns(),
        this.creatives.getCreatives()
      ]);

      const exportData = {
        accounts: accountsResponse.success ? accountsResponse.data : [],
        campaigns: campaignsResponse.success ? campaignsResponse.data : [],
        creatives: creativesResponse.success ? creativesResponse.data : [],
        exported_at: new Date().toISOString(),
        format
      };

      return {
        success: true,
        data: exportData
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const adsService = new AdsService();
export default adsService;

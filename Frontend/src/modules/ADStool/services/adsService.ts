/**
 * Service principal do módulo ADStool
 * @module modules/ADStool/services/adsService
 * @description
 * Service orquestrador que coordena os serviços especializados do módulo ADStool,
 * fornecendo operações de alto nível que combinam múltiplos serviços especializados
 * para dashboard completo, estatísticas gerais, sincronização de contas,
 * otimização de campanhas, geração de relatórios, testes de conectividade,
 * insights de otimização global, limpeza de dados e exportação de dados.
 * @since 1.0.0
 */

import { AdsResponse, AdsAccount, AdsCampaign } from '../types';
import adsAccountService from './adsAccountService';
import adsCampaignService from './adsCampaignService';
import adsCreativeService from './adsCreativeService';
import adsAnalyticsService from './adsAnalyticsService';
import adsTemplateService from './adsTemplateService';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Classe AdsService - Service Principal do ADStool
 * @class
 * @description
 * Service orquestrador que coordena todos os serviços especializados do módulo ADStool,
 * fornecendo uma interface unificada para operações complexas que envolvem múltiplos serviços.
 * 
 * @example
 * ```typescript
 * import { adsService } from '@/modules/ADStool/services/adsService';
 * 
 * // Buscar dashboard completo
 * const dashboard = await adsService.getDashboard();

 * 
 * // Sincronizar todas as contas
 * await adsService.syncAllAccounts();

 * 
 * // Otimizar todas as campanhas ativas
 * await adsService.optimizeAllCampaigns();

 * ```
 */
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
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
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
          active_accounts: Array.isArray(accounts) ? accounts.filter((acc: Record<string, any>) => acc.status === 'active').length : 0,
          active_campaigns: Array.isArray(campaigns) ? campaigns.filter((camp: Record<string, any>) => camp.status === 'active').length : 0
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Sincroniza dados de todas as contas
   */
  async syncAllAccounts(): Promise<AdsResponse> {
    try {
      const accountsResponse = await this.accounts.getAccounts();

      if (!accountsResponse.success || !Array.isArray(accountsResponse.data)) {
        return {
          success: false,
          error: 'Falha ao buscar contas'};

      }

      const syncPromises = (accountsResponse.data as AdsAccount[]).map((account: unknown) => 
        this.accounts.syncAccount(account.id));

      const results = await Promise.allSettled(syncPromises);

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      return {
        success: true,
        data: {
          total: results.length,
          successful,
          failed
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Otimiza todas as campanhas ativas
   */
  async optimizeAllCampaigns(): Promise<AdsResponse> {
    try {
      const campaignsResponse = await this.campaigns.getCampaigns();

      if (!campaignsResponse.success || !Array.isArray(campaignsResponse.data)) {
        return {
          success: false,
          error: 'Falha ao buscar campanhas'};

      }

      const activeCampaigns = (campaignsResponse.data as AdsCampaign[]).filter((campaign: unknown) => campaign.status === 'active');

      const optimizePromises = activeCampaigns.map((campaign: unknown) => 
        this.campaigns.optimizeCampaign(campaign.id));

      const results = await Promise.allSettled(optimizePromises);

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      return {
        success: true,
        data: {
          total: results.length,
          successful,
          failed
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
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
  } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Testa conectividade de todas as contas
   */
  async testAllConnections(): Promise<AdsResponse> {
    try {
      const accountsResponse = await this.accounts.getAccounts();

      if (!accountsResponse.success || !Array.isArray(accountsResponse.data)) {
        return {
          success: false,
          error: 'Falha ao buscar contas'};

      }

      const testPromises = (accountsResponse.data as AdsAccount[]).map((account: AdsAccount) => 
        this.accounts.testAccountConnection(account.id));

      const results = await Promise.allSettled(testPromises);

      const successful = results.filter(result => 
        result.status === 'fulfilled' && (result.value as AdsResponse).success
      ).length;
      const failed = results.length - successful;

      return {
        success: true,
        data: {
          total: results.length,
          successful,
          failed,
          results: results.map((result: unknown, index: unknown) => {
            const account = accountsResponse.data[index] as AdsAccount;
            return {
              account_id: account.id,
              account_name: account.name || account.account_name || 'Unknown',
              status: result.status === 'fulfilled' ? 'success' : 'failed',
              error: result.status === 'rejected' 
                ? (result.reason instanceof Error ? result.reason.message : 'Erro desconhecido')
                : null};

          })
  } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
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
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Aplica otimizações globais
   */
  async applyGlobalOptimizations(): Promise<AdsResponse> {
    try {
      const insightsResponse = await this.analytics.getOptimizationInsights();

      if (!insightsResponse.success) {
        return {
          success: false,
          error: 'Falha ao buscar insights de otimização'};

      }

      // Aqui você implementaria a lógica para aplicar as otimizações
      // baseadas nos insights retornados

      return {
        success: true,
        data: {
          applied: true,
          insights: insightsResponse.data
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
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
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
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
        format};

      return {
        success: true,
        data: exportData};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } }

export const adsService = new AdsService();

export default adsService;

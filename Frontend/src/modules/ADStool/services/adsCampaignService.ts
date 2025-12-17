/**
 * Service de Campanhas do módulo ADStool
 * @module modules/ADStool/services/adsCampaignService
 * @description
 * Service responsável pelo gerenciamento completo de campanhas de anúncios,
 * incluindo operações CRUD, atualização de status, pausa/resume, duplicação,
 * filtros por status/objetivo/conta, atualização de orçamento e targeting,
 * estatísticas, otimização automática, sugestões de otimização, histórico
 * e criação a partir de templates.
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { AdsCampaign, AdsCampaignStatus, AdsObjective, AdsTargeting, AdsResponse } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Classe AdsCampaignService - Service de Campanhas
 * @class
 * @description
 * Service que gerencia todas as operações relacionadas a campanhas de anúncios,
 * fornecendo funcionalidades completas de gestão, otimização e análise.
 * 
 * @example
 * ```typescript
 * import { adsCampaignService } from '@/modules/ADStool/services/adsCampaignService';
 * 
 * // Buscar todas as campanhas
 * const campaigns = await adsCampaignService.getCampaigns();

 * 
 * // Criar nova campanha
 * const newCampaign = await adsCampaignService.createCampaign({
 *   name: 'Nova Campanha',
 *   account_id: 1,
 *   platform: 'google_ads',
 *   objective: 'conversions'
 * });

 * 
 * // Pausar campanha
 * await adsCampaignService.pauseCampaign('campaign123');

 * ```
 */
class AdsCampaignService {
  private api = apiClient;

  /**
   * Busca todas as campanhas
   */
  async getCampaigns(accountId?: string): Promise<AdsResponse> {
    try {
      const params = accountId ? { account_id: accountId } : {};

      const response = await this.api.get('/adstool/campaigns', { params }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca campanha específica por ID
   */
  async getCampaignById(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/${campaignId}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Cria nova campanha
   */
  async createCampaign(data: Partial<AdsCampaign>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/campaigns', data) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza campanha existente
   */
  async updateCampaign(campaignId: string, data: Partial<AdsCampaign>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/campaigns/${campaignId}`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Remove campanha
   */
  async deleteCampaign(campaignId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/campaigns/${campaignId}`);

      return {
        success: true,
        message: 'Campanha removida com sucesso'};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza status da campanha
   */
  async updateCampaignStatus(campaignId: string, status: AdsCampaignStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/campaigns/${campaignId}/status`, { status }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Pausa campanha
   */
  async pauseCampaign(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/pause`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Resume campanha
   */
  async resumeCampaign(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/resume`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Duplica campanha
   */
  async duplicateCampaign(campaignId: string, newName?: string): Promise<AdsResponse> {
    try {
      const data = newName ? { name: newName } : {};

      const response = await this.api.post(`/adstool/campaigns/${campaignId}/duplicate`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca campanhas por status
   */
  async getCampaignsByStatus(status: AdsCampaignStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/status/${status}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca campanhas por objetivo
   */
  async getCampaignsByObjective(objective: AdsObjective): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/objective/${objective}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca campanhas por conta
   */
  async getCampaignsByAccount(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/account/${accountId}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza orçamento da campanha
   */
  async updateCampaignBudget(campaignId: string, budget: number): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/campaigns/${campaignId}/budget`, { budget }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza targeting da campanha
   */
  async updateCampaignTargeting(campaignId: string, targeting: AdsTargeting): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/campaigns/${campaignId}/targeting`, targeting) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca estatísticas da campanha
   */
  async getCampaignStats(campaignId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};

      const response = await this.api.get(`/adstool/campaigns/${campaignId}/stats`, { params }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Otimiza campanha automaticamente
   * @param {string} campaignId - ID da campanha a ser otimizada
   * @param {Record<string, any>} [options] - Opções de otimização
   * @returns {Promise<AdsResponse>} Resposta com resultados da otimização ou erro
   */
  async optimizeCampaign(campaignId: string, options?: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/optimize`, options) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca sugestões de otimização
   */
  async getOptimizationSuggestions(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/${campaignId}/suggestions`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Aplica sugestão de otimização
   */
  async applyOptimizationSuggestion(campaignId: string, suggestionId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/suggestions/${suggestionId}/apply`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca histórico de campanha
   */
  async getCampaignHistory(campaignId: string, limit?: number): Promise<AdsResponse> {
    try {
      const params = limit ? { limit } : {};

      const response = await this.api.get(`/adstool/campaigns/${campaignId}/history`, { params }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Cria campanha a partir de template
   * @param {string} templateId - ID do template a ser usado
   * @param {Record<string, any>} data - Dados para criar a campanha
   * @returns {Promise<AdsResponse>} Resposta com campanha criada ou erro
   */
  async createCampaignFromTemplate(templateId: string, data: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/template/${templateId}`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } }

/**
 * Instância singleton do AdsCampaignService
 * @constant adsCampaignService
 * @type {AdsCampaignService}
 */
export const adsCampaignService = new AdsCampaignService();

export default adsCampaignService;

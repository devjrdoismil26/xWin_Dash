/**
 * Service de Criativos do módulo ADStool
 * @module modules/ADStool/services/adsCreativeService
 * @description
 * Service responsável pelo gerenciamento completo de criativos de anúncios,
 * incluindo operações CRUD, atualização de status, aprovação/rejeição, duplicação,
 * filtros por tipo/status/campanha, atualização de conteúdo, upload de mídia,
 * estatísticas, testes, preview, sugestões, histórico e criação a partir de templates.
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { AdsCreative, AdsCreativeType, AdsCreativeStatus, AdsCreativeContent, AdsResponse } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Classe AdsCreativeService - Service de Criativos
 * @class
 * @description
 * Service que gerencia todas as operações relacionadas a criativos de anúncios,
 * fornecendo funcionalidades completas de gestão, validação e análise.
 */
class AdsCreativeService {
  private api = apiClient;

  /**
   * Busca todos os criativos
   */

  async getCreatives(campaignId?: string): Promise<AdsResponse> {
    try {
      const params = campaignId ? { campaign_id: campaignId } : {};

      const response = await this.api.get('/adstool/creatives', { params }) as { data?: string};

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

    } async resumeCreative(creativeId: number): Promise<any> {
    try {
      const response = await this.apiClient.post(`/ads/creatives/${creativeId}/resume`);

      return response.data as any;
    } catch (error) {
      console.error('resumeCreative error:', error);

      throw error;
    } }
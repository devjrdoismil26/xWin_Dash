/**
 * Service de Templates do módulo ADStool
 * @module modules/ADStool/services/adsTemplateService
 * @description
 * Service responsável pelo gerenciamento de templates e otimizações de anúncios,
 * incluindo operações CRUD de templates, duplicação, filtros por categoria/plataforma,
 * templates públicos/usuário, aplicação de templates, gerenciamento de otimizações,
 * sugestões de templates e otimizações, histórico, validação e testes.
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { AdsResponse } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface AdsTemplate {
  id: string;
  name: string;
  type: 'campaign' | 'creative' | 'account';
  platform: string;
  category: string;
  description: string;
  content: Record<string, any>;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string; }

interface AdsOptimization {
  id: string;
  name: string;
  type: string;
  rules: Record<string, any>[];
  is_active: boolean;
  created_at: string;
  updated_at: string; }

class AdsTemplateService {
  private api = apiClient;

  /**
   * Busca todos os templates
   */
  async getTemplates(type?: string, platform?: string): Promise<AdsResponse> {
    try {
      const params: Record<string, any> = {};

      if (type) params.type = type;
      if (platform) params.platform = platform;
      
      const response = await this.api.get('/adstool/templates', { params }) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca template específico por ID
   */
  async getTemplateById(templateId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/${templateId}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Cria novo template
   */
  async createTemplate(data: Partial<AdsTemplate>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/templates', data) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Atualiza template existente
   */
  async updateTemplate(templateId: string, data: Partial<AdsTemplate>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/templates/${templateId}`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Remove template
   */
  async deleteTemplate(templateId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/templates/${templateId}`);

      return {
        success: true,
        message: 'Template removido com sucesso'};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Duplica template
   */
  async duplicateTemplate(templateId: string, newName?: string): Promise<AdsResponse> {
    try {
      const data = newName ? { name: newName } : {};

      const response = await this.api.post(`/adstool/templates/${templateId}/duplicate`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca templates por categoria
   */
  async getTemplatesByCategory(category: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/category/${category}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca templates por plataforma
   */
  async getTemplatesByPlatform(platform: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/platform/${platform}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca templates públicos
   */
  async getPublicTemplates(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/templates/public') as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca templates do usuário
   */
  async getUserTemplates(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/templates/user') as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Aplica template
   */
  async applyTemplate(templateId: string, targetId: string, customizations?: Record<string, any>): Promise<AdsResponse> {
    try {
      const data = {
        target_id: targetId,
        customizations};

      const response = await this.api.post(`/adstool/templates/${templateId}/apply`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca otimizações
   */
  async getOptimizations(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/optimizations') as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Cria nova otimização
   */
  async createOptimization(data: Partial<AdsOptimization>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/optimizations', data) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Atualiza otimização
   */
  async updateOptimization(optimizationId: string, data: Partial<AdsOptimization>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/optimizations/${optimizationId}`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Remove otimização
   */
  async deleteOptimization(optimizationId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/optimizations/${optimizationId}`);

      return {
        success: true,
        message: 'Otimização removida com sucesso'};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Ativa/desativa otimização
   */
  async toggleOptimization(optimizationId: string, isActive: boolean): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/optimizations/${optimizationId}/toggle`, { is_active: isActive }) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Aplica otimização
   */
  async applyOptimization(optimizationId: string, targetIds: string[]): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/optimizations/${optimizationId}/apply`, { target_ids: targetIds }) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca sugestões de templates baseadas em critérios
   * @param {Record<string, any>} criteria - Critérios para buscar sugestões de templates
   * @returns {Promise<AdsResponse>} Resposta com sugestões de templates ou erro
   */
  async getTemplateSuggestions(criteria: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/templates/suggestions', criteria) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca sugestões de otimização
   */
  async getOptimizationSuggestions(targetId: string, type: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/optimizations/suggestions/${targetId}`, { 
        params: { type } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca histórico de templates
   */
  async getTemplateHistory(templateId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/${templateId}/history`) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Busca histórico de otimizações
   */
  async getOptimizationHistory(optimizationId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/optimizations/${optimizationId}/history`) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Valida template
   */
  async validateTemplate(templateId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/${templateId}/validate`) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? (error as any).message
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } /**
   * Testa template
   */
  async testTemplate(templateId: string, testData?: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/templates/${templateId}/test`, testData) as { data?: string};

      return {
        success: true,
        data: (response as any).data };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? (error as any).message
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage };

    } }

export const adsTemplateService = new AdsTemplateService();

export default adsTemplateService;

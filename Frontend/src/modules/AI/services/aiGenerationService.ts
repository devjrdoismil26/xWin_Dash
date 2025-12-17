/**
import { getErrorMessage } from '@/utils/errorHelpers';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
 * Service de Geração AI
 * @module modules/AI/services/aiGenerationService
 * @description
 * Service responsável por gerenciar geração de conteúdo usando diferentes provedores
 * de IA, incluindo geração de texto, imagens, vídeos, áudio, código, análise de conteúdo,
 * tradução, resumo, correção e otimização de conteúdo, validação de gerações e
 * histórico de gerações.
 * @since 1.0.0
 */
import { apiClient } from '@/services';
import { AIProvider, GenerateTextRequest, GenerateImageRequest, GenerateVideoRequest, AIGeneration, AIResponse } from '../types';

/**
 * Classe AIGenerationService - Service de Geração de IA
 * @class
 * @description
 * Service que gerencia todas as operações relacionadas a geração de conteúdo com IA,
 * fornecendo funcionalidades completas de geração e análise de conteúdo.
 * 
 * @example
 * ```typescript
 * import { aiGenerationService } from '@/modules/AI/services/aiGenerationService';
 * 
 * // Gerar texto
 * const text = await aiGenerationService.generateText({
 *   prompt: 'Escreva um artigo sobre IA',
 *   provider: 'openai',
 *   model: 'gpt-4'
 * });

 * 
 * // Gerar imagem
 * const imageUrl = await aiGenerationService.generateImage({
 *   prompt: 'Uma paisagem futurista',
 *   provider: 'openai',
 *   size: '1024x1024'
 * });

 * ```
 */
class AIGenerationService {
  private api = apiClient;

  /**
   * Gerar texto usando IA
   */
  async generateText(request: GenerateTextRequest): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/text', request);

      return (response as any).data.result;
    } catch (error: unknown) {
      throw new Error(`Erro ao gerar texto: ${getErrorMessage(error)}`);

    } /**
   * Gerar imagem usando IA
   */
  async generateImage(request: GenerateImageRequest): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/image', request);

      return (response as any).data.result;
    } catch (error: unknown) {
      throw new Error(`Erro ao gerar imagem: ${getErrorMessage(error)}`);

    } /**
   * Gerar vídeo usando IA
   */
  async generateVideo(request: GenerateVideoRequest): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/video', request);

      return (response as any).data.result;
    } catch (error: unknown) {
      throw new Error(`Erro ao gerar vídeo: ${getErrorMessage(error)}`);

    } /**
   * Gerar código usando IA
   */
  async generateCode(prompt: string, language: string, provider?: AIProvider): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/code', {
        prompt,
        language,
        provider
      }) as { data: { result: string } ;

      return (response as any).data.result;
    } catch (error: unknown) {
      throw new Error(`Erro ao gerar código: ${getErrorMessage(error)}`);

    } /**
   * Gerar áudio usando IA
   */
  async generateAudio(prompt: string, voice?: string, provider?: AIProvider): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/audio', {
        prompt,
        voice,
        provider
      }) as { data: { result: string } ;

      return (response as any).data.result;
    } catch (error: unknown) {
      throw new Error(`Erro ao gerar áudio: ${getErrorMessage(error)}`);

    } /**
   * Gerar conteúdo multimodal
   */
  async generateMultimodal(
    textPrompt: string, 
    imagePrompt?: string, 
    provider?: AIProvider
  ): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/generate/multimodal', {
        text_prompt: textPrompt,
        image_prompt: imagePrompt,
        provider
      }) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao gerar conteúdo multimodal: ${getErrorMessage(error)}`);

    } /**
   * Salvar geração no histórico
   */
  async saveGeneration(generation: AIGeneration): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/generations', generation) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao salvar geração: ${getErrorMessage(error)}`);

    } /**
   * Obter geração por ID
   */
  async getGeneration(id: string): Promise<AIGeneration> {
    try {
      const response = await this.api.get(`/ai/generations/${id}`) as { data: AIGeneration};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter geração: ${getErrorMessage(error)}`);

    } /**
   * Excluir geração
   */
  async deleteGeneration(id: string): Promise<AIResponse> {
    try {
      const response = await this.api.delete(`/ai/generations/${id}`) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao excluir geração: ${getErrorMessage(error)}`);

    } /**
   * Obter histórico de gerações
   */
  async getGenerations(filters?: Record<string, any>): Promise<AIGeneration[]> {
    try {
      const response = await this.api.get('/ai/generations', {
        params: filters
      }) as { data: AIGeneration[]};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter gerações: ${getErrorMessage(error)}`);

    } /**
   * Obter estatísticas de gerações
   */
  async getGenerationStats(period: string = 'week'): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/generations/stats', {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter estatísticas: ${getErrorMessage(error)}`);

    } /**
   * Exportar gerações
   */
  async exportGenerations(format: 'json' | 'csv' = 'json', filters?: Record<string, any>): Promise<Blob> {
    try {
      const response = await this.api.get('/ai/generations/export', {
        params: { format, ...filters },
        responseType: 'blob'
      }) as { data: Blob};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao exportar gerações: ${getErrorMessage(error)}`);

    } /**
   * Obter templates de geração
   */
  async getGenerationTemplates(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/generation-templates') as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter templates: ${getErrorMessage(error)}`);

    } /**
   * Aplicar template de geração
   */
  async applyTemplate(templateId: string, variables: Record<string, any>): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/generation-templates/${templateId}/apply`, {
        variables
      }) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao aplicar template: ${getErrorMessage(error)}`);

    } /**
   * Obter sugestões de prompts
   */
  async getPromptSuggestions(type: string, context?: string): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/prompt-suggestions', {
        params: { type, context } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter sugestões: ${getErrorMessage(error)}`);

    } /**
   * Validar prompt
   */
  async validatePrompt(prompt: string, type: string): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/validate-prompt', {
        prompt,
        type
      }) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao validar prompt: ${getErrorMessage(error)}`);

    } }

export default new AIGenerationService();

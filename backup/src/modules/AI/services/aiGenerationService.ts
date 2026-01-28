/**
 * Service de Geração AI
 * Gerencia geração de conteúdo usando diferentes provedores
 */
import { apiClient } from '@/services';
import { 
  AIProvider, 
  GenerateTextRequest, 
  GenerateImageRequest, 
  GenerateVideoRequest,
  AIGeneration,
  AIResponse 
} from '../types';

class AIGenerationService {
  private api = apiClient;

  /**
   * Gerar texto usando IA
   */
  async generateText(request: GenerateTextRequest): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/text', request);
      return response.data.result;
    } catch (error: any) {
      throw new Error(`Erro ao gerar texto: ${error.message}`);
    }
  }

  /**
   * Gerar imagem usando IA
   */
  async generateImage(request: GenerateImageRequest): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/image', request);
      return response.data.result;
    } catch (error: any) {
      throw new Error(`Erro ao gerar imagem: ${error.message}`);
    }
  }

  /**
   * Gerar vídeo usando IA
   */
  async generateVideo(request: GenerateVideoRequest): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/video', request);
      return response.data.result;
    } catch (error: any) {
      throw new Error(`Erro ao gerar vídeo: ${error.message}`);
    }
  }

  /**
   * Gerar código usando IA
   */
  async generateCode(prompt: string, language: string, provider?: AIProvider): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/code', {
        prompt,
        language,
        provider
      });
      return response.data.result;
    } catch (error: any) {
      throw new Error(`Erro ao gerar código: ${error.message}`);
    }
  }

  /**
   * Gerar áudio usando IA
   */
  async generateAudio(prompt: string, voice?: string, provider?: AIProvider): Promise<string> {
    try {
      const response = await this.api.post('/ai/generate/audio', {
        prompt,
        voice,
        provider
      });
      return response.data.result;
    } catch (error: any) {
      throw new Error(`Erro ao gerar áudio: ${error.message}`);
    }
  }

  /**
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
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao gerar conteúdo multimodal: ${error.message}`);
    }
  }

  /**
   * Salvar geração no histórico
   */
  async saveGeneration(generation: AIGeneration): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/generations', generation);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao salvar geração: ${error.message}`);
    }
  }

  /**
   * Obter geração por ID
   */
  async getGeneration(id: string): Promise<AIGeneration> {
    try {
      const response = await this.api.get(`/ai/generations/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter geração: ${error.message}`);
    }
  }

  /**
   * Excluir geração
   */
  async deleteGeneration(id: string): Promise<AIResponse> {
    try {
      const response = await this.api.delete(`/ai/generations/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao excluir geração: ${error.message}`);
    }
  }

  /**
   * Obter histórico de gerações
   */
  async getGenerations(filters?: any): Promise<AIGeneration[]> {
    try {
      const response = await this.api.get('/ai/generations', {
        params: filters
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter gerações: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de gerações
   */
  async getGenerationStats(period: string = 'week'): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/generations/stats', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  /**
   * Exportar gerações
   */
  async exportGenerations(format: 'json' | 'csv' = 'json', filters?: any): Promise<Blob> {
    try {
      const response = await this.api.get('/ai/generations/export', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao exportar gerações: ${error.message}`);
    }
  }

  /**
   * Obter templates de geração
   */
  async getGenerationTemplates(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/generation-templates');
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter templates: ${error.message}`);
    }
  }

  /**
   * Aplicar template de geração
   */
  async applyTemplate(templateId: string, variables: Record<string, any>): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/generation-templates/${templateId}/apply`, {
        variables
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao aplicar template: ${error.message}`);
    }
  }

  /**
   * Obter sugestões de prompts
   */
  async getPromptSuggestions(type: string, context?: string): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/prompt-suggestions', {
        params: { type, context }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter sugestões: ${error.message}`);
    }
  }

  /**
   * Validar prompt
   */
  async validatePrompt(prompt: string, type: string): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/validate-prompt', {
        prompt,
        type
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao validar prompt: ${error.message}`);
    }
  }
}

export default new AIGenerationService();

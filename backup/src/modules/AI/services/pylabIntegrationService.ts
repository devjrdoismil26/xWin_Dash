/**
 * 🚀 PyLab Integration Service
 * 
 * Serviço para integração entre aiLaboratory e PyLab
 * Conecta as capacidades avançadas de IA do PyLab com a interface do aiLaboratory
 */

import { apiClient } from '@/services';
import { 
  AIGeneration, 
  AIGenerationType, 
  AIProvider, 
  AIResponse, 
  AIPagination 
} from '../types/aiTypes';

// ============================================================================
// TYPES ESPECÍFICOS DO PYLAB
// ============================================================================

export interface PyLabCapabilities {
  media_generation: {
    image_generation: boolean;
    video_generation: boolean;
    models: string[];
  };
  scene_management: {
    long_videos: boolean;
    transitions: boolean;
    templates: string[];
    max_scenes: number;
  };
  image_processing: {
    img2img: boolean;
    img2vid: boolean;
    style_transfer: boolean;
    inpainting: boolean;
    outpainting: boolean;
    upscaling: boolean;
    variation: boolean;
    analysis: boolean;
  };
  ai_analysis: {
    text_analysis: boolean;
    image_analysis: boolean;
    speech_processing: boolean;
    code_generation: boolean;
    business_intelligence: boolean;
  };
  supported_formats: {
    input: string[];
    output: string[];
  };
}

export interface PyLabGenerationRequest {
  prompt: string;
  negative_prompt?: string;
  style?: 'realistic' | 'artistic' | 'anime' | 'concept_art' | 'photography';
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
  batch_size?: number;
  duration?: number; // Para vídeos
  fps?: number; // Para vídeos
  quality?: 'hd' | 'full_hd' | '4k'; // Para vídeos
}

export interface PyLabGenerationResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  media_type: 'image' | 'video';
  filename?: string;
  file_url?: string;
  file_size?: number;
  generation_time?: number;
  metadata?: Record<string, any>;
  error_message?: string;
  created_at: string;
}

export interface PyLabProgressResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_percent: number;
  current_step: number;
  total_steps: number;
  estimated_time_remaining?: number;
  message?: string;
}

export interface PyLabSystemStatus {
  service_name: string;
  version: string;
  uptime: string;
  total_generations: number;
  active_tasks: number;
  queue_size: number;
  available_models: Array<{
    name: string;
    type: 'image' | 'video';
    version: string;
    description: string;
    parameters: Record<string, any>;
    memory_usage: string;
    loaded: boolean;
  }>;
  system_resources: {
    cpu_usage: string;
    memory_usage: string;
    memory_available: string;
    gpu_info: Record<string, any>;
  };
}

export interface PyLabTextAnalysisRequest {
  text: string;
  analysis_type: 'sentiment' | 'business_insights' | 'document_summary' | 
                'competitor_analysis' | 'executive_report' | 'market_research' |
                'customer_feedback' | 'financial_analysis';
  context?: Record<string, any>;
  language?: string;
  business_domain?: string;
}

export interface PyLabTextAnalysisResponse {
  analysis_type: string;
  insights: Record<string, any>;
  summary: string;
  confidence_score: number;
  recommendations: string[];
  metadata: Record<string, any>;
  processing_time: number;
}

export interface PyLabImageAnalysisRequest {
  image_data: string; // Base64 ou URL
  analysis_type: 'content_analysis' | 'brand_analysis' | 'product_analysis' |
                'marketing_analysis' | 'competitor_analysis' | 'quality_analysis' |
                'emotion_analysis' | 'accessibility_analysis';
  context?: Record<string, any>;
  business_domain?: string;
  comparison_images?: string[];
}

export interface PyLabImageAnalysisResponse {
  analysis_type: string;
  insights: Record<string, any>;
  summary: string;
  confidence_score: number;
  recommendations: string[];
  visual_elements: Record<string, any>;
  metadata: Record<string, any>;
  processing_time: number;
}

export interface PyLabCodeGenerationRequest {
  description: string;
  language: 'python' | 'javascript' | 'typescript' | 'php' | 'sql' | 'bash' | 'html' | 'css' | 'java' | 'go';
  generation_type: 'function_generation' | 'api_creation' | 'sql_query' | 'automation_script' |
                  'data_analysis' | 'web_scraping' | 'integration' | 'optimization' | 'documentation' | 'refactoring';
  context?: Record<string, any>;
  existing_code?: string;
  requirements?: string[];
  framework?: string;
}

export interface PyLabCodeGenerationResponse {
  generated_code: string;
  language: string;
  generation_type: string;
  explanation: string;
  analysis: {
    complexity_score: number;
    performance_rating: string;
    security_issues: string[];
    best_practices: string[];
    suggestions: string[];
    dependencies: string[];
  };
  tests?: string;
  documentation: string;
  confidence_score: number;
  metadata: Record<string, any>;
  processing_time: number;
}

// ============================================================================
// PYLAB INTEGRATION SERVICE
// ============================================================================

class PyLabIntegrationService {
  private baseUrl: string;
  private isConnected: boolean = false;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';

  constructor() {
    // URL do PyLab - pode ser configurada via environment
    this.baseUrl = process.env.REACT_APP_PYLAB_URL || 'http://localhost:8000';
  }

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.isConnected = true;
        this.connectionStatus = 'connected';
        return true;
      } else {
        this.isConnected = false;
        this.connectionStatus = 'error';
        return false;
      }
    } catch (error) {
      console.error('Erro ao conectar com PyLab:', error);
      this.isConnected = false;
      this.connectionStatus = 'error';
      return false;
    }
  }

  async getSystemStatus(): Promise<PyLabSystemStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/system-status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter status do sistema PyLab:', error);
      throw error;
    }
  }

  async getCapabilities(): Promise<PyLabCapabilities> {
    try {
      const response = await fetch(`${this.baseUrl}/capabilities`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter capacidades do PyLab:', error);
      throw error;
    }
  }

  // ============================================================================
  // MEDIA GENERATION
  // ============================================================================

  async generateImage(request: PyLabGenerationRequest): Promise<PyLabGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          media_type: 'image'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar imagem no PyLab:', error);
      throw error;
    }
  }

  async generateVideo(request: PyLabGenerationRequest): Promise<PyLabGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          media_type: 'video'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar vídeo no PyLab:', error);
      throw error;
    }
  }

  async getGenerationStatus(taskId: string): Promise<PyLabGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${taskId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter status da geração:', error);
      throw error;
    }
  }

  async getGenerationProgress(taskId: string): Promise<PyLabProgressResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/progress/${taskId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter progresso da geração:', error);
      throw error;
    }
  }

  async cancelGeneration(taskId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao cancelar geração:', error);
      throw error;
    }
  }

  // ============================================================================
  // TEXT ANALYSIS
  // ============================================================================

  async analyzeText(request: PyLabTextAnalysisRequest): Promise<PyLabTextAnalysisResponse> {
    try {
      const endpoint = `/analyze/text/${request.analysis_type}`;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na análise de texto:', error);
      throw error;
    }
  }

  async batchTextAnalysis(requests: PyLabTextAnalysisRequest[]): Promise<{
    results: PyLabTextAnalysisResponse[];
    success_count: number;
    error_count: number;
    processing_time: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze/text/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests,
          request_type: 'text_analysis'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na análise em lote de texto:', error);
      throw error;
    }
  }

  // ============================================================================
  // IMAGE ANALYSIS
  // ============================================================================

  async analyzeImage(request: PyLabImageAnalysisRequest): Promise<PyLabImageAnalysisResponse> {
    try {
      const endpoint = `/analyze/image/${request.analysis_type}`;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na análise de imagem:', error);
      throw error;
    }
  }

  async compareImages(images: string[], comparisonType: string = 'similarity'): Promise<{
    similarity_matrix: number[][];
    most_similar_pair: [number, number, number];
    least_similar_pair: [number, number, number];
    average_similarity: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze/image/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images,
          comparison_type: comparisonType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na comparação de imagens:', error);
      throw error;
    }
  }

  // ============================================================================
  // CODE GENERATION
  // ============================================================================

  async generateCode(request: PyLabCodeGenerationRequest): Promise<PyLabCodeGenerationResponse> {
    try {
      const endpoint = `/generate/code/${request.generation_type}`;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na geração de código:', error);
      throw error;
    }
  }

  async optimizeCode(code: string, language: string): Promise<PyLabCodeGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na otimização de código:', error);
      throw error;
    }
  }

  async refactorCode(code: string, language: string): Promise<PyLabCodeGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/refactor/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na refatoração de código:', error);
      throw error;
    }
  }

  // ============================================================================
  // BUSINESS INTELLIGENCE
  // ============================================================================

  async comprehensiveBusinessAnalysis(data: {
    text_data?: string;
    image_data?: string;
    audio_data?: string;
    business_domain?: string;
  }): Promise<{
    individual_analyses: Record<string, any>;
    consolidated_insights: Record<string, any>;
    timestamp: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/bi/comprehensive-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na análise de business intelligence:', error);
      throw error;
    }
  }

  async generateExecutiveDashboard(data: Record<string, any>): Promise<{
    dashboard_insights: Array<{
      source: string;
      type: string;
      insights: Record<string, any>;
      recommendations: string[];
    }>;
    executive_summary: string;
    timestamp: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/bi/executive-dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na geração do dashboard executivo:', error);
      throw error;
    }
  }

  // ============================================================================
  // FILE UPLOAD
  // ============================================================================

  async uploadImageForAnalysis(file: File): Promise<PyLabImageAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no upload de imagem:', error);
      throw error;
    }
  }

  async uploadAudioForAnalysis(file: File): Promise<{
    analysis_type: string;
    insights: Record<string, any>;
    summary: string;
    confidence_score: number;
    recommendations: string[];
    metadata: Record<string, any>;
    processing_time: number;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/upload/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no upload de áudio:', error);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getConnectionStatus(): 'disconnected' | 'connecting' | 'connected' | 'error' {
    return this.connectionStatus;
  }

  isPyLabConnected(): boolean {
    return this.isConnected;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  // ============================================================================
  // INTEGRATION WITH AI LABORATORY
  // ============================================================================

  async convertToAIGeneration(pyLabResponse: PyLabGenerationResponse): Promise<AIGeneration> {
    return {
      id: pyLabResponse.task_id,
      type: pyLabResponse.media_type === 'image' ? 'image' : 'video',
      provider: 'pylab' as AIProvider,
      model: 'PyLab Advanced',
      prompt: pyLabResponse.metadata?.prompt || '',
      result: pyLabResponse.file_url || '',
      metadata: {
        ...pyLabResponse.metadata,
        generation_time: pyLabResponse.generation_time,
        file_size: pyLabResponse.file_size,
        filename: pyLabResponse.filename,
        status: pyLabResponse.status
      },
      created_at: pyLabResponse.created_at,
      updated_at: new Date().toISOString()
    };
  }

  async convertToAIResponse<T>(pyLabResponse: T): Promise<AIResponse<T>> {
    return {
      success: true,
      data: pyLabResponse,
      message: 'Operação realizada com sucesso via PyLab',
      timestamp: new Date().toISOString()
    };
  }
}

// Instância singleton
export const pylabIntegrationService = new PyLabIntegrationService();

// Exportar tipos para uso em outros módulos
export type {
  PyLabCapabilities,
  PyLabGenerationRequest,
  PyLabGenerationResponse,
  PyLabProgressResponse,
  PyLabSystemStatus,
  PyLabTextAnalysisRequest,
  PyLabTextAnalysisResponse,
  PyLabImageAnalysisRequest,
  PyLabImageAnalysisResponse,
  PyLabCodeGenerationRequest,
  PyLabCodeGenerationResponse
};

export default pylabIntegrationService;
/**
 * 🤖 AI Laboratory API Service
 * 
 * Serviço para integração com PyLab e outras APIs de IA
 */

import { apiClient } from '@/services';
import { AIGenerationRequest, AIGenerationResult, PyLabConnectionStatus, PyLabCapabilities, PyLabSystemStatus, AILaboratoryError, ERROR_CODES } from '../types';

// ============================================================================
// API ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  // PyLab Integration
  pylab: {
    connection: '/api/v1/pylab/connection/check',
    status: '/api/v1/pylab/system/status',
    capabilities: '/api/v1/pylab/capabilities',
    generateImage: '/api/v1/pylab/generate/image',
    generateVideo: '/api/v1/pylab/generate/video',
    analyzeText: '/api/v1/pylab/analyze/text',
    analyzeImage: '/api/v1/pylab/analyze/image',
    generateCode: '/api/v1/pylab/generate/code',
    generationStatus: '/api/v1/pylab/generation',
    generationProgress: '/api/v1/pylab/generation',
    cancelGeneration: '/api/v1/pylab/generation',
    uploadImage: '/api/v1/pylab/upload/image',
    uploadAudio: '/api/v1/pylab/upload/audio',
    businessIntelligence: '/api/v1/pylab/bi/comprehensive-analysis',
    executiveDashboard: '/api/v1/pylab/bi/executive-dashboard'
  },
  
  // AI Laboratory specific
  laboratory: {
    generations: '/api/v1/ai-laboratory/generations',
    history: '/api/v1/ai-laboratory/history',
    settings: '/api/v1/ai-laboratory/settings',
    metrics: '/api/v1/ai-laboratory/metrics'
  } ;

// ============================================================================
// ERROR HANDLING
// ============================================================================

const handleApiError = (error: unknown, operation: string): AILaboratoryError => {
  console.error(`AI Laboratory API Error (${operation}):`, error);

  let code = ERROR_CODES.GENERATION_FAILED;
  let message = 'An unexpected error occurred';
  let recoverable = false;
  
  if (error.response) {
    const status = (error as any).response.status;
    const data = (error as any).response.data;
    
    switch (status) {
      case 400:
        code = ERROR_CODES.VALIDATION_ERROR;
        message = (data as any).message || 'Invalid request data';
        recoverable = true;
        break;
      case 401:
        code = ERROR_CODES.CONNECTION_FAILED;
        message = 'Authentication failed';
        recoverable = true;
        break;
      case 408:
        code = ERROR_CODES.TIMEOUT_ERROR;
        message = 'Request timeout';
        recoverable = true;
        break;
      case 429:
        code = ERROR_CODES.RATE_LIMIT_ERROR;
        message = 'Rate limit exceeded';
        recoverable = true;
        break;
      case 500:
        code = ERROR_CODES.GENERATION_FAILED;
        message = 'Server error';
        recoverable = false;
        break;
      case 503:
        code = ERROR_CODES.INSUFFICIENT_RESOURCES;
        message = 'Service unavailable';
        recoverable = true;
        break;
      default:
        message = (data as any).message || `HTTP ${status} error`;
    } else if (error.code === 'NETWORK_ERROR') {
    code = ERROR_CODES.CONNECTION_FAILED;
    message = 'Network connection failed';
    recoverable = true;
  } else if (error.code === 'TIMEOUT') {
    code = ERROR_CODES.TIMEOUT_ERROR;
    message = 'Request timeout';
    recoverable = true;
  }
  
  return {
    code,
    message,
    details: error,
    timestamp: new Date(),
    recoverable};
};

// ============================================================================
// PYLAB INTEGRATION
// ============================================================================

const pylabApi = {
  // Connection Management
  async checkConnection(): Promise<PyLabConnectionStatus> {
    try {
      const response = await apiClient.get(ENDPOINTS.pylab.connection);

      return {
        status: (response as any).data.connected ? 'connected' : 'error',
        lastChecked: new Date(),
        error: (response as any).data.connected ? undefined : 'Connection failed'};

    } catch (error) {
      throw handleApiError(error, 'checkConnection');

    } ,

  async getSystemStatus(): Promise<PyLabSystemStatus> {
    try {
      const response = await apiClient.get(ENDPOINTS.pylab.status);

      return (response as any).data.data;
    } catch (error) {
      throw handleApiError(error, 'getSystemStatus');

    } ,

  async getCapabilities(): Promise<PyLabCapabilities> {
    try {
      const response = await apiClient.get(ENDPOINTS.pylab.capabilities);

      return (response as any).data.data;
    } catch (error) {
      throw handleApiError(error, 'getCapabilities');

    } ,

  // Media Generation
  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      const response = await apiClient.post(ENDPOINTS.pylab.generateImage, {
        prompt: request.prompt,
        negative_prompt: request.negative_prompt,
        style: request.style,
        width: request.width,
        height: request.height,
        steps: request.steps,
        guidance_scale: request.guidance_scale,
        seed: request.seed,
        batch_size: request.batch_size
      });

      const result = (response as any).data.data;
      return {
        id: result.task_id,
        type: 'image',
        status: 'processing',
        progress: 0,
        startTime: new Date(),
        prompt: request.prompt,
        provider: 'pylab',
        model: 'Stable Diffusion XL',
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'generateImage');

    } ,

  async generateVideo(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      const response = await apiClient.post(ENDPOINTS.pylab.generateVideo, {
        prompt: request.prompt,
        negative_prompt: request.negative_prompt,
        duration: request.duration,
        fps: request.fps,
        quality: request.quality,
        seed: request.seed
      });

      const result = (response as any).data.data;
      return {
        id: result.task_id,
        type: 'video',
        status: 'processing',
        progress: 0,
        startTime: new Date(),
        prompt: request.prompt,
        provider: 'pylab',
        model: 'ModelScope T2V',
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'generateVideo');

    } ,

  // Text Analysis
  async analyzeText(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      const response = await apiClient.post(ENDPOINTS.pylab.analyzeText, {
        text: request.prompt,
        analysis_type: request.analysis_type,
        context: request.context,
        language: 'pt-BR',
        business_domain: request.context?.business_domain
      });

      const result = (response as any).data.data;
      return {
        id: `text_${Date.now()}`,
        type: 'text',
        status: 'completed',
        progress: 100,
        startTime: new Date(),
        endTime: new Date(),
        prompt: request.prompt,
        provider: 'pylab',
        model: 'GPT-4',
        result: result,
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'analyzeText');

    } ,

  // Image Analysis
  async analyzeImage(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      const response = await apiClient.post(ENDPOINTS.pylab.analyzeImage, {
        image_data: request.context?.image_data,
        analysis_type: request.analysis_type,
        context: request.context,
        business_domain: request.context?.business_domain
      });

      const result = (response as any).data.data;
      return {
        id: `image_${Date.now()}`,
        type: 'analysis',
        status: 'completed',
        progress: 100,
        startTime: new Date(),
        endTime: new Date(),
        prompt: request.prompt,
        provider: 'pylab',
        model: 'CLIP + BLIP',
        result: result,
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'analyzeImage');

    } ,

  // Code Generation
  async generateCode(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      const response = await apiClient.post(ENDPOINTS.pylab.generateCode, {
        description: request.prompt,
        language: request.language,
        generation_type: request.generation_type,
        context: request.context,
        existing_code: request.existing_code,
        requirements: request.requirements,
        framework: request.framework
      });

      const result = (response as any).data.data;
      return {
        id: `code_${Date.now()}`,
        type: 'code',
        status: 'completed',
        progress: 100,
        startTime: new Date(),
        endTime: new Date(),
        prompt: request.prompt,
        provider: 'pylab',
        model: 'CodeT5 + GPT-4',
        result: result,
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'generateCode');

    } ,

  // Generation Status
  async getGenerationStatus(taskId: string): Promise<AIGenerationResult> {
    try {
      const response = await apiClient.get(`${ENDPOINTS.pylab.generationStatus}/${taskId}/status`);

      const result = (response as any).data.data;
      
      return {
        id: taskId,
        type: result.media_type === 'image' ? 'image' : 'video',
        status: result.status,
        progress: result.status === 'completed' ? 100 : 0,
        startTime: new Date(result.created_at),
        endTime: result.status === 'completed' ? new Date() : undefined,
        prompt: result.metadata?.prompt || '',
        provider: 'pylab',
        model: result.media_type === 'image' ? 'Stable Diffusion XL' : 'ModelScope T2V',
        result: result,
        file_url: result.file_url,
        file_size: result.file_size,
        generation_time: result.generation_time,
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'getGenerationStatus');

    } ,

  async getGenerationProgress(taskId: string): Promise<{ progress: number; status: string; message?: string }> {
    try {
      const response = await apiClient.get(`${ENDPOINTS.pylab.generationProgress}/${taskId}/progress`);

      const result = (response as any).data.data;
      
      return {
        progress: result.progress_percent,
        status: result.status,
        message: result.message};

    } catch (error) {
      throw handleApiError(error, 'getGenerationProgress');

    } ,

  async cancelGeneration(taskId: string): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.pylab.cancelGeneration}/${taskId}/cancel`);

    } catch (error) {
      throw handleApiError(error, 'cancelGeneration');

    } ,

  // File Upload
  async uploadImage(file: File): Promise<AIGenerationResult> {
    try {
      const formData = new FormData();

      formData.append('file', file);

      const response = await apiClient.post(ENDPOINTS.pylab.uploadImage, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } );

      const result = (response as any).data.data;
      return {
        id: `upload_${Date.now()}`,
        type: 'analysis',
        status: 'completed',
        progress: 100,
        startTime: new Date(),
        endTime: new Date(),
        prompt: 'Image upload analysis',
        provider: 'pylab',
        model: 'CLIP + BLIP',
        result: result,
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'uploadImage');

    } ,

  // Business Intelligence
  async comprehensiveBusinessAnalysis(data: unknown): Promise<AIGenerationResult> {
    try {
      const response = await apiClient.post(ENDPOINTS.pylab.businessIntelligence, data);

      const result = (response as any).data.data;
      
      return {
        id: `bi_${Date.now()}`,
        type: 'analysis',
        status: 'completed',
        progress: 100,
        startTime: new Date(),
        endTime: new Date(),
        prompt: 'Business Intelligence Analysis',
        provider: 'pylab',
        model: 'Multi-Modal AI',
        result: result,
        metadata: result};

    } catch (error) {
      throw handleApiError(error, 'comprehensiveBusinessAnalysis');

    } };

// ============================================================================
// AI LABORATORY API
// ============================================================================

export const aiLaboratoryApi = {
  // PyLab Integration
  pylab: pylabApi,

  // Generation Management
  async generate(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      switch (request.type) {
        case 'image':
          return await pylabApi.generateImage(request);

        case 'video':
          return await pylabApi.generateVideo(request);

        case 'text':
          return await pylabApi.analyzeText(request);

        case 'analysis':
          return await pylabApi.analyzeImage(request);

        case 'code':
          return await pylabApi.generateCode(request);

        default:
          throw new Error(`Unsupported generation type: ${request.type}`);

      } catch (error) {
      throw handleApiError(error, 'generate');

    } ,

  // Generation Status
  async getGenerationStatus(taskId: string): Promise<AIGenerationResult> {
    return await pylabApi.getGenerationStatus(taskId);

  },

  async getGenerationProgress(taskId: string): Promise<{ progress: number; status: string; message?: string }> {
    return await pylabApi.getGenerationProgress(taskId);

  },

  async cancelGeneration(taskId: string): Promise<void> {
    return await pylabApi.cancelGeneration(taskId);

  },

  // Connection Management
  async checkPyLabConnection(): Promise<PyLabConnectionStatus> {
    return await pylabApi.checkConnection();

  },

  async getPyLabSystemStatus(): Promise<PyLabSystemStatus> {
    return await pylabApi.getSystemStatus();

  },

  async getPyLabCapabilities(): Promise<PyLabCapabilities> {
    return await pylabApi.getCapabilities();

  },

  // File Operations
  async uploadImage(file: File): Promise<AIGenerationResult> {
    return await pylabApi.uploadImage(file);

  },

  // Business Intelligence
  async businessIntelligenceAnalysis(data: unknown): Promise<AIGenerationResult> {
    return await pylabApi.comprehensiveBusinessAnalysis(data);

  },

  // History and Metrics
  async getGenerationHistory(limit: number = 50): Promise<AIGenerationResult[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.laboratory.history, {
        params: { limit } );

      return (response as any).data.data;
    } catch (error) {
      throw handleApiError(error, 'getGenerationHistory');

    } ,

  async getMetrics(): Promise<any> {
    try {
      const response = await apiClient.get(ENDPOINTS.laboratory.metrics);

      return (response as any).data.data;
    } catch (error) {
      throw handleApiError(error, 'getMetrics');

    } ,

  async saveSettings(settings: unknown): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.laboratory.settings, settings);

    } catch (error) {
      throw handleApiError(error, 'saveSettings');

    } ,

  async getSettings(): Promise<any> {
    try {
      const response = await apiClient.get(ENDPOINTS.laboratory.settings);

      return (response as any).data.data;
    } catch (error) {
      throw handleApiError(error, 'getSettings');

    } };

export default aiLaboratoryApi;

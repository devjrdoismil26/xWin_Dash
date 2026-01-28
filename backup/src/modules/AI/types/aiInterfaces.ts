/**
 * Interfaces do módulo AI
 */

import { AIProvider, AIGenerationType, AIStatus, AIModel, AIGeneration, AIChatSession, AIAnalytics, AIConfig } from './aiTypes';

// Interface para status dos serviços
export interface AIServicesStatus {
  [key: string]: {
    name: string;
    status: AIStatus;
    last_check: string;
    response_time?: number;
    error_message?: string;
  };
}

// Interface para provedores
export interface AIProviders {
  [key: string]: {
    name: string;
    capabilities: AIGenerationType[];
    models: AIModel[];
    strengths: string[];
    pricing_model: string;
    status: AIStatus;
    api_key_configured: boolean;
  };
}

// Interface para requisições de geração
export interface GenerateTextRequest {
  prompt: string;
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
  history?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

export interface GenerateImageRequest {
  prompt: string;
  provider?: AIProvider;
  model?: string;
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface GenerateVideoRequest {
  prompt: string;
  provider?: AIProvider;
  model?: string;
  duration?: number;
  resolution?: '720p' | '1080p' | '4k';
}

// Interface para histórico
export interface AIHistoryItem {
  id: string;
  type: AIGenerationType;
  prompt: string;
  result: string;
  provider: AIProvider;
  model: string;
  created_at: string;
  metadata: {
    tokens?: number;
    cost?: number;
    duration?: number;
    quality?: number;
  };
}

// Interface para dashboard
export interface AIDashboardData {
  services_status: AIServicesStatus;
  recent_generations: AIGeneration[];
  analytics: AIAnalytics;
  providers: AIProviders;
  config: AIConfig;
}

// Interface para componentes
export interface AIComponentProps {
  className?: string;
  variant?: 'basic' | 'advanced' | 'revolutionary';
  loading?: boolean;
  error?: string | null;
  onAction?: (action: string, data?: any) => void;
}

// Interface para hooks
export interface AIHookReturn {
  loading: boolean;
  error: string | null;
  data?: any;
  actions: {
    [key: string]: (...args: any[]) => Promise<any> | void;
  };
}

// Interface para serviços
export interface AIServiceInterface {
  getServicesStatus(): Promise<AIServicesStatus>;
  getProviders(): Promise<AIProviders>;
  generateText(request: GenerateTextRequest): Promise<string>;
  generateImage(request: GenerateImageRequest): Promise<string>;
  generateVideo(request: GenerateVideoRequest): Promise<string>;
  getHistory(filters?: any): Promise<AIHistoryItem[]>;
  getAnalytics(period: string): Promise<AIAnalytics>;
  saveGeneration(generation: AIGeneration): Promise<void>;
  deleteGeneration(id: string): Promise<void>;
}

// Interface para store
export interface AIState {
  servicesStatus: AIServicesStatus | null;
  servicesLoading: boolean;
  providers: AIProviders;
  providersLoading: boolean;
  textGenerations: AIGeneration[];
  imageGenerations: AIGeneration[];
  videoGenerations: AIGeneration[];
  chatHistory: AIChatSession[];
  analysisHistory: AIHistoryItem[];
  currentView: string;
  loading: boolean;
  error: string | null;
  config: AIConfig;
}

export interface AIActions {
  fetchServicesStatus: () => Promise<void>;
  fetchProviders: () => Promise<void>;
  generateText: (request: GenerateTextRequest) => Promise<string>;
  generateImage: (request: GenerateImageRequest) => Promise<string>;
  generateVideo: (request: GenerateVideoRequest) => Promise<string>;
  getHistory: (filters?: any) => Promise<void>;
  getAnalytics: (period: string) => Promise<AIAnalytics>;
  saveGeneration: (generation: AIGeneration) => Promise<void>;
  deleteGeneration: (id: string) => Promise<void>;
  setCurrentView: (view: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateConfig: (config: Partial<AIConfig>) => void;
}

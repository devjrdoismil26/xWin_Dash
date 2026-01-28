/**
 * 🤖 AI Laboratory Block Types
 * 
 * Tipos específicos para o bloco aiLaboratory integrado com PyLab
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type ImageStyle = 'realistic' | 'artistic' | 'anime' | 'concept_art' | 'photography';
export type VideoQuality = 'hd' | 'full_hd' | '4k';
export type AIGenerationType = 'image' | 'video' | 'text' | 'code' | 'analysis';
export type AIProvider = 'pylab' | 'openai' | 'claude' | 'gemini' | 'anthropic';
export type AIAnalysisType = 'sentiment' | 'business_insights' | 'document_summary' | 'competitor_analysis' | 'executive_report' | 'market_research' | 'customer_feedback' | 'financial_analysis';
export type ImageAnalysisType = 'content_analysis' | 'brand_analysis' | 'product_analysis' | 'marketing_analysis' | 'competitor_analysis' | 'quality_analysis' | 'emotion_analysis' | 'accessibility_analysis';
export type CodeGenerationType = 'function_generation' | 'api_creation' | 'sql_query' | 'automation_script' | 'data_analysis' | 'web_scraping' | 'integration' | 'optimization' | 'documentation' | 'refactoring';
export type ProgrammingLanguage = 'python' | 'javascript' | 'typescript' | 'php' | 'sql' | 'bash' | 'html' | 'css' | 'java' | 'go';

// ============================================================================
// GENERATION INTERFACES
// ============================================================================

export interface AIGenerationRequest {
  type: AIGenerationType;
  prompt: string;
  negative_prompt?: string;
  style?: ImageStyle;
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
  batch_size?: number;
  duration?: number;
  fps?: number;
  quality?: VideoQuality;
  temperature?: number;
  max_tokens?: number;
  language?: ProgrammingLanguage;
  generation_type?: CodeGenerationType;
  analysis_type?: AIAnalysisType | ImageAnalysisType;
  context?: Record<string, any>;
  existing_code?: string;
  requirements?: string[];
  framework?: string;
}

export interface AIGenerationResult {
  id: string;
  type: AIGenerationType;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: any;
  error?: string;
  startTime: Date;
  endTime?: Date;
  metadata?: Record<string, any>;
  prompt: string;
  provider: AIProvider;
  model: string;
  file_url?: string;
  file_size?: number;
  generation_time?: number;
}

export interface PyLabConnectionStatus {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastChecked: Date | null;
  error?: string;
}

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

// ============================================================================
// BLOCK DATA INTERFACES
// ============================================================================

export interface AILaboratoryBlockData {
  label: string;
  description?: string;
  status?: 'active' | 'inactive' | 'error' | 'processing';
  progress?: number;
  lastActivity?: string;
  
  // AI Configuration
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  
  // PyLab Integration
  pylabConnected: boolean;
  pylabCapabilities?: PyLabCapabilities;
  pylabSystemStatus?: PyLabSystemStatus;
  
  // Generation History
  generations: AIGenerationResult[];
  activeGenerations: string[];
  
  // Settings
  autoSave: boolean;
  notifications: boolean;
  maxHistory: number;
  
  // Metrics
  totalGenerations: number;
  successRate: number;
  averageTime: number;
  lastGeneration?: Date;
}

// ============================================================================
// CONNECTION HANDLES
// ============================================================================

export interface AILaboratoryHandles {
  // Input Handles
  promptInput: {
    id: string;
    type: 'target';
    position: 'left';
    dataType: 'text';
    label: 'Prompt';
  };
  imageInput: {
    id: string;
    type: 'target';
    position: 'left';
    dataType: 'image';
    label: 'Image';
  };
  dataInput: {
    id: string;
    type: 'target';
    position: 'left';
    dataType: 'data';
    label: 'Data';
  };
  
  // Output Handles
  contentOutput: {
    id: string;
    type: 'source';
    position: 'right';
    dataType: 'content';
    label: 'Content';
  };
  mediaOutput: {
    id: string;
    type: 'source';
    position: 'top';
    dataType: 'media';
    label: 'Media';
  };
  analysisOutput: {
    id: string;
    type: 'source';
    position: 'bottom';
    dataType: 'analysis';
    label: 'Analysis';
  };
  codeOutput: {
    id: string;
    type: 'source';
    position: 'right';
    dataType: 'code';
    label: 'Code';
  };
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  image: { 
    maxWidth: 2048, 
    maxHeight: 2048,
    maxSteps: 100,
    maxBatchSize: 4,
    maxPromptLength: 1000
  },
  video: {
    maxDuration: 30,
    maxFps: 60,
    maxPromptLength: 1000,
    supportedQualities: ['hd', 'full_hd', '4k']
  },
  text: {
    maxTextLength: 50000,
    maxBatchSize: 10
  },
  code: {
    maxCodeLength: 10000,
    maxDescriptionLength: 2000
  },
  analysis: {
    maxImageSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp']
  }
};

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_AI_CONFIG = {
  provider: 'pylab' as AIProvider,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  autoSave: true,
  notifications: true,
  maxHistory: 50
};

export const DEFAULT_GENERATION_CONFIG = {
  image: {
    style: 'realistic' as ImageStyle,
    width: 1024,
    height: 1024,
    steps: 50,
    guidance_scale: 7.5
  },
  video: {
    duration: 10,
    fps: 24,
    quality: 'hd' as VideoQuality
  },
  text: {
    temperature: 0.7,
    max_tokens: 2000
  },
  code: {
    language: 'python' as ProgrammingLanguage,
    generation_type: 'function_generation' as CodeGenerationType
  }
};

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AILaboratoryError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
}

export const ERROR_CODES = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  GENERATION_FAILED: 'GENERATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INSUFFICIENT_RESOURCES: 'INSUFFICIENT_RESOURCES',
  INVALID_PROMPT: 'INVALID_PROMPT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT'
} as const;

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface AILaboratoryEvent {
  type: 'generation_started' | 'generation_completed' | 'generation_failed' | 'connection_changed' | 'settings_updated';
  data: any;
  timestamp: Date;
  blockId: string;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  AIGenerationRequest,
  AIGenerationResult,
  PyLabConnectionStatus,
  PyLabCapabilities,
  PyLabSystemStatus,
  AILaboratoryBlockData,
  AILaboratoryHandles,
  AILaboratoryError,
  AILaboratoryEvent
};

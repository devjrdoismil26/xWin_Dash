// AI Types
export type AIProvider = 'openai' | 'gemini' | 'pylab' | 'anthropic';

export type AIGenerationType = 'text' | 'image' | 'video' | 'audio' | 'code';

export interface AIGeneration {
  id: string;
  type: AIGenerationType;
  provider: AIProvider;
  prompt: string;
  result?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date; }

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: unknown; }

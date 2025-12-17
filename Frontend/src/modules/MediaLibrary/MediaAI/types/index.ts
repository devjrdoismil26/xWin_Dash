// =========================================
// EXPORTS - TIPOS DO SUBMÓDULO MEDIA AI
// =========================================
// Re-export types from the main MediaLibrary types

export * from '@/types';


export interface MediaAI {
  id: string;
  mediaId: string;
  tags: string[];
  labels: string[];
  faces: number;
  colors: string[];
  text?: string;
  confidence: number;
  processedAt: Date; }

export interface MediaSimilarity {
  mediaId: string;
  similarity: number;
  matchedFeatures: string[]; }

export interface MediaAutoTag {
  tag: string;
  confidence: number;
  source: 'ai' | 'manual'; }

export interface MediaApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

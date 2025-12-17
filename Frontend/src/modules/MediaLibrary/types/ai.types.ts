import type { MediaFile } from './core.types';

export interface MediaAI {
  id: string;
  media_id: string;
  type: 'auto_tag' | 'face_recognition' | 'object_detection' | 'text_extraction' | 'color_analysis' | 'similarity_search';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  confidence?: number;
  created_at: string;
  completed_at?: string;
  error?: string; }

export interface MediaSimilarity {
  media_id: string;
  similar_files: Array<{
    file: MediaFile;
  similarity: number;
  reason: 'visual' | 'metadata' | 'content' | 'tags'; }>;
  created_at: string;
}

export interface MediaAutoTag {
  media_id: string;
  tags: Array<{
    tag: string;
  confidence: number;
  source: 'ai' | 'metadata' | 'filename' | 'content'; }>;
  created_at: string;
}

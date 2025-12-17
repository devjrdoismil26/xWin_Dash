/**
 * Tipos para posts do SocialBuffer
 */

export interface SocialPost {
  id?: string;
  text: string;
  media?: string[];
  scheduled_at?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platforms: string[];
  created_at?: string;
  updated_at?: string; }

export interface PostFormProps {
  post?: SocialPost;
  onSave??: (e: any) => void;
  onCancel???: (e: any) => void; }

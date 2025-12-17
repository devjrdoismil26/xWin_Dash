export interface SocialPost {
  id: string;
  user_id: number;
  content: string;
  title?: string;
  description?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  type: 'text' | 'image' | 'video' | 'carousel';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_at?: string;
  published_at?: string;
  failed_at?: string;
  link_url?: string;
  hashtags?: string[];
  mentions?: string[];
  location?: string;
  metadata?: string;
  error_message?: string;
  social_accounts?: SocialAccount[];
  media?: SocialMedia[];
  analytics?: SocialAnalytics[];
  created_at: string;
  updated_at: string; }

export interface SocialAccount {
  id: string;
  user_id: number;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest';
  account_name: string;
  account_id?: string;
  username?: string;
  profile_image?: string;
  is_active: boolean;
  metadata?: string;
  created_at: string;
  updated_at: string; }

export interface SocialMedia {
  id: string;
  post_id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnail_url?: string;
  size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  duration?: number;
  order: number; }

export interface SocialAnalytics {
  id: string;
  post_id: string;
  social_account_id: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  clicks: number;
  saves: number;
  engagement_rate: number;
  synced_at?: string; }

export interface HashtagGroup {
  id: string;
  user_id: number;
  name: string;
  hashtags: string[];
  description?: string;
  usage_count: number; }

export interface SocialSchedule {
  id: string;
  user_id: number;
  name: string;
  days_of_week: number[];
  times: string[];
  timezone: string;
  is_active: boolean; }

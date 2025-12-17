/**
 * Tipos TypeScript para o m?dulo SocialBuffer
 *
 * @description
 * Consolida todas as interfaces e tipos relacionados ao SocialBuffer incluindo
 * contas sociais, posts, agendamentos, hashtags, links, m?dia, engajamento e analytics.
 *
 * @module modules/SocialBuffer/types/socialTypes
 * @since 1.0.0
 */

/**
 * Conta social
 *
 * @interface SocialAccount
 * @property {number} id - ID ?nico da conta
 * @property {string} name - Nome da conta
 * @property {SocialPlatform} platform - Plataforma social
 * @property {string} username - Nome de usu?rio
 * @property {string} account_id - ID da conta na plataforma
 * @property {SocialAccountStatus} status - Status da conta
 * @property {string} [profile_picture] - URL da foto de perfil (opcional)
 * @property {number} followers_count - N?mero de seguidores
 * @property {number} following_count - N?mero de seguindo
 * @property {number} posts_count - N?mero de posts
 * @property {boolean} is_connected - Se est? conectada
 * @property {string} [last_sync] - Data da ?ltima sincroniza??o (opcional)
 * @property {string} created_at - Data de cria??o (ISO 8601)
 * @property {string} updated_at - Data de ?ltima atualiza??o (ISO 8601)
 */
export interface SocialAccount {
  id: number;
  name: string;
  platform: SocialPlatform;
  username: string;
  account_id: string;
  status: SocialAccountStatus;
  profile_picture?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_connected: boolean;
  last_sync?: string;
  created_at: string;
  updated_at: string; }

export type SocialPlatform = 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'linkedin' 
  | 'youtube' 
  | 'tiktok' 
  | 'pinterest';

export type SocialAccountStatus = 
  | 'active' 
  | 'inactive' 
  | 'error' 
  | 'pending';

export interface SocialPost {
  id: number;
  content: string;
  media_urls?: string[];
  scheduled_at?: string;
  published_at?: string;
  status: SocialPostStatus;
  platform: SocialPlatform;
  account_id: number;
  engagement?: SocialEngagement;
  created_at: string;
  updated_at: string; }

export type SocialPostStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'published' 
  | 'failed' 
  | 'cancelled';

export interface SocialEngagement {
  likes: number;
  comments: number;
  shares: number;
  retweets?: number;
  saves?: number;
  views?: number;
  clicks?: number;
  reach?: number;
  impressions?: number; }

export interface SocialSchedule {
  id: number;
  name: string;
  posts: SocialPost[];
  frequency: SocialScheduleFrequency;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export interface SocialScheduleFrequency {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  times: string[];
  days?: number[];
  timezone: string; }

export interface SocialHashtag {
  id: number;
  name: string;
  platform: SocialPlatform;
  usage_count: number;
  trending_score?: number;
  is_trending: boolean;
  created_at: string;
  updated_at: string; }

export type TrendingHashtag = SocialHashtag & {
  trend_velocity: number;
  peak_time?: string;};

export type PopularHashtag = SocialHashtag & {
  engagement_rate: number;
  reach: number;};

export type RelatedHashtag = SocialHashtag & {
  relevance_score: number;
  co_occurrence_count: number;};

export interface HashtagValidation {
  hashtag: string;
  is_valid: boolean;
  errors?: string[];
  suggestions?: string[]; }

export interface SocialMedia {
  id: number;
  name: string;
  type: SocialMediaType;
  url: string;
  size: number;
  platform: SocialPlatform;
  is_public: boolean;
  created_at: string;
  updated_at: string; }

export type SocialMediaType = 
  | 'image' 
  | 'video' 
  | 'gif' 
  | 'document';

export interface SocialLink {
  id: number;
  original_url: string;
  short_url: string;
  clicks: number;
  platform: SocialPlatform;
  created_at: string;
  updated_at: string; }

export interface SocialEngagementData {
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_reach: number;
  total_impressions: number;
  engagement_rate: number;
  best_performing_posts: SocialPost[];
  engagement_trend: SocialEngagementTrend[];
  [key: string]: unknown; }

export interface SocialEngagementTrend {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number; }

export interface SocialAnalytics {
  accounts: SocialAccount[];
  total_followers: number;
  total_posts: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  top_hashtags: SocialHashtag[];
  engagement_data: SocialEngagementData; }

// Component Props Types
export interface SocialAccountManagerProps {
  accounts: SocialAccount[];
  loading?: boolean;
  error?: string;
  onAccountConnect??: (e: any) => void;
  onAccountDisconnect??: (e: any) => void;
  onAccountSync??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialPostCreatorProps {
  accounts: SocialAccount[];
  media: SocialMedia[];
  onPostCreate??: (e: any) => void;
  onPostSchedule??: (e: any) => void;
  onPostPublish??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialPostManagerProps {
  posts: SocialPost[];
  accounts: SocialAccount[];
  loading?: boolean;
  error?: string;
  onPostEdit??: (e: any) => void;
  onPostDelete??: (e: any) => void;
  onPostReschedule??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialScheduleManagerProps {
  schedules: SocialSchedule[];
  posts: SocialPost[];
  loading?: boolean;
  error?: string;
  onScheduleCreate???: (e: any) => void;
  onScheduleEdit??: (e: any) => void;
  onScheduleDelete??: (e: any) => void;
  onScheduleToggle??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialHashtagManagerProps {
  hashtags: SocialHashtag[];
  platform: SocialPlatform;
  loading?: boolean;
  error?: string;
  onHashtagAdd??: (e: any) => void;
  onHashtagRemove??: (e: any) => void;
  onHashtagTrack??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialMediaManagerProps {
  media: SocialMedia[];
  loading?: boolean;
  error?: string;
  onMediaUpload??: (e: any) => void;
  onMediaDelete??: (e: any) => void;
  onMediaEdit??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialLinkShortenerProps {
  links: SocialLink[];
  loading?: boolean;
  error?: string;
  onLinkCreate??: (e: any) => void;
  onLinkDelete??: (e: any) => void;
  onLinkAnalytics??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialEngagementWidgetProps {
  engagement: SocialEngagementData;
  loading?: boolean;
  error?: string;
  period?: string;
  onPeriodChange??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialAnalyticsDashboardProps {
  analytics: SocialAnalytics;
  loading?: boolean;
  error?: string;
  period?: string;
  onPeriodChange??: (e: any) => void;
  [key: string]: unknown; }

export interface SocialBufferDashboardProps {
  accounts: SocialAccount[];
  posts: SocialPost[];
  schedules: SocialSchedule[];
  analytics: SocialAnalytics;
  loading?: boolean;
  error?: string;
  onRefresh???: (e: any) => void;
  [key: string]: unknown; }

// ===== ANALYTICS TYPES =====
export interface SocialAnalyticsOverview {
  totalAccounts: number;
  totalPosts: number;
  totalFollowers: number;
  totalEngagement: number;
  engagementRate: number;
  reach: number;
  impressions: number;
  period: {
    start: string;
  end: string; };

  trends: {
    followers: SocialTrendData[];
    engagement: SocialTrendData[];
    reach: SocialTrendData[];
    impressions: SocialTrendData[];};

}

export interface SocialAccountAnalytics {
  accountId: number;
  accountName: string;
  platform: SocialPlatform;
  metrics: {
    followers: number;
  following: number;
  posts: number;
  engagement: number;
  engagementRate: number;
  reach: number;
  impressions: number;
  clicks: number; };

  trends: {
    followers: SocialTrendData[];
    engagement: SocialTrendData[];
    reach: SocialTrendData[];
    impressions: SocialTrendData[];};

  topPosts: SocialPostAnalytics[];
  performance: SocialAccountPerformance;
}

export interface SocialPostAnalytics {
  postId: number;
  content: string;
  platform: SocialPlatform;
  publishedAt: string;
  metrics: {
    likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  clicks: number;
  engagement: number;
  engagementRate: number; };

  hashtags: string[];
  mentions: string[];
  media: SocialMedia[];
}

export interface SocialEngagementAnalytics {
  totalEngagement: number;
  engagementRate: number;
  averageEngagementRate: number;
  engagementByPlatform: SocialPlatformEngagement[];
  engagementByTime: SocialTimeEngagement[];
  engagementByContentType: SocialContentTypeEngagement[];
  topEngagingPosts: SocialPostAnalytics[];
  engagementTrends: SocialTrendData[]; }

export interface SocialReachAnalytics {
  totalReach: number;
  averageReach: number;
  reachByPlatform: SocialPlatformReach[];
  reachByTime: SocialTimeReach[];
  reachByContentType: SocialContentTypeReach[];
  topReachingPosts: SocialPostAnalytics[];
  reachTrends: SocialTrendData[]; }

export interface SocialImpressionsAnalytics {
  totalImpressions: number;
  averageImpressions: number;
  impressionsByPlatform: SocialPlatformImpressions[];
  impressionsByTime: SocialTimeImpressions[];
  impressionsByContentType: SocialContentTypeImpressions[];
  topImpressionPosts: SocialPostAnalytics[];
  impressionTrends: SocialTrendData[]; }

export interface SocialTrendData {
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
  [key: string]: unknown; }

export interface SocialPlatformEngagement {
  platform: SocialPlatform;
  engagement: number;
  engagementRate: number;
  posts: number;
  averageEngagement: number; }

export interface SocialTimeEngagement {
  hour: number;
  engagement: number;
  posts: number;
  averageEngagement: number; }

export interface SocialContentTypeEngagement {
  contentType: 'text' | 'image' | 'video' | 'link';
  engagement: number;
  engagementRate: number;
  posts: number;
  averageEngagement: number; }

export interface SocialPlatformReach {
  platform: SocialPlatform;
  reach: number;
  posts: number;
  averageReach: number; }

export interface SocialTimeReach {
  hour: number;
  reach: number;
  posts: number;
  averageReach: number; }

export interface SocialContentTypeReach {
  contentType: 'text' | 'image' | 'video' | 'link';
  reach: number;
  posts: number;
  averageReach: number; }

export interface SocialPlatformImpressions {
  platform: SocialPlatform;
  impressions: number;
  posts: number;
  averageImpressions: number; }

export interface SocialTimeImpressions {
  hour: number;
  impressions: number;
  posts: number;
  averageImpressions: number; }

export interface SocialContentTypeImpressions {
  contentType: 'text' | 'image' | 'video' | 'link';
  impressions: number;
  posts: number;
  averageImpressions: number; }

export interface SocialAccountPerformance {
  followersGrowth: number;
  engagementGrowth: number;
  reachGrowth: number;
  impressionsGrowth: number;
  bestPerformingPost: SocialPostAnalytics | null;
  worstPerformingPost: SocialPostAnalytics | null;
  averagePerformance: number;
  performanceScore: number; }

export interface SocialAnalyticsFilter {
  platform?: SocialPlatform[];
  accountId?: number[];
  dateFrom?: string;
  dateTo?: string;
  contentType?: ('text' | 'image' | 'video' | 'link')[];
  search?: string; }

export interface SocialAnalyticsSort {
  field: 'date' | 'engagement' | 'reach' | 'impressions' | 'followers';
  direction: 'asc' | 'desc'; }

export interface SocialAnalyticsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  pagination?: { page?: number;
  limit?: number;
  total?: number; };

  count?: number;
}

// ===== API RESPONSE TYPES =====
export interface SocialAnalyticsResponse {
  success: boolean;
  data: SocialAnalyticsOverview | SocialAccountAnalytics | SocialPostAnalytics | SocialEngagementAnalytics | SocialReachAnalytics | SocialImpressionsAnalytics;
  message?: string;
  error?: string; }

export interface SocialAnalyticsListResponse {
  success: boolean;
  data: {
    items: SocialPostAnalytics[];
  pagination: SocialAnalyticsPagination;
  message?: string;
  error?: string;
  total?: number;
  count?: number; };

  message?: string;
  error?: string;
}

// ===== HOOK RETURN TYPES =====
export interface UseSocialAnalyticsReturn {
  overview: SocialAnalyticsOverview | null;
  accountAnalytics: SocialAccountAnalytics | null;
  postAnalytics: SocialPostAnalytics[];
  engagementAnalytics: SocialEngagementAnalytics | null;
  reachAnalytics: SocialReachAnalytics | null;
  impressionsAnalytics: SocialImpressionsAnalytics | null;
  loading: boolean;
  error: string | null;
  filters: SocialAnalyticsFilter;
  sort: SocialAnalyticsSort;
  pagination: SocialAnalyticsPagination;
  setFilters?: (e: any) => void;
  setSort?: (e: any) => void;
  setPage?: (e: any) => void;
  refresh: () => Promise<void>;
  total?: number;
  count?: number; }

export interface UseSocialAccountAnalyticsReturn {
  analytics: SocialAccountAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; }

export interface UseSocialPostAnalyticsReturn {
  posts: SocialPostAnalytics[];
  loading: boolean;
  error: string | null;
  filters: SocialAnalyticsFilter;
  sort: SocialAnalyticsSort;
  pagination: SocialAnalyticsPagination;
  setFilters?: (e: any) => void;
  setSort?: (e: any) => void;
  setPage?: (e: any) => void;
  refresh: () => Promise<void>;
  total?: number;
  count?: number; }

export interface UseSocialEngagementAnalyticsReturn {
  analytics: SocialEngagementAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; }

export interface UseSocialReachAnalyticsReturn {
  analytics: SocialReachAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; }

export interface UseSocialImpressionsAnalyticsReturn {
  analytics: SocialImpressionsAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; }


// ===== ADDITIONAL SOCIAL POST TYPES =====

export interface SocialPostContent {
  text: string;
  media?: string[];
  links?: string[];
  hashtags?: string[];
  mentions?: string[]; }

export interface SocialPostMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement_rate: number; }

export interface SocialPostReport {
  post_id: number;
  period: string;
  metrics: SocialPostMetrics;
  insights: Record<string, any>; }

export interface SocialPostNotification {
  id: number;
  post_id: number;
  type: string;
  message: string;
  read: boolean;
  created_at: string; }

export interface SocialPostIntegration {
  platform: string;
  connected: boolean;
  credentials?: Record<string, any>; }

export interface SocialPostWebhook {
  url: string;
  events: string[];
  active: boolean; }

export interface SocialPostBackup {
  id: number;
  post_id: number;
  backup_data: Record<string, any>;
  created_at: string; }

export interface SocialPostRestore {
  backup_id: number;
  restore_point: string; }

export interface SocialPostUpgrade {
  feature: string;
  from_version: string;
  to_version: string; }

export interface SocialPostDowngrade {
  feature: string;
  from_version: string;
  to_version: string; }

export interface SocialPostMaintenance {
  scheduled_at: string;
  duration_minutes: number;
  affected_features: string[]; }

export interface SocialPostCompliance {
  platform_rules: boolean;
  content_policy: boolean;
  verified_at: string; }

export interface SocialPostSecurity {
  encrypted: boolean;
  access_level: string;
  permissions: string[]; }

export interface SocialPostHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  last_check: string; }

export interface SocialPostMonitor {
  active_posts: number;
  scheduled_posts: number;
  failed_posts: number;
  success_rate: number; }

export interface SocialPostDashboard {
  widgets: string[];
  layout: Record<string, any>;
  filters: Record<string, any>; }

export interface SocialPostMigration {
  from_platform: string;
  to_platform: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed'; }

// SocialBuffer Types
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
  updated_at: string;
}

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
  updated_at: string;
}

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
  impressions?: number;
}

export interface SocialSchedule {
  id: number;
  name: string;
  posts: SocialPost[];
  frequency: SocialScheduleFrequency;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialScheduleFrequency {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  times: string[];
  days?: number[];
  timezone: string;
}

export interface SocialHashtag {
  id: number;
  name: string;
  platform: SocialPlatform;
  usage_count: number;
  trending_score?: number;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialMedia {
  id: number;
  name: string;
  type: SocialMediaType;
  url: string;
  size: number;
  platform: SocialPlatform;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

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
  updated_at: string;
}

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
}

export interface SocialEngagementTrend {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

export interface SocialAnalytics {
  accounts: SocialAccount[];
  total_followers: number;
  total_posts: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  top_hashtags: SocialHashtag[];
  engagement_data: SocialEngagementData;
}

// Component Props Types
export interface SocialAccountManagerProps {
  accounts: SocialAccount[];
  loading?: boolean;
  error?: string;
  onAccountConnect?: (platform: SocialPlatform) => void;
  onAccountDisconnect?: (accountId: number) => void;
  onAccountSync?: (accountId: number) => void;
}

export interface SocialPostCreatorProps {
  accounts: SocialAccount[];
  media: SocialMedia[];
  onPostCreate?: (post: Partial<SocialPost>) => void;
  onPostSchedule?: (post: Partial<SocialPost>) => void;
  onPostPublish?: (post: Partial<SocialPost>) => void;
}

export interface SocialPostManagerProps {
  posts: SocialPost[];
  accounts: SocialAccount[];
  loading?: boolean;
  error?: string;
  onPostEdit?: (post: SocialPost) => void;
  onPostDelete?: (postId: number) => void;
  onPostReschedule?: (postId: number, scheduledAt: string) => void;
}

export interface SocialScheduleManagerProps {
  schedules: SocialSchedule[];
  posts: SocialPost[];
  loading?: boolean;
  error?: string;
  onScheduleCreate?: () => void;
  onScheduleEdit?: (schedule: SocialSchedule) => void;
  onScheduleDelete?: (scheduleId: number) => void;
  onScheduleToggle?: (scheduleId: number) => void;
}

export interface SocialHashtagManagerProps {
  hashtags: SocialHashtag[];
  platform: SocialPlatform;
  loading?: boolean;
  error?: string;
  onHashtagAdd?: (hashtag: string) => void;
  onHashtagRemove?: (hashtagId: number) => void;
  onHashtagTrack?: (hashtagId: number) => void;
}

export interface SocialMediaManagerProps {
  media: SocialMedia[];
  loading?: boolean;
  error?: string;
  onMediaUpload?: (file: File) => void;
  onMediaDelete?: (mediaId: number) => void;
  onMediaEdit?: (media: SocialMedia) => void;
}

export interface SocialLinkShortenerProps {
  links: SocialLink[];
  loading?: boolean;
  error?: string;
  onLinkCreate?: (url: string) => void;
  onLinkDelete?: (linkId: number) => void;
  onLinkAnalytics?: (linkId: number) => void;
}

export interface SocialEngagementWidgetProps {
  engagement: SocialEngagementData;
  loading?: boolean;
  error?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface SocialAnalyticsDashboardProps {
  analytics: SocialAnalytics;
  loading?: boolean;
  error?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface SocialBufferDashboardProps {
  accounts: SocialAccount[];
  posts: SocialPost[];
  schedules: SocialSchedule[];
  analytics: SocialAnalytics;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

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
    end: string;
  };
  trends: {
    followers: SocialTrendData[];
    engagement: SocialTrendData[];
    reach: SocialTrendData[];
    impressions: SocialTrendData[];
  };
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
    clicks: number;
  };
  trends: {
    followers: SocialTrendData[];
    engagement: SocialTrendData[];
    reach: SocialTrendData[];
    impressions: SocialTrendData[];
  };
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
    engagementRate: number;
  };
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
  engagementTrends: SocialTrendData[];
}

export interface SocialReachAnalytics {
  totalReach: number;
  averageReach: number;
  reachByPlatform: SocialPlatformReach[];
  reachByTime: SocialTimeReach[];
  reachByContentType: SocialContentTypeReach[];
  topReachingPosts: SocialPostAnalytics[];
  reachTrends: SocialTrendData[];
}

export interface SocialImpressionsAnalytics {
  totalImpressions: number;
  averageImpressions: number;
  impressionsByPlatform: SocialPlatformImpressions[];
  impressionsByTime: SocialTimeImpressions[];
  impressionsByContentType: SocialContentTypeImpressions[];
  topImpressionPosts: SocialPostAnalytics[];
  impressionTrends: SocialTrendData[];
}

export interface SocialTrendData {
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
}

export interface SocialPlatformEngagement {
  platform: SocialPlatform;
  engagement: number;
  engagementRate: number;
  posts: number;
  averageEngagement: number;
}

export interface SocialTimeEngagement {
  hour: number;
  engagement: number;
  posts: number;
  averageEngagement: number;
}

export interface SocialContentTypeEngagement {
  contentType: 'text' | 'image' | 'video' | 'link';
  engagement: number;
  engagementRate: number;
  posts: number;
  averageEngagement: number;
}

export interface SocialPlatformReach {
  platform: SocialPlatform;
  reach: number;
  posts: number;
  averageReach: number;
}

export interface SocialTimeReach {
  hour: number;
  reach: number;
  posts: number;
  averageReach: number;
}

export interface SocialContentTypeReach {
  contentType: 'text' | 'image' | 'video' | 'link';
  reach: number;
  posts: number;
  averageReach: number;
}

export interface SocialPlatformImpressions {
  platform: SocialPlatform;
  impressions: number;
  posts: number;
  averageImpressions: number;
}

export interface SocialTimeImpressions {
  hour: number;
  impressions: number;
  posts: number;
  averageImpressions: number;
}

export interface SocialContentTypeImpressions {
  contentType: 'text' | 'image' | 'video' | 'link';
  impressions: number;
  posts: number;
  averageImpressions: number;
}

export interface SocialAccountPerformance {
  followersGrowth: number;
  engagementGrowth: number;
  reachGrowth: number;
  impressionsGrowth: number;
  bestPerformingPost: SocialPostAnalytics | null;
  worstPerformingPost: SocialPostAnalytics | null;
  averagePerformance: number;
  performanceScore: number;
}

export interface SocialAnalyticsFilter {
  platform?: SocialPlatform[];
  accountId?: number[];
  dateFrom?: string;
  dateTo?: string;
  contentType?: ('text' | 'image' | 'video' | 'link')[];
  search?: string;
}

export interface SocialAnalyticsSort {
  field: 'date' | 'engagement' | 'reach' | 'impressions' | 'followers';
  direction: 'asc' | 'desc';
}

export interface SocialAnalyticsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ===== API RESPONSE TYPES =====
export interface SocialAnalyticsResponse {
  success: boolean;
  data: SocialAnalyticsOverview | SocialAccountAnalytics | SocialPostAnalytics | SocialEngagementAnalytics | SocialReachAnalytics | SocialImpressionsAnalytics;
  message?: string;
  error?: string;
}

export interface SocialAnalyticsListResponse {
  success: boolean;
  data: {
    items: SocialPostAnalytics[];
    pagination: SocialAnalyticsPagination;
  };
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
  setFilters: (filters: SocialAnalyticsFilter) => void;
  setSort: (sort: SocialAnalyticsSort) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
}

export interface UseSocialAccountAnalyticsReturn {
  analytics: SocialAccountAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseSocialPostAnalyticsReturn {
  posts: SocialPostAnalytics[];
  loading: boolean;
  error: string | null;
  filters: SocialAnalyticsFilter;
  sort: SocialAnalyticsSort;
  pagination: SocialAnalyticsPagination;
  setFilters: (filters: SocialAnalyticsFilter) => void;
  setSort: (sort: SocialAnalyticsSort) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
}

export interface UseSocialEngagementAnalyticsReturn {
  analytics: SocialEngagementAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseSocialReachAnalyticsReturn {
  analytics: SocialReachAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseSocialImpressionsAnalyticsReturn {
  analytics: SocialImpressionsAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

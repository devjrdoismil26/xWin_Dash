export interface WidgetProps {
  id?: string;
  title?: string;
  [key: string]: unknown; }

// Widget Data Types
export interface ADSPerformanceData {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  [key: string]: unknown; }

export interface AIProcessingData {
  total_requests: number;
  completed: number;
  pending: number;
  failed: number;
  avg_processing_time: number;
  [key: string]: unknown; }

export interface AnalyticsOverviewData {
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  [key: string]: unknown; }

export interface CalendarIntegrationData {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  events: Array<{
    id: string;
  title: string;
  start: string;
  end: string;
  [key: string]: unknown; }>;
}

export interface EmailMarketingData {
  total_campaigns: number;
  active_campaigns: number;
  total_sent: number;
  open_rate: number;
  click_rate: number;
  [key: string]: unknown; }

export interface MediaLibraryData {
  total_files: number;
  total_size: number;
  images: number;
  videos: number;
  documents: number;
  [key: string]: unknown; }

export interface ProductsPerformanceData {
  total_products: number;
  active_products: number;
  total_sales: number;
  revenue: number;
  top_products: Array<{
    id: string;
  name: string;
  sales: number;
  [key: string]: unknown; }>;
}

export interface SocialBufferData {
  scheduled_posts: number;
  published_posts: number;
  failed_posts: number;
  total_engagement: number;
  [key: string]: unknown; }

export interface UniverseData {
  total_items: number;
  active_items: number;
  categories: number;
  recent_activity: Array<{
    id: string;
  type: string;
  description: string;
  created_at: string;
  [key: string]: unknown; }>;
}

export interface WorkflowsStatusData {
  total_workflows: number;
  active_workflows: number;
  completed_executions: number;
  failed_executions: number;
  success_rate: number;
  [key: string]: unknown; }

import { z } from 'zod';

/**
 * SCHEMAS REAIS - Baseados nos Models do Backend
 * Verificados em: 24/11/2025 17:45
 * Todos os IDs são UUIDs (string)
 */

// ==================== BASE SCHEMAS ====================
export const PaginationSchema = z.object({
  currentPage: z.number(),
  lastPage: z.number(),
  perPage: z.number(),
  total: z.number()
  });

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    meta: PaginationSchema.optional()
  });

// ==================== USERS ====================
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  email_verified_at: z.string().optional().nullable(),
  role: z.string().optional(),
  avatar: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const UserPermissionsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  permissions: z.array(z.string()),
  role: z.string()
  });

export const UserPreferencesSchema = z.object({
  theme: z.string().optional(),
  language: z.string().optional(),
  notifications: z.boolean().optional(),
  timezone: z.string().optional()
  });

// ==================== LEADS ====================
export const LeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  utm_content: z.string().optional().nullable(),
  utm_term: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  status: z.string(),
  score: z.number().optional().nullable(),
  last_activity_at: z.string().optional().nullable(),
  converted_at: z.string().optional().nullable(),
  value: z.number().optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const LeadActivitySchema = z.object({
  id: z.string(),
  lead_id: z.string(),
  type: z.string(),
  description: z.string(),
  metadata: z.record(z.any()).optional().nullable(),
  created_at: z.string()
  });

// ==================== PRODUCTS ====================
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  price: z.number(),
  compare_price: z.number().optional().nullable(),
  cost_price: z.number().optional().nullable(),
  stock_quantity: z.number().optional().nullable(),
  track_inventory: z.boolean().optional(),
  status: z.string(),
  weight: z.number().optional().nullable(),
  dimensions: z.record(z.any()).optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  attributes: z.record(z.any()).optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().optional().nullable()
  });

export const ABTestVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.record(z.any()).optional(),
  traffic: z.number().optional(),
  impressions: z.number().optional(),
  clicks: z.number().optional(),
  conversions: z.number().optional(),
  revenue: z.number().optional()
  });

export const ABTestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  target: z.string(),
  status: z.string(),
  variants: z.array(ABTestVariantSchema),
  metrics: z.record(z.any()).optional(),
  started_at: z.string().nullable().optional(),
  ended_at: z.string().nullable().optional(),
  winner_id: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  name: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional()
  });

export const LeadCaptureFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  status: z.string(),
  fields: z.array(FormFieldSchema),
  settings: z.record(z.any()).optional(),
  styling: z.record(z.any()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== PROJECTS ====================
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  settings: z.record(z.any()).optional().nullable(),
  modules: z.array(z.string()).optional().nullable(),
  is_active: z.boolean().optional(),
  owner_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const ProjectTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  status: z.string(),
  priority: z.string().optional().nullable(),
  assignee_id: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  project_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== WORKFLOWS ====================
export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  status: z.string(),
  definition: z.record(z.any()).optional().nullable(),
  settings: z.record(z.any()).optional().nullable(),
  variables: z.record(z.any()).optional().nullable(),
  last_executed_at: z.string().optional().nullable(),
  execution_count: z.number().optional(),
  is_template: z.boolean().optional(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  user_id: z.string(),
  project_id: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.any())
  });

export const WorkflowExecutionSchema = z.object({
  id: z.string(),
  workflow_id: z.string(),
  status: z.string(),
  input: z.record(z.any()).optional().nullable(),
  output: z.record(z.any()).optional().nullable(),
  started_at: z.string().optional().nullable(),
  completed_at: z.string().optional().nullable(),
  created_at: z.string().optional()
  });

// ==================== DASHBOARD ====================
export const DashboardWidgetSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: z.string(),
  config: z.record(z.any()).optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().optional().nullable()
  });

export const DashboardMetricsSchema = z.object({
  total_leads: z.number().int().nonnegative(),
  total_users: z.number().int().nonnegative(),
  total_projects: z.number().int().nonnegative(),
  active_projects: z.number().int().nonnegative(),
  total_campaigns: z.number().int().nonnegative(),
  total_revenue: z.number().nonnegative(),
  conversion_rate: z.number().nonnegative(),
  leads_growth: z.number(),
  users_growth: z.number(),
  projects_growth: z.number(),
  campaigns_growth: z.number(),
  revenue_growth: z.number(),
});

export const RecentActivitySchema = z.object({
  id: z.string(),
  action: z.string(),
  description: z.string(),
  count: z.number().int().nonnegative(),
  timestamp: z.string(),
  type: z.enum(['lead', 'project', 'user', 'campaign', 'system']),
  user_id: z.string().optional(),
  user_name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const TopLeadSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  score: z.number().nonnegative(),
  status: z.string(),
  source: z.string(),
  created_at: z.string(),
  last_activity_at: z.string().optional(),
});

export const ProjectOwnerSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
});

export const RecentProjectSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  owner_id: z.number().int().positive(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  deadline: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  owner: ProjectOwnerSchema.optional(),
});

export const DashboardStatsSchema = z.object({
  leads_by_status: z.record(z.string(), z.number().int().nonnegative()),
  leads_by_source: z.record(z.string(), z.number().int().nonnegative()),
  monthly_leads: z.record(z.string(), z.number().int().nonnegative()),
});

export const DashboardDataSchema = z.object({
  metrics: DashboardMetricsSchema,
  recent_activities: z.array(RecentActivitySchema),
  top_leads: z.array(TopLeadSchema),
  recent_projects: z.array(RecentProjectSchema),
  stats: DashboardStatsSchema,
});

export const DashboardLayoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  widgets: z.array(DashboardWidgetSchema),
  is_default: z.boolean().optional()
  });

// ==================== ANALYTICS ====================
export const AnalyticsDataSchema = z.object({
  pageviews: z.number(),
  sessions: z.number(),
  users: z.number(),
  bounce_rate: z.number(),
  avg_session_duration: z.number(),
  date: z.string().optional()
  });

export const AnalyticsReportSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  data: z.array(AnalyticsDataSchema),
  period: z.object({
    start: z.string(),
    end: z.string()
  }),
  created_at: z.string()
  });

// ==================== ACTIVITY ====================
export const ActivityLogSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  description: z.string(),
  metadata: z.record(z.any()).optional().nullable(),
  ip_address: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  created_at: z.string()
  });

// ==================== SOCIAL BUFFER ====================
export const SocialPostSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  content: z.string(),
  status: z.string(),
  scheduled_at: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
  platform_post_id: z.string().optional().nullable(),
  platform: z.string(),
  post_url: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const SocialAccountSchema = z.object({
  id: z.string(),
  platform: z.string(),
  username: z.string(),
  status: z.string(),
  avatar: z.string().optional().nullable(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== MEDIA ====================
export const MediaFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  file_name: z.string(),
  mime_type: z.string(),
  path: z.string(),
  size: z.number(),
  folder_id: z.string().optional().nullable(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const MediaFolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  parent_id: z.string().optional().nullable(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== EMAIL MARKETING ====================
export const EmailTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  content: z.string(),
  type: z.string().optional(),
  created_at: z.string().optional()
  });

export const EmailCampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  template_id: z.string().optional(),
  status: z.string(),
  sent_count: z.number().optional(),
  open_rate: z.number().optional(),
  click_rate: z.number().optional(),
  scheduled_at: z.string().optional()
  });

// ==================== AI ====================
export const AIPromptSchema = z.object({
  id: z.string(),
  name: z.string(),
  prompt: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  max_tokens: z.number().optional()
  });

export const AIResponseSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  response: z.string(),
  model: z.string(),
  tokens_used: z.number().optional(),
  created_at: z.string()
  });

// ==================== AURA ====================
export const AuraAnalysisSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  insights: z.array(z.string()),
  score: z.number().optional(),
  created_at: z.string()
  });

// ==================== ADS TOOL ====================
export const AdCreativeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  content: z.string(),
  media_url: z.string().optional(),
  cta: z.string().optional()
  });

export const AdCampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string(),
  status: z.string(),
  budget: z.number(),
  spent: z.number().optional(),
  impressions: z.number().optional(),
  clicks: z.number().optional(),
  conversions: z.number().optional(),
  creatives: z.array(AdCreativeSchema).optional(),
  created_at: z.string().optional()
  });

// ==================== SETTINGS (Core) ====================
export const ApiConfigurationSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  credentials: z.record(z.any()),
  status: z.enum(['connected', 'disconnected', 'error']),
  last_tested: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== ADSTOOL ====================
export * from './adstool.schema';

// ==================== ANALYTICS ADVANCED ====================
export * from './analytics.schema';

// ==================== AURA ====================
export * from './aura.schema';

// ==================== EMAIL MARKETING ADVANCED ====================
export * from './emailmarketing.schema';

// ==================== MEDIA LIBRARY ====================
export * from './media.schema';

// ==================== PRODUCTS ====================
export * from './products.schema';

// ==================== WORKFLOWS ====================
export * from './workflows.schema';

// ==================== AI (Novos) ====================
export * from './ai.schema';

// ==================== HELPER FUNCTIONS ====================
export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);

}

export function safeValidateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);

  return result.success ? result.data : null;
}

// ==================== EXPORT TYPES ====================
export type User = z.infer<typeof UserSchema>;
export type UserPermissions = z.infer<typeof UserPermissionsSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type Lead = z.infer<typeof LeadSchema>;
export type LeadActivity = z.infer<typeof LeadActivitySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ABTest = z.infer<typeof ABTestSchema>;
export type ABTestVariant = z.infer<typeof ABTestVariantSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type LeadCaptureForm = z.infer<typeof LeadCaptureFormSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectTask = z.infer<typeof ProjectTaskSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowExecution = z.infer<typeof WorkflowExecutionSchema>;
export type DashboardWidget = z.infer<typeof DashboardWidgetSchema>;
export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>;
export type RecentActivity = z.infer<typeof RecentActivitySchema>;
export type TopLead = z.infer<typeof TopLeadSchema>;
export type RecentProject = z.infer<typeof RecentProjectSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type DashboardLayout = z.infer<typeof DashboardLayoutSchema>;
export type AnalyticsData = z.infer<typeof AnalyticsDataSchema>;
export type AnalyticsReport = z.infer<typeof AnalyticsReportSchema>;
export type ActivityLog = z.infer<typeof ActivityLogSchema>;
export type SocialPost = z.infer<typeof SocialPostSchema>;
export type SocialAccount = z.infer<typeof SocialAccountSchema>;
export type MediaFile = z.infer<typeof MediaFileSchema>;
export type MediaFolder = z.infer<typeof MediaFolderSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type EmailCampaign = z.infer<typeof EmailCampaignSchema>;
export type AIPrompt = z.infer<typeof AIPromptSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;
export type AuraAnalysis = z.infer<typeof AuraAnalysisSchema>;
export type AdCreative = z.infer<typeof AdCreativeSchema>;
export type AdCampaign = z.infer<typeof AdCampaignSchema>;
export type ApiConfiguration = z.infer<typeof ApiConfigurationSchema>;
import { z } from 'zod';

/**
 * SCHEMAS AJUSTADOS PARA BACKEND REAL
 * Baseados nos Models reais em App\Domains\*\Models\
 */

// ==================== LEADS (App\Domains\Leads\Models\Lead) ====================
export const RealLeadSchema = z.object({
  id: z.string(), // UUID
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

// ==================== PRODUCTS (App\Domains\Products\Models\Product) ====================
export const RealProductSchema = z.object({
  id: z.string(), // UUID
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

// ==================== WORKFLOWS (App\Domains\Workflows\Models\Workflow) ====================
export const RealWorkflowSchema = z.object({
  id: z.string(), // UUID
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

// ==================== PROJECTS (App\Domains\Projects\Models\Project) ====================
export const RealProjectSchema = z.object({
  id: z.string(), // UUID
  name: z.string(),
  description: z.string().optional().nullable(),
  status: z.string(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  budget: z.number().optional().nullable(),
  progress: z.number().optional(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== MEDIA (App\Domains\Media\Models\MediaFile) ====================
export const RealMediaFileSchema = z.object({
  id: z.string(), // UUID
  name: z.string(),
  file_name: z.string(),
  mime_type: z.string(),
  path: z.string(),
  disk: z.string().optional(),
  size: z.number(),
  folder_id: z.string().optional().nullable(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const RealMediaFolderSchema = z.object({
  id: z.string(), // UUID
  name: z.string(),
  parent_id: z.string().optional().nullable(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== SOCIAL BUFFER (App\Domains\SocialBuffer\Models\Post) ====================
export const RealSocialPostSchema = z.object({
  id: z.string(), // UUID
  content: z.string(),
  platform: z.string(),
  status: z.string(),
  scheduled_at: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
  media: z.array(z.string()).optional().nullable(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// ==================== ACTIVITY (App\Domains\Activity\Models\ActivityLog) ====================
export const RealActivityLogSchema = z.object({
  id: z.string(), // UUID
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

// ==================== DASHBOARD (App\Domains\Dashboard\Models\DashboardWidget) ====================
export const RealDashboardWidgetSchema = z.object({
  id: z.string(), // UUID
  name: z.string(),
  type: z.string(),
  config: z.record(z.any()).optional().nullable(),
  position: z.record(z.any()).optional().nullable(),
  user_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

// Export types
export type RealLead = z.infer<typeof RealLeadSchema>;
export type RealProduct = z.infer<typeof RealProductSchema>;
export type RealWorkflow = z.infer<typeof RealWorkflowSchema>;
export type RealProject = z.infer<typeof RealProjectSchema>;
export type RealMediaFile = z.infer<typeof RealMediaFileSchema>;
export type RealMediaFolder = z.infer<typeof RealMediaFolderSchema>;
export type RealSocialPost = z.infer<typeof RealSocialPostSchema>;
export type RealActivityLog = z.infer<typeof RealActivityLogSchema>;
export type RealDashboardWidget = z.infer<typeof RealDashboardWidgetSchema>;

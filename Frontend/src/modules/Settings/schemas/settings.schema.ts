import { z } from 'zod';

export const settingsSchema = z.object({
  general: z.object({
    site_name: z.string().min(1),
    site_url: z.string().url(),
    timezone: z.string(),
    language: z.string(),
  }).optional(),
  email: z.object({
    smtp_host: z.string(),
    smtp_port: z.number().int().min(1).max(65535),
    smtp_user: z.string().email(),
    smtp_password: z.string(),
    from_email: z.string().email(),
    from_name: z.string(),
  }).optional(),
  ai: z.object({
    default_provider: z.enum(['openai', 'gemini', 'anthropic']),
    openai_api_key: z.string().optional(),
    gemini_api_key: z.string().optional(),
    anthropic_api_key: z.string().optional(),
  }).optional(),
  notifications: z.object({
    email_enabled: z.boolean(),
    push_enabled: z.boolean(),
    sms_enabled: z.boolean(),
  }).optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

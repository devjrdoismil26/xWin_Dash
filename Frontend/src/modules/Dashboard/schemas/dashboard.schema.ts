import { z } from 'zod';

export const widgetSchema = z.object({
  id: z.string(),
  type: z.enum(['chart', 'metric', 'table', 'list']),
  title: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number().min(1), height: z.number().min(1) }),
  config: z.record(z.any()).optional(),
  data_source: z.string().optional(),
});

export const dashboardLayoutSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  widgets: z.array(widgetSchema),
  is_default: z.boolean().default(false),
  is_public: z.boolean().default(false),
});

export type Widget = z.infer<typeof widgetSchema>;
export type DashboardLayout = z.infer<typeof dashboardLayoutSchema>;

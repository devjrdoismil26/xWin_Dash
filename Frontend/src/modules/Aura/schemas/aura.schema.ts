import { z } from 'zod';

export const auraFlowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.any()),
});

export const auraFlowSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  nodes: z.array(auraFlowNodeSchema),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
  })),
  status: z.enum(['active', 'inactive', 'draft']).default('draft'),
});

export const auraMessageSchema = z.object({
  id: z.string().uuid().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  type: z.enum(['text', 'image', 'document', 'audio']).default('text'),
  scheduled_at: z.string().datetime().optional(),
});

export const auraBenchmarkSchema = z.object({
  metric: z.string(),
  value: z.number(),
  target: z.number(),
  unit: z.string().optional(),
});

export type AuraFlowNode = z.infer<typeof auraFlowNodeSchema>;
export type AuraFlow = z.infer<typeof auraFlowSchema>;
export type AuraMessage = z.infer<typeof auraMessageSchema>;
export type AuraBenchmark = z.infer<typeof auraBenchmarkSchema>;

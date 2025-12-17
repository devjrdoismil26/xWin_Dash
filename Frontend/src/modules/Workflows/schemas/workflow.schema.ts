import { z } from 'zod';

export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.any()),
});

export const workflowSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  trigger: z.string().min(1, 'Trigger é obrigatório'),
  nodes: z.array(workflowNodeSchema),
  edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string() })),
  status: z.enum(['active', 'inactive', 'draft']).default('draft'),
  is_template: z.boolean().default(false),
});

export const workflowExecutionSchema = z.object({
  id: z.string().uuid().optional(),
  workflow_id: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  error: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export type Workflow = z.infer<typeof workflowSchema>;
export type WorkflowNode = z.infer<typeof workflowNodeSchema>;
export type WorkflowExecution = z.infer<typeof workflowExecutionSchema>;

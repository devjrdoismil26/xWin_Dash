/**
 * Workflows Schemas - Validação Zod
 *
 * @description
 * Schemas de validação para o módulo Workflows, incluindo workflows,
 * execuções, nodes e triggers.
 *
 * @module schemas/workflows
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema para node de workflow
 */
export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.any()),
});

/**
 * Schema para conexão entre nodes
 */
export const WorkflowConnectionSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

/**
 * Schema para workflow completo
 */
export const WorkflowDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['active', 'paused', 'draft']),
  trigger: z.string(),
  nodes: z.array(WorkflowNodeSchema),
  connections: z.array(WorkflowConnectionSchema),
  variables: z.record(z.any()).optional(),
  execution_count: z.number().int().min(0),
  last_executed_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

/**
 * Schema para execução de workflow
 */
export const WorkflowExecutionSchema = z.object({
  id: z.string(),
  workflow_id: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']),
  input: z.record(z.any()).optional(),
  output: z.record(z.any()).optional(),
  error: z.string().optional(),
  started_at: z.string().optional(),
  completed_at: z.string().optional(),
  duration_ms: z.number().int().min(0).optional(),
  created_at: z.string(),
});

/**
 * Schema para workflow simplificado (lista)
 */
export const WorkflowSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['active', 'paused', 'draft']),
  trigger: z.string(),
  execution_count: z.number().int().min(0),
  success_rate: z.number().min(0).max(100),
  last_executed_at: z.string().optional(),
  created_at: z.string(),
});

/**
 * Schema para estatísticas de workflows
 */
export const WorkflowStatsSchema = z.object({
  total_workflows: z.number().int().min(0),
  active_workflows: z.number().int().min(0),
  paused_workflows: z.number().int().min(0),
  draft_workflows: z.number().int().min(0),
  total_executions: z.number().int().min(0),
  successful_executions: z.number().int().min(0),
  failed_executions: z.number().int().min(0),
  average_execution_time_ms: z.number().min(0),
  success_rate: z.number().min(0).max(100),
});

/**
 * Schema para dashboard de workflows
 */
export const WorkflowDashboardDataSchema = z.object({
  workflows: z.array(WorkflowSummarySchema),
  recent_executions: z.array(WorkflowExecutionSchema),
  stats: WorkflowStatsSchema,
});

/**
 * Schema para criar/atualizar workflow
 */
export const CreateWorkflowSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  trigger: z.string().min(1, 'Trigger é obrigatório'),
  nodes: z.array(WorkflowNodeSchema).optional(),
  connections: z.array(WorkflowConnectionSchema).optional(),
  variables: z.record(z.any()).optional(),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowConnection = z.infer<typeof WorkflowConnectionSchema>;
export type WorkflowDetails = z.infer<typeof WorkflowDetailsSchema>;
export type WorkflowExecution = z.infer<typeof WorkflowExecutionSchema>;
export type WorkflowSummary = z.infer<typeof WorkflowSummarySchema>;
export type WorkflowStats = z.infer<typeof WorkflowStatsSchema>;
export type WorkflowDashboardData = z.infer<typeof WorkflowDashboardDataSchema>;
export type CreateWorkflow = z.infer<typeof CreateWorkflowSchema>;

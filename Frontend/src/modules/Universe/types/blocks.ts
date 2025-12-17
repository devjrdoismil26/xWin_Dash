import React from 'react';
import { BlockType, BlockCategory, BlockData, BlockMetadata } from './universe';

export interface BaseBlockProps {
  id: string;
  type: BlockType;
  data: BlockData;
  isConnectable?: boolean;
  isSelected?: boolean;
  onUpdate??: (e: any) => void;
  onDelete???: (e: any) => void;
  onConfigure???: (e: any) => void;
  onConnect??: (e: any) => void;
  onDisconnect??: (e: any) => void;
  [key: string]: unknown; }

export interface BlockConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type: string;
  data: Record<string, any>; }

export interface BlockHandle {
  id: string;
  type: 'source' | 'target';
  position: 'top' | 'right' | 'bottom' | 'left';
  dataType: string;
  label?: string;
  isConnectable?: boolean;
  style?: React.CSSProperties; }

export interface BlockConfiguration {
  id: string;
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  icon: string;
  color: string;
  handles: BlockHandle[];
  defaultData: BlockData;
  defaultMetadata: BlockMetadata;
  validation: BlockValidation;
  settings: BlockSettings;
  [key: string]: unknown; }

export interface BlockValidation {
  required: string[];
  optional: string[];
  rules: ValidationRule[]; }

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: unknown) => boolean | string; }

export interface BlockSettings {
  canDelete: boolean;
  canDuplicate: boolean;
  canConfigure: boolean;
  canConnect: boolean;
  maxConnections?: number;
  allowedConnections?: string[];
  autoSave: boolean;
  refreshInterval?: number;
  [key: string]: unknown; }

export interface BlockMetrics {
  id: string;
  blockId: string;
  timestamp: Date;
  metrics: {
    executions: number;
  successRate: number;
  averageTime: number;
  errors: number;
  throughput: number;
  [key: string]: unknown; };

}

export interface BlockEvent {
  id: string;
  blockId: string;
  type: 'execution' | 'error' | 'success' | 'warning' | 'info';
  message: string;
  data: Record<string, any>;
  timestamp: Date; }

// Block-specific interfaces
export interface DashboardBlockData extends BlockData {
  metrics: {
    users: number;
    revenue: number;
    conversion: number;
    growth: number;};

  refreshInterval: number;
  autoRefresh: boolean;
}

export interface AnalyticsBlockData extends BlockData {
  dataSource: string;
  metrics: string[];
  timeRange: string;
  filters: Record<string, any>;
  visualization: 'chart' | 'table' | 'graph';
}

export interface AIBlockData extends BlockData {
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  context: string[];
  output: Record<string, any> | null;
}

export interface WorkflowBlockData extends BlockData {
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  configuration: Record<string, any>;
  order: number; }

export interface WorkflowTrigger {
  id: string;
  type: string;
  condition: string;
  action: string; }

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: string;
  value: unknown; }

export interface WorkflowAction {
  id: string;
  type: string;
  target: string;
  parameters: Record<string, any>; }

// Block factory interface
export interface BlockFactory {
  createBlock(type: BlockType, data?: Partial<BlockData>): BaseBlockProps;
  getBlockConfiguration(type: BlockType): BlockConfiguration;
  validateBlockData(type: BlockType, data: BlockData): ValidationResult;
  getAvailableBlocks(): BlockConfiguration[];
  getBlocksByCategory(category: BlockCategory): BlockConfiguration[]; }

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[]; }

// Block registry interface
export interface BlockRegistry {
  register(type: BlockType, configuration: BlockConfiguration): void;
  unregister(type: BlockType): void;
  get(type: BlockType): BlockConfiguration | undefined;
  getAll(): BlockConfiguration[];
  getByCategory(category: BlockCategory): BlockConfiguration[]; }

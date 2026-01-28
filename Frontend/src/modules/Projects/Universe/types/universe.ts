export interface UniverseProject {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  mode: 'universe';
  blocks: UniverseBlock[];
  connections: UniverseConnection[];
  templates: UniverseTemplate[];
  settings: UniverseSettings;
  metrics: UniverseMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface UniverseBlock {
  id: string;
  type: BlockType;
  position: { x: number; y: number };
  data: BlockData;
  status: 'active' | 'inactive' | 'error' | 'processing';
  configuration: Record<string, any>;
  connections: string[];
  metadata: BlockMetadata;
}

export interface BlockData {
  label: string;
  description?: string;
  metrics?: Record<string, any>;
  status?: string;
  progress?: number;
  lastActivity?: string;
  [key: string]: any;
}

export interface BlockMetadata {
  category: BlockCategory;
  version: string;
  dependencies: string[];
  permissions: string[];
  tags: string[];
}

export interface UniverseConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: ConnectionType;
  data: ConnectionData;
  animated: boolean;
  style: ConnectionStyle;
}

export interface ConnectionData {
  label?: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  throughput?: number;
  latency?: number;
}

export interface ConnectionStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface UniverseTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  blocks: UniverseBlock[];
  connections: UniverseConnection[];
  preview: string;
  tags: string[];
  rating: number;
  usageCount: number;
  isPublic: boolean;
  author: string;
  createdAt: string;
}

export interface UniverseSettings {
  theme: 'light' | 'dark' | 'auto';
  gridSize: number;
  backgroundVariant: 'dots' | 'lines' | 'cross';
  snapToGrid: boolean;
  showMiniMap: boolean;
  showControls: boolean;
  autoSave: boolean;
  aiLevel: 'basic' | 'balanced' | 'advanced';
  notifications: boolean;
}

export interface UniverseMetrics {
  totalBlocks: number;
  activeBlocks: number;
  totalConnections: number;
  activeConnections: number;
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  aiSuggestions: number;
  automationsRunning: number;
  lastActivity: string;
}

export interface AIContext {
  projectId: string;
  activeBlocks: UniverseBlock[];
  connections: UniverseConnection[];
  userIntent: string;
  suggestions: AISuggestion[];
  chatHistory: ChatMessage[];
  currentFocus?: string;
}

export interface AISuggestion {
  id: string;
  type: 'connection' | 'optimization' | 'automation' | 'template';
  title: string;
  description: string;
  confidence: number;
  action: AISuggestionAction;
  metadata: Record<string, any>;
}

export interface AISuggestionAction {
  type: string;
  parameters: Record<string, any>;
  execute: () => Promise<void>;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: AISuggestion[];
  nodeContext?: string;
  type: 'text' | 'command' | 'suggestion';
}

export type BlockType = 
  | 'dashboard'
  | 'analytics'
  | 'crm'
  | 'ecommerce'
  | 'landingPage'
  | 'emailMarketing'
  | 'leads'
  | 'workflows'
  | 'mediaLibrary'
  | 'aiAgent'
  | 'aiLaboratory'
  | 'aiContext'
  | 'aura'
  | 'socialBuffer'
  | 'adsTool'
  | 'webBrowser'
  | 'products'
  | 'integrations';

export type BlockCategory = 
  | 'core'
  | 'marketing'
  | 'ai'
  | 'ecommerce'
  | 'analytics'
  | 'integrations'
  | 'automation'
  | 'media';

export type ConnectionType = 
  | 'data'
  | 'trigger'
  | 'response'
  | 'webhook'
  | 'api'
  | 'database'
  | 'file'
  | 'notification';

export type TemplateCategory = 
  | 'ecommerce'
  | 'marketing'
  | 'analytics'
  | 'automation'
  | 'ai'
  | 'crm'
  | 'social'
  | 'content';

export interface UniverseState {
  project: UniverseProject | null;
  blocks: UniverseBlock[];
  connections: UniverseConnection[];
  selectedBlock: UniverseBlock | null;
  selectedConnection: UniverseConnection | null;
  isRunning: boolean;
  isSaving: boolean;
  error: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant: 'primary' | 'secondary' | 'destructive';
}

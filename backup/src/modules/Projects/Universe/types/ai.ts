export interface AIService {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'azure' | 'custom';
  endpoint: string;
  apiKey?: string;
  models: AIModel[];
  capabilities: AICapability[];
  status: 'active' | 'inactive' | 'error';
  lastUsed: Date;
  usage: AIUsage;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'multimodal';
  maxTokens: number;
  costPerToken: number;
  capabilities: string[];
  description: string;
}

export interface AICapability {
  type: 'text_generation' | 'image_generation' | 'code_generation' | 'analysis' | 'translation';
  description: string;
  parameters: AIParameter[];
  examples: string[];
}

export interface AIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: any;
  description: string;
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
  custom?: (value: any) => boolean | string;
}

export interface AIUsage {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  requestsToday: number;
  tokensToday: number;
  costToday: number;
  lastReset: Date;
}

export interface AIRequest {
  id: string;
  serviceId: string;
  modelId: string;
  prompt: string;
  parameters: Record<string, any>;
  context?: AIContext;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  response?: AIResponse;
  error?: string;
  duration?: number;
  tokensUsed?: number;
  cost?: number;
}

export interface AIResponse {
  content: string;
  type: 'text' | 'image' | 'json' | 'html';
  metadata: Record<string, any>;
  suggestions?: AISuggestion[];
  confidence?: number;
  alternatives?: AIAlternative[];
}

export interface AISuggestion {
  id: string;
  type: 'optimization' | 'connection' | 'automation' | 'template';
  title: string;
  description: string;
  confidence: number;
  action: SuggestionAction;
  metadata: Record<string, any>;
}

export interface SuggestionAction {
  type: string;
  parameters: Record<string, any>;
  execute: () => Promise<void>;
}

export interface AIAlternative {
  content: string;
  confidence: number;
  reasoning: string;
}

export interface AIContext {
  projectId: string;
  blocks: BlockContext[];
  connections: ConnectionContext[];
  userIntent: string;
  chatHistory: ChatMessage[];
  currentFocus?: string;
  preferences: UserPreferences;
}

export interface BlockContext {
  id: string;
  type: string;
  data: any;
  status: string;
  metrics: Record<string, any>;
}

export interface ConnectionContext {
  id: string;
  source: string;
  target: string;
  type: string;
  status: string;
  throughput: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'command' | 'suggestion' | 'error';
  metadata?: Record<string, any>;
  suggestions?: AISuggestion[];
}

export interface UserPreferences {
  language: string;
  responseStyle: 'concise' | 'detailed' | 'technical';
  autoSuggestions: boolean;
  voiceEnabled: boolean;
  darkMode: boolean;
  notifications: boolean;
}

export interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  steps: AIWorkflowStep[];
  triggers: AIWorkflowTrigger[];
  conditions: AIWorkflowCondition[];
  actions: AIWorkflowAction[];
  status: 'active' | 'inactive' | 'error';
  lastRun: Date;
  nextRun?: Date;
  statistics: AIWorkflowStats;
}

export interface AIWorkflowStep {
  id: string;
  name: string;
  type: 'ai_generation' | 'ai_analysis' | 'ai_optimization' | 'ai_decision';
  configuration: Record<string, any>;
  order: number;
  dependencies: string[];
  timeout: number;
  retries: number;
}

export interface AIWorkflowTrigger {
  id: string;
  type: 'schedule' | 'event' | 'condition' | 'manual';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface AIWorkflowCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
  logic: 'and' | 'or';
}

export interface AIWorkflowAction {
  id: string;
  type: 'notification' | 'webhook' | 'data_update' | 'block_action';
  configuration: Record<string, any>;
  order: number;
}

export interface AIWorkflowStats {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  lastSuccess: Date;
  lastFailure: Date;
  successRate: number;
}

export interface AIPersonalization {
  userId: string;
  preferences: UserPreferences;
  behavior: UserBehavior;
  recommendations: AIRecommendation[];
  learning: AILearning;
}

export interface UserBehavior {
  mostUsedBlocks: string[];
  commonWorkflows: string[];
  preferredTimes: string[];
  interactionPatterns: InteractionPattern[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface InteractionPattern {
  action: string;
  frequency: number;
  context: string;
  timestamp: Date;
}

export interface AIRecommendation {
  id: string;
  type: 'block' | 'workflow' | 'template' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  action: RecommendationAction;
  metadata: Record<string, any>;
}

export interface RecommendationAction {
  type: string;
  parameters: Record<string, any>;
  execute: () => Promise<void>;
}

export interface AILearning {
  model: string;
  accuracy: number;
  lastTraining: Date;
  trainingData: TrainingData[];
  predictions: AIPrediction[];
  feedback: UserFeedback[];
}

export interface TrainingData {
  input: any;
  output: any;
  context: any;
  timestamp: Date;
  quality: number;
}

export interface AIPrediction {
  id: string;
  type: string;
  input: any;
  prediction: any;
  confidence: number;
  timestamp: Date;
  actual?: any;
  accuracy?: number;
}

export interface UserFeedback {
  predictionId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
  helpful: boolean;
}

/**
 * Exportações otimizadas do módulo Workflows
 * Entry point principal com lazy loading
 */
import React from 'react';

// Main module exports for Workflows
export const WorkflowsIndexPage = React.lazy(() => import('./pages/WorkflowsIndexPage'));

// Default export para lazy loading
export { default } from './pages/WorkflowsIndexPage';

// Core Components
export const AdvancedWorkflowDashboard = React.lazy(() => import('./components/AdvancedWorkflowDashboard'));

export const AdvancedWorkflowEditor = React.lazy(() => import('./components/AdvancedWorkflowEditor'));

export const WorkflowMetrics = React.lazy(() => import('./components/WorkflowMetrics'));

export const WorkflowExecutions = React.lazy(() => import('./components/WorkflowExecutions'));

// Modals
export const TriggerWorkflowModal = React.lazy(() => import('./components/TriggerWorkflowModal'));

export const NodeConfigModal = React.lazy(() => import('./components/NodeConfigModal'));

// Editor Components
export const ExecutionControls = React.lazy(() => import('./components/editor-components/ExecutionControls'));

export const HistoryPanel = React.lazy(() => import('./components/editor-components/HistoryPanel'));

export const PropertiesPanel = React.lazy(() => import('./components/editor-components/PropertiesPanel'));

export const SaveWorkflowModal = React.lazy(() => import('./components/editor-components/SaveWorkflowModal'));

export const Sidebar = React.lazy(() => import('./components/editor-components/Sidebar'));

// Node Types
export const TriggerNode = React.lazy(() => import('./components/nodes/TriggerNode'));

export const ActionNode = React.lazy(() => import('./components/nodes/ActionNode'));

export const ConditionNode = React.lazy(() => import('./components/nodes/ConditionNode'));

export const DelayNode = React.lazy(() => import('./components/nodes/DelayNode'));

export const EmailNode = React.lazy(() => import('./components/nodes/EmailNode'));

export const WhatsAppNode = React.lazy(() => import('./components/nodes/WhatsAppNode'));

export const ApiNode = React.lazy(() => import('./components/nodes/ApiNode'));

export const DataNode = React.lazy(() => import('./components/nodes/DataNode'));

export const LoopNode = React.lazy(() => import('./components/nodes/LoopNode'));

export const AiNode = React.lazy(() => import('./components/nodes/AiNode'));

export const ExternalAiNode = React.lazy(() => import('./components/nodes/ExternalAiNode'));

export const AITextAnalysisNode = React.lazy(() => import('./components/nodes/AITextAnalysisNode'));

export const AnalyticsReportNode = React.lazy(() => import('./components/nodes/AnalyticsReportNode'));

export const AdCreationNode = React.lazy(() => import('./components/nodes/AdCreationNode'));

export const CustomWebhookNode = React.lazy(() => import('./components/nodes/WebhookNode'));

export const EmailCampaignNode = React.lazy(() => import('./components/nodes/EmailCampaignNode'));

export const MediaProcessingNode = React.lazy(() => import('./components/nodes/MediaProcessingNode'));

export const PostScheduleNode = React.lazy(() => import('./components/nodes/PostScheduleNode'));

export const SocialMediaAutomationNode = React.lazy(() => import('./components/nodes/SocialMediaAutomationNode'));

export const TriggerWorkflowNode = React.lazy(() => import('./components/nodes/TriggerWorkflowNode'));

// Services
export { workflowService } from './services/workflowService';

// Hooks
export { useWorkflows } from './hooks/useWorkflows';

// Configuration
export { default as nodeTypes } from './components/nodeTypes';
export { default as nodeConfigs } from './components/nodeConfigs';

// Export new node components (DelayNode already exported above)
export const ApiCallNode = React.lazy(() => import('./components/nodes/ApiCallNode'));

export const CreateADSCampaignNode = React.lazy(() => import('./components/nodes/CreateADSCampaignNode'));

export const LeadHasTagNode = React.lazy(() => import('./components/nodes/LeadHasTagNode'));

export const SocialPostHasMediaNode = React.lazy(() => import('./components/nodes/SocialPostHasMediaNode'));

export const EmailEngagementConditionNode = React.lazy(() => import('./components/nodes/EmailEngagementConditionNode'));

// Export advanced canvas
export const AdvancedWorkflowCanvas = React.lazy(() => import('./components/AdvancedWorkflowCanvas'));

// Export integration test component
export const WorkflowIntegrationTest = React.lazy(() => import('./components/WorkflowIntegrationTest'));

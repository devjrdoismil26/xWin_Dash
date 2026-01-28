/**
 * Exportações otimizadas do módulo Projects
 * Entry point principal com lazy loading
 */
import React from 'react';

// Main Projects Module - No lazy loading for main component
export { default } from './components/ProjectsModule';

// Project Selector - Direct import (main entry point)
export { default as ProjectSelector } from './ProjectSelector';

// Core Components - Direct imports (no lazy loading for frequently used components)
export { default as ProjectsModule } from './components/ProjectsModule';
export { default as ProjectsDashboard } from './components/ProjectsDashboard';
export { default as ProjectsHeader } from './components/ProjectsHeader';
export { default as ProjectsNavigation } from './components/ProjectsNavigation';

// Core Hooks - Direct imports
export { useProjects } from './hooks/useProjects';
export { useProjectsCore } from './ProjectsCore/hooks/useProjectsCore';

// Core Services - Direct imports
export { default as projectsCoreService } from './ProjectsCore/services/projectsCoreService';
export { default as projectsManagerService } from './ProjectsManager/services/projectsManagerService';

// Core Types - Direct imports
export * from './types/projectsTypes';
export * from './ProjectsCore/types/projectsCoreTypes';
export * from './ProjectsManager/types/projectsManagerTypes';
export * from './ProjectsAdvanced/types/projectsAdvancedTypes';

// Lazy loading only for heavy components that are not frequently used
// CreateEdit and Show components removed - functionality moved to ProjectSelector

// Project Components - Lazy loaded (used less frequently)
export const ProjectCard = React.lazy(() => import('./components/ProjectsDashboard'));
export const ProjectList = React.lazy(() => import('./components/ProjectsDashboard'));

// Advanced Components - Lazy loaded (heavy components)
export const ProjectTemplates = React.lazy(() => import('./components/ProjectTemplates'));
export const ProjectTimeline = React.lazy(() => import('./components/ProjectTimeline'));
export const ProjectMilestones = React.lazy(() => import('./components/ProjectMilestones'));
export const ProjectResources = React.lazy(() => import('./components/ProjectResources'));
export const ProjectBudget = React.lazy(() => import('./components/ProjectBudget'));
export const ProjectRisks = React.lazy(() => import('./components/ProjectRisks'));

// Universe Components - Lazy loaded (heavy components)
export const Universe = React.lazy(() => import('./Universe/index.tsx'));
export const UniverseHub = React.lazy(() => import('./Universe/dashboard/UniverseHub'));
export const UniverseBlock = React.lazy(() => import('./Universe/components/UniverseBlock'));
export const DGDPanel = React.lazy(() => import('./Universe/components/DGDPanel'));
export const KanbanBoard = React.lazy(() => import('./Universe/components/KanbanBoard'));
export const AdvancedUniverseDashboard = React.lazy(() => import('./Universe/components/AdvancedUniverseDashboard'));

// Universe Advanced Components - Lazy loaded (very heavy components)
export const BlockMarketplace = React.lazy(() => import('./Universe/components/Marketplace/BlockMarketplace'));
export const AISuperAgents = React.lazy(() => import('./Universe/components/AI/AISuperAgents'));
export const UniversalConnectors = React.lazy(() => import('./Universe/components/Integration/UniversalConnectors'));
export const EnterpriseArchitecture = React.lazy(() => import('./Universe/components/Enterprise/EnterpriseArchitecture'));
export const ARVRInterface = React.lazy(() => import('./Universe/components/Immersive/ARVRInterface'));

// Universe Hooks - Lazy loaded (heavy hooks)
export const useUniverse = React.lazy(() => import('./Universe/hooks/useUniverse'));
export const useUniverseCanvas = React.lazy(() => import('./Universe/hooks/useUniverseCanvas'));

// Universe Pages - Lazy loaded
export const UniverseIndexPage = React.lazy(() => import('./Universe/pages/UniverseIndex'));
export const UniverseCanvasPage = React.lazy(() => import('./Universe/pages/UniverseWorkspace'));
export const UniverseDashboardPage = React.lazy(() => import('./Universe/pages/Dashboard'));
export const UniverseSettingsPage = React.lazy(() => import('./Universe/pages/UniverseProjectCreator'));
export const UniverseAnalyticsPage = React.lazy(() => import('./Universe/pages/WorkspaceSelector'));

// Universe Services - Lazy loaded
export const universeService = React.lazy(() => import('./Universe/services/universeService'));
export const blockService = React.lazy(() => import('./Universe/services/AICommandProcessor'));

// Universe Types - Direct imports (types are lightweight)
export * from './Universe/types/universe';
export * from './Universe/types/blocks';
export * from './Universe/types/ai';

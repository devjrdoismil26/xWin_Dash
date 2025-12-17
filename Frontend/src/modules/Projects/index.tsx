/**
 * Exportações otimizadas do módulo Projects
 * Entry point principal com lazy loading
 */
import React from 'react';

// Main Projects Module
export { default } from './components/ProjectsModule';

// Project Selector
export { default as ProjectSelector } from './ProjectSelector';

// Core Components
export { default as ProjectsModule } from './components/ProjectsModule';
export { default as ProjectsDashboard } from './components/ProjectsDashboard';
export { default as ProjectsHeader } from './components/ProjectsHeader';
export { default as ProjectsNavigation } from './components/ProjectsNavigation';

// Core Hooks
export { useProjects } from './hooks/useProjects';
export { useProjectsCore } from './ProjectsCore/hooks/useProjectsCore';
export { useProjectsManager } from './hooks/manager';

// Core Services
export { default as projectsCoreService } from './ProjectsCore/services/projectsCoreService';
export { default as projectsManagerService } from './ProjectsManager/services/projectsManagerService';
export { default as projectsService } from './services/projectsService';

// Core Types
export * from './types/projectsTypes';
export * from './ProjectsCore/types/projectsCoreTypes';
export * from './ProjectsManager/types/projectsManagerTypes';
export * from './ProjectsAdvanced/types/projectsAdvancedTypes';

// Lazy loaded components
export const ProjectTemplates = React.lazy(() => import('./shared/components/ProjectTemplates'));

export const ProjectTimeline = React.lazy(() => import('./shared/components/ProjectTimeline'));

export const ProjectMilestones = React.lazy(() => import('./shared/components/ProjectMilestones'));

export const ProjectResources = React.lazy(() => import('./shared/components/ProjectResources'));

export const ProjectBudget = React.lazy(() => import('./shared/components/ProjectBudget'));

export const ProjectRisks = React.lazy(() => import('./shared/components/ProjectRisks'));

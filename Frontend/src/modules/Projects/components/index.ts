/**
 * Exportações centralizadas dos componentes do módulo Projects
 */

// Componentes principais
export { default as ProjectsModule } from './ProjectsModule';
export { default as ProjectsDashboard } from './ProjectsDashboard';
export { default as ProjectsHeader } from './ProjectsHeader';
export { default as ProjectsNavigation } from './ProjectsNavigation';
export { default as ProjectTemplates } from './ProjectTemplates';
export { default as ProjectTimeline } from './ProjectTimeline';
export { default as ProjectMilestones } from './ProjectMilestones';
export { default as ProjectResources } from './ProjectResources';
export { default as ProjectBudget } from './ProjectBudget';
export { default as ProjectRisks } from './ProjectRisks';
export { default as AddProjectMemberModal } from './AddProjectMemberModal';
export { default as AdminProjectTable } from './AdminProjectTable';
export { default as ProjectMembersTable } from './ProjectMembersTable';

// Re-exportações para conveniência
export type {
  ProjectsModuleProps,
  ProjectsDashboardProps,
  ProjectsHeaderProps,
  ProjectsNavigationProps,
  ProjectTemplatesProps,
  ProjectTimelineProps,
  ProjectMilestonesProps,
  ProjectResourcesProps,
  ProjectBudgetProps,
  ProjectRisksProps
} from './ProjectsModule';
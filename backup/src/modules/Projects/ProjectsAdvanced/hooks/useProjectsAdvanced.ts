// ========================================
// PROJECTS ADVANCED HOOKS (REFATORADO)
// ========================================
// Este arquivo agora re-exporta todos os hooks avançados modulares

export {
  useProjectTemplates,
  useProjectTemplateCRUD
} from './templates';

export {
  useProjectTimelines,
  useProjectTimelineCRUD
} from './timelines';

export {
  useProjectMilestones
} from './milestones';

export {
  useProjectResources
} from './resources';

export {
  useProjectBudgets
} from './budgets';

export {
  useProjectRisks
} from './risks';

export {
  useProjectReports
} from './reports';

export {
  useProjectAnalytics
} from './analytics';

// Hook principal que combina todos os hooks modulares
import { useState, useCallback } from 'react';
import { useProjectTemplates } from './templates/useProjectTemplates';
import { useProjectTimelines } from './timelines/useProjectTimelines';
import { useProjectMilestones } from './milestones/useProjectMilestones';
import { useProjectResources } from './resources/useProjectResources';
import { useProjectBudgets } from './budgets/useProjectBudgets';
import { useProjectRisks } from './risks/useProjectRisks';
import { useProjectReports } from './reports/useProjectReports';
import { useProjectAnalytics } from './analytics/useProjectAnalytics';

export const useProjectsAdvanced = () => {
  const templatesHook = useProjectTemplates();
  const timelinesHook = useProjectTimelines();
  const milestonesHook = useProjectMilestones();
  const resourcesHook = useProjectResources();
  const budgetsHook = useProjectBudgets();
  const risksHook = useProjectRisks();
  const reportsHook = useProjectReports();
  const analyticsHook = useProjectAnalytics();

  const loading = templatesHook.loading || timelinesHook.loading || milestonesHook.loading || 
                  resourcesHook.loading || budgetsHook.loading || risksHook.loading || 
                  reportsHook.loading || analyticsHook.loading;

  const error = templatesHook.error || timelinesHook.error || milestonesHook.error || 
                resourcesHook.error || budgetsHook.error || risksHook.error || 
                reportsHook.error || analyticsHook.error;

  return {
    // State
    templates: templatesHook.templates,
    timelines: timelinesHook.timelines,
    milestones: milestonesHook.milestones,
    resources: resourcesHook.resources,
    budgets: budgetsHook.budgets,
    risks: risksHook.risks,
    reports: reportsHook.reports,
    analytics: analyticsHook.analytics,
    loading,
    error,

    // Template management
    getProjectTemplates: templatesHook.getProjectTemplates,
    createProjectTemplate: templatesHook.createProjectTemplate,
    updateProjectTemplate: templatesHook.updateProjectTemplate,
    deleteProjectTemplate: templatesHook.deleteProjectTemplate,
    duplicateProjectTemplate: templatesHook.duplicateProjectTemplate,

    // Timeline management
    getProjectTimeline: timelinesHook.getProjectTimeline,
    createProjectTimeline: timelinesHook.createProjectTimeline,
    updateProjectTimeline: timelinesHook.updateProjectTimeline,
    deleteProjectTimeline: timelinesHook.deleteProjectTimeline,

    // Milestone management
    getProjectMilestones: milestonesHook.getProjectMilestones,
    createProjectMilestone: milestonesHook.createProjectMilestone,
    updateProjectMilestone: milestonesHook.updateProjectMilestone,
    deleteProjectMilestone: milestonesHook.deleteProjectMilestone,
    completeProjectMilestone: milestonesHook.completeProjectMilestone,

    // Resource management
    getProjectResources: resourcesHook.getProjectResources,
    createProjectResource: resourcesHook.createProjectResource,
    updateProjectResource: resourcesHook.updateProjectResource,
    deleteProjectResource: resourcesHook.deleteProjectResource,

    // Budget management
    getProjectBudgets: budgetsHook.getProjectBudgets,
    createProjectBudget: budgetsHook.createProjectBudget,
    updateProjectBudget: budgetsHook.updateProjectBudget,
    deleteProjectBudget: budgetsHook.deleteProjectBudget,

    // Risk management
    getProjectRisks: risksHook.getProjectRisks,
    createProjectRisk: risksHook.createProjectRisk,
    updateProjectRisk: risksHook.updateProjectRisk,
    deleteProjectRisk: risksHook.deleteProjectRisk,

    // Report management
    getProjectReports: reportsHook.getProjectReports,
    createProjectReport: reportsHook.createProjectReport,
    updateProjectReport: reportsHook.updateProjectReport,
    deleteProjectReport: reportsHook.deleteProjectReport,

    // Analytics management
    getProjectAnalytics: analyticsHook.getProjectAnalytics,
    generateProjectAnalytics: analyticsHook.generateProjectAnalytics,
    updateProjectAnalytics: analyticsHook.updateProjectAnalytics,
    deleteProjectAnalytics: analyticsHook.deleteProjectAnalytics
  };
};
import { useCallback } from 'react';
import { useProjectCRUD } from './useProjectCRUD';
import { useProjectMembers } from './useProjectMembers';
import { useProjectInvitations } from './useProjectInvitations';
import { useProjectSettings } from './useProjectSettings';
import { useProjectPermissions } from './useProjectPermissions';

export const useProjectsManager = () => {
  const crud = useProjectCRUD();

  const members = useProjectMembers();

  const invitations = useProjectInvitations();

  const settings = useProjectSettings();

  const permissions = useProjectPermissions();

  const clearError = useCallback(() => {
    // Limpar erros de todos os hooks
  }, []);

  return {
    // State
    projects: crud.projects,
    currentProject: crud.currentProject,
    members: members.members,
    invitations: invitations.invitations,
    metrics: permissions.metrics,
    loading: crud.loading || members.loading || invitations.loading || settings.loading || permissions.loading,
    error: crud.error || members.error || invitations.error || settings.error || permissions.error,

    // Project CRUD
    fetchManagedProjects: crud.fetchManagedProjects,
    fetchProjectManager: crud.fetchProjectManager,
    updateProjectMode: crud.updateProjectMode,
    updateProjectModules: crud.updateProjectModules,
    setCurrentProject: crud.setCurrentProject,

    // Members
    getProjectMembers: members.getProjectMembers,
    addProjectMember: members.addProjectMember,
    updateProjectMember: members.updateProjectMember,
    removeProjectMember: members.removeProjectMember,
    bulkUpdateMemberRoles: members.bulkUpdateMemberRoles,
    bulkRemoveMembers: members.bulkRemoveMembers,

    // Invitations
    sendProjectInvitation: invitations.sendProjectInvitation,
    getProjectInvitations: invitations.getProjectInvitations,
    cancelProjectInvitation: invitations.cancelProjectInvitation,
    resendProjectInvitation: invitations.resendProjectInvitation,

    // Settings
    getProjectSettings: settings.getProjectSettings,
    updateProjectSettings: settings.updateProjectSettings,
    updateNotificationSettings: settings.updateNotificationSettings,
    updatePrivacySettings: settings.updatePrivacySettings,
    updateIntegrationSettings: settings.updateIntegrationSettings,
    updateAutomationSettings: settings.updateAutomationSettings,

    // Permissions & Metrics
    checkUserPermission: permissions.checkUserPermission,
    getUserPermissions: permissions.getUserPermissions,
    getProjectStatistics: permissions.getProjectStatistics,
    getManagerMetrics: permissions.getManagerMetrics,

    // Utilities
    clearError};
};

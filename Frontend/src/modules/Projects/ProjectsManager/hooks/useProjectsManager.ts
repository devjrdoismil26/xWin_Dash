import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProjectManager, ProjectManagerFilters, ProjectManagerMetrics, ProjectMember, ProjectInvitation, ProjectRole, ProjectPermission, ProjectSettings, ProjectManagerResponse } from '../types/projectsManagerTypes';
import projectsManagerService from '../services/projectsManagerService';

interface UseProjectsManagerReturn {
  // State
  projects: ProjectManager[];
  currentProject: ProjectManager | null;
  members: ProjectMember[];
  invitations: ProjectInvitation[];
  metrics: ProjectManagerMetrics | null;
  loading: boolean;
  error: string | null;
  // Project management
  fetchManagedProjects: (filters?: ProjectManagerFilters, page?: number) => Promise<void>;
  fetchProjectManager: (id: string) => Promise<void>;
  updateProjectMode: (id: string, mode: 'normal' | 'universe') => Promise<ProjectManager | null>;
  updateProjectModules: (id: string, modules: string[]) => Promise<ProjectManager | null>;
  // Member management
  getProjectMembers: (projectId: string) => Promise<ProjectMember[]>;
  addProjectMember: (projectId: string, memberData: {
    userId: string;
  role: ProjectRole;
  permissions: ProjectPermission[]; }) => Promise<ProjectMember | null>;
  updateProjectMember: (projectId: string, memberId: string, memberData: {
    role?: ProjectRole;
    permissions?: ProjectPermission[];
    status?: 'active' | 'inactive';
  }) => Promise<ProjectMember | null>;
  removeProjectMember: (projectId: string, memberId: string) => Promise<boolean>;

  // Invitation management
  sendProjectInvitation: (projectId: string, invitationData: {
    email: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
    message?: string;
  }) => Promise<ProjectInvitation | null>;
  getProjectInvitations: (projectId: string) => Promise<ProjectInvitation[]>;
  cancelProjectInvitation: (projectId: string, invitationId: string) => Promise<boolean>;
  resendProjectInvitation: (projectId: string, invitationId: string) => Promise<ProjectInvitation | null>;

  // Settings management
  getProjectSettings: (projectId: string) => Promise<ProjectSettings | null>;
  updateProjectSettings: (projectId: string, settings: Partial<ProjectSettings>) => Promise<ProjectSettings | null>;
  updateNotificationSettings: (projectId: string, notificationSettings: Partial<ProjectSettings['notifications']>) => Promise<ProjectSettings | null>;
  updatePrivacySettings: (projectId: string, privacySettings: Partial<ProjectSettings['privacy']>) => Promise<ProjectSettings | null>;
  updateIntegrationSettings: (projectId: string, integrationSettings: Partial<ProjectSettings['integrations']>) => Promise<ProjectSettings | null>;
  updateAutomationSettings: (projectId: string, automationSettings: Partial<ProjectSettings['automation']>) => Promise<ProjectSettings | null>;

  // Statistics and metrics
  getProjectStatistics: (projectId: string) => Promise<any>;
  getManagerMetrics: () => Promise<void>;

  // Permission management
  checkUserPermission: (projectId: string, permission: ProjectPermission) => Promise<boolean>;
  getUserPermissions: (projectId: string) => Promise<ProjectPermission[]>;

  // Bulk operations
  bulkUpdateMemberRoles: (projectId: string, updates: Array<{
    memberId: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
  }>) => Promise<boolean>;
  bulkRemoveMembers: (projectId: string, memberIds: string[]) => Promise<boolean>;

  // Utilities
  clearError??: (e: any) => void;
  setCurrentProject?: (e: any) => void;
}

export const useProjectsManager = (): UseProjectsManagerReturn => {
  // State
  const [projects, setProjects] = useState<ProjectManager[]>([]);

  const [currentProject, setCurrentProject] = useState<ProjectManager | null>(null);

  const [members, setMembers] = useState<ProjectMember[]>([]);

  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);

  const [metrics, setMetrics] = useState<ProjectManagerMetrics | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);

  }, []);

  // Project management
  const fetchManagedProjects = useCallback(async (filters?: ProjectManagerFilters, page: number = 1) => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.getManagedProjects(filters, { page, limit: 20 });

      if (result.success) {
        setProjects(result.data);

      } else {
        setError(result.message || 'Failed to fetch managed projects');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch managed projects');

    } finally {
      setLoading(false);

    } , []);

  const fetchProjectManager = useCallback(async (id: string) => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.getProjectManager(id);

      if (result.success) {
        setCurrentProject(result.data);

      } else {
        setError(result.message || 'Failed to fetch project manager');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project manager');

    } finally {
      setLoading(false);

    } , []);

  const updateProjectMode = useCallback(async (id: string, mode: 'normal' | 'universe'): Promise<ProjectManager | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updateProjectMode(id, mode);

      if (result.success) {
        setProjects(prev => prev.map(p => p.id === id ? result.data : p));

        if (currentProject?.id === id) {
          setCurrentProject(result.data);

        }
        return result.data;
      } else {
        setError(result.message || 'Failed to update project mode');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project mode');

      return null;
    } finally {
      setLoading(false);

    } , [currentProject?.id]);

  const updateProjectModules = useCallback(async (id: string, modules: string[]): Promise<ProjectManager | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updateProjectModules(id, modules);

      if (result.success) {
        setProjects(prev => prev.map(p => p.id === id ? result.data : p));

        if (currentProject?.id === id) {
          setCurrentProject(result.data);

        }
        return result.data;
      } else {
        setError(result.message || 'Failed to update project modules');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project modules');

      return null;
    } finally {
      setLoading(false);

    } , [currentProject?.id]);

  // Member management
  const getProjectMembers = useCallback(async (projectId: string): Promise<ProjectMember[]> => {
    try {
      setError(null);

      const result = await projectsManagerService.getProjectMembers(projectId);

      if (result.success) {
        setMembers(result.data);

        return result.data;
      } else {
        setError(result.message || 'Failed to fetch project members');

        return [];
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project members');

      return [];
    } , []);

  const addProjectMember = useCallback(async (projectId: string, memberData: {
    userId: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
  }): Promise<ProjectMember | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.addProjectMember(projectId, memberData);

      if (result.success) {
        setMembers(prev => [result.data, ...prev]);

        return result.data;
      } else {
        setError(result.message || 'Failed to add project member');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project member');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateProjectMember = useCallback(async (projectId: string, memberId: string, memberData: {
    role?: ProjectRole;
    permissions?: ProjectPermission[];
    status?: 'active' | 'inactive';
  }): Promise<ProjectMember | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updateProjectMember(projectId, memberId, memberData);

      if (result.success) {
        setMembers(prev => prev.map(m => m.id === memberId ? result.data : m));

        return result.data;
      } else {
        setError(result.message || 'Failed to update project member');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project member');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const removeProjectMember = useCallback(async (projectId: string, memberId: string): Promise<boolean> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.removeProjectMember(projectId, memberId);

      if (result.success) {
        setMembers(prev => prev.filter(m => m.id !== memberId));

        return true;
      } else {
        setError(result.message || 'Failed to remove project member');

        return false;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove project member');

      return false;
    } finally {
      setLoading(false);

    } , []);

  // Invitation management
  const sendProjectInvitation = useCallback(async (projectId: string, invitationData: {
    email: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
    message?: string;
  }): Promise<ProjectInvitation | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.sendProjectInvitation(projectId, invitationData);

      if (result.success) {
        setInvitations(prev => [result.data, ...prev]);

        return result.data;
      } else {
        setError(result.message || 'Failed to send project invitation');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send project invitation');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const getProjectInvitations = useCallback(async (projectId: string): Promise<ProjectInvitation[]> => {
    try {
      setError(null);

      const result = await projectsManagerService.getProjectInvitations(projectId);

      if (result.success) {
        setInvitations(result.data);

        return result.data;
      } else {
        setError(result.message || 'Failed to fetch project invitations');

        return [];
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project invitations');

      return [];
    } , []);

  const cancelProjectInvitation = useCallback(async (projectId: string, invitationId: string): Promise<boolean> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.cancelProjectInvitation(projectId, invitationId);

      if (result.success) {
        setInvitations(prev => prev.filter(i => i.id !== invitationId));

        return true;
      } else {
        setError(result.message || 'Failed to cancel project invitation');

        return false;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel project invitation');

      return false;
    } finally {
      setLoading(false);

    } , []);

  const resendProjectInvitation = useCallback(async (projectId: string, invitationId: string): Promise<ProjectInvitation | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.resendProjectInvitation(projectId, invitationId);

      if (result.success) {
        setInvitations(prev => prev.map(i => i.id === invitationId ? result.data : i));

        return result.data;
      } else {
        setError(result.message || 'Failed to resend project invitation');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend project invitation');

      return null;
    } finally {
      setLoading(false);

    } , []);

  // Settings management
  const getProjectSettings = useCallback(async (projectId: string): Promise<ProjectSettings | null> => {
    try {
      setError(null);

      const result = await projectsManagerService.getProjectSettings(projectId);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to fetch project settings');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project settings');

      return null;
    } , []);

  const updateProjectSettings = useCallback(async (projectId: string, settings: Partial<ProjectSettings>): Promise<ProjectSettings | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updateProjectSettings(projectId, settings);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update project settings');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project settings');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateNotificationSettings = useCallback(async (projectId: string, notificationSettings: Partial<ProjectSettings['notifications']>): Promise<ProjectSettings | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updateNotificationSettings(projectId, notificationSettings);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update notification settings');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification settings');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updatePrivacySettings = useCallback(async (projectId: string, privacySettings: Partial<ProjectSettings['privacy']>): Promise<ProjectSettings | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updatePrivacySettings(projectId, privacySettings);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update privacy settings');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update privacy settings');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateIntegrationSettings = useCallback(async (projectId: string, integrationSettings: Partial<ProjectSettings['integrations']>): Promise<ProjectSettings | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updateIntegrationSettings(projectId, integrationSettings);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update integration settings');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update integration settings');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateAutomationSettings = useCallback(async (projectId: string, automationSettings: Partial<ProjectSettings['automation']>): Promise<ProjectSettings | null> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.updateAutomationSettings(projectId, automationSettings);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update automation settings');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update automation settings');

      return null;
    } finally {
      setLoading(false);

    } , []);

  // Statistics and metrics
  const getProjectStatistics = useCallback(async (projectId: string) => {
    try {
      setError(null);

      const result = await projectsManagerService.getProjectStatistics(projectId);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to fetch project statistics');

        return null;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project statistics');

      return null;
    } , []);

  const getManagerMetrics = useCallback(async () => {
    try {
      setError(null);

      const result = await projectsManagerService.getManagerMetrics();

      if (result.success) {
        setMetrics(result.data);

      } else {
        setError(result.message || 'Failed to fetch manager metrics');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch manager metrics');

    } , []);

  // Permission management
  const checkUserPermission = useCallback(async (projectId: string, permission: ProjectPermission): Promise<boolean> => {
    try {
      setError(null);

      const result = await projectsManagerService.checkUserPermission(projectId, permission);

      if (result.success) {
        return result.data.hasPermission;
      } else {
        setError(result.message || 'Failed to check user permission');

        return false;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check user permission');

      return false;
    } , []);

  const getUserPermissions = useCallback(async (projectId: string): Promise<ProjectPermission[]> => {
    try {
      setError(null);

      const result = await projectsManagerService.getUserPermissions(projectId);

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to fetch user permissions');

        return [];
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user permissions');

      return [];
    } , []);

  // Bulk operations
  const bulkUpdateMemberRoles = useCallback(async (projectId: string, updates: Array<{
    memberId: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
  }>): Promise<boolean> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.bulkUpdateMemberRoles(projectId, updates);

      if (result.success) {
        // Refresh members to get updated data
        await getProjectMembers(projectId);

        return true;
      } else {
        setError(result.message || 'Failed to bulk update member roles');

        return false;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update member roles');

      return false;
    } finally {
      setLoading(false);

    } , [getProjectMembers]);

  const bulkRemoveMembers = useCallback(async (projectId: string, memberIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);

      setError(null);

      const result = await projectsManagerService.bulkRemoveMembers(projectId, memberIds);

      if (result.success) {
        setMembers(prev => prev.filter(m => !memberIds.includes(m.id)));

        return true;
      } else {
        setError(result.message || 'Failed to bulk remove members');

        return false;
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk remove members');

      return false;
    } finally {
      setLoading(false);

    } , []);

  // Auto-fetch metrics on mount
  useEffect(() => {
    getManagerMetrics();

  }, [getManagerMetrics]);

  return {
    // State
    projects,
    currentProject,
    members,
    invitations,
    metrics,
    loading,
    error,

    // Project management
    fetchManagedProjects,
    fetchProjectManager,
    updateProjectMode,
    updateProjectModules,

    // Member management
    getProjectMembers,
    addProjectMember,
    updateProjectMember,
    removeProjectMember,

    // Invitation management
    sendProjectInvitation,
    getProjectInvitations,
    cancelProjectInvitation,
    resendProjectInvitation,

    // Settings management
    getProjectSettings,
    updateProjectSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateIntegrationSettings,
    updateAutomationSettings,

    // Statistics and metrics
    getProjectStatistics,
    getManagerMetrics,

    // Permission management
    checkUserPermission,
    getUserPermissions,

    // Bulk operations
    bulkUpdateMemberRoles,
    bulkRemoveMembers,

    // Utilities
    clearError,
    setCurrentProject};
};

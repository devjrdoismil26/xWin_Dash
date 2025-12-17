import { useState, useCallback } from 'react';
import { ProjectMember, ProjectRole, ProjectPermission } from '../../ProjectsManager/types/projectsManagerTypes';
import projectsManagerService from '../../ProjectsManager/services/projectsManagerService';

export const useProjectMembers = () => {
  const [members, setMembers] = useState<ProjectMember[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getProjectMembers = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const data = await projectsManagerService.getProjectMembers(projectId);

      setMembers(data);

      return data;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar membros');

      return [];
    } finally {
      setLoading(false);

    } , []);

  const addProjectMember = useCallback(async (
    projectId: string,
    memberData: { userId: string; role: ProjectRole; permissions: ProjectPermission[] }
  ) => {
    setLoading(true);

    setError(null);

    try {
      const member = await projectsManagerService.addProjectMember(projectId, memberData);

      setMembers(prev => [...prev, member]);

      return member;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao adicionar membro');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateProjectMember = useCallback(async (
    projectId: string,
    memberId: string,
    memberData: { role?: ProjectRole; permissions?: ProjectPermission[]; status?: 'active' | 'inactive' }
  ) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updateProjectMember(projectId, memberId, memberData);

      setMembers(prev => prev.map(m => m.id === memberId ? updated : m));

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar membro');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const removeProjectMember = useCallback(async (projectId: string, memberId: string) => {
    setLoading(true);

    setError(null);

    try {
      await projectsManagerService.removeProjectMember(projectId, memberId);

      setMembers(prev => prev.filter(m => m.id !== memberId));

      return true;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao remover membro');

      return false;
    } finally {
      setLoading(false);

    } , []);

  const bulkUpdateMemberRoles = useCallback(async (
    projectId: string,
    updates: Array<{ memberId: string; role: ProjectRole; permissions: ProjectPermission[]  }>
  ) => {
    setLoading(true);

    setError(null);

    try {
      await projectsManagerService.bulkUpdateMemberRoles(projectId, updates);

      await getProjectMembers(projectId);

      return true;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar membros');

      return false;
    } finally {
      setLoading(false);

    } , [getProjectMembers]);

  const bulkRemoveMembers = useCallback(async (projectId: string, memberIds: string[]) => {
    setLoading(true);

    setError(null);

    try {
      await projectsManagerService.bulkRemoveMembers(projectId, memberIds);

      setMembers(prev => prev.filter(m => !memberIds.includes(m.id)));

      return true;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao remover membros');

      return false;
    } finally {
      setLoading(false);

    } , []);

  return {
    members,
    loading,
    error,
    getProjectMembers,
    addProjectMember,
    updateProjectMember,
    removeProjectMember,
    bulkUpdateMemberRoles,
    bulkRemoveMembers};
};

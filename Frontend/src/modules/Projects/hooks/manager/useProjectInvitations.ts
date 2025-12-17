import { useState, useCallback } from 'react';
import { ProjectInvitation, ProjectRole, ProjectPermission } from '../../ProjectsManager/types/projectsManagerTypes';
import projectsManagerService from '../../ProjectsManager/services/projectsManagerService';

export const useProjectInvitations = () => {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getProjectInvitations = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const data = await projectsManagerService.getProjectInvitations(projectId);

      setInvitations(data);

      return data;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar convites');

      return [];
    } finally {
      setLoading(false);

    } , []);

  const sendProjectInvitation = useCallback(async (
    projectId: string,
    invitationData: { email: string; role: ProjectRole; permissions: ProjectPermission[]; message?: string }
  ) => {
    setLoading(true);

    setError(null);

    try {
      const invitation = await projectsManagerService.sendProjectInvitation(projectId, invitationData);

      setInvitations(prev => [...prev, invitation]);

      return invitation;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao enviar convite');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const cancelProjectInvitation = useCallback(async (projectId: string, invitationId: string) => {
    setLoading(true);

    setError(null);

    try {
      await projectsManagerService.cancelProjectInvitation(projectId, invitationId);

      setInvitations(prev => prev.filter(i => i.id !== invitationId));

      return true;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao cancelar convite');

      return false;
    } finally {
      setLoading(false);

    } , []);

  const resendProjectInvitation = useCallback(async (projectId: string, invitationId: string) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.resendProjectInvitation(projectId, invitationId);

      setInvitations(prev => prev.map(i => i.id === invitationId ? updated : i));

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao reenviar convite');

      return null;
    } finally {
      setLoading(false);

    } , []);

  return {
    invitations,
    loading,
    error,
    getProjectInvitations,
    sendProjectInvitation,
    cancelProjectInvitation,
    resendProjectInvitation};
};

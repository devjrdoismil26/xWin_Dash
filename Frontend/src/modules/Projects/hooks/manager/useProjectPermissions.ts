import { useState, useCallback } from 'react';
import { ProjectPermission, ProjectManagerMetrics } from '../../ProjectsManager/types/projectsManagerTypes';
import projectsManagerService from '../../ProjectsManager/services/projectsManagerService';

export const useProjectPermissions = () => {
  const [metrics, setMetrics] = useState<ProjectManagerMetrics | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const checkUserPermission = useCallback(async (projectId: string, permission: ProjectPermission) => {
    setLoading(true);

    setError(null);

    try {
      return await projectsManagerService.checkUserPermission(projectId, permission);

    } catch (err: unknown) {
      setError(err.message || 'Erro ao verificar permissão');

      return false;
    } finally {
      setLoading(false);

    } , []);

  const getUserPermissions = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      return await projectsManagerService.getUserPermissions(projectId);

    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar permissões');

      return [];
    } finally {
      setLoading(false);

    } , []);

  const getProjectStatistics = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      return await projectsManagerService.getProjectStatistics(projectId);

    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar estatísticas');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const getManagerMetrics = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const data = await projectsManagerService.getManagerMetrics();

      setMetrics(data);

    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar métricas');

    } finally {
      setLoading(false);

    } , []);

  return {
    metrics,
    loading,
    error,
    checkUserPermission,
    getUserPermissions,
    getProjectStatistics,
    getManagerMetrics};
};

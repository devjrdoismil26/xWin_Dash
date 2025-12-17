import { useState, useCallback } from 'react';
import { ProjectSettings } from '../../ProjectsManager/types/projectsManagerTypes';
import projectsManagerService from '../../ProjectsManager/services/projectsManagerService';

export const useProjectSettings = () => {
  const [settings, setSettings] = useState<ProjectSettings | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getProjectSettings = useCallback(async (projectId: string) => {
    setLoading(true);

    setError(null);

    try {
      const data = await projectsManagerService.getProjectSettings(projectId);

      setSettings(data);

      return data;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar configurações');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateProjectSettings = useCallback(async (projectId: string, updates: Partial<ProjectSettings>) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updateProjectSettings(projectId, updates);

      setSettings(updated);

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar configurações');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateNotificationSettings = useCallback(async (
    projectId: string,
    notificationSettings: Partial<ProjectSettings['notifications'] />
  ) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updateNotificationSettings(projectId, notificationSettings);

      setSettings(updated);

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar notificações');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updatePrivacySettings = useCallback(async (
    projectId: string,
    privacySettings: Partial<ProjectSettings['privacy'] />
  ) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updatePrivacySettings(projectId, privacySettings);

      setSettings(updated);

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar privacidade');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateIntegrationSettings = useCallback(async (
    projectId: string,
    integrationSettings: Partial<ProjectSettings['integrations'] />
  ) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updateIntegrationSettings(projectId, integrationSettings);

      setSettings(updated);

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar integrações');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateAutomationSettings = useCallback(async (
    projectId: string,
    automationSettings: Partial<ProjectSettings['automation'] />
  ) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updateAutomationSettings(projectId, automationSettings);

      setSettings(updated);

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar automação');

      return null;
    } finally {
      setLoading(false);

    } , []);

  return {
    settings,
    loading,
    error,
    getProjectSettings,
    updateProjectSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateIntegrationSettings,
    updateAutomationSettings};
};

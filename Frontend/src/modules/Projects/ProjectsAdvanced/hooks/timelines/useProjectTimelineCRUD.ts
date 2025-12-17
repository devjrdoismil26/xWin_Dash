// ========================================
// HOOK CRUD DE TIMELINES DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectTimeline } from '@/types/projectsAdvancedTypes';

export const useProjectTimelineCRUD = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createTimeline = useCallback(async (timelineData: Partial<ProjectTimeline>): Promise<ProjectTimeline | null> => {
    try {
      setLoading(true);

      setError(null);

      const newTimeline: ProjectTimeline = {
        id: Date.now().toString(),
        projectId: timelineData.projectId || '',
        name: timelineData.name || 'New Timeline',
        description: timelineData.description || '',
        startDate: timelineData.startDate || new Date().toISOString(),
        endDate: timelineData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        phases: timelineData.phases || [],
        dependencies: timelineData.dependencies || [],
        criticalPath: timelineData.criticalPath || [],
        bufferTime: timelineData.bufferTime || 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()};

      return newTimeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create timeline');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const readTimeline = useCallback(async (timelineId: string): Promise<ProjectTimeline | null> => {
    try {
      setLoading(true);

      setError(null);

      const timeline: ProjectTimeline = {
        id: timelineId,
        projectId: 'project1',
        name: 'Sample Timeline',
        description: 'A sample project timeline',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        phases: [],
        dependencies: [],
        criticalPath: [],
        bufferTime: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()};

      return timeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read timeline');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateTimeline = useCallback(async (timelineId: string, timelineData: Partial<ProjectTimeline>): Promise<ProjectTimeline | null> => {
    try {
      setLoading(true);

      setError(null);

      const updatedTimeline: ProjectTimeline = {
        id: timelineId,
        projectId: timelineData.projectId || '',
        name: timelineData.name || 'Updated Timeline',
        description: timelineData.description || '',
        startDate: timelineData.startDate || new Date().toISOString(),
        endDate: timelineData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        phases: timelineData.phases || [],
        dependencies: timelineData.dependencies || [],
        criticalPath: timelineData.criticalPath || [],
        bufferTime: timelineData.bufferTime || 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()};

      return updatedTimeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update timeline');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const deleteTimeline = useCallback(async (timelineId: string): Promise<boolean> => {
    try {
      setLoading(true);

      setError(null);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete timeline');

      return false;
    } finally {
      setLoading(false);

    } , []);

  return {
    loading,
    error,
    createTimeline,
    readTimeline,
    updateTimeline,
    deleteTimeline};
};

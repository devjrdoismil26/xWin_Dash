import { useState, useCallback } from 'react';
import { validatedApiClient } from '@/services';
import { ProjectSchema, ProjectTaskSchema, type Project, type ProjectTask } from '@/schemas';
import { z } from 'zod';

export function useProjectsValidated() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await validatedApiClient.get('/projects', z.array(ProjectSchema));

      setProjects(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const getProject = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      return await validatedApiClient.get(`/projects/${id}`, ProjectSchema);

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const createProject = useCallback(async (data: Partial<Project>) => {
    try {
      setLoading(true);

      const newProject = await validatedApiClient.post('/projects', ProjectSchema, data);

      setProjects(prev => [...prev, newProject]);

      return newProject;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const updateProject = useCallback(async (id: string | number, data: Partial<Project>) => {
    try {
      setLoading(true);

      const updated = await validatedApiClient.put(`/projects/${id}`, ProjectSchema, data);

      setProjects(prev => prev.map(p => p.id === id ? updated : p));

      return updated;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const deleteProject = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      await validatedApiClient.delete(`/projects/${id}`);

      setProjects(prev => prev.filter(p => p.id !== id));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const getProjectTasks = useCallback(async (projectId: string | number) => {
    try {
      setLoading(true);

      return await validatedApiClient.get(`/projects/${projectId}/tasks`, z.array(ProjectTaskSchema));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectTasks};

}

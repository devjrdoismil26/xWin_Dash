import { useState, useCallback } from 'react';
import { validatedApiClient } from '@/services';
import { WorkflowSchema, type Workflow } from '@/schemas';
import { z } from 'zod';

export function useWorkflowsValidated() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await validatedApiClient.get('/workflows', z.array(WorkflowSchema));

      setWorkflows(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const getWorkflow = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      return await validatedApiClient.get(`/workflows/${id}`, WorkflowSchema);

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const createWorkflow = useCallback(async (data: Partial<Workflow>) => {
    try {
      setLoading(true);

      const newWorkflow = await validatedApiClient.post('/workflows', WorkflowSchema, data);

      setWorkflows(prev => [...prev, newWorkflow]);

      return newWorkflow;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const updateWorkflow = useCallback(async (id: string | number, data: Partial<Workflow>) => {
    try {
      setLoading(true);

      const updated = await validatedApiClient.put(`/workflows/${id}`, WorkflowSchema, data);

      setWorkflows(prev => prev.map(w => w.id === id ? updated : w));

      return updated;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const deleteWorkflow = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      await validatedApiClient.delete(`/workflows/${id}`);

      setWorkflows(prev => prev.filter(w => w.id !== id));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const executeWorkflow = useCallback(async (id: string | number, input?: string) => {
    try {
      setLoading(true);

      return await validatedApiClient.post(`/workflows/${id}/execute`, z.any(), input);

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    getWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow};

}

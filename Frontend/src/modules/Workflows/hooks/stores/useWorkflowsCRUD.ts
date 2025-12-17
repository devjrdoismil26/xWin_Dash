import { useState, useCallback } from 'react';

export const useWorkflowsCRUD = () => {
  const [workflows, setWorkflows] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);

    try {
      // API call
    } finally {
      setLoading(false);

    } , []);

  const createWorkflow = useCallback(async (data: unknown) => {
    // API call
    return null;
  }, []);

  const updateWorkflow = useCallback(async (id: string, data: unknown) => {
    // API call
    return null;
  }, []);

  const deleteWorkflow = useCallback(async (id: string) => {
    // API call
    return true;
  }, []);

  return { workflows, loading, fetchWorkflows, createWorkflow, updateWorkflow, deleteWorkflow};
};

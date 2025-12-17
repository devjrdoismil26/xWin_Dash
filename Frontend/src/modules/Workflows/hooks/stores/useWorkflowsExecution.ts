import { useState, useCallback } from 'react';

export const useWorkflowsExecution = () => {
  const [executing, setExecuting] = useState(false);

  const executeWorkflow = useCallback(async (id: string, data?: string) => {
    setExecuting(true);

    try {
      // API call
      return null;
    } finally {
      setExecuting(false);

    } , []);

  return { executing, executeWorkflow};
};

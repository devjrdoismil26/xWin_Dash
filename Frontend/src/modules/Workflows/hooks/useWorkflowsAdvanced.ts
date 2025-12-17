import { useState, useEffect, useCallback } from 'react';
import { workflowService } from '../services/workflowService';
import { WorkflowExecutionQueue, WorkflowExecutionQueueStats, WorkflowExecutionQueueFilter, WorkflowExecutionQueueSort, WorkflowExecutionQueuePagination, WorkflowExecutionQueueResponse, WorkflowQueueProcessResult, WorkflowQueueRetryResult, WorkflowQueueClearResult, WorkflowQueueStatus, WorkflowExecutionPriority, UseWorkflowExecutionQueueReturn, UseWorkflowQueueStatusReturn, UseWorkflowQueueManagementReturn } from '../types/workflowTypes';

// ===== EXECUTION QUEUE HOOKS =====
export const useWorkflowExecutionQueue = (): UseWorkflowExecutionQueueReturn => {
  const [queue, setQueue] = useState<WorkflowExecutionQueue[]>([]);

  const [stats, setStats] = useState<WorkflowExecutionQueueStats>({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    retrying: 0,
    averageProcessingTime: 0,
    averageWaitTime: 0,
    throughput: 0,
    errorRate: 0
  });

  const [pagination, setPagination] = useState<WorkflowExecutionQueuePagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<WorkflowExecutionQueueFilter>({});

  const [sort, setSort] = useState<WorkflowExecutionQueueSort>({
    field: 'scheduledAt',
    direction: 'desc'
  });

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sort};

      const response = await workflowService.getExecutionQueue(params);

      if (response.success) {
        const data = (response as any).data as WorkflowExecutionQueueResponse;
        setQueue(data.items);

        setStats(data.stats);

        setPagination(data.pagination);

      } else {
        setError(response.error || 'Failed to fetch execution queue');

      } catch (err) {
      setError('Failed to fetch execution queue');

    } finally {
      setLoading(false);

    } , [pagination.page, pagination.limit, filters, sort]);

  const processQueue = useCallback(async () => {
    try {
      setLoading(true);

      const response = await workflowService.processExecutionQueue();

      if (response.success) {
        await fetchQueue();

      } else {
        setError(response.error || 'Failed to process queue');

      } catch (err) {
      setError('Failed to process queue');

    } finally {
      setLoading(false);

    } , [fetchQueue]);

  const retryFailed = useCallback(async () => {
    try {
      setLoading(true);

      const response = await workflowService.retryFailedExecutions();

      if (response.success) {
        await fetchQueue();

      } else {
        setError(response.error || 'Failed to retry failed executions');

      } catch (err) {
      setError('Failed to retry failed executions');

    } finally {
      setLoading(false);

    } , [fetchQueue]);

  const retryAll = useCallback(async () => {
    try {
      setLoading(true);

      const response = await workflowService.retryAllExecutions();

      if (response.success) {
        await fetchQueue();

      } else {
        setError(response.error || 'Failed to retry all executions');

      } catch (err) {
      setError('Failed to retry all executions');

    } finally {
      setLoading(false);

    } , [fetchQueue]);

  const clearQueue = useCallback(async () => {
    try {
      setLoading(true);

      const response = await workflowService.clearExecutionQueue();

      if (response.success) {
        await fetchQueue();

      } else {
        setError(response.error || 'Failed to clear queue');

      } catch (err) {
      setError('Failed to clear queue');

    } finally {
      setLoading(false);

    } , [fetchQueue]);

  const cancelExecution = useCallback(async (id: string) => {
    try {
      setLoading(true);

      const response = await workflowService.cancelExecutionQueueItem(id);

      if (response.success) {
        await fetchQueue();

      } else {
        setError(response.error || 'Failed to cancel execution');

      } catch (err) {
      setError('Failed to cancel execution');

    } finally {
      setLoading(false);

    } , [fetchQueue]);

  const retryExecution = useCallback(async (id: string) => {
    try {
      setLoading(true);

      const response = await workflowService.retryExecutionQueueItem(id);

      if (response.success) {
        await fetchQueue();

      } else {
        setError(response.error || 'Failed to retry execution');

      } catch (err) {
      setError('Failed to retry execution');

    } finally {
      setLoading(false);

    } , [fetchQueue]);

  const refresh = useCallback(async () => {
    await fetchQueue();

  }, [fetchQueue]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));

  }, []);

  useEffect(() => {
    fetchQueue();

  }, [fetchQueue]);

  return {
    queue,
    stats,
    pagination,
    loading,
    error,
    filters,
    sort,
    setFilters,
    setSort,
    setPage,
    refresh,
    processQueue,
    retryFailed,
    retryAll,
    clearQueue,
    cancelExecution,
    retryExecution};
};

export const useWorkflowQueueStatus = (): UseWorkflowQueueStatusReturn => {
  const [status, setStatus] = useState<WorkflowQueueStatus | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);

      const response = await workflowService.getExecutionQueueStatus();

      if (response.success) {
        setStatus(response.data as WorkflowQueueStatus);

      } else {
        setError(response.error || 'Failed to fetch queue status');

      } catch (err) {
      setError('Failed to fetch queue status');

    } finally {
      setLoading(false);

    } , []);

  const startProcessing = useCallback(async () => {
    try {
      setLoading(true);

      const response = await workflowService.resumeExecutionQueue();

      if (response.success) {
        await fetchStatus();

      } else {
        setError(response.error || 'Failed to start processing');

      } catch (err) {
      setError('Failed to start processing');

    } finally {
      setLoading(false);

    } , [fetchStatus]);

  const stopProcessing = useCallback(async () => {
    try {
      setLoading(true);

      const response = await workflowService.pauseExecutionQueue();

      if (response.success) {
        await fetchStatus();

      } else {
        setError(response.error || 'Failed to stop processing');

      } catch (err) {
      setError('Failed to stop processing');

    } finally {
      setLoading(false);

    } , [fetchStatus]);

  const refresh = useCallback(async () => {
    await fetchStatus();

  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus();

  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refresh,
    startProcessing,
    stopProcessing};
};

export const useWorkflowQueueManagement = (): UseWorkflowQueueManagementReturn => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const processQueue = useCallback(async (): Promise<WorkflowQueueProcessResult> => {
    try {
      setLoading(true);

      const response = await workflowService.processExecutionQueue();

      if (response.success) {
        return (response as any).data as WorkflowQueueProcessResult;
      } else {
        setError(response.error || 'Failed to process queue');

        throw new Error(response.error || 'Failed to process queue');

      } catch (err) {
      setError('Failed to process queue');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const retryFailed = useCallback(async (): Promise<WorkflowQueueRetryResult> => {
    try {
      setLoading(true);

      const response = await workflowService.retryFailedExecutions();

      if (response.success) {
        return (response as any).data as WorkflowQueueRetryResult;
      } else {
        setError(response.error || 'Failed to retry failed executions');

        throw new Error(response.error || 'Failed to retry failed executions');

      } catch (err) {
      setError('Failed to retry failed executions');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const retryAll = useCallback(async (): Promise<WorkflowQueueRetryResult> => {
    try {
      setLoading(true);

      const response = await workflowService.retryAllExecutions();

      if (response.success) {
        return (response as any).data as WorkflowQueueRetryResult;
      } else {
        setError(response.error || 'Failed to retry all executions');

        throw new Error(response.error || 'Failed to retry all executions');

      } catch (err) {
      setError('Failed to retry all executions');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const clearQueue = useCallback(async (): Promise<WorkflowQueueClearResult> => {
    try {
      setLoading(true);

      const response = await workflowService.clearExecutionQueue();

      if (response.success) {
        return (response as any).data as WorkflowQueueClearResult;
      } else {
        setError(response.error || 'Failed to clear queue');

        throw new Error(response.error || 'Failed to clear queue');

      } catch (err) {
      setError('Failed to clear queue');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const cancelExecution = useCallback(async (id: string) => {
    try {
      setLoading(true);

      const response = await workflowService.cancelExecutionQueueItem(id);

      if (!response.success) {
        setError(response.error || 'Failed to cancel execution');

        throw new Error(response.error || 'Failed to cancel execution');

      } catch (err) {
      setError('Failed to cancel execution');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const retryExecution = useCallback(async (id: string) => {
    try {
      setLoading(true);

      const response = await workflowService.retryExecutionQueueItem(id);

      if (!response.success) {
        setError(response.error || 'Failed to retry execution');

        throw new Error(response.error || 'Failed to retry execution');

      } catch (err) {
      setError('Failed to retry execution');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const updateExecutionPriority = useCallback(async (id: string, priority: WorkflowExecutionPriority) => {
    try {
      setLoading(true);

      const response = await workflowService.updateExecutionPriority(id, priority);

      if (!response.success) {
        setError(response.error || 'Failed to update execution priority');

        throw new Error(response.error || 'Failed to update execution priority');

      } catch (err) {
      setError('Failed to update execution priority');

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    loading,
    error,
    processQueue,
    retryFailed,
    retryAll,
    clearQueue,
    cancelExecution,
    retryExecution,
    updateExecutionPriority};
};

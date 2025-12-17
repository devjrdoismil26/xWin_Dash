import { useState, useEffect, useCallback } from 'react';
import activityService from '../services/activityService';

export const useActivityRefactored = () => {
  const [logs, setLogs] = useState<unknown[]>([]);

  const [metrics, setMetrics] = useState({
    total_logs: 0,
    today_logs: 0,
    active_users: 0,
    error_logs: 0,
  });

  const [analytics, setAnalytics] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<any>({});

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 15,
    total: 0,
  });

  const fetchLogs = useCallback(async (customFilters?: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await activityService.getLogs(customFilters || filters);

      if (response.success && (response as any).data) {
        setLogs(Array.isArray(response.data) ? (response as any).data : [response.data]);

      } catch (err: unknown) {
      setError(err.message);

    } finally {
      setLoading(false);

    } , [filters]);

  const getLog = useCallback(async (id: string) => {
    setLoading(true);

    try {
      const response = await activityService.getLogById(id);

      return (response as any).success ? (response as any).data : null;
    } catch (err: unknown) {
      setError(err.message);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await activityService.getLogStats();

      if (response.success && (response as any).data) {
        setMetrics(response.data as any);

      } catch (err: unknown) {
      console.error('Error fetching metrics:', err);

    } , []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await activityService.getActivityStats();

      if (response.success) {
        setAnalytics(response.data);

      } catch (err: unknown) {
      console.error('Error fetching analytics:', err);

    } , []);

  const exportLogs = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    try {
      const response = await activityService.exportLogs(filters, format);

      return (response as any).success;
    } catch (err: unknown) {
      setError(err.message);

      return false;
    } , [filters]);

  const clearOldLogs = useCallback(async (days: number = 30) => {
    try {
      const response = await activityService.clearOldLogs(days);

      if (response.success) {
        await fetchLogs();

        await fetchMetrics();

      }
      return (response as any).success;
    } catch (err: unknown) {
      setError(err.message);

      return false;
    } , [fetchLogs, fetchMetrics]);

  const refreshLogs = useCallback(() => {
    fetchLogs();

    fetchMetrics();

  }, [fetchLogs, fetchMetrics]);

  useEffect(() => {
    fetchLogs();

    fetchMetrics();

  }, []);

  return {
    logs,
    metrics,
    analytics,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    fetchLogs,
    getLog,
    fetchMetrics,
    fetchAnalytics,
    exportLogs,
    clearOldLogs,
    refreshLogs,};
};

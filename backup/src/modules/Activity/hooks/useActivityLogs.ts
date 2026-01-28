import { useState, useCallback, useEffect } from 'react';
import { 
  ActivityLog, 
  ActivityLogFilters, 
  ActivityLogStats, 
  ActivityLogResponse 
} from '../types';

export const useActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });

  const fetchLogs = useCallback(async (filters: ActivityLogFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.log_name) params.append('log_name', filters.log_name);
      if (filters.causer_type) params.append('causer_type', filters.causer_type);
      if (filters.subject_type) params.append('subject_type', filters.subject_type);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
      if (filters.page) params.append('page', filters.page.toString());

      const response = await fetch(`/api/activity-logs?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ActivityLogResponse = await response.json();
      setLogs(result.data);
      setPagination(result.meta);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar logs de atividade';
      setError(errorMessage);
      console.error('Error fetching activity logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogById = useCallback(async (id: string): Promise<ActivityLog | null> => {
    try {
      const response = await fetch(`/api/activity-logs/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Error fetching activity log:', err);
      return null;
    }
  }, []);

  const getLogStats = useCallback(async (): Promise<ActivityLogStats | null> => {
    try {
      const response = await fetch('/api/activity-logs/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Error fetching activity stats:', err);
      return null;
    }
  }, []);

  const exportLogs = useCallback(async (filters: ActivityLogFilters = {}, format: 'csv' | 'json' = 'csv') => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.log_name) params.append('log_name', filters.log_name);
      if (filters.causer_type) params.append('causer_type', filters.causer_type);
      if (filters.subject_type) params.append('subject_type', filters.subject_type);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      params.append('format', format);

      const response = await fetch(`/api/activity-logs/export?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': format === 'csv' ? 'text/csv' : 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (err) {
      console.error('Error exporting activity logs:', err);
      return false;
    }
  }, []);

  const clearOldLogs = useCallback(async (daysToKeep: number = 30): Promise<boolean> => {
    try {
      const response = await fetch('/api/activity-logs/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ days_to_keep: daysToKeep }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh logs after clearing
      await fetchLogs();
      return true;
    } catch (err) {
      console.error('Error clearing old logs:', err);
      return false;
    }
  }, [fetchLogs]);

  // Helper functions
  const getLogType = useCallback((logName: string): string => {
    const typeMap: Record<string, string> = {
      'login': 'login',
      'logout': 'logout',
      'user.created': 'create',
      'user.updated': 'update',
      'user.deleted': 'delete',
      'email.sent': 'email',
      'security.alert': 'security',
      'settings.updated': 'settings',
      'api.request': 'api',
      'error.occurred': 'error',
    };
    
    return typeMap[logName] || 'activity';
  }, []);

  const getLogIcon = useCallback((logName: string): string => {
    const iconMap: Record<string, string> = {
      'login': 'User',
      'logout': 'User',
      'user.created': 'UserPlus',
      'user.updated': 'UserEdit',
      'user.deleted': 'UserMinus',
      'email.sent': 'Mail',
      'security.alert': 'Shield',
      'settings.updated': 'Settings',
      'api.request': 'Globe',
      'error.occurred': 'AlertTriangle',
    };
    
    return iconMap[logName] || 'Activity';
  }, []);

  const getLogColor = useCallback((logName: string): string => {
    const colorMap: Record<string, string> = {
      'login': 'success',
      'logout': 'secondary',
      'user.created': 'success',
      'user.updated': 'warning',
      'user.deleted': 'destructive',
      'email.sent': 'info',
      'security.alert': 'warning',
      'settings.updated': 'secondary',
      'api.request': 'info',
      'error.occurred': 'destructive',
    };
    
    return colorMap[logName] || 'secondary';
  }, []);

  const formatLogDescription = useCallback((log: ActivityLog): string => {
    if (log.description) {
      return log.description;
    }

    // Generate description from log_name and properties
    const type = getLogType(log.log_name);
    const subject = log.subject_type ? log.subject_type.replace('App\\Models\\', '') : 'item';
    
    switch (type) {
      case 'create':
        return `${subject} criado`;
      case 'update':
        return `${subject} atualizado`;
      case 'delete':
        return `${subject} excluído`;
      case 'login':
        return 'Usuário fez login';
      case 'logout':
        return 'Usuário fez logout';
      default:
        return log.log_name.replace(/\./g, ' ');
    }
  }, [getLogType]);

  return {
    // State
    logs,
    loading,
    error,
    pagination,
    
    // Actions
    fetchLogs,
    fetchLogById,
    getLogStats,
    exportLogs,
    clearOldLogs,
    
    // Helpers
    getLogType,
    getLogIcon,
    getLogColor,
    formatLogDescription,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';

export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read_at?: string;
  created_at: string;
  updated_at: string;
  action_url?: string;
  action_text?: string; }

export interface NotificationFilters {
  type?: string;
  read?: boolean;
  page?: number;
  per_page?: number; }

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<Record<string, any> | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async (filters: NotificationFilters = {}) => {
    try {
      setLoading(true);

      setError(null);

      const params = new URLSearchParams();

      if (filters.type) params.append('type', filters.type);

      if (filters.read !== undefined) params.append('read', filters.read.toString());

      if (filters.page) params.append('page', filters.page.toString());

      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const data = await apiClient.get<{ data: Notification[]; meta: Record<string, any> }>(`/api/v1/users/notifications`, { params: Object.fromEntries(params) });

      setNotifications(data.data || []);

      setPagination(data.meta || null);

    } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  // Fetch unread notifications count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await apiClient.get<{ count: number }>('/api/v1/users/notifications/unread');

      setUnreadCount(data.count || 0);

    } catch (err: unknown) {
    } , []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.patch(`/api/v1/users/notifications/${id}/mark-as-read`);

      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ));

      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.post('/api/v1/users/notifications/mark-all-as-read');

      setNotifications(prev => prev.map(n => ({ 
        ...n, 
        read_at: n.read_at || new Date().toISOString()
  })));

      setUnreadCount(0);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Delete notification
  const deleteNotification = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.delete(`/api/v1/users/notifications/${id}`);

      const notification = notifications.find(n => n.id === id);

      setNotifications(prev => prev.filter(n => n.id !== id));

      // Decrease unread count if notification was unread
      if (notification && !notification.read_at) {
        setUnreadCount(prev => Math.max(0, prev - 1));

      } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , [notifications]);

  // Delete all notifications
  const deleteAllNotifications = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.post('/api/v1/users/notifications/delete-all');

      setNotifications([]);

      setUnreadCount(0);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Get notification by ID
  const getNotification = useCallback(async (id: number): Promise<Notification> => {
    try {
      setLoading(true);

      setError(null);

      const notification = await apiClient.get<Notification>(`/api/v1/users/notifications/${id}`);

      return notification;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Create notification (for testing/admin purposes)
  const createNotification = useCallback(async (data: {
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    action_url?: string;
    action_text?: string;
  }): Promise<Notification> => {
    try {
      setLoading(true);

      setError(null);

      const newNotification = await apiClient.post<Notification>('/api/v1/users/notifications', data);

      setNotifications(prev => [newNotification, ...prev]);

      setUnreadCount(prev => prev + 1);

      return newNotification;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Initialize notifications on mount
  useEffect(() => {
    fetchNotifications();

    fetchUnreadCount();

  }, [fetchNotifications, fetchUnreadCount]);

  // Set up real-time updates (if using WebSockets)
  useEffect(() => {
    // This would be implemented with WebSocket connection
    // For now, we'll just refresh periodically
    const interval = setInterval(() => {
      fetchUnreadCount();

    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);

  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    getNotification,
    createNotification,};
};

export default useNotifications;

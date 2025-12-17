import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Eye } from 'lucide-react';
import type { NotificationItem, NotificationSettings, NotificationContextType, AdvancedNotificationProviderProps } from './types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const AdvancedNotificationProvider: React.FC<AdvancedNotificationProviderProps> = ({ children    }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    categories: {
      system: true,
      social: true,
      marketing: true,
      sales: true,
      security: true
    },
    quiet: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    filters: {
      priority: ['low', 'medium', 'high', 'urgent'],
      types: ['success', 'error', 'warning', 'info', 'system', 'social', 'marketing', 'sales'],
      sources: []
    } );

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useMemo(() => 
    (notifications || []).filter(n => !n.read && !n.archived).length
  , [notifications]);

  const addNotification = useCallback((notificationData: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const notification: NotificationItem = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false};

    setNotifications(prev => [notification, ...prev]);

    if (settings.enabled && settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });

    }

    if (notification.autoRemove && notification.duration) {
      setTimeout(() => removeNotification(notification.id), notification.duration);

    } , [settings]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => (prev || []).filter(n => n.id !== id));

  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => (prev || []).map(n => 
      n.id === id ? { ...n, read: true } : n
    ));

  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => (prev || []).map(n => ({ ...n, read: true })));

  }, []);

  const togglePin = useCallback((id: string) => {
    setNotifications(prev => (prev || []).map(n => 
      n.id === id ? { ...n, pinned: !n.pinned } : n
    ));

  }, []);

  const toggleStar = useCallback((id: string) => {
    setNotifications(prev => (prev || []).map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ));

  }, []);

  const archiveNotification = useCallback((id: string) => {
    setNotifications(prev => (prev || []).map(n => 
      n.id === id ? { ...n, archived: !n.archived } : n
    ));

  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

  }, []);

  const openCenter = useCallback(() => setIsOpen(true), []);

  const closeCenter = useCallback(() => setIsOpen(false), []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const clearRead = useCallback(() => {
    setNotifications(prev => (prev || []).filter(n => !n.read));

  }, []);

  const value: NotificationContextType = {
    notifications,
    settings,
    unreadCount,
    isOpen,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    togglePin,
    toggleStar,
    archiveNotification,
    updateSettings,
    openCenter,
    closeCenter,
    clearAll,
    clearRead};

  return (
            <NotificationContext.Provider value={ value } />
      {children}
    </NotificationContext.Provider>);};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications deve ser usado dentro do AdvancedNotificationProvider');

  }
  return context;};

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (n) => setNotifications((prev) => [{ id: crypto.randomUUID(), read: false, date: new Date(), ...n }, ...prev]);
  const markAsRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const removeNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => setNotifications([]);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  useEffect(() => {
    const echo = window.Echo;
    if (!echo) return undefined;
    const channel = echo.channel('notifications');
    const handler = (data) => addNotification({ type: 'info', title: data.title, message: data.message });
    channel.listen('GenericNotification', handler);
    return () => {
      try {
        channel.stopListening('GenericNotification', handler);
      } catch (err) {
        // ensure cleanup regardless of Echo state
        void err;
      }
    };
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const NotificationListener = () => null;

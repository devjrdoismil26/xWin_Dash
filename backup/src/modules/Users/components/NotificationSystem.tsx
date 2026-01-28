import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
// Tipos para o sistema de notificações
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';
export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  actions?: NotificationAction[];
  read?: boolean;
  timestamp: Date;
}
export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}
const DEFAULT_POSITION: NotificationPosition = 'top-right';
// Ícones para cada tipo de notificação
const NOTIFICATION_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};
// Cores para cada tipo de notificação
const NOTIFICATION_STYLES = {
  success: {
    container: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300'
  },
  error: {
    container: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300'
  },
  info: {
    container: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300'
  }
};
// Context para notificações
const NotificationContext = createContext<NotificationContextType | null>(null);
// Provider do contexto de notificações
export const NotificationProvider: React.FC<{
  children: React.ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
}> = ({ children, position = DEFAULT_POSITION, maxNotifications = 5 }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? 5000,
      read: false
    };
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });
    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    return id;
  }, [maxNotifications]);
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  const contextValue = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll
  }), [notifications, addNotification, removeNotification, markAsRead, clearAll]);
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer position={position} />
    </NotificationContext.Provider>
  );
};
// Componente individual de notificação
const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onRemove, onMarkAsRead }) => {
  const IconComponent = NOTIFICATION_ICONS[notification.type];
  const styles = NOTIFICATION_STYLES[notification.type];
  return (
    <div className={cn(
      'relative p-4 border rounded-lg shadow-lg transition-all duration-300 ease-in-out',
      styles.container,
      notification.read ? 'opacity-75' : ''
    )}>
      <div className="flex items-start space-x-3">
        <div className={cn('flex-shrink-0', styles.icon)}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={cn('text-sm font-medium', styles.title)}>
              {notification.title}
            </h4>
            <div className="flex items-center space-x-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Marcar como lida"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onRemove(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {notification.message && (
            <p className={cn('text-sm mt-1', styles.message)}>
              {notification.message}
            </p>
          )}
          {notification?.actions?.length && notification.actions.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              {notification.actions.map((action, index) => (
                <Button 
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Container de notificações
const NotificationContainer: React.FC<{
  position: NotificationPosition;
}> = ({ position }) => {
  const { notifications, removeNotification, markAsRead } = useNotifications();
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };
  if (notifications.length === 0) {
    return null;
  }
  return (
    <div className={cn(
      'fixed z-50 space-y-2 max-w-sm w-full',
      getPositionClasses()
    )}>
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
          onMarkAsRead={markAsRead}
        />
      ))}
    </div>
  );
};
// Hook para usar notificações
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};
export default NotificationProvider;

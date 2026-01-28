import React from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import Button from '@/components/ui/Button';

const NotificationItem: React.FC<{ notification: Notification; onClose: (id: string) => void }> = ({ 
  notification, 
  onClose 
}) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className={`p-4 rounded-md border shadow-lg ${getTypeStyles(notification.type)} animate-in slide-in-from-right-full duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-lg font-medium">{getIcon(notification.type)}</span>
          <div className="flex-1">
            <h4 className="font-medium">{notification.title}</h4>
            {notification.message && (
              <p className="mt-1 text-sm opacity-90">{notification.message}</p>
            )}
            {notification.action && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={notification.action.onClick}
                  className="text-xs"
                >
                  {notification.action.label}
                </Button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useAdvancedNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;

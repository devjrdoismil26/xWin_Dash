import React from 'react';
import { Bell, CheckCircle, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem.tsx';
import Button from '@/components/ui/Button';
const NotificationList = React.memo(function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onClearAll,
  loading = false
}) {
  const unreadCount = notifications.filter(n => !n.read).length;
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma notificação
        </h3>
        <p className="text-gray-500">
          Você não tem notificações no momento.
        </p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-gray-200">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Notificações
            </h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onMarkAllAsRead} 
                className="text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearAll} 
              className="text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Limpar todas
            </Button>
          </div>
        </div>
      </div>
      {/* Notifications */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
});
export default NotificationList;

import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
const NotificationItem = React.memo(function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };
  return (
    <div className={`p-4 border-l-4 ${getTypeStyles()} ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
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
                onClick={() => onDelete(notification.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Excluir notificação"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ptBR
            })}
          </p>
        </div>
      </div>
    </div>
  );
});
export default NotificationItem;

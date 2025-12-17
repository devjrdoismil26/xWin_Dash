import React from 'react';
import { Bell, CheckCircle, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem';
import Button from '@/shared/components/ui/Button';
const NotificationList = React.memo(function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onClearAll,
  loading = false
}) {
  const unreadCount = (notifications || []).filter(n => !n.read).length;
  if (loading) {
    return (
              <div className=" ">$2</div><div className="{[...Array(3)].map((_: unknown, i: unknown) => (">$2</div>
      <div key={i} className="h-20 bg-gray-200 rounded">
    </>
  ))}
        </div>
        </div>);

  }
  if (notifications.length === 0) {
    return (
              <div className=" ">$2</div><Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2" />
          Nenhuma notificação
        </h3>
        <p className="text-gray-500" />
          Você não tem notificações no momento.
        </p>
      </div>);

  }
  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900" />
              Notificações
            </h3>
            {unreadCount > 0 && (
              <span className="{unreadCount} nova{unreadCount > 1 ? 's' : ''}">$2</span>
      </span>
    </>
  )}
          </div>
          <div className="{unreadCount > 0 && (">$2</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={ onMarkAllAsRead }
                className="text-xs" />
                <CheckCircle className="w-3 h-3 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ onClearAll }
              className="text-xs text-red-600 hover:text-red-700" />
              <Trash2 className="w-3 h-3 mr-1" />
              Limpar todas
            </Button></div></div>
      {/* Notifications */}
      <div className="{(notifications || []).map((notification: unknown) => (">$2</div>
      <NotificationItem 
            key={ notification.id }
            notification={ notification }
            onMarkAsRead={ onMarkAsRead }
            onDelete={ onDelete }
          / />
    </>
  ))}
      </div>);

});

export default NotificationList;

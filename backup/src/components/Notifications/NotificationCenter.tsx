import React, { useMemo, useState } from 'react';
import { useNotifications } from './NotificationProvider.jsx';

export function NotificationCenter({ onClose }) {
  const { notifications, markAllAsRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => (n.category || '').toLowerCase() === filter);
  }, [notifications, filter]);

  const categories = ['all', 'unread', 'ai', 'aura', 'social', 'email', 'workflow', 'system'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-16 pr-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{notifications.length}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1 text-xs rounded-full capitalize ${
                  filter === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b flex justify-between">
          <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">Mark all as read</button>
          <button onClick={clearAll} className="text-sm text-red-600 hover:text-red-800">Clear all</button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filtered.length ? (
            filtered.map((notification) => (
              <div key={notification.id} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium">{notification.title || 'Notification'}</h4>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</span>
                      {notification.action?.url && (
                        <a href={notification.action.url} className="text-xs text-blue-600 hover:text-blue-800">Open</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <span className="text-4xl mb-2 block">🔔</span>
              <p>No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;

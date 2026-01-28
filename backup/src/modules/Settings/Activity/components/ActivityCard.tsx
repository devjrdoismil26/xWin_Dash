import React from 'react';
export function ActivityCard({ activity, detailed = false }) {
  const getActionIcon = (action) => {
    const icons = {
      create: '✅',
      update: '✏️',
      delete: '🗑️',
      login: '🔑',
      logout: '🚪',
      error: '⚠️',
    };
    return icons[action] || 'ℹ️';
  };
  const getActionColor = (action) => {
    const colors = {
      create: 'text-green-600 bg-green-50',
      update: 'text-blue-600 bg-blue-50',
      delete: 'text-red-600 bg-red-50',
      login: 'text-purple-600 bg-purple-50',
      logout: 'text-gray-600 bg-gray-50',
      error: 'text-red-600 bg-red-50',
    };
    return colors[action] || 'text-gray-600 bg-gray-50';
  };
  return (
    <div className={`flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 ${getActionColor(activity?.action)}`}>
      <span className="text-lg">{getActionIcon(activity?.action)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">{activity?.title || 'Atividade'}</h3>
          <span className="text-xs text-gray-500">{activity?.created_at || ''}</span>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          <span>Por {activity?.user?.name || 'Sistema'}</span>
          {activity?.ip && (
            <span className="ml-2 text-gray-400">IP: {activity.ip}</span>
          )}
        </div>
        {detailed && (
          <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(activity?.details || {}, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

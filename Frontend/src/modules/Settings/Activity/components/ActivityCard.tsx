import React from 'react';

type ActionType = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'error';

interface Activity {
  action?: ActionType;
  title?: string;
  created_at?: string;
  user?: { name?: string;
};

  ip?: string;
  details?: Record<string, any>;
}

interface ActivityCardProps {
  activity: Activity;
  detailed?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export function ActivityCard({ activity, detailed = false }: ActivityCardProps) {
  const getActionIcon = (action?: ActionType) => {
    const icons = {
      create: '✅',
      update: '✏️',
      delete: '🗑️',
      login: '🔑',
      logout: '🚪',
      error: '⚠️',};

    return icons[action] || 'ℹ️';};

  const getActionColor = (action?: ActionType) => {
    const colors = {
      create: 'text-green-600 bg-green-50',
      update: 'text-blue-600 bg-blue-50',
      delete: 'text-red-600 bg-red-50',
      login: 'text-purple-600 bg-purple-50',
      logout: 'text-gray-600 bg-gray-50',
      error: 'text-red-600 bg-red-50',};

    return colors[action] || 'text-gray-600 bg-gray-50';};

  return (
        <>
      <div className={`flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 ${getActionColor(activity?.action)} `}>
      </div><span className="text-lg">{getActionIcon(activity?.action)}</span>
      <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-sm font-medium text-gray-900 truncate">{activity?.title || 'Atividade'}</h3>
          <span className="text-xs text-gray-500">{activity?.created_at || ''}</span></div><div className=" ">$2</div><span>Por {activity?.user?.name || 'Sistema'}</span>
          {activity?.ip && (
            <span className="ml-2 text-gray-400">IP: {activity.ip}</span>
          )}
        </div>
        {detailed && (
          <div className=" ">$2</div><pre className="whitespace-pre-wrap">{JSON.stringify(activity?.details || {}, null, 2)}</pre>
      </div>
    </>
  )}
      </div>);

}

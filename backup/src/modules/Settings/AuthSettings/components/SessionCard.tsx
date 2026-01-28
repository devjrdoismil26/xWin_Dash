import React from 'react';
import Button from '@/components/ui/Button';
export function SessionCard({ session, onTerminate }) {
  const getDeviceIcon = (userAgent = '') => {
    if (userAgent.includes('Mobile')) return '📱';
    if (userAgent.includes('Tablet')) return '📱';
    return '💻';
  };
  const getBrowserName = (userAgent = '') => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{getDeviceIcon(session?.user_agent)}</div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Sessão</h3>
            <span className={`text-xs px-2 py-1 rounded ${session?.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {session?.is_current ? 'Atual' : 'Ativa'}
            </span>
          </div>
          <p className="text-sm text-gray-600">{getBrowserName(session?.user_agent)} • {session?.ip_address}</p>
          <p className="text-xs text-gray-500">{session?.last_active}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">ID {session?.id}</span>
        <Button size="sm" variant="destructive" onClick={() => onTerminate?.(session)}>Revogar</Button>
      </div>
    </div>
  );
}
export default SessionCard;

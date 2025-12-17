import React from 'react';
import Button from '@/shared/components/ui/Button';

interface Session {
  id?: string | number;
  user_agent?: string;
  is_current?: boolean;
  ip_address?: string;
  last_active?: string; }

interface SessionCardProps {
  session: Session;
  onTerminate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export function SessionCard({ session, onTerminate }: SessionCardProps) {
  const getDeviceIcon = (userAgent = '') => {
    if (userAgent.includes('Mobile')) return '📱';
    if (userAgent.includes('Tablet')) return '📱';
    return '💻';};

  const getBrowserName = (userAgent = '') => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl">{getDeviceIcon(session?.user_agent)}</div>
        <div>
           
        </div><div className=" ">$2</div><h3 className="font-semibold">Sessão</h3>
            <span className={`text-xs px-2 py-1 rounded ${session?.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} `}>
           
        </span>{session?.is_current ? 'Atual' : 'Ativa'}
            </span></div><p className="text-sm text-gray-600">{getBrowserName(session?.user_agent)} • {session?.ip_address}</p>
          <p className="text-xs text-gray-500">{session?.last_active}</p></div><div className=" ">$2</div><span className="text-xs text-gray-500">ID {session?.id}</span>
        <Button size="sm" variant="destructive" onClick={ () => onTerminate?.(session) }>Revogar</Button>
      </div>);

}
export default SessionCard;

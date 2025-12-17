import React from 'react';
import { Card } from '@/shared/components/ui';
import { Activity, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface ActivityMetricsCardsProps {
  metrics: {
total_logs: number;
  today_logs: number;
  active_users: number;
  error_logs: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  loading?: boolean;
}

export const ActivityMetricsCards: React.FC<ActivityMetricsCardsProps> = ({ metrics,
  loading,
   }) => {
  const cards = [
    {
      title: 'Total de Logs',
      value: metrics.total_logs,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Logs Hoje',
      value: metrics.today_logs,
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      title: 'Usuários Ativos',
      value: metrics.active_users,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Logs de Erro',
      value: metrics.error_logs,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
            <div className="{ cards.map((card: unknown) => (">$2</div>
        <Card key={card.title } />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold mt-1" />
                {loading ? '...' : card.value.toLocaleString('pt-BR')}
              </p></div><div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
           
        </div><card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')} `} / /></div></Card>
      ))}
    </div>);};

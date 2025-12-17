import React from 'react';
import { Card } from '@/shared/components/ui';
import { Sparkles, Zap, DollarSign, TrendingUp } from 'lucide-react';

interface AIMetricsCardsProps {
  metrics: {
total_generations: number;
  active_models: number;
  total_cost: number;
  avg_response_time: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  loading?: boolean;
}

export const AIMetricsCards: React.FC<AIMetricsCardsProps> = ({ metrics, loading    }) => {
  const cards = [
    {
      title: 'Total de Gerações',
      value: metrics.total_generations,
      icon: Sparkles,
      color: 'bg-blue-500',
    },
    {
      title: 'Modelos Ativos',
      value: metrics.active_models,
      icon: Zap,
      color: 'bg-green-500',
    },
    {
      title: 'Custo Total',
      value: `R$ ${metrics.total_cost.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Tempo Médio',
      value: `${metrics.avg_response_time}ms`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  return (
            <div className="{ cards.map((card: unknown) => (">$2</div>
        <Card key={card.title } />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold mt-1" />
                {loading ? '...' : card.value}
              </p></div><div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
           
        </div><card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')} `} / /></div></Card>
      ))}
    </div>);};

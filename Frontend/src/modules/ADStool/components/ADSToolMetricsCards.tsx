import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

interface ADSToolMetricsCardsProps {
  metrics?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    spend?: number;
  };
  loading?: boolean;
}

export const ADSToolMetricsCards: React.FC<ADSToolMetricsCardsProps> = ({ 
  metrics = {},
  loading = false 
}) => {
  const cards = [
    {
      title: 'Impressões',
      value: metrics.impressions?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Cliques',
      value: metrics.clicks?.toLocaleString() || '0',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Conversões',
      value: metrics.conversions?.toLocaleString() || '0',
      icon: Target,
      color: 'bg-purple-500',
    },
    {
      title: 'Gasto',
      value: `R$ ${(metrics.spend || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title}>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold mt-1">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                <IconComponent className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ADSToolMetricsCards;

import React from 'react';
import Card from '@/shared/components/ui/Card';
import { TrendingUp, DollarSign, MousePointer, Target, LucideIcon } from 'lucide-react';

interface ADSToolMetricsCardsProps {
  metrics: {
total_campaigns: number;
  active_campaigns: number;
  total_spend: number;
  total_conversions: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  loading?: boolean;
}

interface MetricCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string; }

export const ADSToolMetricsCards: React.FC<ADSToolMetricsCardsProps> = ({ metrics, loading    }) => {
  const cards: MetricCard[] = [
    {
      title: 'Total de Campanhas',
      value: metrics.total_campaigns,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Campanhas Ativas',
      value: metrics.active_campaigns,
      icon: Target,
      color: 'bg-green-500',
    },
    {
      title: 'Gasto Total',
      value: `R$ ${metrics.total_spend.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversões',
      value: metrics.total_conversions,
      icon: MousePointer,
      color: 'bg-yellow-500',
    },
  ];

  return (
            <div className="{ cards.map((card: unknown) => {">$2</div>
        const IconComponent = card.icon;
        return (
        <>
      <Card key={card.title } />
      <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold mt-1" />
                  {loading ? '...' : card.value}
                </p></div><div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
           
        </div><IconComponent className={`h-6 w-6 ${card.color.replace('bg-', 'text-')} `} / /></div></Card>);

      })}
    </div>);};

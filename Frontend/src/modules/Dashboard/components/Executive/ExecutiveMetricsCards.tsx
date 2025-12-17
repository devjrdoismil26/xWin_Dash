import React from 'react';
import { DollarSign, Users, Target, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';

interface MetricCardData {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage'; }

interface ExecutiveMetricsCardsProps {
  metrics: {
total_revenue: number;
  monthly_growth: number;
  total_users: number;
  user_growth: number;
  conversion_rate: number;
  conversion_change: number;
  active_campaigns: number;
  campaign_change: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

}

export const ExecutiveMetricsCards: React.FC<ExecutiveMetricsCardsProps> = ({ metrics    }) => {
  const cards: MetricCardData[] = [
    {
      title: 'Receita Total',
      value: metrics.total_revenue,
      change: metrics.monthly_growth,
      icon: <DollarSign className="w-5 h-5" />,
      format: 'currency'
    },
    {
      title: 'Total de Usuários',
      value: metrics.total_users,
      change: metrics.user_growth,
      icon: <Users className="w-5 h-5" />,
      format: 'number'
    },
    {
      title: 'Taxa de Conversão',
      value: metrics.conversion_rate,
      change: metrics.conversion_change,
      icon: <Target className="w-5 h-5" />,
      format: 'percentage'
    },
    {
      title: 'Campanhas Ativas',
      value: metrics.active_campaigns,
      change: metrics.campaign_change,
      icon: <TrendingUp className="w-5 h-5" />,
      format: 'number'
    }
  ];

  const formatValue = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);

      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('pt-BR').format(value);

    } ;

  return (
            <div className="{cards.map((card: unknown, index: unknown) => (">$2</div>
        <Card key={index} className="p-6" />
          <div className=" ">$2</div><div className="{card.icon}">$2</div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              card.change >= 0 ? 'text-green-600' : 'text-red-600'
            } `}>
              {card.change >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(card.change).toFixed(1)}%
            </div>
          
          <div>
           
        </div><p className="text-sm text-gray-600 dark:text-gray-400 mb-1" />
              {card.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white" />
              <AnimatedCounter
                value={ card.value }
                format={ (val: unknown) => formatValue(val, card.format) } /></p></div>
      </Card>
    </>
  ))}
    </div>);};

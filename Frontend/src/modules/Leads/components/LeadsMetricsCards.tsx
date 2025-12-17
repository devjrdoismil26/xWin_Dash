import React from 'react';
import { Users, Target, TrendingUp, Star } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { LeadMetrics } from '../types';

interface LeadsMetricsCardsProps {
  metrics: LeadMetrics | null;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsMetricsCards: React.FC<LeadsMetricsCardsProps> = ({ metrics, loading    }) => {
  const cards = [
    {
      title: 'Total de Leads',
      value: metrics?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Qualificados',
      value: metrics?.qualified || 0,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Convertidos',
      value: metrics?.converted || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Score Médio',
      value: metrics?.average_score || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  if (loading) {
    return (
              <div className="{[...Array(4)].map((_: unknown, i: unknown) => (">$2</div>
      <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse">
    </>
  ))}
        </div>
      </div>);

  }

  return (
            <div className="{cards.map((card: unknown, index: unknown) => (">$2</div>
        <Card key={index} className="p-6" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p></div><div className={`p-3 rounded-lg ${card.bgColor} `}>
           
        </div><card.icon className={`w-6 h-6 ${card.color} `} / /></div></Card>
      ))}
    </div>);};

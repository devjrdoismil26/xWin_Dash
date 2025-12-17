import React from 'react';
import { Users, Eye, MousePointer, DollarSign } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';

interface MetricsOverviewProps {
  dateRange?: { start: Date;
  end: Date
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

}

export const MetricsOverview: React.FC<MetricsOverviewProps> = () => {
  const metrics = [
    { icon: Users, label: 'Visitantes', value: '45.2K', change: '+12.5%', positive: true },
    { icon: Eye, label: 'Visualizações', value: '128.5K', change: '+8.3%', positive: true },
    { icon: MousePointer, label: 'Taxa de Cliques', value: '3.8%', change: '-2.1%', positive: false },
    { icon: DollarSign, label: 'Receita', value: 'R$ 89.5K', change: '+15.7%', positive: true }
  ];

  return (
            <div className="{metrics.map((metric: unknown, index: unknown) => (">$2</div>
        <Card key={index} className="p-6" />
          <div className=" ">$2</div><metric.icon className="w-8 h-8 text-blue-600" />
            <span className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'} `}>
           
        </span>{metric.change}
            </span></div><div className=" ">$2</div><p className="text-sm text-gray-600">{metric.label}</p>
            <p className="text-2xl font-bold">{metric.value}</p></div></Card>
      ))}
    </div>);};

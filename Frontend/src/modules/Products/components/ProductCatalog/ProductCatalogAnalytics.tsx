import React from 'react';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';

interface ProductCatalogAnalyticsProps {
  analytics: {
totalViews: number;
  conversionRate: number;
  averageOrderValue: number;
  returnCustomerRate: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

}

export const ProductCatalogAnalytics: React.FC<ProductCatalogAnalyticsProps> = ({ analytics
   }) => {
  const metrics = [
    {
      label: 'Total de Visualizações',
      value: analytics.totalViews.toLocaleString(),
      icon: BarChart3,
      trend: '+12%'
    },
    {
      label: 'Taxa de Conversão',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      trend: '+5%'
    },
    {
      label: 'Ticket Médio',
      value: `R$ ${analytics.averageOrderValue.toFixed(2)}`,
      icon: Package,
      trend: '+8%'
    },
    {
      label: 'Clientes Recorrentes',
      value: `${analytics.returnCustomerRate.toFixed(1)}%`,
      icon: Users,
      trend: '+3%'
    }
  ];

  return (
            <div className=" ">$2</div><h3 className="font-semibold mb-4">Analytics do Catálogo</h3>
      <div className="{metrics.map((metric: unknown, index: unknown) => (">$2</div>
          <div key={index} className="text-center">
           
        </div><metric.icon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
            <div className="text-xs text-green-600">{metric.trend}</div>
        ))}
      </div>);};

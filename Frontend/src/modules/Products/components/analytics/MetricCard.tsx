import React from 'react';
import Card from '@/shared/components/ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  format?: 'currency' | 'percentage' | 'number';
  icon: React.ReactNode;
  colorClass: string; }

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, change, format = 'number', icon, colorClass
   }) => {
  const formatValue = (val: number) => {
    if (format === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    if (format === 'percentage') return (val * 100).toFixed(1) + '%';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();};

  const trendIcon = trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                    trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                    <Minus className="w-4 h-4 text-gray-600" />;

  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-6" />
      <div className=" ">$2</div><div className=" ">$2</div><div className={cn('p-2 rounded-lg', colorClass) } >{icon}</div>
          <div>
           
        </div><p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p></div><div className=" ">$2</div><div className="{trendIcon}">$2</div>
            <span className={cn('text-sm font-medium', trendColor)  }>
        </span>{change > 0 ? '+' : ''}{change}%
            </span></div><p className="text-xs text-gray-500">vs last period</p></div></Card>);};

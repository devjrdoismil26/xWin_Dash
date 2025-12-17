import React from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { TrendingUp, TrendingDown, Minus, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Performer {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  format?: 'currency' | 'percentage' | 'number'; }

interface TopPerformersProps {
  items: Performer[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const TopPerformers: React.FC<TopPerformersProps> = ({ items    }) => {
  const formatValue = (val: number, format?: string) => {
    if (format === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    if (format === 'percentage') return (val * 100).toFixed(1) + '%';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();};

  const trendIcon = (trend: string) => trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                                       trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                                       <Minus className="w-4 h-4 text-gray-600" />;

  const trendColor = (trend: string) => trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button></div>
      <div className="{items.map((item: unknown, index: unknown) => (">$2</div>
          <div key={index} className="flex items-center justify-between">
           
        </div><div className=" ">$2</div><div className="{index + 1}">$2</div>
              </div>
              <div>
           
        </div><p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{formatValue(item.value, item.format)}</p></div><div className="{trendIcon(item.trend)}">$2</div>
              <span className={cn('text-sm font-medium', trendColor(item.trend))  }>
        </span>{item.change > 0 ? '+' : ''}{item.change}%
              </span>
      </div>
    </>
  ))}
      </div>
    </Card>);};

import React from 'react';
import Card from '@/shared/components/ui/Card';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode; }

interface AnalyticsMetricsProps {
  metrics: Metric[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ metrics    }) => {
  return (
            <div className="{metrics.map((metric: unknown, idx: unknown) => (">$2</div>
        <Card key={idx} className="p-4" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">{metric.label}</p>
              <p className="text-2xl font-bold mt-1">{metric.value}</p>
              {metric.change !== undefined && (
                <p className={`text-sm mt-1 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'} `}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </p>
              )}
            </div>
            <div className="text-gray-400">{metric.icon}</div>
      </Card>
    </>
  ))}
    </div>);};

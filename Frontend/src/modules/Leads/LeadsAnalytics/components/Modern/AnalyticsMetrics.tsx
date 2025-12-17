import React from 'react';
import Card from '@/shared/components/ui/Card';

interface AnalyticsMetricsProps {
  metrics: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ metrics    }) => {
  return (
            <div className=" ">$2</div><Card className="p-4" />
        <p className="text-sm text-gray-600">Total Leads</p>
        <p className="text-2xl font-bold">0</p></Card></div>);};

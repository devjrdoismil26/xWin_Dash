import React from 'react';
import { cn } from '@/lib/utils';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { AnalyticsHeader } from './analytics/AnalyticsHeader';
import { MetricCard } from './analytics/MetricCard';
import { PerformanceChart } from './analytics/PerformanceChart';
import { TopPerformers } from './analytics/TopPerformers';
import { TrendsInsights } from './analytics/TrendsInsights';

interface ModernAnalyticsProps {
  type: 'products' | 'landing-pages' | 'forms';
  data: unknown;
  loading?: boolean;
  onRefresh???: (e: any) => void;
  onExport???: (e: any) => void;
  className?: string;
  showMetrics?: boolean;
  showCharts?: boolean;
  showTrends?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ModernAnalytics: React.FC<ModernAnalyticsProps> = ({ type,
  data,
  loading = false,
  onRefresh,
  onExport,
  className,
  showMetrics = true,
  showCharts = true,
  showTrends = true,
  showExport = true,
  showRefresh = true
   }) => {
  const { getMetrics, getTopPerformers, getMetricIcon, getMetricColor } = useAnalyticsData(type, data);

  const metrics = getMetrics();

  const topPerformers = getTopPerformers();

  return (
        <>
      <div className={cn('space-y-6', className)  }>
      </div><AnalyticsHeader
        type={ type }
        loading={ loading }
        showRefresh={ showRefresh }
        showExport={ showExport }
        onRefresh={ onRefresh }
        onExport={ onExport  }>
          {showMetrics && (
        <div className="{metrics.map((metric: unknown) => {">$2</div>
            const Icon = getMetricIcon(metric.key);

            return (
                      <MetricCard
                key={ metric.key }
                label={ metric.label }
                value={ metric.value }
                trend={ metric.trend }
                change={ metric.change }
                format={ metric.format }
                icon={ <Icon className="w-5 h-5" /> }
                colorClass={ getMetricColor(metric.key) } />);

          })}
        </div>
      )}

      {showCharts && (
        <div className=" ">$2</div><PerformanceChart data={data} / />
          <TopPerformers items={topPerformers} / />
        </div>
      )}

      {showTrends && <TrendsInsights />}
    </div>);};

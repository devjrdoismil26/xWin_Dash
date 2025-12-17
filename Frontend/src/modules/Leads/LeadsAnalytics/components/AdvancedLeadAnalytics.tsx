// ========================================
// ANALYTICS AVANÇADOS - LEADS (REFATORADO)
// ========================================
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LeadAnalytics, LeadMetrics, Lead } from '@/types';
import { AnalyticsDashboard, AnalyticsCharts, AnalyticsFilters, AnalyticsMetrics, AnalyticsExport } from './analytics';

interface AdvancedLeadAnalyticsProps {
  analytics: LeadAnalytics | null;
  metrics: LeadMetrics | null;
  leads: Lead[];
  loading?: boolean;
  onRefresh???: (e: any) => void;
  onExport??: (e: any) => void;
  className?: string;
  compact?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AdvancedLeadAnalytics: React.FC<AdvancedLeadAnalyticsProps> = ({ analytics,
  metrics,
  leads,
  loading = false,
  onRefresh,
  onExport,
  className,
  compact = false
   }) => {
  const [dashboardMode, setDashboardMode] = useState<'overview' | 'detailed' | 'custom'>('overview');

  const renderDashboardContent = () => {
    switch (dashboardMode) {
      case 'overview':
        return (
                  <div className=" ">$2</div><AnalyticsMetrics metrics={metrics} / />
            <AnalyticsCharts analytics={analytics} metrics={metrics} / />
          </div>);

      case 'detailed':
        return (
                  <div className=" ">$2</div><AnalyticsFilters / />
            <AnalyticsMetrics metrics={metrics} / />
            <AnalyticsCharts analytics={analytics} metrics={metrics} / />
            <AnalyticsExport onExport={onExport} / />
          </div>);

      case 'custom':
        return (
                  <div className=" ">$2</div><div className="Dashboard personalizado em desenvolvimento">$2</div>
            </div>);

      default:
        return null;
    } ;

  if (compact) {
    return (
              <AnalyticsDashboard
        analytics={ analytics }
        metrics={ metrics }
        leads={ leads }
        loading={ loading }
        onRefresh={ onRefresh }
        onExport={ onExport }
        className={className} compact={ true }
      / />);

  }

  return (
        <>
      <div className={cn("space-y-6", className)  }>
      </div><AnalyticsDashboard
        analytics={ analytics }
        metrics={ metrics }
        leads={ leads }
        loading={ loading }
        onRefresh={ onRefresh }
        onExport={ onExport }
        className={className} compact={ false  }>
          {renderDashboardContent()}
    </div>);};

export default AdvancedLeadAnalytics;
// ========================================
// ANALYTICS AVANÇADOS - LEADS (REFATORADO)
// ========================================
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LeadAnalytics, LeadMetrics, Lead } from '../../types';
import {
  AnalyticsDashboard,
  AnalyticsCharts,
  AnalyticsFilters,
  AnalyticsMetrics,
  AnalyticsExport
} from './analytics';

interface AdvancedLeadAnalyticsProps {
  analytics: LeadAnalytics | null;
  metrics: LeadMetrics | null;
  leads: Lead[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'xlsx' | 'pdf') => void;
  className?: string;
  compact?: boolean;
}

const AdvancedLeadAnalytics: React.FC<AdvancedLeadAnalyticsProps> = ({
  analytics,
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
          <div className="space-y-6">
            <AnalyticsMetrics metrics={metrics} />
            <AnalyticsCharts analytics={analytics} metrics={metrics} />
          </div>
        );
      case 'detailed':
        return (
          <div className="space-y-6">
            <AnalyticsFilters />
            <AnalyticsMetrics metrics={metrics} />
            <AnalyticsCharts analytics={analytics} metrics={metrics} />
            <AnalyticsExport onExport={onExport} />
          </div>
        );
      case 'custom':
        return (
          <div className="text-center py-12">
            <div className="text-gray-500">
              Dashboard personalizado em desenvolvimento
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <AnalyticsDashboard
        analytics={analytics}
        metrics={metrics}
        leads={leads}
        loading={loading}
        onRefresh={onRefresh}
        onExport={onExport}
        className={className}
        compact={true}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <AnalyticsDashboard
        analytics={analytics}
        metrics={metrics}
        leads={leads}
        loading={loading}
        onRefresh={onRefresh}
        onExport={onExport}
        className={className}
        compact={false}
      />
      {renderDashboardContent()}
    </div>
  );
};

export default AdvancedLeadAnalytics;
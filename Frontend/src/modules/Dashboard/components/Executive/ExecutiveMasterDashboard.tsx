import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { ExecutiveHeader } from './ExecutiveHeader';
import { ExecutiveMetricsCards } from './ExecutiveMetricsCards';
import { ExecutiveTrendCharts } from './ExecutiveTrendCharts';
import { ExecutiveModuleWidgets } from './ExecutiveModuleWidgets';
import { ExecutiveRecentActivity } from './ExecutiveRecentActivity';

interface ExecutiveMetrics {
  total_revenue: number;
  monthly_growth: number;
  total_users: number;
  user_growth: number;
  conversion_rate: number;
  conversion_change: number;
  active_campaigns: number;
  campaign_change: number; }

interface ModuleMetrics {
  ai: { active: number;
  total: number;
  status: string;
};

  aura: { conversations: number; pending: number; status: string};

  products: { active: number; total: number; status: string};

  email: { campaigns: number; sent: number; status: string};

  media: { files: number; storage: number; status: string};

  workflows: { active: number; total: number; status: string};

  analytics: { reports: number; insights: number; status: string};

  ads: { campaigns: number; budget: number; status: string};

}

interface Activity {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  module: string; }

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string; }>;
}

export const ExecutiveMasterDashboard: React.FC = () => {
  const [period, setPeriod] = useState('month');

  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState<ExecutiveMetrics>({
    total_revenue: 0,
    monthly_growth: 0,
    total_users: 0,
    user_growth: 0,
    conversion_rate: 0,
    conversion_change: 0,
    active_campaigns: 0,
    campaign_change: 0
  });

  const [moduleMetrics, setModuleMetrics] = useState<ModuleMetrics>({
    ai: { active: 0, total: 0, status: 'info' },
    aura: { conversations: 0, pending: 0, status: 'info' },
    products: { active: 0, total: 0, status: 'info' },
    email: { campaigns: 0, sent: 0, status: 'info' },
    media: { files: 0, storage: 0, status: 'info' },
    workflows: { active: 0, total: 0, status: 'info' },
    analytics: { reports: 0, insights: 0, status: 'info' },
    ads: { campaigns: 0, budget: 0, status: 'info' } );

  const [activities, setActivities] = useState<Activity[]>([]);

  const [revenueData, setRevenueData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [userGrowthData, setUserGrowthData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [conversionData, setConversionData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [metricsRes, modulesRes, activitiesRes, chartsRes] = await Promise.all([
        apiClient.get(`/api/dashboard/executive/metrics?period=${period}`),
        apiClient.get(`/api/dashboard/executive/modules?period=${period}`),
        apiClient.get(`/api/dashboard/executive/activities?limit=10`),
        apiClient.get(`/api/dashboard/executive/charts?period=${period}`)
      ]);

      const metrics = metricsRes as { data?: string};

      const modules = modulesRes as { data?: string};

      const activities = activitiesRes as { data?: string};

      const charts = chartsRes as { data?: { revenue?: string; userGrowth?: string; conversion?: string } ;

      setMetrics(metrics.data);

      setModuleMetrics(modules.data);

      setActivities(activities.data);

      setRevenueData(charts.data?.revenue);

      setUserGrowthData(charts.data?.userGrowth);

      setConversionData(charts.data?.conversion);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);

    } finally {
      setIsLoading(false);

    } , [period]);

  useEffect(() => {
    fetchDashboardData();

  }, [fetchDashboardData]);

  const handleRefresh = useCallback(() => {
    fetchDashboardData();

  }, [fetchDashboardData]);

  const handleExport = useCallback(() => {
  }, []);

  if (isLoading) {
    return (
              <div className=" ">$2</div><LoadingSpinner size="lg" / />
      </div>);

  }

  return (
        <>
      <PageTransition />
      <div className=" ">$2</div><ExecutiveHeader
          period={ period }
          onPeriodChange={ setPeriod }
          onRefresh={ handleRefresh }
          onExport={ handleExport }
          isLoading={ isLoading }
        / />
        <ExecutiveMetricsCards metrics={metrics} / />
        <ExecutiveTrendCharts
          revenueData={ revenueData }
          userGrowthData={ userGrowthData }
          conversionData={ conversionData }
        / />
        <ExecutiveModuleWidgets modules={moduleMetrics} / />
        <div className=" ">$2</div><div className=" ">$2</div><ExecutiveRecentActivity activities={activities} / /></div></div>
    </PageTransition>);};

export default ExecutiveMasterDashboard;

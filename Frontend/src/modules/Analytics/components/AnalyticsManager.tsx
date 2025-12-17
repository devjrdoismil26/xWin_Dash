import React, { useState, useEffect } from 'react';
import { AnalyticsHeader } from './Advanced/AnalyticsHeader';
import { AnalyticsMetrics } from './Advanced/AnalyticsMetrics';
import { AnalyticsCharts } from './Advanced/AnalyticsCharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export const AdvancedAnalyticsManager: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any>(null);

  const metrics = [
    { label: 'Total Users', value: '10,234', change: 12.5, icon: <Users className="w-6 h-6" /> },
    { label: 'Revenue', value: '$45,678', change: 8.2, icon: <DollarSign className="w-6 h-6" /> },
    { label: 'Active', value: '8,456', change: -2.1, icon: <Activity className="w-6 h-6" /> },
    { label: 'Growth', value: '23%', change: 5.3, icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => setLoading(false), 1000);};

  const handleExport = () => {};

  return (
            <div className=" ">$2</div><AnalyticsHeader onRefresh={handleRefresh} onExport={handleExport} loading={loading} / />
      <AnalyticsMetrics metrics={metrics} / />
      <AnalyticsCharts data={data} / />
    </div>);};

export default AdvancedAnalyticsManager;

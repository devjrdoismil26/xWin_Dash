/**
 * Página principal do módulo Analytics
 * Dashboard com visão geral dos dados
 */
import React from 'react';
import { AnalyticsDashboard } from '../components';
import { cn } from '@/lib/utils';

interface AnalyticsIndexPageProps {
  className?: string;
}

export const AnalyticsIndexPage: React.FC<AnalyticsIndexPageProps> = ({ className }) => {
  return (
    <div className={cn("analytics-index-page", className)}>
      <AnalyticsDashboard />
    </div>
  );
};

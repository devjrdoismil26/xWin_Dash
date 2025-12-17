import React from 'react';
import { AnalyticsMetrics } from './Modern/AnalyticsMetrics';

interface ModernLeadAnalyticsProps {
  analytics?: string;
  metrics?: string;
  onRefresh???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ModernLeadAnalytics: React.FC<ModernLeadAnalyticsProps> = ({ metrics    }) => {
  return (
        <>
      <div>
      </div><AnalyticsMetrics metrics={metrics} / />
    </div>);};

export default ModernLeadAnalytics;

/**
 * Advanced AI Dashboard - Especialização do AIDashboard
 * Dashboard avançado com métricas detalhadas e funcionalidades extras
 */
import React from 'react';
import AIDashboard from './AIDashboard';
import { AIComponentProps } from '../types';

interface AdvancedAIDashboardProps extends AIComponentProps {
  className?: string;
}

const AdvancedAIDashboard: React.FC<AdvancedAIDashboardProps> = ({ 
  className,
  onAction 
}) => {
  return (
    <AIDashboard
      variant="advanced"
      className={className}
      onAction={onAction}
      showAdvancedMetrics={true}
      showRealTimeData={true}
      showProviderStatus={true}
      showCostAnalytics={true}
      features={['analytics', 'providers', 'costs', 'realtime']}
    />
  );
};

export default AdvancedAIDashboard;

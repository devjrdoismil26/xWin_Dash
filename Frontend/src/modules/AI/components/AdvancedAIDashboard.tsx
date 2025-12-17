/**
 * Advanced AI Dashboard - Especialização do AIDashboard
 * @module modules/AI/components/AdvancedAIDashboard
 * @description
 * Dashboard avançado do módulo AI com métricas detalhadas e funcionalidades extras,
 * especialização do AIDashboard com variante 'advanced' e funcionalidades adicionais
 * como analytics avançados, status de provedores, analytics de custos e dados em tempo real.
 * @since 1.0.0
 */
import React from 'react';
import AIDashboard from './AIDashboard';
import { AIComponentProps } from '../types';

interface AdvancedAIDashboardProps extends AIComponentProps {
  className?: string;
}

const AdvancedAIDashboard: React.FC<AdvancedAIDashboardProps> = ({ className,
  onAction 
   }) => {
  return (
            <AIDashboard
      variant="advanced"
      className={className} onAction={ onAction }
      showAdvancedMetrics={ true }
      showRealTimeData={ true }
      showProviderStatus={ true }
      showCostAnalytics={ true }
      features={ ['analytics', 'providers', 'costs', 'realtime'] }
    / />);};

export default AdvancedAIDashboard;

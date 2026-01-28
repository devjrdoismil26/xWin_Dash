// ========================================
// ANALYTICS DASHBOARD - COMPONENTE PRINCIPAL
// ========================================
import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { LeadAnalytics, LeadMetrics, Lead } from '../../../types';

interface AnalyticsDashboardProps {
  analytics: LeadAnalytics | null;
  metrics: LeadMetrics | null;
  leads: Lead[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'xlsx' | 'pdf') => void;
  className?: string;
  compact?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  metrics,
  leads,
  loading = false,
  onRefresh,
  onExport,
  className,
  compact = false
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<'overview' | 'detailed' | 'custom'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        {/* Overview Cards */}
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.total_leads || 0}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-sm">+12%</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversões</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.converted_leads || 0}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-sm">+8%</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.conversion_rate?.toFixed(1) || 0}%</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-sm">+2%</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Score Médio</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.average_score?.toFixed(1) || 0}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-sm">+5</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Avançados de Leads</h2>
          <p className="text-gray-600">Insights profundos e métricas preditivas</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedCharts(!showDetailedCharts)}
          >
            {showDetailedCharts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Dashboard Mode Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant={dashboardMode === 'overview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDashboardMode('overview')}
        >
          Visão Geral
        </Button>
        <Button
          variant={dashboardMode === 'detailed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDashboardMode('detailed')}
        >
          Detalhado
        </Button>
        <Button
          variant={dashboardMode === 'custom' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDashboardMode('custom')}
        >
          Personalizado
        </Button>
      </div>

      {/* Content will be rendered by child components */}
      <div className="space-y-6">
        {/* This will be replaced by specific dashboard components */}
        <div className="text-center py-12 text-gray-500">
          Dashboard content will be rendered here based on mode
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
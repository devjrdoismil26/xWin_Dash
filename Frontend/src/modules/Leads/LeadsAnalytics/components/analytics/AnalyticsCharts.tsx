// ========================================
// ANALYTICS CHARTS - GRÁFICOS E VISUALIZAÇÕES
// ========================================
import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, LineChart } from 'lucide-react';
import Card from '@/components/ui/Card';
import { LeadAnalytics, LeadMetrics } from '../../../types';

interface AnalyticsChartsProps {
  analytics: LeadAnalytics | null;
  metrics: LeadMetrics | null;
  className?: string;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  analytics,
  metrics,
  className
}) => {
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const renderConversionFunnel = () => {
    const funnelData = [
      { name: 'Leads Criados', count: 1247, percentage: 100 },
      { name: 'Primeiro Contato', count: 892, percentage: 71.5 },
      { name: 'Qualificados', count: 456, percentage: 36.6 },
      { name: 'Propostas Enviadas', count: 234, percentage: 18.8 },
      { name: 'Negociação', count: 123, percentage: 9.9 },
      { name: 'Convertidos', count: 89, percentage: 7.1 }
    ];

    return (
      <div className="space-y-4">
        {funnelData.map((stage, index) => (
          <div key={stage.name} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{stage.name}</span>
              <span className="text-sm text-gray-500">{stage.count} ({formatPercentage(stage.percentage)})</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
            {index < funnelData.length - 1 && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <TrendingDown className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderLeadScoring = () => {
    const scoringData = [
      { range: '0-20', count: 45, percentage: 3.6, color: '#ef4444' },
      { range: '21-40', count: 89, percentage: 7.1, color: '#f97316' },
      { range: '41-60', count: 156, percentage: 12.5, color: '#eab308' },
      { range: '61-80', count: 234, percentage: 18.8, color: '#22c55e' },
      { range: '81-100', count: 123, percentage: 9.9, color: '#10b981' }
    ];

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {metrics?.average_score?.toFixed(1) || 67.2}
          </div>
          <div className="text-sm text-gray-600">Score Médio</div>
        </div>
        <div className="space-y-3">
          {scoringData.map((item) => (
            <div key={item.range} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.range}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{item.count}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: item.color,
                      width: `${item.percentage}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGeographicDistribution = () => {
    const countries = [
      { name: 'Brasil', count: 892, percentage: 71.5 },
      { name: 'Argentina', count: 123, percentage: 9.9 },
      { name: 'Chile', count: 89, percentage: 7.1 },
      { name: 'Colômbia', count: 67, percentage: 5.4 },
      { name: 'México', count: 45, percentage: 3.6 },
      { name: 'Outros', count: 31, percentage: 2.5 }
    ];

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Por País</h4>
          <div className="space-y-2">
            {countries.map((country) => (
              <div key={country.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{country.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{country.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{formatPercentage(country.percentage)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Por Cidade</h4>
          <div className="space-y-2">
            {[
              { name: 'São Paulo', count: 234, percentage: 18.8 },
              { name: 'Rio de Janeiro', count: 123, percentage: 9.9 },
              { name: 'Belo Horizonte', count: 89, percentage: 7.1 }
            ].map((city) => (
              <div key={city.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{city.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{city.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${city.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{formatPercentage(city.percentage)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Funil de Conversão</h3>
          </div>
          {renderConversionFunnel()}
        </Card>

        {/* Lead Scoring */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Distribuição de Scores</h3>
          </div>
          {renderLeadScoring()}
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Distribuição Geográfica</h3>
          </div>
          {renderGeographicDistribution()}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
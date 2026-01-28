import React from 'react';
import Card from '@/components/ui/Card';
import { LeadMetricsProps } from '../types';
const LeadMetrics: React.FC<LeadMetricsProps> = ({ metrics, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <Card.Content className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Content className="p-4 text-center text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  const metricsData = [
    {
      title: 'Total de Leads',
      value: metrics.total,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversion_rate.toFixed(1)}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Score Médio',
      value: metrics.avg_score.toFixed(1),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Leads Ganhos',
      value: metrics.won,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];
  const statusData = [
    { label: 'Novos', value: metrics.new, color: 'bg-blue-500' },
    { label: 'Contactados', value: metrics.contacted, color: 'bg-yellow-500' },
    { label: 'Qualificados', value: metrics.qualified, color: 'bg-green-500' },
    { label: 'Propostas', value: metrics.proposal, color: 'bg-purple-500' },
    { label: 'Negociação', value: metrics.negotiation, color: 'bg-orange-500' },
    { label: 'Ganhos', value: metrics.won, color: 'bg-emerald-500' },
    { label: 'Perdidos', value: metrics.lost, color: 'bg-red-500' }
  ];
  const totalStatus = statusData.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <Card key={index}>
            <Card.Content className={`p-4 ${metric.bgColor} rounded-lg`}>
              <div className="text-sm font-medium text-gray-600 mb-1">
                {metric.title}
              </div>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value.toLocaleString('pt-BR')}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
      {/* Distribuição por Status */}
      <Card>
        <Card.Header>
          <Card.Title>Distribuição por Status</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="space-y-3">
            {statusData.map((item, index) => {
              const percentage = totalStatus > 0 ? (item.value / totalStatus) * 100 : 0;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-20 text-sm font-medium text-gray-700">
                    {item.label}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className={`${item.color} h-4 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {item.value.toLocaleString('pt-BR')}
                  </div>
                  <div className="w-12 text-xs text-gray-500 text-right">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <Card.Title>Resumo Executivo</Card.Title>
          </Card.Header>
          <Card.Content className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total de Leads:</span>
                <span className="font-medium">{metrics.total.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Conversão:</span>
                <span className="font-medium text-green-600">
                  {metrics.conversion_rate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Score Médio:</span>
                <span className="font-medium">{metrics.avg_score.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Leads Ativos:</span>
                <span className="font-medium">
                  {(metrics.new + metrics.contacted + metrics.qualified + metrics.proposal + metrics.negotiation).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Performance</Card.Title>
          </Card.Header>
          <Card.Content className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Leads Ganhos:</span>
                <span className="font-medium text-green-600">
                  {metrics.won.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Leads Perdidos:</span>
                <span className="font-medium text-red-600">
                  {metrics.lost.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Sucesso:</span>
                <span className="font-medium">
                  {metrics.won + metrics.lost > 0 
                    ? ((metrics.won / (metrics.won + metrics.lost)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};
export default LeadMetrics;

import React from 'react';
import { Mail, Eye, MousePointer, Users, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { EmailCampaignStats } from '../../types/emailTypes';
interface CampaignMetricsProps {
  metrics: EmailCampaignStats;
  loading?: boolean;
  error?: string;
}
const CampaignMetrics: React.FC<CampaignMetricsProps> = ({ 
  metrics = {}, 
  loading = false, 
  error 
}) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Métricas da Campanha</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Métricas da Campanha</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  const formatNumber = (num: number = 0): string => {
    return num.toLocaleString('pt-BR');
  };
  const formatPercentage = (num: number = 0): string => {
    return `${num.toFixed(2)}%`;
  };
  const getRateColor = (rate: number): string => {
    if (rate >= 20) return 'text-green-600';
    if (rate >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>Métricas da Campanha</Card.Title>
      </Card.Header>
      <Card.Content className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Enviados */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(metrics.sent)}
            </div>
            <div className="text-sm text-gray-600">Enviados</div>
          </div>
          {/* Entregues */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(metrics.delivered)}
            </div>
            <div className="text-sm text-gray-600">Entregues</div>
          </div>
          {/* Aberturas */}
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(metrics.opened)}
            </div>
            <div className="text-sm text-gray-600">Aberturas</div>
            <div className={`text-xs font-medium ${getRateColor(metrics.open_rate)}`}>
              {formatPercentage(metrics.open_rate)} taxa
            </div>
          </div>
          {/* Cliques */}
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <MousePointer className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber(metrics.clicked)}
            </div>
            <div className="text-sm text-gray-600">Cliques</div>
            <div className={`text-xs font-medium ${getRateColor(metrics.click_rate)}`}>
              {formatPercentage(metrics.click_rate)} taxa
            </div>
          </div>
        </div>
        {/* Métricas Adicionais */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {formatNumber(metrics.bounced)}
              </div>
              <div className="text-gray-500">Bounces</div>
              <div className={`text-xs ${getRateColor(100 - metrics.bounce_rate)}`}>
                {formatPercentage(metrics.bounce_rate)} taxa
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {formatNumber(metrics.unsubscribed)}
              </div>
              <div className="text-gray-500">Descadastros</div>
              <div className={`text-xs ${getRateColor(100 - metrics.unsubscribe_rate)}`}>
                {formatPercentage(metrics.unsubscribe_rate)} taxa
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {formatNumber(metrics.spam_reports)}
              </div>
              <div className="text-gray-500">Spam Reports</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {formatPercentage(metrics.open_rate)}
              </div>
              <div className="text-gray-500">Taxa de Abertura</div>
              <div className="text-xs text-gray-400">Geral</div>
            </div>
          </div>
        </div>
        {/* Performance Indicators */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Performance</span>
            <div className="flex items-center gap-2">
              {metrics.open_rate >= 20 ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Excelente
                </Badge>
              ) : metrics.open_rate >= 10 ? (
                <Badge variant="warning" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Boa
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Precisa melhorar
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default CampaignMetrics;

// =========================================
// ANALYTICS DASHBOARD - DASHBOARD DE ANALYTICS
// =========================================
// Componente para exibir analytics de produtos
// Máximo: 200 linhas

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { useProductAnalytics } from '../ProductsAnalytics/hooks/useProductAnalytics';
import { useProductsOptimization } from '../hooks/useProductsOptimization';

interface AnalyticsDashboardProps {
  productId: string;
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  productId,
  className = ''
}) => {
  const {
    analytics,
    metrics,
    performance,
    loading,
    error,
    loadAnalytics,
    loadMetrics,
    loadPerformance,
    loadSalesAnalytics,
    loadRevenueAnalytics,
    loadConversionAnalytics,
    loadViews,
    loadClicks,
    loadEngagement,
    clearError
  } = useProductAnalytics();

  const { useOptimizedCallback } = useProductsOptimization();

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    loadAnalytics(productId, { period: selectedPeriod });
    loadMetrics(productId, selectedPeriod);
    loadPerformance(productId, { period: selectedPeriod });
  }, [productId, selectedPeriod, loadAnalytics, loadMetrics, loadPerformance]);

  // =========================================
  // HANDLERS
  // =========================================

  const handlePeriodChange = useOptimizedCallback(
    (period: string) => {
      setSelectedPeriod(period);
    },
    [],
    'changePeriod'
  );

  const handleMetricChange = useOptimizedCallback(
    (metric: string) => {
      setSelectedMetric(metric);
    },
    [],
    'changeMetric'
  );

  const handleRefresh = useOptimizedCallback(
    async () => {
      await Promise.all([
        loadAnalytics(productId, { period: selectedPeriod }),
        loadMetrics(productId, selectedPeriod),
        loadPerformance(productId, { period: selectedPeriod })
      ]);
    },
    [productId, selectedPeriod, loadAnalytics, loadMetrics, loadPerformance],
    'refreshAnalytics'
  );

  // =========================================
  // OPÇÕES DOS SELECTS
  // =========================================

  const periodOptions = [
    { value: '1d', label: 'Último dia' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' }
  ];

  const metricOptions = [
    { value: 'overview', label: 'Visão Geral' },
    { value: 'sales', label: 'Vendas' },
    { value: 'revenue', label: 'Receita' },
    { value: 'conversion', label: 'Conversão' },
    { value: 'views', label: 'Visualizações' },
    { value: 'clicks', label: 'Cliques' },
    { value: 'engagement', label: 'Engajamento' }
  ];

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // =========================================
  // RENDER
  // =========================================

  if (loading) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-3 text-gray-600">Carregando analytics...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`analytics-dashboard ${className}`}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Analytics do Produto
          </h3>
          <div className="flex items-center space-x-3">
            <Select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              options={periodOptions}
              className="w-40"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Atualizar
            </Button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800">{error}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="mt-2"
            >
              Fechar
            </Button>
          </div>
        )}

        {/* Filtros de Métricas */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {metricOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedMetric === option.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleMetricChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics?.views || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                +12% vs período anterior
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics?.sales || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                +8% vs período anterior
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics?.revenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                +15% vs período anterior
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(analytics?.conversion_rate || 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-red-600">
                -2% vs período anterior
              </span>
            </div>
          </Card>
        </div>

        {/* Gráficos e Detalhes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Vendas */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Vendas ao Longo do Tempo
            </h4>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Gráfico de vendas</p>
                <p className="text-sm">Integração com biblioteca de gráficos</p>
              </div>
            </div>
          </Card>

          {/* Métricas de Engajamento */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Métricas de Engajamento
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tempo médio na página</span>
                <span className="font-semibold">2m 34s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa de rejeição</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Páginas por sessão</span>
                <span className="font-semibold">3.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa de cliques</span>
                <span className="font-semibold">12.5%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Referrers */}
        <div className="mt-6">
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Principais Fontes de Tráfego
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Google</span>
                </div>
                <span className="text-sm font-semibold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Facebook</span>
                </div>
                <span className="text-sm font-semibold">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Instagram</span>
                </div>
                <span className="text-sm font-semibold">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Direto</span>
                </div>
                <span className="text-sm font-semibold">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Outros</span>
                </div>
                <span className="text-sm font-semibold">5%</span>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;

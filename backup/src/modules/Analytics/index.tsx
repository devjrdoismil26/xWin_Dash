// ========================================
// MÓDULO ANALYTICS - ENTRY POINT
// ========================================
// Ponto de entrada principal do módulo Analytics
// Máximo: 100 linhas

import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Activity,
  RefreshCw,
  Settings,
  Download,
  Share2,
  Filter,
  Calendar,
  Target,
  Zap,
  Brain,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

// Lazy loading de componentes complexos
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
const AnalyticsCharts = React.lazy(() => import('./components/AnalyticsCharts'));
const AnalyticsMetrics = React.lazy(() => import('./components/AnalyticsMetrics'));
const AnalyticsInsights = React.lazy(() => import('./components/AnalyticsInsights'));
const AnalyticsRealTime = React.lazy(() => import('./components/AnalyticsRealTime'));
const AnalyticsFilters = React.lazy(() => import('./components/AnalyticsFilters'));
const AnalyticsReports = React.lazy(() => import('./components/AnalyticsReports'));
const AnalyticsExport = React.lazy(() => import('./components/AnalyticsExport'));
const AnalyticsActions = React.lazy(() => import('./components/AnalyticsActions'));
const AnalyticsBreadcrumbs = React.lazy(() => import('./components/AnalyticsBreadcrumbs'));
const AnalyticsIntegrationTest = React.lazy(() => import('./components/AnalyticsIntegrationTest'));
const AnalyticsHeader = React.lazy(() => import('./components/AnalyticsHeader'));

// Lazy loading de páginas
const AnalyticsDetailPage = React.lazy(() => import('./pages/AnalyticsDetailPage'));
const AnalyticsCreatePage = React.lazy(() => import('./pages/AnalyticsCreatePage'));

// Lazy loading de hooks especializados
const useAnalyticsDashboard = React.lazy(() => import('./hooks/useAnalyticsDashboard'));
const useAnalyticsFilters = React.lazy(() => import('./hooks/useAnalyticsFilters'));
const useAnalyticsRealTime = React.lazy(() => import('./hooks/useAnalyticsRealTime'));
const useAnalyticsReports = React.lazy(() => import('./hooks/useAnalyticsReports'));

// Lazy loading de serviços especializados
const analyticsApiService = React.lazy(() => import('./services/analyticsApiService'));
const analyticsCacheService = React.lazy(() => import('./services/analyticsCacheService'));
const analyticsValidationService = React.lazy(() => import('./services/analyticsValidationService'));

// Lazy loading de utilitários
const analyticsHelpers = React.lazy(() => import('./utils/analyticsHelpers'));
const analyticsFormatters = React.lazy(() => import('./utils/analyticsFormatters'));
const analyticsValidators = React.lazy(() => import('./utils/analyticsValidators'));
const analyticsConstants = React.lazy(() => import('./utils/analyticsConstants'));

interface AnalyticsProps {
  auth?: any;
  page?: string;
  reportId?: string;
  reportType?: 'dashboard' | 'report' | 'insight' | 'metric';
  reportData?: any;
}

const Analytics: React.FC<AnalyticsProps> = ({ 
  auth, 
  page = 'index',
  reportId,
  reportType,
  reportData
}) => {
  const [isIntegrationTestVisible, setIsIntegrationTestVisible] = React.useState(false);

  const handleToggleIntegrationTest = () => {
    setIsIntegrationTestVisible(!isIntegrationTestVisible);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Carregando dashboard...</span>
          </div>}>
            <AnalyticsDashboard />
          </Suspense>
        );
      
      case 'reports':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Carregando relatórios...</span>
          </div>}>
            <AnalyticsReports />
          </Suspense>
        );
      
      case 'real-time':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Carregando tempo real...</span>
          </div>}>
            <AnalyticsRealTime />
          </Suspense>
        );
      
      case 'detail':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Carregando detalhes...</span>
          </div>}>
            <AnalyticsDetailPage 
              auth={auth}
              reportId={reportId}
              reportType={reportType}
              reportData={reportData}
            />
          </Suspense>
        );
      
      case 'create':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Carregando criação...</span>
          </div>}>
            <AnalyticsCreatePage 
              auth={auth}
              type={reportType}
            />
          </Suspense>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-gray-600">Análise completa de dados e métricas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleToggleIntegrationTest}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {isIntegrationTestVisible ? 'Ocultar' : 'Mostrar'} Teste
                </Button>
              </div>
            </div>

            {/* Integration Test */}
            {isIntegrationTestVisible && (
              <Suspense fallback={<div>Carregando teste de integração...</div>}>
                <AnalyticsIntegrationTest />
              </Suspense>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Visualizações</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                      <p className="text-xs text-green-600">+12.5% vs período anterior</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Usuários Únicos</p>
                      <p className="text-2xl font-bold text-gray-900">89</p>
                      <p className="text-xs text-green-600">+8.3% vs período anterior</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sessões</p>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                      <p className="text-xs text-red-600">-2.1% vs período anterior</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-gray-900">3.2%</p>
                      <p className="text-xs text-green-600">+0.5% vs período anterior</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Relatório mensal exportado</p>
                      <p className="text-xs text-gray-600">Há 2 horas</p>
                    </div>
                    <Badge variant="secondary">PDF</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Novos insights gerados</p>
                      <p className="text-xs text-gray-600">Há 4 horas</p>
                    </div>
                    <Badge variant="default">3 insights</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Anomalia detectada no tráfego</p>
                      <p className="text-xs text-gray-600">Há 6 horas</p>
                    </div>
                    <Badge variant="outline">Atenção</Badge>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        );
    }
  };

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Analytics - xWin Dash" />
      <PageLayout>
        {renderPage()}
      </PageLayout>
    </AuthenticatedLayout>
  );
};

// Exportações diretas para acesso rápido
export { useAnalyticsStore } from './hooks/useAnalyticsStore';
export { AnalyticsIntegrationTest } from './components/AnalyticsIntegrationTest';

export default Analytics;

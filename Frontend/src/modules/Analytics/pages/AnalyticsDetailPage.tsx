/**
 * Página de Detalhes de Analytics
 *
 * @description
 * Página para visualizar detalhes específicos de analytics incluindo
 * dashboards, relatórios e insights com gráficos, métricas e insights.
 *
 * @module modules/Analytics/pages/AnalyticsDetailPage
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useValidatedGet } from '@/hooks/useValidatedApi';
import { AnalyticsReportSchema, type AnalyticsReport } from '@/schemas';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { cn } from '@/lib/utils';
import { ArrowLeft, Download, Share2, Edit, Trash2, Calendar, RefreshCw } from 'lucide-react';

/**
 * Props do componente AnalyticsDetailPage
 *
 * @interface AnalyticsDetailPageProps
 * @property {any} [auth] - Dados de autenticação (opcional)
 * @property {string} id - ID do relatório a exibir
 */
interface AnalyticsDetailPageProps {
  auth?: string;
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AnalyticsDetailPage
 *
 * @description
 * Renderiza página de detalhes de analytics com abas para overview,
 * gráficos, insights e dados brutos. Permite editar, excluir e exportar.
 *
 * @param {AnalyticsDetailPageProps} props - Props do componente
 * @returns {JSX.Element} Página de detalhes de analytics
 */
export const AnalyticsDetailPage: React.FC<AnalyticsDetailPageProps> = ({ auth,
  id
   }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'data'>('overview');

  // Hook para buscar detalhes do relatório
  const {
    data: report,
    loading,
    error,
    fetch: refreshReport
  } = useValidatedGet<AnalyticsReport>(
    `/api/analytics/reports/${id}`,
    AnalyticsReportSchema,
    true // autoFetch);

  // Estados de loading e error
  if (loading) {
    return (
        <>
      <AuthenticatedLayout />
      <Head title="Carregando relatório..." / />
        <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></AuthenticatedLayout>);

  }

  if (error || !report) {
    return (
        <>
      <AuthenticatedLayout />
      <Head title="Erro" / />
        <div className=" ">$2</div><ErrorState
            title="Erro ao carregar relatório"
            description={ typeof error === 'string' ? error : 'Relatório não encontrado' }
            onRetry={ refreshReport }
          / /></div></AuthenticatedLayout>);

  }

  const handleExport = async (format: string) => {
    try {
      await exportData(reportId || 'detail', format);

    } catch (error) {
      console.error('Erro ao exportar:', error);

    } ;

  const handleShare = () => {
    // Implementar compartilhamento};

  const handleEdit = () => {
    // Implementar edição};

  const handleDelete = () => {
    // Implementar exclusão};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'dashboard':
        return 'Dashboard';
      case 'report':
        return 'Relatório';
      case 'insight':
        return 'Insight';
      case 'metric':
        return 'Métrica';
      default:
        return 'Analytics';
    } ;

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'dashboard':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'report':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'insight':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'metric':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    } ;

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye },
    { id: 'charts', label: 'Gráficos', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'raw-data', label: 'Dados Brutos', icon: RefreshCw }
  ];

  if (loading || isLoading) { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Detalhes - Analytics" / />
        <PageLayout />
          <div className=" ">$2</div><RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Carregando detalhes...</span></div></PageLayout>
      </AuthenticatedLayout>);

  }

  if (error) { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Erro - Analytics" / />
        <PageLayout />
          <div className=" ">$2</div><div className="text-red-600 mb-4">{error}</div>
            <Button onClick={ () => window.location.reload()  }>
              Tentar Novamente
            </Button></div></PageLayout>
      </AuthenticatedLayout>);

  }

  return (
        <>
      <AuthenticatedLayout user={ auth?.user } />
      <Head title="Detalhes - Analytics" / />
      <PageLayout />
        <div className="{/* Breadcrumbs */}">$2</div>
          <AnalyticsBreadcrumbs 
            items={[
              { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Eye },
              { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
              { id: 'detail', label: 'Detalhes', icon: Eye, current: true }
            ]}
  >
          {/* Header */}
          <div className=" ">$2</div><div className=" ">$2</div><Button
                variant="outline"
                size="sm"
                onClick={ () => window.history.back()  }>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              
              <div>
           
        </div><h1 className="text-2xl font-bold text-gray-900" />
                  {reportData?.name || 'Detalhes do Relatório'}
                </h1>
                <div className=" ">$2</div><Badge className={getReportTypeColor(reportType) } />
                    {getReportTypeLabel(reportType)}
                  </Badge>
                  {reportData?.created_at && (
                    <div className=" ">$2</div><Calendar className="h-3 w-3" />
                      Criado em {formatDate(reportData.created_at)}
                    </div>
                  )}
                  {reportData?.updated_at && (
                    <div className=" ">$2</div><Clock className="h-3 w-3" />
                      Atualizado em {formatDate(reportData.updated_at)}
                    </div>
                  )}
                  {reportData?.created_by && (
                    <div className=" ">$2</div><User className="h-3 w-3" />
                      {reportData.created_by}
                    </div>
                  )}
                </div></div><div className=" ">$2</div><Button
                variant="outline"
                onClick={ () => handleExport('pdf')  }>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={ () => handleExport('excel')  }>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button
                variant="outline"
                onClick={ handleShare } />
                <Share2 className="h-4 w-4 mr-1" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                onClick={ handleEdit } />
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={ handleDelete }
                className="text-red-600 hover:text-red-700" />
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>

          {/* Tabs */}
          <div className=" ">$2</div><nav className="-mb-px flex space-x-8" />
              {(tabs || []).map((tab: unknown) => {
                const IconComponent = tab.icon;
                return (
                          <button
                    key={ tab.id }
                    onClick={ () => setActiveTab(tab.id as any) }
                    className={cn(
                      "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm",
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )  }>
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>);

              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="{activeTab === 'overview' && (">$2</div>
              <div className="{/* Descrição */}">$2</div>
                {reportData?.description && (
                  <Card />
                    <Card.Header />
                      <Card.Title>Descrição</Card.Title>
                    </Card.Header>
                    <Card.Content />
                      <p className="text-gray-700">{reportData.description}</p>
                    </Card.Content>
      </Card>
    </>
  )}

                {/* Métricas Principais */}
                <AnalyticsMetrics 
                  data={ metrics }
                  loading={ loading  }>
          {/* Resumo */}
                <Card />
                  <Card.Header />
                    <Card.Title>Resumo Executivo</Card.Title>
                  </Card.Header>
                  <Card.Content />
                    <div className=" ">$2</div><div className=" ">$2</div><div className="text-3xl font-bold text-blue-900">1,247</div>
                        <div className="text-sm text-blue-700">Visualizações</div>
                        <div className="text-xs text-blue-600 mt-1">+12.5% vs período anterior</div>
                      <div className=" ">$2</div><div className="text-3xl font-bold text-green-900">89</div>
                        <div className="text-sm text-green-700">Usuários Únicos</div>
                        <div className="text-xs text-green-600 mt-1">+8.3% vs período anterior</div>
                      <div className=" ">$2</div><div className="text-3xl font-bold text-purple-900">42%</div>
                        <div className="text-sm text-purple-700">Taxa de Rejeição</div>
                        <div className="text-xs text-purple-600 mt-1">-5.2% vs período anterior</div></div></Card.Content></Card></div>
            )}

            {activeTab === 'charts' && (
              <AnalyticsCharts 
                data={ charts }
                loading={ loading }
              / />
            )}

            {activeTab === 'insights' && (
              <AnalyticsInsights 
                insights={ insights }
                loading={ loading }
              / />
            )}

            {activeTab === 'raw-data' && (
              <Card />
                <Card.Header />
                  <Card.Title>Dados Brutos</Card.Title>
                </Card.Header>
                <Card.Content />
                  <div className=" ">$2</div><pre className="text-sm text-gray-700 overflow-auto" />
                      {JSON.stringify(reportData || dashboard, null, 2)}
                    </pre></div></Card.Content>
      </Card>
    </>
  )}
          </div></PageLayout></AuthenticatedLayout>);};

export default AnalyticsDetailPage;
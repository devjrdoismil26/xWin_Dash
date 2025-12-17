/**
 * Página ADStoolDetailPage - Detalhes de Itens do ADStool
 *
 * @description
 * Página de detalhes que exibe informações completas de um item específico
 * do ADStool (campanha, conta ou criativo). Mostra estatísticas, métricas,
 * informações básicas e permite ações de edição/exclusão.
 *
 * Funcionalidades principais:
 * - Exibição de detalhes completos do item
 * - Métricas e estatísticas para campanhas
 * - Status e badges visuais
 * - Ações de edição e exclusão
 * - Loading state durante carregamento
 * - Estados de erro (item não encontrado)
 * - Formatação de valores (moeda, porcentagem, números)
 * - Integração com hook useADStool
 * - Suporte completo a dark mode
 *
 * @module modules/ADStool/pages/ADStoolDetailPage
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // Detalhes de campanha
 * <ADStoolDetailPage type="campaign" id="123" auth={auth} / />
 *
 * // Detalhes de conta
 * <ADStoolDetailPage type="account" id="456" auth={auth} / />
 *
 * // Detalhes de criativo
 * <ADStoolDetailPage type="creative" id="789" auth={auth} / />
 * ```
 */

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Settings, BarChart3, Edit, Trash2 } from 'lucide-react';
import { useValidatedGet } from '@/hooks/useValidatedApi';
import { CampaignMetricsSchema, type CampaignMetrics } from '@/schemas';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';
import useADStool from '../hooks/useADStool';

/**
 * Props do componente ADStoolDetailPage
 *
 * @description
 * Propriedades que podem ser passadas para o componente ADStoolDetailPage.
 *
 * @interface ADStoolDetailPageProps
 * @property {any} [auth] - Dados de autenticação do usuário (opcional)
 * @property {string} id - ID único da campanha a ser visualizada
 */
interface ADStoolDetailPageProps {
  auth?: string;
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ADStoolDetailPage
 *
 * @description
 * Renderiza uma página de detalhes com informações completas do item.
 * Gerencia carregamento de dados, estados de loading e erro, e exibe
 * métricas formatadas para campanhas.
 *
 * @component
 * @param {ADStoolDetailPageProps} props - Props do componente
 * @param {any} [props.auth] - Dados de autenticação
 * @param {DetailItemType} props.type - Tipo de item
 * @param {string} props.id - ID do item
 * @returns {JSX.Element} Página de detalhes renderizada
 */
const ADStoolDetailPage: React.FC<ADStoolDetailPageProps> = ({ auth, 
  id 
   }) => {
  const { formatCurrency, formatNumber, formatPercentage } = useADStool();

  // Hook para buscar detalhes da campanha
  const {
    data: campaign,
    loading,
    error,
    fetch: refreshCampaign
  } = useValidatedGet<CampaignMetrics>(
    `/api/adstool/campaigns/${id}`,
    CampaignMetricsSchema,
    true // autoFetch);

  // Estados de loading e error
  if (loading) {
    return (
        <>
      <AuthenticatedLayout />
      <Head title="Carregando..." / />
        <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></AuthenticatedLayout>);

  }

  if (error || !campaign) {
    return (
        <>
      <AuthenticatedLayout />
      <Head title="Erro" / />
        <div className=" ">$2</div><ErrorState
            title="Erro ao carregar campanha"
            description={ typeof error === 'string' ? error : 'Campanha não encontrada' }
            onRetry={ refreshCampaign }
          / /></div></AuthenticatedLayout>);

  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'secondary' | 'destructive'> = {
      active: 'success',
      paused: 'secondary',
      completed: 'destructive',
      draft: 'secondary',};

    return (
              <Badge variant={ variants[status] || 'secondary' } />
        {status.toUpperCase()}
      </Badge>);};

  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <AuthenticatedLayout />
        <Head title={`${campaign.name} - ADStool - xWin Dash`} / />
        <PageLayout />
          <div className="{/* Header */}">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><Link href="/adstool" />
                  <Button variant="outline" size="sm" />
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button></Link><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
                    {campaign.name}
                  </h1>
                  <div className="{getStatusBadge(campaign.status)}">$2</div>
                    <Badge variant="outline">{campaign.platform}</Badge></div></div>
              <div className=" ">$2</div><Button variant="outline" size="sm" />
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" />
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" />
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>

            {/* Stats */}
            {true && (
              <ResponsiveGrid
                columns={ xs: 1, sm: 2, lg: 4 } gap={ xs: '1rem', md: '1.5rem' } />
                <Card />
                  <Card.Content className="p-6 text-center" />
                    <h3 className="text-2xl font-bold text-gray-900" />
                      <AnimatedCounter
                        value={ campaign.total_spend }
                        duration={ 2000 }
                        prefix="R$ "
                        decimals={ 2 }
                      / /></h3><p className="text-gray-600">Gasto Total</p>
                  </Card.Content></Card><Card />
                  <Card.Content className="p-6 text-center" />
                    <h3 className="text-2xl font-bold text-gray-900" />
                      <AnimatedCounter
                        value={ campaign.impressions }
                        duration={ 2000 }
                      / /></h3><p className="text-gray-600">Impressões</p>
                  </Card.Content></Card><Card />
                  <Card.Content className="p-6 text-center" />
                    <h3 className="text-2xl font-bold text-gray-900" />
                      <AnimatedCounter
                        value={ campaign.clicks }
                        duration={ 2000 }
                      / /></h3><p className="text-gray-600">Cliques</p>
                  </Card.Content></Card><Card />
                  <Card.Content className="p-6 text-center" />
                    <h3 className="text-2xl font-bold text-gray-900" />
                      {formatPercentage(campaign.ctr)}
                    </h3>
                    <p className="text-gray-600">CTR</p>
                  </Card.Content></Card></ResponsiveGrid>
            )}

            {/* Details */}
            <Card />
              <Card.Header />
                <Card.Title>Detalhes</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className=" ">$2</div><div>
           
        </div><h4 className="font-semibold text-gray-900 mb-2">Informações Básicas</h4>
                    <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Nome:</span>
                        <span className="font-medium">{campaign.name}</span></div><div className=" ">$2</div><span className="text-gray-600">Status:</span>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className=" ">$2</div><span className="text-gray-600">Plataforma:</span>
                        <span className="font-medium">{campaign.platform}</span>
                      </div>
                      {campaign.daily_budget && (
                        <div className=" ">$2</div><span className="text-gray-600">Orçamento Diário:</span>
                          <span className="{formatCurrency(campaign.daily_budget)}">$2</span>
                          </span>
      </div>
    </>
  )}
                    </div>
                  <div>
           
        </div><h4 className="font-semibold text-gray-900 mb-2">Datas</h4>
                    <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Criado em:</span>
                        <span className="{new Date(campaign.created_at).toLocaleDateString('pt-BR')}">$2</span>
                        </span></div><div className=" ">$2</div><span className="text-gray-600">Atualizado em:</span>
                        <span className="{new Date(campaign.updated_at || campaign.created_at).toLocaleDateString('pt-BR')}">$2</span>
                        </span></div></div>
              </Card.Content></Card></div></PageLayout></AuthenticatedLayout></PageTransition>);};

export default ADStoolDetailPage;

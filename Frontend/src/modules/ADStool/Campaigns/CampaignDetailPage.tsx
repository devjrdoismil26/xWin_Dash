/**
 * Página de visualização de campanha
 * @module modules/ADStool/Campaigns/Show
 * @description
 * Página para visualizar detalhes de uma campanha de anúncios, incluindo
 * informações gerais, métricas, gráficos de performance e ações disponíveis.
 * Integra com AuthenticatedLayout e PageLayout para fornecer estrutura
 * consistente de página.
 * @since 1.0.0
 */
import React from 'react';
import { Head } from '@inertiajs/react';
import CampaignActions from './components/CampaignActions';
import CampaignMetricsChart from './components/CampaignMetricsChart';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import PageLayout from '@/layouts/PageLayout';
import { AdsCampaign } from '../types/adsCampaignTypes';

/**
 * Interface ShowProps - Props do componente Show
 * @interface ShowProps
 * @property {AdsCampaign} campaign - Dados da campanha a ser exibida
 */
interface ShowProps {
  campaign: AdsCampaign;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Formata data para exibição em português
 * @param {string} [dateString] - String de data a ser formatada (opcional)
 * @returns {string} Data formatada ou 'N/A' se não fornecida
 */
const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

/**
 * Componente Show - Página de Visualização de Campanha
 * @component
 * @description
 * Componente que renderiza a página de visualização de detalhes de uma campanha de anúncios,
 * exibindo informações gerais (status, orçamento, datas), métricas de performance,
 * gráficos e ações disponíveis.
 * 
 * @param {ShowProps} props - Props do componente
 * @returns {JSX.Element} Página de visualização de campanha
 * 
 * @example
 * ```tsx
 * <Show campaign={campaignData} / />
 * ```
 */
const Show: React.FC<ShowProps> = ({ campaign    }) => {
  return (
        <>
      <AuthenticatedLayout />
      <Head title={`Campanha: ${campaign?.name || ''}`} / />
      <PageLayout
        title={ campaign?.name || 'Campanha' }
        actions={<Button onClick={() => { /* editar campanha */ } >Editar Campanha</Button>}
  >
        <div className=" ">$2</div><Card />
            <Card.Header />
              <Card.Title>Visão Geral</Card.Title>
            </Card.Header>
            <Card.Content className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" />
              <div>
           
        </div><p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-900">{campaign.status}</p></div><div>
           
        </div><p className="text-sm text-gray-500">Orçamento</p>
                <p className="font-medium text-gray-900">R$ {Number(campaign.budget || 0).toFixed(2)}</p></div><div>
           
        </div><p className="text-sm text-gray-500">Data de Início</p>
                <p className="font-medium text-gray-900">{formatDate(campaign.start_date)}</p></div><div>
           
        </div><p className="text-sm text-gray-500">Data de Fim</p>
                <p className="font-medium text-gray-900">{formatDate(campaign.end_date)}</p></div><div className=" ">$2</div><p className="text-sm text-gray-500">Criativos</p>
                <p className="font-medium text-gray-900">{campaign.creatives ? campaign.creatives.join(', ') : 'N/A'}</p></div></Card.Content></Card><Card />
            <Card.Header />
              <Card.Title>Ações</Card.Title>
            </Card.Header>
            <Card.Content />
              <CampaignActions campaign={campaign} / />
            </Card.Content></Card><Card />
            <Card.Header />
              <Card.Title>Métricas de Performance</Card.Title>
            </Card.Header>
            <Card.Content />
              <CampaignMetricsChart campaignId={campaign.id} / />
            </Card.Content></Card></div></PageLayout></AuthenticatedLayout>);};

export default Show;

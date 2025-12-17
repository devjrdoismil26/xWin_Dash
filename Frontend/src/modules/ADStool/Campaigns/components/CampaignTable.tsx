/**
 * Tabela de campanhas de anúncios
 *
 * @description
 * Componente para exibir lista de campanhas de anúncios em formato de tabela.
 * Suporta múltiplas plataformas, diferentes status e ações (visualizar, editar,
 * excluir, pausar, ativar, parar).
 *
 * @module modules/ADStool/Campaigns/components/CampaignTable
 * @since 1.0.0
 */

import React from 'react';
import { Eye, Edit, Trash2, Play, Pause, Square } from 'lucide-react';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import { Table, TableColumn } from '@/shared/components/ui/Table';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { AdsCampaign, AdsCampaignStatus } from '../../types/adsCampaignTypes';
import { AdsPlatform } from '../../types/adsAccountTypes';

/**
 * Props do componente CampaignTable
 *
 * @interface CampaignTableProps
 * @property {AdsCampaign[]} campaigns - Lista de campanhas
 * @property {(campaign: AdsCampaign) => void} [onEdit] - Callback para editar campanha
 * @property {(campaign: AdsCampaign) => void} [onDelete] - Callback para excluir campanha
 * @property {(campaign: AdsCampaign) => void} [onViewDetails] - Callback para visualizar detalhes
 * @property {(campaign: AdsCampaign) => void} [onPlay] - Callback para ativar campanha
 * @property {(campaign: AdsCampaign) => void} [onPause] - Callback para pausar campanha
 * @property {(campaign: AdsCampaign) => void} [onStop] - Callback para parar campanha
 * @property {boolean} [loading] - Se está carregando dados
 */
interface CampaignTableProps {
  campaigns: AdsCampaign[];
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onViewDetails??: (e: any) => void;
  onPlay??: (e: any) => void;
  onPause??: (e: any) => void;
  onStop??: (e: any) => void;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
/**
 * Componente CampaignTable
 *
 * @description
 * Renderiza tabela de campanhas com colunas para nome, plataforma, status,
 * orçamento, período e ações. Exibe spinner durante carregamento e
 * mensagem quando não há campanhas disponíveis.
 *
 * @param {CampaignTableProps} props - Props do componente
 * @returns {JSX.Element} Tabela de campanhas
 *
 * @example
 * ```tsx
 * <CampaignTable
 *   campaigns={ campaigns }
 *   onEdit={ (campaign: unknown) => handleEdit(campaign) }
 *   onPause={ (campaign: unknown) => handlePause(campaign) }
 *   loading={ isLoading }
 * />
 * ```
 */
const CampaignTable: React.FC<CampaignTableProps> = React.memo(({ 
  campaigns = [] as unknown[], 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onPlay,
  onPause,
  onStop,
  loading = false 
}) => {
  if (loading) {
    return <LoadingSpinner text="Carregando campanhas..." />;
  }
  if (!campaigns || campaigns.length === 0) {
    return <div className="text-sm text-gray-600">Nenhuma campanha encontrada.</div>;
  }
  const getStatusBadge = (status: AdsCampaignStatus) => {
    const statusConfig: Record<AdsCampaignStatus, { variant: string; label: string }> = {
      active: { variant: 'success', label: 'Ativa' },
      paused: { variant: 'warning', label: 'Pausada' },
      deleted: { variant: 'destructive', label: 'Excluída' },
      pending: { variant: 'secondary', label: 'Pendente' } ;

    const config = statusConfig[status] || { variant: 'outline', label: status};

    return <Badge variant={ config.variant as 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'primary' | 'info' }>{config.label}</Badge>;};

  const getPlatformBadge = (platform: AdsPlatform) => {
    const platformConfig: Record<AdsPlatform, { variant: string; label: string }> = {
      google_ads: { variant: 'primary', label: 'Google Ads' },
      facebook_ads: { variant: 'secondary', label: 'Facebook Ads' },
      linkedin_ads: { variant: 'outline', label: 'LinkedIn Ads' },
      twitter_ads: { variant: 'info', label: 'Twitter Ads' },
      tiktok_ads: { variant: 'warning', label: 'TikTok Ads' } ;

    const config = platformConfig[platform] || { variant: 'outline', label: platform};

    return <Badge variant={ config.variant as 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'primary' | 'info' }>{config.label}</Badge>;};

  const formatBudget = (budget?: number): string => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget || 0);

  const formatDate = (dateString?: string): string => 
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  const getBudgetUtilization = (campaign: AdsCampaign): number => {
    if (!campaign.budget || !campaign.daily_budget) return 0;
    return Math.min((campaign.daily_budget / campaign.budget) * 100, 100);};

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Campanha',
      render: (campaign: unknown) => {
        const camp = campaign as AdsCampaign;
        return (
        <>
      <div>
      </div><div className="font-medium text-gray-900">{camp.name}</div>
          <div className="text-sm text-gray-500">{camp.objective}</div>);

      },
    },
    { 
      key: 'platform', 
      label: 'Plataforma', 
      render: (campaign: unknown) => {
        const camp = campaign as AdsCampaign;
        return getPlatformBadge(camp.platform);

      } ,
    { 
      key: 'status', 
      label: 'Status', 
      render: (campaign: unknown) => {
        const camp = campaign as AdsCampaign;
        return getStatusBadge(camp.status);

      } ,
    { 
      key: 'budget', 
      label: 'Orçamento', 
      render: (campaign: unknown) => {
        const camp = campaign as AdsCampaign;
        return (
        <>
      <div>
      </div><div className="font-medium">{formatBudget(camp.budget)}</div>
          {camp.daily_budget && (
            <div className="{formatBudget(camp.daily_budget)}/dia">$2</div>
    </div>
  )}
        </div>);

      } ,
    { 
      key: 'dates', 
      label: 'Período', 
      render: (campaign: unknown) => {
        const camp = campaign as AdsCampaign;
        return (
        <>
      <div>
      </div><div className="text-sm">{formatDate(camp.start_date)}</div>
          <div className="{camp.end_date ? formatDate(camp.end_date) : 'Sem fim'}">$2</div>
          </div>);

      } ,
    {
      key: 'actions',
      label: 'Ações',
      render: (campaign: unknown) => {
        const camp = campaign as AdsCampaign;
        return (
                <div className=" ">$2</div><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onViewDetails?.(camp) }
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" /></Button><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onEdit?.(camp) }
            title="Editar campanha"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {camp.status === 'active' ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ () => onPause?.(camp) }
              title="Pausar campanha"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ () => onPlay?.(camp) }
              title="Ativar campanha"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={ () => onStop?.(camp) }
            title="Parar campanha"
          >
            <Square className="h-4 w-4" /></Button><Button 
            variant="destructive" 
            size="sm" 
            onClick={ () => onDelete?.(camp) }
            title="Excluir campanha"
          >
            <Trash2 className="h-4 w-4" /></Button></div>);

      },
    },
  ] as const;
  return (
            <Table 
      columns={ columns }
      data={ campaigns }
      emptyMessage="Nenhuma campanha encontrada" 
    / />);

});

CampaignTable.displayName = 'CampaignTable';
export default CampaignTable;

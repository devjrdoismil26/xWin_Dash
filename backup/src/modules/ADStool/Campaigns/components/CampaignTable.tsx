import React from 'react';
import { Eye, Edit, Trash2, Play, Pause, Square } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { AdsCampaign, AdsCampaignStatus, AdsPlatform } from '../../types/adsCampaignTypes';
interface CampaignTableProps {
  campaigns: AdsCampaign[];
  onEdit?: (campaign: AdsCampaign) => void;
  onDelete?: (campaign: AdsCampaign) => void;
  onViewDetails?: (campaign: AdsCampaign) => void;
  onPlay?: (campaign: AdsCampaign) => void;
  onPause?: (campaign: AdsCampaign) => void;
  onStop?: (campaign: AdsCampaign) => void;
  loading?: boolean;
}
const CampaignTable: React.FC<CampaignTableProps> = React.memo(({ 
  campaigns = [], 
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
      pending: { variant: 'secondary', label: 'Pendente' }
    };
    const config = statusConfig[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };
  const getPlatformBadge = (platform: AdsPlatform) => {
    const platformConfig: Record<AdsPlatform, { variant: string; label: string }> = {
      google_ads: { variant: 'primary', label: 'Google Ads' },
      facebook_ads: { variant: 'secondary', label: 'Facebook Ads' },
      linkedin_ads: { variant: 'outline', label: 'LinkedIn Ads' },
      twitter_ads: { variant: 'info', label: 'Twitter Ads' },
      tiktok_ads: { variant: 'warning', label: 'TikTok Ads' }
    };
    const config = platformConfig[platform] || { variant: 'outline', label: platform };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };
  const formatBudget = (budget?: number): string => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget || 0);
  const formatDate = (dateString?: string): string => 
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  const getBudgetUtilization = (campaign: AdsCampaign): number => {
    if (!campaign.budget || !campaign.daily_budget) return 0;
    return Math.min((campaign.daily_budget / campaign.budget) * 100, 100);
  };
  const columns = [
    {
      key: 'name',
      label: 'Campanha',
      render: (campaign: AdsCampaign) => (
        <div>
          <div className="font-medium text-gray-900">{campaign.name}</div>
          <div className="text-sm text-gray-500">{campaign.objective}</div>
        </div>
      ),
    },
    { 
      key: 'platform', 
      label: 'Plataforma', 
      render: (campaign: AdsCampaign) => getPlatformBadge(campaign.platform) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (campaign: AdsCampaign) => getStatusBadge(campaign.status) 
    },
    { 
      key: 'budget', 
      label: 'Orçamento', 
      render: (campaign: AdsCampaign) => (
        <div>
          <div className="font-medium">{formatBudget(campaign.budget)}</div>
          {campaign.daily_budget && (
            <div className="text-sm text-gray-500">
              {formatBudget(campaign.daily_budget)}/dia
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'dates', 
      label: 'Período', 
      render: (campaign: AdsCampaign) => (
        <div>
          <div className="text-sm">{formatDate(campaign.start_date)}</div>
          <div className="text-sm text-gray-500">
            {campaign.end_date ? formatDate(campaign.end_date) : 'Sem fim'}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (campaign: AdsCampaign) => (
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails?.(campaign)}
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit?.(campaign)}
            title="Editar campanha"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {campaign.status === 'active' ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPause?.(campaign)}
              title="Pausar campanha"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPlay?.(campaign)}
              title="Ativar campanha"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onStop?.(campaign)}
            title="Parar campanha"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete?.(campaign)}
            title="Excluir campanha"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Table 
      columns={columns} 
      data={campaigns} 
      emptyMessage="Nenhuma campanha encontrada" 
    />
  );
});
CampaignTable.displayName = 'CampaignTable';
export default CampaignTable;

import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { AdsAccount, AdsPlatform, AdsAccountStatus } from '../../types/adsAccountTypes';
interface AdAccountTableProps {
  adAccounts: AdsAccount[];
  onEdit?: (account: AdsAccount) => void;
  onDelete?: (account: AdsAccount) => void;
  onViewDetails?: (account: AdsAccount) => void;
}
const AdAccountTable: React.FC<AdAccountTableProps> = React.memo(({ 
  adAccounts = [], 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  if (!adAccounts || adAccounts.length === 0) {
    return <EmptyState text="Nenhuma conta de anúncios encontrada." />;
  }
  const getPlatformBadge = (platform: AdsPlatform) => {
    const platformConfig: Record<AdsPlatform, { variant: string; label: string }> = {
      facebook_ads: { variant: 'primary', label: 'Facebook Ads' },
      google_ads: { variant: 'warning', label: 'Google Ads' },
      linkedin_ads: { variant: 'outline', label: 'LinkedIn Ads' },
      twitter_ads: { variant: 'info', label: 'Twitter Ads' },
      tiktok_ads: { variant: 'secondary', label: 'TikTok Ads' }
    };
    const config = platformConfig[platform] || { variant: 'outline', label: platform };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };
  const getStatusBadge = (status: AdsAccountStatus) => {
    const statusConfig: Record<AdsAccountStatus, { variant: string; label: string }> = {
      active: { variant: 'success', label: 'Ativa' },
      paused: { variant: 'secondary', label: 'Pausada' },
      suspended: { variant: 'destructive', label: 'Suspensa' },
      pending: { variant: 'warning', label: 'Pendente' }
    };
    const config = statusConfig[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };
  const formatDate = (dateString?: string): string => 
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  const formatCurrency = (value?: number, currency: string = 'BRL'): string =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value || 0);
  const columns = [
    {
      key: 'name',
      label: 'Nome da Conta',
      render: (account: AdsAccount) => (
        <div>
          <div className="font-medium text-gray-900">{account.name}</div>
          <div className="text-sm text-gray-500">ID: {account.account_id}</div>
        </div>
      ),
    },
    { 
      key: 'platform', 
      label: 'Plataforma', 
      render: (account: AdsAccount) => getPlatformBadge(account.platform) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (account: AdsAccount) => getStatusBadge(account.status) 
    },
    { 
      key: 'budget', 
      label: 'Orçamento', 
      render: (account: AdsAccount) => formatCurrency(account.budget, account.currency) 
    },
    { 
      key: 'last_sync', 
      label: 'Última Sincronização', 
      render: (account: AdsAccount) => formatDate(account.updated_at) 
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (account: AdsAccount) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails?.(account)} 
            className="h-8 px-2"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit?.(account)} 
            className="h-8 px-2"
            title="Editar conta"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete?.(account)} 
            className="h-8 px-2"
            title="Excluir conta"
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
      data={adAccounts} 
      emptyMessage="Nenhuma conta de anúncios encontrada" 
    />
  );
});
AdAccountTable.displayName = 'AdAccountTable';
export default AdAccountTable;

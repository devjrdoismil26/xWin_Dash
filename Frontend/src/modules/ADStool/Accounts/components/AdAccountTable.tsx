/**
 * Tabela de contas de anúncios
 *
 * @description
 * Componente para exibir lista de contas de anúncios em formato de tabela.
 * Suporta múltiplas plataformas (Facebook, Google, LinkedIn, Twitter, TikTok),
 * diferentes status e ações (visualizar, editar, excluir).
 *
 * @module modules/ADStool/Accounts/components/AdAccountTable
 * @since 1.0.0
 */

import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import { Table, TableColumn } from '@/shared/components/ui/Table';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { AdsAccount, AdsPlatform, AdsAccountStatus } from '../../types/adsAccountTypes';

/**
 * Props do componente AdAccountTable
 *
 * @interface AdAccountTableProps
 * @property {AdsAccount[]} adAccounts - Lista de contas de anúncios
 * @property {(account: AdsAccount) => void} [onEdit] - Callback para editar conta
 * @property {(account: AdsAccount) => void} [onDelete] - Callback para excluir conta
 * @property {(account: AdsAccount) => void} [onViewDetails] - Callback para visualizar detalhes
 */
interface AdAccountTableProps {
  adAccounts: AdsAccount[];
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onViewDetails??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
/**
 * Componente AdAccountTable
 *
 * @description
 * Renderiza tabela de contas de anúncios com colunas para nome, plataforma,
 * status, orçamento, última sincronização e ações.
 * Exibe estado vazio quando não há contas disponíveis.
 *
 * @param {AdAccountTableProps} props - Props do componente
 * @returns {JSX.Element} Tabela de contas de anúncios
 *
 * @example
 * ```tsx
 * <AdAccountTable
 *   adAccounts={ accounts }
 *   onEdit={ (account: unknown) => handleEdit(account) }
 *   onDelete={ (account: unknown) => handleDelete(account) }
 *   onViewDetails={ (account: unknown) => handleView(account) }
 * />
 * ```
 */
const AdAccountTable: React.FC<AdAccountTableProps> = React.memo(({ 
  adAccounts = [] as unknown[], 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  if (!adAccounts || adAccounts.length === 0) {
    return <EmptyState title="Nenhuma conta de anúncios encontrada." />;
  }
  const getPlatformBadge = (platform: AdsPlatform) => {
    const platformConfig: Record<AdsPlatform, { variant: string; label: string }> = {
      facebook_ads: { variant: 'primary', label: 'Facebook Ads' },
      google_ads: { variant: 'warning', label: 'Google Ads' },
      linkedin_ads: { variant: 'outline', label: 'LinkedIn Ads' },
      twitter_ads: { variant: 'info', label: 'Twitter Ads' },
      tiktok_ads: { variant: 'secondary', label: 'TikTok Ads' } ;

    const config = platformConfig[platform] || { variant: 'outline', label: platform};

    return <Badge variant={ config.variant as 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'primary' | 'info' }>{config.label}</Badge>;};

  const getStatusBadge = (status: AdsAccountStatus) => {
    const statusConfig: Record<AdsAccountStatus, { variant: string; label: string }> = {
      active: { variant: 'success', label: 'Ativa' },
      paused: { variant: 'secondary', label: 'Pausada' },
      suspended: { variant: 'destructive', label: 'Suspensa' },
      pending: { variant: 'warning', label: 'Pendente' } ;

    const config = statusConfig[status] || { variant: 'outline', label: status};

    return <Badge variant={ config.variant as 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'primary' | 'info' }>{config.label}</Badge>;};

  const formatDate = (dateString?: string): string => 
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  const formatCurrency = (value?: number, currency: string = 'BRL'): string =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value || 0);

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Nome da Conta',
      render: (account: unknown) => {
        const acc = account as AdsAccount;
        return (
        <>
      <div>
      </div><div className="font-medium text-gray-900">{acc.name}</div>
          <div className="text-sm text-gray-500">ID: {acc.account_id}</div>);

      },
    },
    { 
      key: 'platform', 
      label: 'Plataforma', 
      render: (account: unknown) => {
        const acc = account as AdsAccount;
        return getPlatformBadge(acc.platform);

      } ,
    { 
      key: 'status', 
      label: 'Status', 
      render: (account: unknown) => {
        const acc = account as AdsAccount;
        return getStatusBadge(acc.status);

      } ,
    { 
      key: 'budget', 
      label: 'Orçamento', 
      render: (account: unknown) => {
        const acc = account as AdsAccount;
        return formatCurrency(acc.budget, acc.currency);

      } ,
    { 
      key: 'last_sync', 
      label: 'Última Sincronização', 
      render: (account: unknown) => {
        const acc = account as AdsAccount;
        return formatDate(acc.updated_at);

      } ,
    {
      key: 'actions',
      label: 'Ações',
      render: (account: unknown) => {
        const acc = account as AdsAccount;
        return (
                <div className=" ">$2</div><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onViewDetails?.(acc) }
            className="h-8 px-2"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" /></Button><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onEdit?.(acc) }
            className="h-8 px-2"
            title="Editar conta"
          >
            <Edit className="h-4 w-4" /></Button><Button 
            variant="destructive" 
            size="sm" 
            onClick={ () => onDelete?.(acc) }
            className="h-8 px-2"
            title="Excluir conta"
          >
            <Trash2 className="h-4 w-4" /></Button></div>);

      },
    },
  ] as const;
  return (
            <Table 
      columns={ columns }
      data={ adAccounts }
      emptyMessage="Nenhuma conta de anúncios encontrada" 
    / />);

});

AdAccountTable.displayName = 'AdAccountTable';
export default AdAccountTable;

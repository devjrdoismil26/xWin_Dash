import React from 'react';
import { Eye, Edit, Trash2, Send, Pause, Play } from 'lucide-react';
import { Table } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { EmailCampaign, EmailCampaignStatus } from '@/types/emailTypes';
interface CampaignTableProps {
  campaigns: EmailCampaign[];
  onView??: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onSend??: (e: any) => void;
  onPause??: (e: any) => void;
  onResume??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const CampaignTable: React.FC<CampaignTableProps> = React.memo(({ 
  campaigns = [] as unknown[], 
  onView, 
  onEdit, 
  onDelete, 
  onSend, 
  onPause, 
  onResume 
}) => {
  const getStatusBadge = (status: EmailCampaignStatus) => {
    const statusConfig: Record<EmailCampaignStatus, { variant: string; label: string }> = {
      draft: { variant: 'secondary', label: 'Rascunho' },
      scheduled: { variant: 'warning', label: 'Agendada' },
      sending: { variant: 'info', label: 'Enviando' },
      sent: { variant: 'success', label: 'Enviada' },
      paused: { variant: 'warning', label: 'Pausada' },
      cancelled: { variant: 'destructive', label: 'Cancelada' } ;

    const config = statusConfig[status] || { variant: 'secondary', label: status};

    return <Badge variant={ config.variant as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }>{config.label}</Badge>;};

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');};

  const formatStats = (stats?: Record<string, any>): string => {
    if (!stats) return '-';
    return `${(stats.sent as number)?.toLocaleString() || 0} enviados`;};

  const columns = [
    { 
      key: 'name', 
      label: 'Nome',
      render: (campaign: EmailCampaign) => (
        <div>
           
        </div><div className="font-medium text-gray-900">{campaign.name}</div>
          <div className="text-sm text-gray-500">{campaign.subject}</div>
      )
  },
    { 
      key: 'status', 
      label: 'Status',
      render: (campaign: EmailCampaign) => getStatusBadge(campaign.status)
  },
    { 
      key: 'type', 
      label: 'Tipo',
      render: (campaign: EmailCampaign) => (
        <Badge variant="outline" />
          {campaign.type === 'regular' ? 'Regular' :
           campaign.type === 'automated' ? 'Automática' :
           campaign.type === 'ab_test' ? 'A/B Test' :
           campaign.type === 'remarketing' ? 'Remarketing' : campaign.type}
        </Badge>
      )
  },
    { 
      key: 'scheduled_at', 
      label: 'Agendada',
      render: (campaign: EmailCampaign) => formatDate(campaign.scheduled_at)
  },
    { 
      key: 'sent_at', 
      label: 'Enviada',
      render: (campaign: EmailCampaign) => formatDate(campaign.sent_at)
  },
    { 
      key: 'stats', 
      label: 'Estatísticas',
      render: (campaign: EmailCampaign) => formatStats(campaign.stats)
  },
    {
      key: 'actions',
      label: 'Ações',
      render: (campaign: EmailCampaign) => (
        <div className=" ">$2</div><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onView?.(campaign) }
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" /></Button><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onEdit?.(campaign) }
            title="Editar campanha"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {campaign.status === 'draft' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ () => onSend?.(campaign) }
              title="Enviar campanha"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
          {campaign.status === 'scheduled' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ () => onPause?.(campaign) }
              title="Pausar campanha"
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {campaign.status === 'paused' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ () => onResume?.(campaign) }
              title="Retomar campanha"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={ () => onDelete?.(campaign) }
            title="Excluir campanha"
          >
            <Trash2 className="h-4 w-4" /></Button></div>
      ),
    },
  ];
  return (
            <Table 
      columns={ columns }
      data={ campaigns }
      emptyMessage="Nenhuma campanha encontrada" 
    / />);

});

CampaignTable.displayName = 'CampaignTable';
export default CampaignTable;

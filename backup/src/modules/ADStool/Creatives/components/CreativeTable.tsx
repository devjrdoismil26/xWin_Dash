import React from 'react';
import { Eye, Edit, Trash2, Play, Pause, Square } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { AdsCreative, AdsCreativeType, AdsCreativeStatus } from '../../types/adsCreativeTypes';
interface CreativeTableProps {
  creatives: AdsCreative[];
  onEdit?: (creative: AdsCreative) => void;
  onDelete?: (creative: AdsCreative) => void;
  onViewDetails?: (creative: AdsCreative) => void;
  onPlay?: (creative: AdsCreative) => void;
  onPause?: (creative: AdsCreative) => void;
  onStop?: (creative: AdsCreative) => void;
}
const CreativeTable: React.FC<CreativeTableProps> = React.memo(({ 
  creatives = [], 
  onEdit, 
  onDelete, 
  onViewDetails,
  onPlay,
  onPause,
  onStop
}) => {
  if (!creatives || creatives.length === 0) {
    return <div className="text-sm text-gray-600">Nenhum criativo encontrado.</div>;
  }
  const getTypeBadge = (type: AdsCreativeType) => {
    const typeConfig: Record<AdsCreativeType, { variant: string; label: string }> = {
      image: { variant: 'primary', label: 'Imagem' },
      video: { variant: 'secondary', label: 'Vídeo' },
      carousel: { variant: 'warning', label: 'Carrossel' },
      collection: { variant: 'info', label: 'Coleção' },
      text: { variant: 'outline', label: 'Texto' }
    };
    const config = typeConfig[type] || { variant: 'outline', label: type };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };
  const getStatusBadge = (status: AdsCreativeStatus) => {
    const statusConfig: Record<AdsCreativeStatus, { variant: string; label: string }> = {
      active: { variant: 'success', label: 'Ativo' },
      paused: { variant: 'warning', label: 'Pausado' },
      rejected: { variant: 'destructive', label: 'Rejeitado' },
      pending: { variant: 'secondary', label: 'Pendente' }
    };
    const config = statusConfig[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };
  const formatDate = (dateString?: string): string => 
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  const getPerformanceColor = (performance?: any): string => {
    if (!performance) return 'text-gray-500';
    const ctr = performance.ctr || 0;
    if (ctr > 2) return 'text-green-600';
    if (ctr > 1) return 'text-yellow-600';
    return 'text-red-600';
  };
  const columns = [
    {
      key: 'name',
      label: 'Criativo',
      render: (creative: AdsCreative) => (
        <div>
          <div className="font-medium text-gray-900">{creative.name}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {creative.content?.headline || 'Sem título'}
          </div>
        </div>
      ),
    },
    { 
      key: 'type', 
      label: 'Tipo', 
      render: (creative: AdsCreative) => getTypeBadge(creative.type) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (creative: AdsCreative) => getStatusBadge(creative.status) 
    },
    { 
      key: 'campaign', 
      label: 'Campanha', 
      render: (creative: AdsCreative) => (
        <div className="text-sm">
          {creative.campaign_id ? `ID: ${creative.campaign_id}` : 'Não vinculado'}
        </div>
      )
    },
    { 
      key: 'performance', 
      label: 'Performance', 
      render: (creative: AdsCreative) => (
        <div className="text-sm">
          {creative.performance ? (
            <div>
              <div className={getPerformanceColor(creative.performance)}>
                CTR: {creative.performance.ctr?.toFixed(2)}%
              </div>
              <div className="text-gray-500">
                {creative.performance.impressions?.toLocaleString()} impressões
              </div>
            </div>
          ) : (
            <span className="text-gray-500">Sem dados</span>
          )}
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: 'Criado em', 
      render: (creative: AdsCreative) => formatDate(creative.created_at) 
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (creative: AdsCreative) => (
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails?.(creative)}
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit?.(creative)}
            title="Editar criativo"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {creative.status === 'active' ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPause?.(creative)}
              title="Pausar criativo"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPlay?.(creative)}
              title="Ativar criativo"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onStop?.(creative)}
            title="Parar criativo"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete?.(creative)}
            title="Excluir criativo"
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
      data={creatives} 
      emptyMessage="Nenhum criativo encontrado" 
    />
  );
});
CreativeTable.displayName = 'CreativeTable';
export default CreativeTable;

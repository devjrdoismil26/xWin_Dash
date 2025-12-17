/**
 * Tabela de criativos de anúncios
 *
 * @description
 * Componente para exibir lista de criativos de anúncios em formato de tabela.
 * Suporta múltiplos tipos, diferentes status e ações (visualizar, editar,
 * excluir, pausar, ativar, parar).
 *
 * @module modules/ADStool/Creatives/components/CreativeTable
 * @since 1.0.0
 */

import React from 'react';
import { Eye, Edit, Trash2, Play, Pause, Square } from 'lucide-react';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import { Table, TableColumn } from '@/shared/components/ui/Table';
import { AdsCreative, AdsCreativeType, AdsCreativeStatus } from '../../types/adsCreativeTypes';

/**
 * Props do componente CreativeTable
 *
 * @interface CreativeTableProps
 * @property {AdsCreative[]} creatives - Lista de criativos
 * @property {(creative: AdsCreative) => void} [onEdit] - Callback para editar criativo
 * @property {(creative: AdsCreative) => void} [onDelete] - Callback para excluir criativo
 * @property {(creative: AdsCreative) => void} [onViewDetails] - Callback para visualizar detalhes
 * @property {(creative: AdsCreative) => void} [onPlay] - Callback para ativar criativo
 * @property {(creative: AdsCreative) => void} [onPause] - Callback para pausar criativo
 * @property {(creative: AdsCreative) => void} [onStop] - Callback para parar criativo
 */
interface CreativeTableProps {
  creatives: AdsCreative[];
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onViewDetails??: (e: any) => void;
  onPlay??: (e: any) => void;
  onPause??: (e: any) => void;
  onStop??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
/**
 * Componente CreativeTable
 *
 * @description
 * Renderiza tabela de criativos com colunas para nome, tipo, status,
 * campanha associada, performance e ações.
 * Exibe mensagem quando não há criativos disponíveis.
 *
 * @param {CreativeTableProps} props - Props do componente
 * @returns {JSX.Element} Tabela de criativos
 *
 * @example
 * ```tsx
 * <CreativeTable
 *   creatives={ creatives }
 *   onEdit={ (creative: unknown) => handleEdit(creative) }
 *   onPause={ (creative: unknown) => handlePause(creative) }
 * />
 * ```
 */
const CreativeTable: React.FC<CreativeTableProps> = React.memo(({ 
  creatives = [] as unknown[], 
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
      slideshow: { variant: 'secondary', label: 'Slideshow' },
      canvas: { variant: 'primary', label: 'Canvas' },
      story: { variant: 'info', label: 'Story' },
      text: { variant: 'outline', label: 'Texto' },
      html5: { variant: 'warning', label: 'HTML5' },
      playable: { variant: 'primary', label: 'Playable' } ;

    const config = typeConfig[type] || { variant: 'outline', label: type};

    return <Badge variant={ config.variant as 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'primary' | 'info' }>{config.label}</Badge>;};

  const getStatusBadge = (status: AdsCreativeStatus) => {
    const statusConfig: Record<AdsCreativeStatus, { variant: string; label: string }> = {
      active: { variant: 'success', label: 'Ativo' },
      paused: { variant: 'warning', label: 'Pausado' },
      deleted: { variant: 'destructive', label: 'Excluído' },
      pending_review: { variant: 'secondary', label: 'Pendente Revisão' },
      approved: { variant: 'success', label: 'Aprovado' },
      rejected: { variant: 'destructive', label: 'Rejeitado' },
      disapproved: { variant: 'destructive', label: 'Desaprovado' } ;

    const config = statusConfig[status] || { variant: 'outline', label: status};

    return <Badge variant={ config.variant as 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'primary' | 'info' }>{config.label}</Badge>;};

  const formatDate = (dateString?: string): string => 
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  const getPerformanceColor = (performance?: { ctr?: number }): string => {
    if (!performance) return 'text-gray-500';
    const ctr = performance.ctr || 0;
    if (ctr > 2) return 'text-green-600';
    if (ctr > 1) return 'text-yellow-600';
    return 'text-red-600';};

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Criativo',
      render: (creative: unknown) => {
        const cr = creative as AdsCreative;
        return (
        <>
      <div>
      </div><div className="font-medium text-gray-900">{cr.name}</div>
          <div className="{cr.content?.headline || 'Sem título'}">$2</div>
          </div>);

      },
    },
    { 
      key: 'type', 
      label: 'Tipo', 
      render: (creative: unknown) => {
        const cr = creative as AdsCreative;
        return getTypeBadge(cr.type);

      } ,
    { 
      key: 'status', 
      label: 'Status', 
      render: (creative: unknown) => {
        const cr = creative as AdsCreative;
        return getStatusBadge(cr.status);

      } ,
    { 
      key: 'campaign', 
      label: 'Campanha', 
      render: (creative: unknown) => {
        const cr = creative as AdsCreative;
        return (
                <div className="{cr.campaign_id ? `ID: ${cr.campaign_id}` : 'Não vinculado'}">$2</div>
        </div>);

      } ,
    { key: 'performance', 
      label: 'Performance', 
      render: (creative: unknown) => {
        const cr = creative as AdsCreative;
        return (
                <div className="{cr.performance ? (">$2</div>
            <div>
           
        </div><div className={getPerformanceColor(cr.performance)  }>
          CTR: 
        </div>{cr.performance.ctr?.toFixed(2)}%
              </div>
              <div className="{cr.performance.impressions?.toLocaleString()} impressões">$2</div>
    </div>
  ) : (
            <span className="text-gray-500">Sem dados</span>
          )}
        </div>);

      } ,
    { 
      key: 'created_at', 
      label: 'Criado em', 
      render: (creative: unknown) => {
        const cr = creative as AdsCreative;
        return formatDate(cr.created_at);

      } ,
    {
      key: 'actions',
      label: 'Ações',
      render: (creative: unknown) => {
        const cr = creative as AdsCreative;
        return (
                <div className=" ">$2</div><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onViewDetails?.(cr) }
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" /></Button><Button 
            variant="outline" 
            size="sm" 
            onClick={ () => onEdit?.(cr) }
            title="Editar criativo"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {cr.status === 'active' ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ () => onPause?.(cr) }
              title="Pausar criativo"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={ () => onPlay?.(cr) }
              title="Ativar criativo"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={ () => onStop?.(cr) }
            title="Parar criativo"
          >
            <Square className="h-4 w-4" /></Button><Button 
            variant="destructive" 
            size="sm" 
            onClick={ () => onDelete?.(cr) }
            title="Excluir criativo"
          >
            <Trash2 className="h-4 w-4" /></Button></div>);

      },
    },
  ] as const;
  return (
            <Table 
      columns={ columns }
      data={ creatives }
      emptyMessage="Nenhum criativo encontrado" 
    / />);

});

CreativeTable.displayName = 'CreativeTable';
export default CreativeTable;

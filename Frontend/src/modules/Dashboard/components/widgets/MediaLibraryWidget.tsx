/**
 * @module modules/Dashboard/components/widgets/MediaLibraryWidget
 * @description
 * Widget de biblioteca de mídia.
 * 
 * Exibe métricas da biblioteca de mídia:
 * - Total de arquivos
 * - Tamanho total do armazenamento
 * - Uploads recentes
 * - Armazenamento usado
 * 
 * @example
 * ```typescript
 * <MediaLibraryWidget
 *   data={
 *     totalFiles: 5000,
 *     totalSize: 10737418240, // 10GB em bytes
 *     recentUploads: 50,
 *     storageUsed: 8589934592 // 8GB em bytes
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { MediaLibraryData, WidgetProps } from '@/types';

/**
 * Props do widget de biblioteca de mídia
 * @interface MediaLibraryWidgetProps
 * @extends WidgetProps
 */
interface MediaLibraryWidgetProps extends WidgetProps {
  /** Dados da biblioteca de mídia */
  data?: MediaLibraryData;
}

/**
 * Componente widget de biblioteca de mídia
 * @param {MediaLibraryWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de biblioteca de mídia
 */
const MediaLibraryWidget: React.FC<MediaLibraryWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Biblioteca de Mídia</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="animate-pulse">Carregando...</div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Biblioteca de Mídia</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Biblioteca de Mídia</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Total de Arquivos: {(data.totalFiles || 0).toLocaleString('pt-BR')}</div>
          <div>Tamanho Total: {formatBytes(data.totalSize)}</div>
          <div className="text-green-600">Uploads Recentes: {(data.recentUploads || 0).toLocaleString('pt-BR')}</div>
          {data.storageUsed && (
            <div>Armazenamento: {formatBytes(data.storageUsed)}</div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default MediaLibraryWidget;

import React from 'react';
import Card from '@/components/ui/Card';
import { MediaLibraryData, WidgetProps } from '../../types';
interface MediaLibraryWidgetProps extends WidgetProps {
  data?: MediaLibraryData;
}
const MediaLibraryWidget: React.FC<MediaLibraryWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Biblioteca de Mídia</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse">Carregando...</div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Biblioteca de Mídia</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>Biblioteca de Mídia</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Total de Arquivos: {(data.totalFiles || 0).toLocaleString('pt-BR')}</div>
          <div>Tamanho Total: {formatBytes(data.totalSize)}</div>
          <div className="text-green-600">Uploads Recentes: {(data.recentUploads || 0).toLocaleString('pt-BR')}</div>
          {data.storageUsed && (
            <div>Armazenamento: {formatBytes(data.storageUsed)}</div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default MediaLibraryWidget;

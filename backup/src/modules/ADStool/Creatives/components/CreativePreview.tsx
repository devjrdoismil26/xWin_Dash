import React from 'react';
import { FileImage, FileVideo, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
const CreativePreview = React.memo(function CreativePreview({ creative }) {
  if (!creative) {
    return (
      <Card className="h-full">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FileImage size={48} className="mb-4" />
          <h3 className="text-lg font-medium">Nenhum criativo selecionado</h3>
          <p className="text-sm">Selecione um criativo para ver sua pré-visualização.</p>
        </div>
      </Card>
    );
  }
  const getTypeIcon = (type) => {
    const iconMap = { image: FileImage, video: FileVideo, text: FileText };
    const IconComponent = iconMap[type] || FileImage;
    return <IconComponent size={20} />;
  };
  const getTypeBadge = (type) => {
    const typeConfig = {
      image: { variant: 'primary', label: 'Imagem' },
      video: { variant: 'secondary', label: 'Vídeo' },
      carousel: { variant: 'warning', label: 'Carrossel' },
      text: { variant: 'outline', label: 'Texto' },
    };
    const config = typeConfig[type] || { variant: 'outline', label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  const renderMediaPreview = () => {
    const { type, preview_url, content_text } = creative;
    if (type === 'image' && preview_url) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={preview_url}
            alt={creative.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="hidden w-full h-full flex-col items-center justify-center text-gray-500">
            <span className="text-sm mt-2">Erro ao carregar imagem</span>
          </div>
        </div>
      );
    }
    if (type === 'video' && preview_url) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video className="w-full h-full" controls poster={creative.thumbnail_url}>
            Seu navegador não suporta vídeos.
          </video>
        </div>
      );
    }
    if (type === 'text' && content_text) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">{content_text}</div>
        </div>
      );
    }
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500">
        {getTypeIcon(creative.type)} <span className="text-sm mt-2">Preview não disponível</span>
      </div>
    );
  };
  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{creative.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              {getTypeBadge(creative.type)}
              {creative.status && (
                <Badge variant={creative.status === 'active' ? 'success' : 'secondary'}>
                  {creative.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {creative.description && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm">{creative.description}</p>
          </div>
        )}
        <div className="mb-4">{renderMediaPreview()}</div>
        <div className="space-y-3 text-sm">
          {creative.file_type && (
            <div className="text-gray-600">
              <span>Tipo: {creative.file_type}</span>
            </div>
          )}
          {creative.file_size && (
            <div className="text-gray-600">
              <span>Tamanho: {creative.file_size}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});
export default CreativePreview;

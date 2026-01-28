// =========================================
// MEDIA LIST COMPONENT
// =========================================
// Componente para exibir mídia em formato de lista
// Máximo: 150 linhas

import React from 'react';
import { Eye, Edit, Trash2, Download, MoreHorizontal, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { MediaFile } from '../types';

interface MediaListProps {
  media: MediaFile[];
  loading?: boolean;
  error?: string | null;
  selectedMedia?: string[];
  onMediaSelect?: (media: MediaFile) => void;
  onMediaEdit?: (media: MediaFile) => void;
  onMediaDelete?: (media: MediaFile) => void;
  onMediaDownload?: (media: MediaFile) => void;
  className?: string;
}

export const MediaList: React.FC<MediaListProps> = ({
  media,
  loading = false,
  error = null,
  selectedMedia = [],
  onMediaSelect,
  onMediaEdit,
  onMediaDelete,
  onMediaDownload,
  className = ''
}) => {
  // =========================================
  // HELPER FUNCTIONS
  // =========================================

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFileIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      document: '📄',
      archive: '📦',
      other: '📁'
    };
    return iconMap[type] || '📁';
  };

  const getTypeColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      image: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      video: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      audio: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      document: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      archive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colorMap[type] || colorMap.other;
  };

  // =========================================
  // HANDLERS
  // =========================================

  const handleMediaClick = (media: MediaFile) => {
    if (onMediaSelect) {
      onMediaSelect(media);
    }
  };

  const handleEdit = (e: React.MouseEvent, media: MediaFile) => {
    e.stopPropagation();
    if (onMediaEdit) {
      onMediaEdit(media);
    }
  };

  const handleDelete = (e: React.MouseEvent, media: MediaFile) => {
    e.stopPropagation();
    if (onMediaDelete) {
      onMediaDelete(media);
    }
  };

  const handleDownload = (e: React.MouseEvent, media: MediaFile) => {
    e.stopPropagation();
    if (onMediaDownload) {
      onMediaDownload(media);
    }
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar mídia"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // =========================================
  // EMPTY STATE
  // =========================================

  if (media.length === 0) {
    return (
      <EmptyState
        title="Nenhum arquivo encontrado"
        message="Faça upload de seus primeiros arquivos ou ajuste os filtros de busca"
        action={{
          label: 'Fazer Upload',
          onClick: () => console.log('Upload clicked')
        }}
      />
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className={className}>
      <div className="space-y-2">
        {media.map((item) => (
          <Card
            key={item.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
              selectedMedia.includes(item.id)
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => handleMediaClick(item)}
          >
            <div className="flex items-center gap-4">
              {/* Media Preview */}
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-2xl">
                    {getFileIcon(item.type)}
                  </div>
                )}
              </div>

              {/* Media Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {item.filename}
                  </h3>
                  <Badge className={getTypeColor(item.type)}>
                    {item.type_label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.created_at)}
                  </span>
                  <span>{formatFileSize(item.size)}</span>
                  {item.user_id && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.user_id}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleEdit(e, item)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDownload(e, item)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDelete(e, item)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaList;

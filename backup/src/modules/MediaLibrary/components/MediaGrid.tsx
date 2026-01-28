// =========================================
// MEDIA GRID COMPONENT
// =========================================
// Componente para exibir mídia em formato de grade
// Máximo: 150 linhas

import React from 'react';
import { Eye, Edit, Trash2, Download, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { MediaFile } from '../types';

interface MediaGridProps {
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

export const MediaGrid: React.FC<MediaGridProps> = ({
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
      <ResponsiveGrid columns={{ default: 2, md: 3, lg: 4, xl: 5 }} gap={4}>
        {media.map((item) => (
          <Card
            key={item.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedMedia.includes(item.id)
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => handleMediaClick(item)}
          >
            {/* Media Preview */}
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-4xl">
                  {getFileIcon(item.type)}
                </div>
              )}
            </div>

            {/* Media Info */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {item.filename}
              </h3>
              
              <div className="flex items-center justify-between">
                <Badge className={getTypeColor(item.type)}>
                  {item.type_label}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(item.size)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
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
                </div>
                
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
      </ResponsiveGrid>
    </div>
  );
};

export default MediaGrid;

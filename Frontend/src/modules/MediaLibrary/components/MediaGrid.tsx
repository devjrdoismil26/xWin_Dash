// =========================================
// MEDIA GRID COMPONENT
// =========================================
// Componente para exibir mídia em formato de grade
// Máximo: 150 linhas

import React from 'react';
import { Eye, Edit, Trash2, Download, MoreHorizontal } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { MediaFile } from '../types';

interface MediaGridProps {
  media: MediaFile[];
  loading?: boolean;
  error?: string | null;
  selectedMedia?: string[];
  onMediaSelect??: (e: any) => void;
  onMediaEdit??: (e: any) => void;
  onMediaDelete??: (e: any) => void;
  onMediaDownload??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaGrid: React.FC<MediaGridProps> = ({ media,
  loading = false,
  error = null,
  selectedMedia = [] as unknown[],
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

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];};

  const getFileIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      document: '📄',
      archive: '📦',
      other: '📁'};

    return iconMap[type] || '📁';};

  const getTypeColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      image: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      video: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      audio: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      document: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      archive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'};

    return colorMap[type] || colorMap.other;};

  // =========================================
  // HANDLERS
  // =========================================

  const handleMediaClick = (media: MediaFile) => {
    if (onMediaSelect) {
      onMediaSelect(media);

    } ;

  const handleEdit = (e: React.MouseEvent, media: MediaFile) => {
    e.stopPropagation();

    if (onMediaEdit) {
      onMediaEdit(media);

    } ;

  const handleDelete = (e: React.MouseEvent, media: MediaFile) => {
    e.stopPropagation();

    if (onMediaDelete) {
      onMediaDelete(media);

    } ;

  const handleDownload = (e: React.MouseEvent, media: MediaFile) => {
    e.stopPropagation();

    if (onMediaDownload) {
      onMediaDownload(media);

    } ;

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
              <div className=" ">$2</div><LoadingSpinner size="lg" / />
      </div>);

  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
              <ErrorState
        title="Erro ao carregar mídia"
        message={ error }
        onRetry={ () => window.location.reload() } />);

  }

  // =========================================
  // EMPTY STATE
  // =========================================

  if (media.length === 0) {
    return (
              <EmptyState
        title="Nenhum arquivo encontrado"
        message="Faça upload de seus primeiros arquivos ou ajuste os filtros de busca"
        action={ label: 'Fazer Upload',
          onClick: () => {
            // Upload é gerenciado pelo componente pai via prop onUpload
            // Se não houver prop, usar evento customizado
            const event = new CustomEvent('media:upload:trigger');

            window.dispatchEvent(event);

           } } />);

  }

  // =========================================
  // RENDER
  // =========================================

  return (
        <>
      <div className={className  }>
      </div><ResponsiveGrid columns={ default: 2, md: 3, lg: 4, xl: 5 } gap={ 4 } />
        {(media || []).map((item: unknown) => (
          <Card
            key={ item.id }
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedMedia.includes(item.id)
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            } `}
            onClick={ () => handleMediaClick(item)  }>
            {/* Media Eye */}
            <div className="{item.type === 'image' ? (">$2</div>
      <img
                  src={ item.url }
                  alt={ item.filename }
                  className="w-full h-full object-cover"
                  loading="lazy"
                / />
    </>
  ) : (
                <div className="{getFileIcon(item.type)}">$2</div>
    </div>
  )}
            </div>

            {/* Media Info */}
            <div className=" ">$2</div><h3 className="font-medium text-gray-900 dark:text-white truncate" />
                {item.filename}
              </h3>
              
              <div className=" ">$2</div><Badge className={getTypeColor(item.type) } />
                  {item.type_label}
                </Badge>
                <span className="{formatFileSize(item.size)}">$2</span>
                </span>
              </div>

              {/* Actions */}
              <div className=" ">$2</div><div className=" ">$2</div><Button
                    variant="ghost"
                    size="sm"
                    onClick={ (e: unknown) => handleEdit(e, item) }
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" /></Button><Button
                    variant="ghost"
                    size="sm"
                    onClick={ (e: unknown) => handleDownload(e, item) }
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" /></Button><Button
                    variant="ghost"
                    size="sm"
                    onClick={ (e: unknown) => handleDelete(e, item) }
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" /></Button></div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0" />
                  <MoreHorizontal className="h-4 w-4" /></Button></div>
      </Card>
    </>
  ))}
      </ResponsiveGrid>
    </div>);};

export default MediaGrid;

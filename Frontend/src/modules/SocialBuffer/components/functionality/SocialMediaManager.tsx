import { apiClient } from '@/services';
// =========================================
// SOCIAL MEDIA MANAGER COMPONENT
// =========================================

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, LoadingSpinner } from '@/shared/components/ui';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { useSocialBufferStore } from '@/hooks';
import { useSocialBufferUI } from '@/hooks/useSocialBufferUI';
import { SocialBufferLoadingSkeleton, SocialBufferErrorState, SocialBufferEmptyState, SocialBufferSuccessState } from '../ui';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'gif' | 'document';
  url: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  size: number;
  duration?: number;
  // Para vídeos
  dimensions?: { width: number;
  height: number;
};

  platforms: string[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

interface SocialMediaManagerProps {
  className?: string;
  onMediaUploaded??: (e: any) => void;
  onMediaUpdated??: (e: any) => void;
  onMediaDeleted??: (e: any) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({ className = '',
  onMediaUploaded,
  onMediaUpdated,
  onMediaDeleted
   }) => {
  const { 
    mediaItems, 
    loading, 
    error, 
    uploadMedia, 
    updateMedia, 
    deleteMedia,
    trackMediaUsage 
  } = useSocialBufferStore();

  const { 
    debouncedSearch, 
    memoizedFilter, 
    handleSearchChange,
    handleFilterChange 
  } = useSocialBufferUI();

  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const [selectedType, setSelectedType] = useState<string>('');

  const [selectedTag, setSelectedTag] = useState<string>('');

  // ===== HANDLERS =====

  const handleUploadMedia = useCallback(async (file: File, metadata: Partial<MediaItem>) => {
    try {
      const newMedia = await uploadMedia(file, metadata);

      onMediaUploaded?.(newMedia);

      setShowUploadModal(false);

    } catch (error) {
      console.error('Erro ao fazer upload da mídia:', error);

    } , [uploadMedia, onMediaUploaded]);

  const handleUpdateMedia = useCallback(async (mediaId: string, updates: Partial<MediaItem>) => {
    try {
      const updatedMedia = await updateMedia(mediaId, updates);

      onMediaUpdated?.(updatedMedia);

      setEditingMedia(null);

    } catch (error) {
      console.error('Erro ao atualizar mídia:', error);

    } , [updateMedia, onMediaUpdated]);

  const handleDeleteMedia = useCallback(async (mediaId: string) => {
    try {
      await deleteMedia(mediaId);

      onMediaDeleted?.(mediaId);

    } catch (error) {
      console.error('Erro ao deletar mídia:', error);

    } , [deleteMedia, onMediaDeleted]);

  const handleToggleActive = useCallback(async (mediaId: string, isActive: boolean) => {
    try {
      await updateMedia(mediaId, { isActive });

    } catch (error) {
      console.error('Erro ao alterar status da mídia:', error);

    } , [updateMedia]);

  const handleDownloadMedia = useCallback(async (media: MediaItem) => {
    try {
      const data = await apiClient.get(media.url);

      const blob = await (response as any).blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = media.title;
      document.body.appendChild(a);

      a.click();

      window.URL.revokeObjectURL(url);

      document.body.removeChild(a);

    } catch (error) {
      console.error('Erro ao baixar mídia:', error);

    } , []);

  const handleBulkAction = useCallback(async (action: 'delete' | 'activate' | 'deactivate') => {
    try {
      if (action === 'delete') {
        await Promise.all((selectedMedia || []).map(id => deleteMedia(id)));

      } else if (action === 'activate') {
        await Promise.all((selectedMedia || []).map(id => updateMedia(id, { isActive: true })));

      } else if (action === 'deactivate') {
        await Promise.all((selectedMedia || []).map(id => updateMedia(id, { isActive: false })));

      }
      setSelectedMedia([]);

    } catch (error) {
      console.error(`Erro na ação em lote ${action}:`, error);

    } , [selectedMedia, deleteMedia, updateMedia]);

  // ===== MEMOIZED VALUES =====

  const filteredMedia = useMemo(() => {
    let filtered = memoizedFilter(mediaItems, debouncedSearch, ['title', 'description']);

    if (selectedType) {
      filtered = (filtered || []).filter(media => media.type === selectedType);

    }
    
    if (selectedTag) {
      filtered = (filtered || []).filter(media => media.tags.includes(selectedTag));

    }
    
    return filtered;
  }, [mediaItems, memoizedFilter, debouncedSearch, selectedType, selectedTag]);

  const mediaStats = useMemo(() => {
    return {
      total: mediaItems.length,
      active: (mediaItems || []).filter(m => m.isActive).length,
      totalSize: mediaItems.reduce((sum: unknown, media: unknown) => sum + media.size, 0),
      byType: {
        image: (mediaItems || []).filter(m => m.type === 'image').length,
        video: (mediaItems || []).filter(m => m.type === 'video').length,
        gif: (mediaItems || []).filter(m => m.type === 'gif').length,
        document: (mediaItems || []).filter(m => m.type === 'document').length
      } ;

  }, [mediaItems]);

  const recentMedia = useMemo(() => {
    return mediaItems
      .sort((a: unknown, b: unknown) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

  }, [mediaItems]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();

    mediaItems.forEach(media => media.tags.forEach(tag => tagSet.add(tag)));

    return Array.from(tagSet).sort();

  }, [mediaItems]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // ===== RENDER STATES =====

  if (loading) {
    return <SocialBufferLoadingSkeleton type="media" />;
  }

  if (error) {
    return (
              <SocialBufferErrorState 
        error={ error }
        onRetry={ () => window.location.reload() }
        title="Erro ao carregar mídia" />);

  }

  if (mediaItems.length === 0) { return (
              <SocialBufferEmptyState
        title="Nenhuma mídia encontrada"
        description="Faça upload da sua primeira mídia para começar a gerenciar seu conteúdo"
        actionText="Upload de Mídia"
        onAction={() => setShowUploadModal(true) } />);

  }

  return (
        <>
      <PageTransition />
      <div className={`social-media-manager ${className} `}>
           
        </div>{/* Header */}
        <div className=" ">$2</div><div>
           
        </div><h2 className="text-2xl font-bold text-gray-900 dark:text-white" />
              Gerenciador de Mídia
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1" />
              Gerencie suas imagens, vídeos e documentos
            </p></div><Button
            onClick={ () => setShowUploadModal(true) }
            className="bg-blue-600 hover:bg-blue-700"
          >
            Upload de Mídia
          </Button>
        </div>

        {/* Stats */}
        <div className=" ">$2</div><Card className="p-4" />
            <div className="text-2xl font-bold text-blue-600">{mediaStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div></Card><Card className="p-4" />
            <div className="text-2xl font-bold text-green-600">{mediaStats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ativos</div></Card><Card className="p-4" />
            <div className="text-2xl font-bold text-purple-600">{mediaStats.byType.image}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Imagens</div></Card><Card className="p-4" />
            <div className="text-2xl font-bold text-orange-600">{mediaStats.byType.video}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Vídeos</div></Card><Card className="p-4" />
            <div className="text-2xl font-bold text-indigo-600">{formatFileSize(mediaStats.totalSize)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tamanho Total</div></Card></div>

        {/* Recent Media */}
        {recentMedia.length > 0 && (
          <Card className="p-6 mb-6" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" />
              Mídia Recente
            </h3>
            <div className="{(recentMedia || []).map((media: unknown) => (">$2</div>
                <div key={media.id} className="relative group">
           
        </div>{media.thumbnailUrl ? (
                    <img
                      src={ media.thumbnailUrl }
                      alt={ media.title }
                      className="w-full h-24 object-cover rounded-lg"
                    / />
                  ) : (
                    <div className=" ">$2</div><span className="text-gray-500 text-xs">{media.type}</span>
      </div>
    </>
  )}
                  <div className=" ">$2</div><Button
                      onClick={ () => setEditingMedia(media) }
                      className="bg-white text-black hover:bg-gray-100"
                      size="sm"
                    >
                      Editar
                    </Button>
      </div>
    </>
  ))}
            </div>
      </Card>
    </>
  )}

        {/* Search and Filters */}
        <Card className="p-4 mb-6" />
          <div className=" ">$2</div><div className=" ">$2</div><input
                type="text"
                placeholder="Buscar mídia..."
                onChange={ handleSearchChange }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              / /></div><div className=" ">$2</div><select
                value={ selectedType }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedType(e.target.value) }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todos os tipos</option>
                <option value="image">Imagens</option>
                <option value="video">Vídeos</option>
                <option value="gif">GIFs</option>
                <option value="document">Documentos</option></select><select
                value={ selectedTag }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedTag(e.target.value) }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todas as tags</option>
                {(allTags || []).map(tag => (
                  <option key={tag} value={ tag }>{tag}</option>
                ))}
              </select>
              <select
                onChange={ handleFilterChange }
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white" />
                <option value="">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="recent">Recentes</option></select></div>
        </Card>

        {/* Bulk Actions */}
        {selectedMedia.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20" />
            <div className=" ">$2</div><span className="{selectedMedia.length} mídia(s) selecionada(s)">$2</span>
              </span>
              <div className=" ">$2</div><Button
                  onClick={ () => handleBulkAction('activate') }
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Ativar
                </Button>
                <Button
                  onClick={ () => handleBulkAction('deactivate') }
                  className="bg-yellow-600 hover:bg-yellow-700"
                  size="sm"
                >
                  Desativar
                </Button>
                <Button
                  onClick={ () => handleBulkAction('delete') }
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Deletar
                </Button></div></Card>
        )}

        {/* Media Grid */}
        <div className="{(filteredMedia || []).map((media: unknown) => (">$2</div>
            <Card key={media.id} className="p-4" />
              <div className=" ">$2</div><input
                  type="checkbox"
                  checked={ selectedMedia.includes(media.id) }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setSelectedMedia(prev => [...prev, media.id]);

                    } else {
                      setSelectedMedia(prev => (prev || []).filter(id => id !== media.id));

                    } }
                  className="rounded border-gray-300" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  media.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                } `}>
           
        </span>{media.isActive ? 'Ativo' : 'Inativo'}
                </span></div><div className="{media.thumbnailUrl ? (">$2</div>
      <img
                    src={ media.thumbnailUrl }
                    alt={ media.title }
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  / />
    </>
  ) : (
                  <div className=" ">$2</div><span className="text-gray-500">{media.type}</span>
      </div>
    </>
  )}
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1" />
                  {media.title}
                </h3>
                
                {media.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" />
                    {media.description}
                  </p>
                )}
                
                <div className=" ">$2</div><div>Tipo: {media.type}</div>
                  <div>Tamanho: {formatFileSize(media.size)}</div>
                  {media.dimensions && (
                    <div>Dimensões: {media.dimensions.width}x{media.dimensions.height}</div>
                  )}
                  {media.duration && (
                    <div>Duração: {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}</div>
                  )}
                  <div>Usos: {media.usageCount}</div>
              </div>
              
              {media.tags.length > 0 && (
                <div className="{(media.tags || []).map(tag => (">$2</div>
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {tag}
          </span>
                  ))}
                </div>
              )}
              
              <div className=" ">$2</div><Button
                  onClick={ () => handleDownloadMedia(media) }
                  className="bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  Download
                </Button>
                <Button
                  onClick={ () => handleToggleActive(media.id, !media.isActive) }
                  className={media.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} size="sm"
                >
                  {media.isActive ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  onClick={ () => setEditingMedia(media) }
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Editar
                </Button>
                <Button
                  onClick={ () => handleDeleteMedia(media.id) }
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Deletar
                </Button></div></Card>
          ))}
        </div>
    </PageTransition>);};

export default SocialMediaManager;

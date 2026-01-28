/**
 * Conteúdo principal da MediaLibrary
 * Exibe a lista/grid de arquivos e pastas
 */

import React, { memo } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { 
  Image, 
  Video, 
  FileText, 
  Music, 
  Archive,
  Folder,
  FolderOpen,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Play,
  Pause
} from 'lucide-react';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';
import { MediaItem } from '../types/basicTypes';

export const MediaLibraryContent: React.FC = memo(() => {
  const {
    mediaItems,
    folders,
    loading,
    error,
    currentView,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleFolderClick,
    handleMediaClick,
    handleDownload,
    handlePreview,
    handleEdit,
    handleDelete,
    filteredMedia,
    filteredFolders
  } = useMediaLibrarySimple();

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'document':
        return FileText;
      case 'audio':
        return Music;
      default:
        return Archive;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Content className="p-6">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Content className="p-6">
          <ErrorState 
            title="Erro ao carregar conteúdo"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </Card.Content>
      </Card>
    );
  }

  if (filteredMedia.length === 0 && filteredFolders.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Content className="p-6">
          <EmptyState
            title="Nenhum arquivo encontrado"
            description="Esta pasta está vazia ou não há arquivos que correspondam aos seus filtros."
            icon={Archive}
          />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <Card.Content className="p-6">
        <div className="space-y-6">
          {/* Controles de seleção */}
          {filteredMedia.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredMedia.length}
                    onChange={handleSelectAll}
                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  Selecionar todos
                </label>
                {selectedItems.length > 0 && (
                  <Badge variant="outline" className="backdrop-blur-sm bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {selectedItems.length} selecionados
                  </Badge>
                )}
              </div>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleDownload(selectedItems)}
                    variant="outline"
                    size="sm"
                    className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedItems)}
                    variant="outline"
                    size="sm"
                    className="backdrop-blur-sm bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Visualização em Grid */}
          {currentView === 'grid' && (
            <ResponsiveGrid
              cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
              gap={4}
            >
              {/* Pastas */}
              {filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className="group cursor-pointer p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-lg bg-blue-500/20 mb-3">
                      <FolderOpen className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1 truncate w-full">
                      {folder.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {folder.itemCount} itens
                    </p>
                  </div>
                </div>
              ))}

              {/* Arquivos */}
              {filteredMedia.map((item) => {
                const IconComponent = getFileIcon(item.type);
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <div
                    key={item.id}
                    className={`group cursor-pointer p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-500/20 border-blue-500/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        <div className="p-3 rounded-lg bg-gray-500/20">
                          <IconComponent className="h-8 w-8 text-gray-400" />
                        </div>
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-sm font-medium text-white mb-1 truncate w-full">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-2">
                        {formatFileSize(item.size)}
                      </p>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(item);
                          }}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload([item]);
                          }}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ResponsiveGrid>
          )}

          {/* Visualização em Lista */}
          {currentView === 'list' && (
            <div className="space-y-2">
              {/* Cabeçalho da lista */}
              <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-400 border-b border-white/10">
                <div className="col-span-1"></div>
                <div className="col-span-4">Nome</div>
                <div className="col-span-2">Tipo</div>
                <div className="col-span-2">Tamanho</div>
                <div className="col-span-2">Modificado</div>
                <div className="col-span-1">Ações</div>
              </div>

              {/* Pastas */}
              {filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className="grid grid-cols-12 gap-4 p-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="col-span-1 flex items-center">
                    <Folder className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="col-span-4 flex items-center">
                    <span className="text-white font-medium">{folder.name}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Badge variant="outline" className="backdrop-blur-sm bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Pasta
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center text-gray-400">
                    {folder.itemCount} itens
                  </div>
                  <div className="col-span-2 flex items-center text-gray-400">
                    {formatDate(folder.modifiedAt)}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Arquivos */}
              {filteredMedia.map((item) => {
                const IconComponent = getFileIcon(item.type);
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-4 p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-500/20 border-blue-500/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-4 flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Badge variant="outline" className="backdrop-blur-sm bg-gray-500/20 text-gray-400 border-gray-500/30">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex items-center text-gray-400">
                      {formatFileSize(item.size)}
                    </div>
                    <div className="col-span-2 flex items-center text-gray-400">
                      {formatDate(item.modifiedAt)}
                    </div>
                    <div className="col-span-1 flex items-center gap-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(item);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload([item]);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
});

MediaLibraryContent.displayName = 'MediaLibraryContent';

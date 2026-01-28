// =========================================
// MEDIA INDEX PAGE - PÁGINA PRINCIPAL
// =========================================
// Página principal do módulo Media Library com dashboard e lista de mídia
// Máximo: 200 linhas

import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Upload, Grid, List, FolderPlus, Filter, Download, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { useMediaLibraryStore } from '../hooks/useMediaLibraryStore';
import { MediaHeader } from '../components/MediaHeader';
import { MediaMetrics } from '../components/MediaMetrics';
import { MediaFilters } from '../components/MediaFilters';
import { MediaGrid } from '../components/MediaGrid';
import { MediaList } from '../components/MediaList';
import { MediaActions } from '../components/MediaActions';

// Lazy-loaded components
const MediaDashboard = React.lazy(() => import('../components/MediaLibraryDashboard'));
const MediaAnalytics = React.lazy(() => import('../components/MediaLibraryStats'));

interface MediaIndexPageProps {
  className?: string;
  initialFilters?: any;
}

export const MediaIndexPage: React.FC<MediaIndexPageProps> = ({
  className = '',
  initialFilters
}) => {
  const {
    media,
    folders,
    stats,
    loading,
    error,
    viewMode,
    sortBy,
    sortOrder,
    filters,
    selectedMedia,
    showUploadModal,
    showCreateFolderModal,
    showBulkActions,
    uploads,
    isUploading,
    dragActive,
    fileInputRef,
    uploadStatus,
    totalProgress,
    breadcrumbs,
    updateFilters,
    clearFilters,
    setViewMode,
    setSortBy,
    setSortOrder,
    navigateToFolder,
    refreshData,
    handleUpload,
    openFileDialog,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearUploads,
    handleCreateFolder,
    setShowCreateFolderModal,
    handleMediaSelection,
    handleSelectAll,
    handleClearSelection,
    updateMedia,
    deleteMedia,
    handleBulkDelete,
    handleBulkMove,
    setShowUploadModal,
    getMediaType,
    formatFileSize,
    getFileIcon,
    clearError
  } = useMediaLibrary();

  const store = useMediaLibraryStore();

  // =========================================
  // HANDLERS
  // =========================================

  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    // Implementar paginação
    console.log('Page changed:', page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    // Implementar mudança de itens por página
    console.log('Items per page changed:', itemsPerPage);
  };

  const handleRefresh = () => {
    refreshData();
  };

  const handleBulkAction = (action: string, ids: string[]) => {
    switch (action) {
      case 'delete':
        handleBulkDelete();
        break;
      case 'move':
        // Implementar modal de seleção de pasta
        break;
      case 'download':
        // Implementar download em lote
        break;
      default:
        console.log('Bulk action:', action, ids);
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <PageTransition type="fade" duration={500}>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className}`}>
        <Head title="Media Library - xWin Dash" />
        
        <MediaHeader
          title="Media Library"
          subtitle="Gerencie suas imagens, vídeos e documentos"
          breadcrumbs={breadcrumbs}
          actions={[
            {
              label: 'Upload',
              icon: Upload,
              onClick: () => setShowUploadModal(true),
              variant: 'primary'
            },
            {
              label: 'Nova Pasta',
              icon: FolderPlus,
              onClick: () => setShowCreateFolderModal(true),
              variant: 'secondary'
            },
            {
              label: 'Atualizar',
              icon: RefreshCw,
              onClick: handleRefresh,
              variant: 'secondary',
              loading: loading
            }
          ]}
        />

        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Metrics */}
          {stats && (
            <MediaMetrics
              stats={stats}
              loading={loading}
              onRefresh={handleRefresh}
            />
          )}

          {/* Filters */}
          <Card className="p-6">
            <MediaFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
              onReset={clearFilters}
              loading={loading}
            />
          </Card>

          {/* Bulk Actions */}
          {showBulkActions && (
            <MediaActions
              selectedCount={selectedMedia.length}
              onBulkAction={handleBulkAction}
              loading={loading}
            />
          )}

          {/* Media Grid/List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Arquivos de Mídia
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {media.length} arquivo(s) encontrado(s)
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Suspense fallback={<LoadingSpinner size="lg" />}>
              {viewMode === 'grid' ? (
                <MediaGrid
                  media={media}
                  loading={loading}
                  error={error}
                  selectedMedia={selectedMedia}
                  onMediaSelect={handleMediaSelection}
                  onMediaEdit={(media) => console.log('Edit media:', media)}
                  onMediaDelete={(media) => deleteMedia(media.id)}
                />
              ) : (
                <MediaList
                  media={media}
                  loading={loading}
                  error={error}
                  selectedMedia={selectedMedia}
                  onMediaSelect={handleMediaSelection}
                  onMediaEdit={(media) => console.log('Edit media:', media)}
                  onMediaDelete={(media) => deleteMedia(media.id)}
                />
              )}
            </Suspense>
          </Card>

          {/* Analytics Dashboard */}
          <Suspense fallback={
            <Card className="p-6">
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            </Card>
          }>
            <MediaAnalytics
              stats={stats}
              loading={loading}
              className="mt-6"
            />
          </Suspense>

          {/* Dashboard */}
          <Suspense fallback={
            <Card className="p-6">
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            </Card>
          }>
            <MediaDashboard
              media={media}
              stats={stats}
              loading={loading}
              className="mt-6"
            />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
};

export default MediaIndexPage;

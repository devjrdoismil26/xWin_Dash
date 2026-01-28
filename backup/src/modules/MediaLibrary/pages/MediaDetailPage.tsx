// =========================================
// MEDIA DETAIL PAGE - PÁGINA DE DETALHES
// =========================================
// Página de detalhes de um arquivo de mídia específico
// Máximo: 200 linhas

import React, { Suspense, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Share, Download, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { MediaHeader } from '../components/MediaHeader';
import { MediaDetailsModal } from '../components/MediaDetailsModal';
import { MediaActions } from '../components/MediaActions';
import { MediaMetrics } from '../components/MediaMetrics';

// Lazy-loaded components
const MediaAnalytics = React.lazy(() => import('../components/MediaLibraryStats'));
const MediaAI = React.lazy(() => import('../components/IntelligentMediaLibrary'));

interface MediaDetailPageProps {
  mediaId: string;
  className?: string;
}

export const MediaDetailPage: React.FC<MediaDetailPageProps> = ({
  mediaId,
  className = ''
}) => {
  const {
    currentMedia,
    loading,
    error,
    comments,
    shares,
    versions,
    getMediaById,
    getComments,
    getShares,
    getVersions,
    clearError
  } = useMediaLibrary();

  // =========================================
  // EFFECTS
  // =========================================

  useEffect(() => {
    if (mediaId) {
      getMediaById(mediaId);
      getComments(mediaId);
      getShares(mediaId);
      getVersions(mediaId);
    }
  }, [mediaId, getMediaById, getComments, getShares, getVersions]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleEdit = () => {
    // Implementar edição
    console.log('Edit media:', currentMedia);
  };

  const handleDelete = () => {
    if (currentMedia) {
      // Implementar confirmação de exclusão
      console.log('Delete media:', currentMedia);
    }
  };

  const handleShare = () => {
    // Implementar compartilhamento
    console.log('Share media:', currentMedia);
  };

  const handleDownload = () => {
    if (currentMedia) {
      // Implementar download
      console.log('Download media:', currentMedia);
    }
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading && !currentMedia) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-red-600 mb-2">
                  Erro ao carregar mídia
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {error}
                </p>
                <Button onClick={clearError} variant="primary">
                  Tentar Novamente
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </PageTransition>
    );
  }

  // =========================================
  // NOT FOUND STATE
  // =========================================

  if (!currentMedia) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Mídia não encontrada
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  O arquivo solicitado não foi encontrado ou foi removido.
                </p>
                <Button onClick={() => window.history.back()} variant="primary">
                  Voltar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </PageTransition>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <PageTransition type="fade" duration={500}>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className}`}>
        <Head title={`${currentMedia.filename} - xWin Dash`} />
        
        <MediaHeader
          title={currentMedia.filename}
          subtitle={`${currentMedia.type_label} • ${currentMedia.human_readable_size}`}
          breadcrumbs={[
            { name: 'Media Library', href: '/media-library' },
            { name: currentMedia.filename, current: true }
          ]}
          actions={[
            {
              label: 'Voltar',
              icon: ArrowLeft,
              onClick: () => window.history.back(),
              variant: 'secondary'
            },
            {
              label: 'Editar',
              icon: Edit,
              onClick: handleEdit,
              variant: 'secondary'
            },
            {
              label: 'Compartilhar',
              icon: Share,
              onClick: handleShare,
              variant: 'secondary'
            },
            {
              label: 'Download',
              icon: Download,
              onClick: handleDownload,
              variant: 'primary'
            }
          ]}
        />

        <div className="container mx-auto px-4 py-6">
          <ResponsiveGrid columns={{ default: 1, lg: 3 }} gap={6}>
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Details */}
              <Card className="p-6">
                <MediaActions
                  media={currentMedia}
                  loading={loading}
                  onUpdate={handleEdit}
                />
              </Card>

              {/* Comments */}
              <Card className="p-6">
                <MediaDetailsModal
                  comments={comments}
                  loading={loading}
                  mediaId={mediaId}
                />
              </Card>

              {/* Versions */}
              <Card className="p-6">
                <MediaMetrics
                  versions={versions}
                  loading={loading}
                  mediaId={mediaId}
                />
              </Card>

              {/* Shares */}
              <Card className="p-6">
                <MediaActions
                  shares={shares}
                  loading={loading}
                  mediaId={mediaId}
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Analytics */}
              <Suspense fallback={
                <Card className="p-6">
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size="md" />
                  </div>
                </Card>
              }>
                <MediaAnalytics
                  mediaId={mediaId}
                  loading={loading}
                />
              </Suspense>

              {/* AI Features */}
              <Suspense fallback={
                <Card className="p-6">
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size="md" />
                  </div>
                </Card>
              }>
                <MediaAI
                  mediaId={mediaId}
                  loading={loading}
                />
              </Suspense>
            </div>
          </ResponsiveGrid>
        </div>
      </div>
    </PageTransition>
  );
};

export default MediaDetailPage;

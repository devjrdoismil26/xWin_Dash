// =========================================
// MEDIA EDIT PAGE - PÁGINA DE EDIÇÃO
// =========================================
// Página para editar arquivos de mídia existentes
// Máximo: 200 linhas

import React, { Suspense, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Save, Eye, X, History } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { MediaHeader } from '../components/MediaHeader';
import { MediaUploader } from '../components/MediaUploader';
import { MediaGrid } from '../components/MediaGrid';
import { MediaMetrics } from '../components/MediaMetrics';

// Lazy-loaded components
const MediaVersionHistory = React.lazy(() => import('../components/MediaLibraryStats'));

interface MediaEditPageProps {
  mediaId: string;
  className?: string;
}

export const MediaEditPage: React.FC<MediaEditPageProps> = ({
  mediaId,
  className = ''
}) => {
  const {
    currentMedia,
    loading,
    error,
    updateMedia,
    getMediaById,
    clearError
  } = useMediaLibrary();

  const [formData, setFormData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // =========================================
  // EFFECTS
  // =========================================

  useEffect(() => {
    if (mediaId) {
      getMediaById(mediaId);
    }
  }, [mediaId, getMediaById]);

  useEffect(() => {
    if (currentMedia) {
      const data = {
        filename: currentMedia.filename,
        alt_text: currentMedia.alt_text,
        caption: currentMedia.caption,
        tags: currentMedia.tags,
        metadata: currentMedia.metadata
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [currentMedia]);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleFormChange = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    try {
      setValidationErrors({});
      
      // Validação básica
      if (!formData.filename?.trim()) {
        setValidationErrors({ filename: 'Nome do arquivo é obrigatório' });
        return;
      }

      await updateMedia(mediaId, formData);
      setOriginalData(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('Você tem alterações não salvas. Deseja realmente cancelar?')) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setHasChanges(false);
    setValidationErrors({});
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
        <Head title={`Editar ${currentMedia.filename} - xWin Dash`} />
        
        <MediaHeader
          title={`Editar ${currentMedia.filename}`}
          subtitle={`${currentMedia.type_label} • ${currentMedia.human_readable_size}`}
          breadcrumbs={[
            { name: 'Media Library', href: '/media-library' },
            { name: currentMedia.filename, href: `/media-library/${mediaId}` },
            { name: 'Editar', current: true }
          ]}
          actions={[
            {
              label: 'Voltar',
              icon: ArrowLeft,
              onClick: handleCancel,
              variant: 'secondary'
            },
            {
              label: 'Histórico',
              icon: History,
              onClick: () => setShowHistory(true),
              variant: 'secondary'
            }
          ]}
        />

        <div className="container mx-auto px-4 py-6">
          <ResponsiveGrid columns={{ default: 1, lg: 2 }} gap={6}>
            {/* Form */}
            <div className="space-y-6">
              {/* Changes Warning */}
              {hasChanges && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center justify-between">
                    <p className="text-yellow-800">
                      Você tem alterações não salvas
                    </p>
                    <Button
                      onClick={handleReset}
                      variant="secondary"
                      size="sm"
                    >
                      Reverter
                    </Button>
                  </div>
                </Card>
              )}

              {/* Media Form */}
              <Card className="p-6">
                <MediaUploader
                  data={formData}
                  onChange={handleFormChange}
                  errors={validationErrors}
                  loading={loading}
                />
              </Card>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <Button
                      onClick={() => setShowPreview(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <MediaGrid
                    data={formData}
                    loading={loading}
                  />
                </Card>
              </div>
            )}
          </ResponsiveGrid>

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              onClick={handleCancel}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              loading={loading}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Version History Modal */}
        {showHistory && (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <MediaVersionHistory
              mediaId={mediaId}
              onClose={() => setShowHistory(false)}
            />
          </Suspense>
        )}
      </div>
    </PageTransition>
  );
};

export default MediaEditPage;

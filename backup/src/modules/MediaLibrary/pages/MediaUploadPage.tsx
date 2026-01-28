// =========================================
// MEDIA UPLOAD PAGE - PÁGINA DE UPLOAD
// =========================================
// Página para upload de arquivos de mídia
// Máximo: 200 linhas

import React, { Suspense, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Upload, Eye, X, Save } from 'lucide-react';
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
const MediaTemplateSelector = React.lazy(() => import('../components/MediaFilters'));
const MediaImportWizard = React.lazy(() => import('../components/MediaLibraryUploader'));

interface MediaUploadPageProps {
  className?: string;
  initialData?: any;
}

export const MediaUploadPage: React.FC<MediaUploadPageProps> = ({
  className = '',
  initialData
}) => {
  const {
    loading,
    error,
    uploads,
    isUploading,
    dragActive,
    fileInputRef,
    uploadFiles,
    clearUploads,
    openFileDialog,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearError
  } = useMediaLibrary();

  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [uploadData, setUploadData] = useState(initialData || {});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // =========================================
  // HANDLERS
  // =========================================

  const handleUpload = async (files: File[], options: any = {}) => {
    try {
      await uploadFiles(files, {
        ...options,
        onComplete: (results) => {
          console.log('Upload concluído:', results);
          setShowPreview(false);
        },
        onError: (error) => {
          console.error('Erro no upload:', error);
        }
      });
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleDataChange = (newData: any) => {
    setUploadData(prev => ({ ...prev, ...newData }));
  };

  const handleTemplateSelect = (template: any) => {
    setUploadData(prev => ({ ...prev, ...template }));
    setShowTemplateSelector(false);
  };

  const handleImport = (data: any) => {
    setUploadData(prev => ({ ...prev, ...data }));
    setShowImportWizard(false);
  };

  const handleSave = () => {
    // Implementar validação e salvamento
    console.log('Save upload data:', uploadData);
  };

  const handleCancel = () => {
    // Implementar cancelamento
    window.history.back();
  };

  const handleSaveDraft = () => {
    // Implementar salvamento de rascunho
    console.log('Save draft:', uploadData);
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <PageTransition type="fade" duration={500}>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className}`}>
        <Head title="Upload de Mídia - xWin Dash" />
        
        <MediaHeader
          title="Upload de Mídia"
          subtitle="Faça upload de seus arquivos de mídia"
          breadcrumbs={[
            { name: 'Media Library', href: '/media-library' },
            { name: 'Upload', current: true }
          ]}
          actions={[
            {
              label: 'Voltar',
              icon: ArrowLeft,
              onClick: handleCancel,
              variant: 'secondary'
            }
          ]}
        />

        <div className="container mx-auto px-4 py-6">
          <ResponsiveGrid columns={{ default: 1, lg: 2 }} gap={6}>
            {/* Upload Form */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowTemplateSelector(true)}
                    variant="secondary"
                    size="sm"
                  >
                    Usar Template
                  </Button>
                  <Button
                    onClick={() => setShowImportWizard(true)}
                    variant="secondary"
                    size="sm"
                  >
                    Importar CSV
                  </Button>
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="secondary"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Ocultar' : 'Mostrar'} Preview
                  </Button>
                </div>
              </Card>

              {/* Uploader */}
              <Card className="p-6">
                <MediaUploader
                  onUpload={handleUpload}
                  loading={isUploading}
                  dragActive={dragActive}
                  fileInputRef={fileInputRef}
                  onFileSelect={handleFileSelect}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  uploads={uploads}
                />
              </Card>

              {/* Metadata */}
              <Card className="p-6">
                <MediaMetrics
                  data={uploadData}
                  onChange={handleDataChange}
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
                    data={uploadData}
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
              onClick={handleSaveDraft}
              variant="secondary"
              loading={loading}
            >
              Salvar Rascunho
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              loading={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Fazer Upload
            </Button>
          </div>
        </div>

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <MediaTemplateSelector
              onSelect={handleTemplateSelect}
              onClose={() => setShowTemplateSelector(false)}
            />
          </Suspense>
        )}

        {/* Import Wizard Modal */}
        {showImportWizard && (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <MediaImportWizard
              onImport={handleImport}
              onClose={() => setShowImportWizard(false)}
            />
          </Suspense>
        )}
      </div>
    </PageTransition>
  );
};

export default MediaUploadPage;

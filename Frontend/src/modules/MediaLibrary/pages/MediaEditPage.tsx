// =========================================
// MEDIA EDIT PAGE - PÁGINA DE EDIÇÃO
// =========================================
// Página para editar arquivos de mídia existentes
// Máximo: 200 linhas

import React, { Suspense, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Save, Eye, X, History } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { MediaHeader } from '../components/MediaHeader';
import { MediaUploader } from '../components/MediaUploader';
import { MediaGrid } from '../components/MediaGrid';
import { MediaMetrics } from '../components/MediaMetrics';
import type { MediaFile } from '../types/core.types';

// Lazy-loaded components
const MediaVersionHistory = React.lazy(() => import('../shared/components/MediaLibraryStats'));

interface MediaEditPageProps {
  mediaId: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface MediaFormData {
  filename?: string;
  alt_text?: string;
  caption?: string;
  tags?: string[];
  metadata?: Record<string, any>; }

export const MediaEditPage: React.FC<MediaEditPageProps> = ({ mediaId,
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

  const [formData, setFormData] = useState<MediaFormData>({});

  const [originalData, setOriginalData] = useState<MediaFormData>({});

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

    } , [mediaId, getMediaById]);

  useEffect(() => {
    if (currentMedia) {
      const data: MediaFormData = {
        filename: currentMedia.filename,
        alt_text: currentMedia.alt_text,
        caption: currentMedia.caption,
        tags: currentMedia.tags,
        metadata: currentMedia.metadata as Record<string, any> | undefined};

      setFormData(data);

      setOriginalData(data);

    } , [currentMedia]);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));

  }, [formData, originalData]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleFormChange = (newData: Partial<MediaFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));};

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

    } ;

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('Você tem alterações não salvas. Deseja realmente cancelar?')) {
        window.history.back();

      } else {
      window.history.back();

    } ;

  const handleReset = () => {
    setFormData(originalData);

    setHasChanges(false);

    setValidationErrors({});};

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading && !currentMedia) { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><LoadingSpinner size="lg" / /></div></div>
      </PageTransition>);

  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <div className=" ">$2</div><div className=" ">$2</div><Card className="p-6" />
              <div className=" ">$2</div><h2 className="text-lg font-semibold text-red-600 mb-2" />
                  Erro ao carregar mídia
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4" />
                  {error}
                </p>
                <Button onClick={clearError} variant="primary" />
                  Tentar Novamente
                </Button></div></Card></div></PageTransition>);

  }

  // =========================================
  // NOT FOUND STATE
  // =========================================

  if (!currentMedia) { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <div className=" ">$2</div><div className=" ">$2</div><Card className="p-6" />
              <div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" />
                  Mídia não encontrada
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4" />
                  O arquivo solicitado não foi encontrado ou foi removido.
                </p>
                <Button onClick={() => window.history.back()} variant="primary">
                  Voltar
                </Button></div></Card></div></PageTransition>);

  }

  // =========================================
  // RENDER
  // =========================================

  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className} `}>
           
        </div><Head title={`Editar ${currentMedia.filename} - xWin Dash`} / />
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
          ]} />

        <div className=" ">$2</div><ResponsiveGrid columns={ default: 1, lg: 2 } gap={ 6 } />
            {/* Form */}
            <div className="{/* Changes Warning */}">$2</div>
              {hasChanges && (
                <Card className="p-4 bg-yellow-50 border-yellow-200" />
                  <div className=" ">$2</div><p className="text-yellow-800" />
                      Você tem alterações não salvas
                    </p>
                    <Button
                      onClick={ handleReset }
                      variant="secondary"
                      size="sm" />
                      Reverter
                    </Button></div></Card>
              )}

              {/* Media Form */}
              <Card className="p-6" />
                <MediaUploader
                  data={ formData }
                  onChange={ handleFormChange }
                  errors={ validationErrors }
                  loading={ loading }
                / /></Card></div>

            {/* Eye */}
            {showPreview && (
              <div className=" ">$2</div><Card className="p-6" />
                  <div className=" ">$2</div><h3 className="text-lg font-semibold">Eye</h3>
                    <Button
                      onClick={ () => setShowPreview(false) }
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" /></Button></div>
                  <MediaGrid
                    data={ formData }
                    loading={ loading }
                  / /></Card></div>
            )}
          </ResponsiveGrid>

          {/* Actions */}
          <div className=" ">$2</div><Button
              onClick={ handleCancel }
              variant="secondary" />
              Cancelar
            </Button>
            <Button
              onClick={ () => setShowPreview(!showPreview) }
              variant="secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ocultar' : 'Mostrar'} Eye
            </Button>
            <Button
              onClick={ handleSave }
              variant="primary"
              loading={ loading }
              disabled={ !hasChanges } />
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>

        {/* Version History Modal */}
        { showHistory && (
          <Suspense fallback={ <LoadingSpinner size="lg" />  }>
            <MediaVersionHistory
              mediaId={ mediaId }
              onClose={ () => setShowHistory(false) } />
          </Suspense>
        )}
      </div>
    </PageTransition>);};

export default MediaEditPage;

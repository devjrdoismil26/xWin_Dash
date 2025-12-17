import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { useMediaLibrary } from './hooks/useMediaLibrary';
import { MediaFile, MediaTag } from './types/mediaLibraryTypes';
import { MediaFormHeader, MediaFormTabs, MediaBasicForm, MediaUploadZone, MediaTagsForm, TabType } from './MediaFormPage';

interface CreateEditProps {
  auth?: string;
  mediaId?: string;
  folderId?: string;
  mode?: 'create' | 'edit' | 'view' | 'upload';
  onClose???: (e: any) => void;
  onSave??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const CreateEdit: React.FC<CreateEditProps> = ({ auth,
  mediaId,
  folderId,
  mode = 'create',
  onClose,
  onSave
   }) => {
  const [formData, setFormData] = useState<Partial<MediaFile>>({});

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<TabType>('basic');

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const [dragActive, setDragActive] = useState(false);

  const [availableTags, setAvailableTags] = useState<MediaTag[]>([]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    createMedia,
    updateMedia,
    uploadMedia,
    getMediaById,
    getTags,
    createTag,
    addTag,
    removeTag
  } = useMediaLibrary();

  useEffect(() => {
    if (mediaId && mode !== 'create' && mode !== 'upload') {
      loadMedia();

    } else {
      initializeForm();

    }
    loadTags();

  }, [mediaId, mode]);

  const loadMedia = async () => {
    if (!mediaId) return;
    
    setLoading(true);

    try {
      const mediaItem = await getMediaById(mediaId);

      if (mediaItem) {
        setFormData(mediaItem);

        setSelectedTags(mediaItem.tags || []);

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mídia');

    } finally {
      setLoading(false);

    } ;

  const loadTags = async () => {
    try {
      const tags = await getTags();

      setAvailableTags(tags);

    } catch (err) {
      console.error('Erro ao carregar tags:', err);

    } ;

  const initializeForm = () => {
    setFormData({
      name: '',
      alt_text: '',
      caption: '',
      description: '',
      tags: [],
      is_public: false,
      is_featured: false,
      folder_id: folderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
  });

    setSelectedTags([]);};

  const handleInputChange = (field: keyof MediaFile, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));

    } ;

  const handleFilesSelected = (files: File[]) => {
    setUploadFiles(files);};

  const handleDragEnter = () => setDragActive(true);

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);

    handleFilesSelected(files);};

  const handleAddTag = async (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);

      if (mediaId) {
        await addTag(mediaId, tag);

      } };

  const handleRemoveTag = async (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));

    if (mediaId) {
      await removeTag(mediaId, tag);

    } ;

  const handleCreateTag = async (name: string) => {
    const newTag = await createTag({ name, slug: name.toLowerCase() });

    if (newTag) {
      setAvailableTags(prev => [...prev, newTag]);

      handleAddTag(name);

    } ;

  const handleSave = async () => {
    setLoading(true);

    setError(null);

    try {
      const dataToSave = { ...formData, tags: selectedTags};

      if (mode === 'upload' && uploadFiles.length > 0) {
        for (const file of uploadFiles) {
          await uploadMedia(file, dataToSave);

        } else if (mode === 'edit' && mediaId) {
        await updateMedia(mediaId, dataToSave);

      } else if (mode === 'create') {
        await createMedia(dataToSave);

      }

      onSave?.(dataToSave as MediaFile);

      onClose?.();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');

    } finally {
      setLoading(false);

    } ;

  if (loading && !formData.name) {
    return (
        <>
      <AppLayout />
      <div className=" ">$2</div><LoadingSpinner / /></div></AppLayout>);

  }

  if (error && !formData.name) {
    return (
        <>
      <AppLayout />
      <ErrorState message={error} onRetry={loadMedia} / />
      </AppLayout>);

  }

  return (
        <>
      <AppLayout />
      <Head title={mode === 'create' ? 'Nova Mídia' : 'Editar Mídia'} / />
      <div className=" ">$2</div><MediaFormHeader
          mode={ mode }
          loading={ loading }
          onSave={ handleSave }
          onClose={ onClose }
        / />
        <Card className="p-6" />
          {mode === 'upload' && (
            <div className=" ">$2</div><MediaUploadZone
                onFilesSelected={ handleFilesSelected }
                dragActive={ dragActive }
                onDragEnter={ handleDragEnter }
                onDragLeave={ handleDragLeave }
                onDrop={ handleDrop  }>
          {uploadFiles.length > 0 && (
                <div className=" ">$2</div><p className="text-sm text-gray-600" />
                    {uploadFiles.length} arquivo(s) selecionado(s)
                  </p>
      </div>
    </>
  )}
            </div>
          )}

          <MediaFormTabs activeTab={activeTab} onTabChange={ setActiveTab  }>
          {activeTab === 'basic' && (
            <MediaBasicForm
              formData={ formData }
              onChange={ handleInputChange }
              errors={ validationErrors }
              disabled={ mode === 'view' }
            / />
          )}

          {activeTab === 'tags' && (
            <MediaTagsForm
              selectedTags={ selectedTags }
              availableTags={ availableTags }
              onAddTag={ handleAddTag }
              onRemoveTag={ handleRemoveTag }
              onCreateTag={ handleCreateTag }
              disabled={ mode === 'view' }
            / />
          )}

          {activeTab === 'metadata' && (
            <div className="text-gray-500">Metadados em desenvolvimento</div>
          )}

          {activeTab === 'permissions' && (
            <div className="text-gray-500">Permissões em desenvolvimento</div>
          )}
        </Card></div></AppLayout>);};

export default CreateEdit;

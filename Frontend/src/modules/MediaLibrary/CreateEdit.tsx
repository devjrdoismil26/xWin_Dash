import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress, OperationProgress } from '@/components/ui/AdvancedProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Music, 
  Archive,
  Save, 
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Share,
  Tag,
  Folder,
  FolderPlus,
  Settings,
  Filter,
  Search,
  Grid,
  List,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Copy,
  Move,
  RotateCw,
  Crop,
  Zap,
  Globe,
  Lock,
  Unlock,
  Star,
  Heart,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import { useMediaLibrary } from './hooks/useMediaLibrary';
import { 
  MediaFile, 
  MediaFolder, 
  MediaUpload, 
  MediaType, 
  MediaMetadata,
  MediaPermissions,
  MediaTag,
  MediaSearchFilters,
  MEDIA_TYPES
} from './types/mediaLibraryTypes';
import { cn } from '@/lib/utils';

interface CreateEditProps {
  auth?: any;
  mediaId?: string;
  folderId?: string;
  mode?: 'create' | 'edit' | 'view' | 'upload';
  onClose?: () => void;
  onSave?: (media: MediaFile) => void;
}

const CreateEdit: React.FC<CreateEditProps> = ({ 
  auth,
  mediaId,
  folderId,
  mode = 'create',
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<MediaFile>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'metadata' | 'tags' | 'permissions'>('basic');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    media,
    folders,
    stats,
    loading: mediaLoading,
    error: mediaError,
    createMedia,
    updateMedia,
    deleteMedia,
    uploadMedia,
    getMediaById,
    getFolderById,
    validateMedia,
    formatFileSize,
    getMediaType,
    getFileIcon,
    generateThumbnail,
    extractMetadata,
    compressMedia,
    addTag,
    removeTag,
    createTag,
    getTags,
    shareMedia,
    downloadMedia
  } = useMediaLibrary();

  const [availableTags, setAvailableTags] = useState<MediaTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (mediaId && mode !== 'create' && mode !== 'upload') {
      loadMedia();
    } else if (mode === 'create' || mode === 'upload') {
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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mídia');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await getTags();
      setAvailableTags(tags);
    } catch (err) {
      console.error('Erro ao carregar tags:', err);
    }
  };

  const initializeForm = () => {
    const baseForm = {
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
    };

    setFormData(baseForm);
    setSelectedTags([]);
  };

  const handleInputChange = (field: keyof MediaFile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setUploadFiles(fileArray);
    
    // Auto-fill form with first file info
    if (fileArray.length === 1) {
      const file = fileArray[0];
      setFormData(prev => ({
        ...prev,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        original_name: file.name,
        filename: file.name,
        mime_type: file.type,
        size: file.size,
        extension: file.name.split('.').pop()?.toLowerCase() || '',
        format: file.name.split('.').pop()?.toLowerCase() || ''
      }));
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleTagAdd = async (tagName: string) => {
    if (!tagName.trim()) return;
    
    try {
      // Check if tag exists
      let tag = availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
      
      if (!tag) {
        // Create new tag
        tag = await createTag({
          name: tagName.trim(),
          color: '#3B82F6',
          description: '',
          usage_count: 0,
          created_at: new Date().toISOString(),
          created_by: auth?.user?.id || '',
          is_system: false
        });
        setAvailableTags(prev => [...prev, tag!]);
      }
      
      if (!selectedTags.includes(tag.id)) {
        setSelectedTags(prev => [...prev, tag.id]);
        handleInputChange('tags', [...selectedTags, tag.id]);
      }
      
      setNewTag('');
    } catch (err) {
      console.error('Erro ao adicionar tag:', err);
    }
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
    handleInputChange('tags', selectedTags.filter(id => id !== tagId));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (mode === 'upload' && uploadFiles.length === 0) {
      errors.files = 'Pelo menos um arquivo deve ser selecionado';
    }

    if (!formData.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (mode === 'upload' && uploadFiles.length > 0) {
      const totalSize = uploadFiles.reduce((sum, file) => sum + file.size, 0);
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      if (totalSize > maxSize) {
        errors.files = `Tamanho total dos arquivos excede o limite de ${formatFileSize(maxSize)}`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let savedMedia: MediaFile;

      if (mode === 'upload') {
        // Handle file upload
        const uploadPromises = uploadFiles.map(async (file) => {
          const uploadData = {
            ...formData,
            file,
            folder_id: folderId
          };
          
          return await uploadMedia(uploadData, (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          });
        });

        const results = await Promise.all(uploadPromises);
        savedMedia = results[0]; // Return first uploaded file
      } else if (mode === 'create') {
        savedMedia = await createMedia(formData as MediaFile);
      } else {
        savedMedia = await updateMedia(mediaId!, formData as MediaFile);
      }

      if (onSave) {
        onSave(savedMedia);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar mídia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!mediaId || mode === 'create' || mode === 'upload') return;

    if (!confirm('Tem certeza que deseja excluir esta mídia?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteMedia(mediaId);
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir mídia');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicTab = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Informações Básicas
          </Card.Title>
          <Card.Description className="text-gray-600 dark:text-gray-300">
            Configure as informações principais da mídia
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome *
            </label>
            <Input
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome da mídia"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={mode === 'view'}
            />
            {validationErrors.name && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Texto Alternativo
            </label>
            <Input
              value={formData.alt_text || ''}
              onChange={(e) => handleInputChange('alt_text', e.target.value)}
              placeholder="Descrição para acessibilidade"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Legenda
            </label>
            <Input
              value={formData.caption || ''}
              onChange={(e) => handleInputChange('caption', e.target.value)}
              placeholder="Legenda da mídia"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição detalhada da mídia"
              className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
              disabled={mode === 'view'}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_public || false}
                  onChange={(e) => handleInputChange('is_public', e.target.checked)}
                  disabled={mode === 'view'}
                  className="rounded border-white/30 bg-white/10"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Público
                </span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured || false}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  disabled={mode === 'view'}
                  className="rounded border-white/30 bg-white/10"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Destaque
                </span>
              </label>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderMetadataTab = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600" />
            Metadados
          </Card.Title>
          <Card.Description className="text-gray-600 dark:text-gray-300">
            Informações técnicas e metadados da mídia
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          {formData.mime_type && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo MIME
                </label>
                <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formData.mime_type}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamanho
                </label>
                <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formData.size ? formatFileSize(formData.size) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {formData.width && formData.height && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dimensões
                </label>
                <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formData.width} × {formData.height}px
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proporção
                </label>
                <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formData.width && formData.height ? 
                      (formData.width / formData.height).toFixed(2) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {formData.duration && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duração
              </label>
              <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
                <span className="text-sm text-gray-900 dark:text-white">
                  {Math.floor(formData.duration / 60)}:{(formData.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estatísticas
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.download_count || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Downloads
                </div>
              </div>
              <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.view_count || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Visualizações
                </div>
              </div>
              <div className="p-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.tags?.length || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Tags
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderTagsTab = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-purple-600" />
            Tags
          </Card.Title>
          <Card.Description className="text-gray-600 dark:text-gray-300">
            Organize sua mídia com tags
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          {/* Add new tag */}
          {mode !== 'view' && (
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar nova tag"
                className="backdrop-blur-sm bg-white/20 border-white/30 focus:bg-white/30"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleTagAdd(newTag);
                  }
                }}
              />
              <Button
                onClick={() => handleTagAdd(newTag)}
                disabled={!newTag.trim()}
                className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Selected tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags Selecionadas
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tagId => {
                const tag = availableTags.find(t => t.id === tagId);
                if (!tag) return null;
                
                return (
                  <Badge
                    key={tagId}
                    variant="outline"
                    className="backdrop-blur-sm bg-white/10 border-white/20"
                  >
                    <span className="mr-2">{tag.name}</span>
                    {mode !== 'view' && (
                      <button
                        onClick={() => handleTagRemove(tagId)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Available tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags Disponíveis
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !selectedTags.includes(tag.id))
                .map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                    onClick={() => {
                      if (mode !== 'view') {
                        setSelectedTags(prev => [...prev, tag.id]);
                        handleInputChange('tags', [...selectedTags, tag.id]);
                      }
                    }}
                  >
                    {tag.name}
                    <span className="ml-1 text-xs text-gray-500">
                      ({tag.usage_count})
                    </span>
                  </Badge>
                ))}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderPermissionsTab = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Permissões
          </Card.Title>
          <Card.Description className="text-gray-600 dark:text-gray-300">
            Configure as permissões de acesso à mídia
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Permissões Públicas
              </h4>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_public || false}
                    onChange={(e) => handleInputChange('is_public', e.target.checked)}
                    disabled={mode === 'view'}
                    className="rounded border-white/30 bg-white/10"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Visível publicamente
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured || false}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    disabled={mode === 'view'}
                    className="rounded border-white/30 bg-white/10"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Em destaque
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Estatísticas de Acesso
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Downloads:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.download_count || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Visualizações:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.view_count || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Último acesso:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.last_accessed ? 
                      new Date(formData.last_accessed).toLocaleDateString() : 
                      'Nunca'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderUploadArea = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload de Arquivos
          </Card.Title>
          <Card.Description className="text-gray-600 dark:text-gray-300">
            Selecione os arquivos para upload
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          {/* Upload Area */}
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
              dragActive 
                ? "border-blue-500 bg-blue-500/10" 
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600"
            >
              Selecionar Arquivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            />
          </div>

          {validationErrors.files && (
            <p className="text-red-600 text-sm">{validationErrors.files}</p>
          )}

          {/* Selected Files */}
          {uploadFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Arquivos Selecionados ({uploadFiles.length})
              </h4>
              {uploadFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadProgress[file.name] !== undefined && (
                      <div className="w-20">
                        <ProgressBar 
                          value={uploadProgress[file.name]} 
                          className="h-2"
                        />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUploadFiles(prev => prev.filter((_, i) => i !== index));
                        setUploadProgress(prev => {
                          const newProgress = { ...prev };
                          delete newProgress[file.name];
                          return newProgress;
                        });
                      }}
                      className="backdrop-blur-sm bg-red-500/10 hover:bg-red-500/20 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (mode === 'upload') {
      return renderUploadArea();
    }

    switch (activeTab) {
      case 'basic':
        return renderBasicTab();
      case 'metadata':
        return renderMetadataTab();
      case 'tags':
        return renderTagsTab();
      case 'permissions':
        return renderPermissionsTab();
      default:
        return renderBasicTab();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        icon={AlertTriangle}
        title="Erro"
        description={error}
        actions={[
          {
            label: "Tentar Novamente",
            onClick: () => setError(null),
            variant: "default",
            icon: RefreshCw
          }
        ]}
      />
    );
  }

  return (
    <PageTransition type="fade" duration={500}>
      <AppLayout
        title={`${mode === 'create' ? 'Criar' : mode === 'edit' ? 'Editar' : mode === 'upload' ? 'Upload' : 'Visualizar'} Mídia`}
        subtitle={mode === 'create' ? 'Criar nova mídia' : mode === 'edit' ? 'Modificar mídia existente' : mode === 'upload' ? 'Fazer upload de arquivos' : 'Detalhes da mídia'}
        showSidebar={true}
        showBreadcrumbs={true}
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Media Library', href: '/media-library' },
          { name: mode === 'create' ? 'Criar' : mode === 'edit' ? 'Editar' : mode === 'upload' ? 'Upload' : 'Visualizar', current: true }
        ]}
        actions={
          <div className="flex items-center gap-3">
            {mode !== 'view' && (
              <Tooltip content="Salvar alterações">
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="backdrop-blur-sm bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Tooltip>
            )}
            
            {mode === 'edit' && (
              <Tooltip content="Excluir mídia">
                <Button 
                  variant="outline"
                  onClick={handleDelete}
                  disabled={loading}
                  className="backdrop-blur-sm bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </Tooltip>
            )}

            <Tooltip content="Pré-visualizar">
              <Button 
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Ocultar Preview' : 'Preview'}
              </Button>
            </Tooltip>

            {onClose && (
              <Tooltip content="Fechar">
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Fechar
                </Button>
              </Tooltip>
            )}
          </div>
        }
      >
        <Head title={`${mode === 'create' ? 'Criar' : mode === 'edit' ? 'Editar' : mode === 'upload' ? 'Upload' : 'Visualizar'} Mídia - xWin Dash`} />
        
        <div className="space-y-6">
          {/* Tabs - Only show for non-upload modes */}
          {mode !== 'upload' && (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <Card.Content className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeTab === 'basic' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('basic')}
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Básico
                  </Button>
                  <Button
                    variant={activeTab === 'metadata' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('metadata')}
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Metadados
                  </Button>
                  <Button
                    variant={activeTab === 'tags' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('tags')}
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </Button>
                  <Button
                    variant={activeTab === 'permissions' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('permissions')}
                    size="sm"
                    className="backdrop-blur-sm"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Permissões
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Content */}
          {renderContent()}
        </div>
      </AppLayout>
    </PageTransition>
  );
};

export default CreateEdit;

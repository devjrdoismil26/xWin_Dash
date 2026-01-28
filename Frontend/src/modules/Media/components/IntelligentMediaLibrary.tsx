/**
 * Intelligent Media Library - Módulo MediaLibrary
 * Biblioteca de mídia inteligente com IA e gestão avançada 95%+
 */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Image, 
  Video, 
  FileText, 
  Music, 
  File, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Grid, 
  List, 
  FolderPlus, 
  Folder, 
  FolderOpen, 
  Star, 
  Heart, 
  Eye, 
  Share2, 
  Copy, 
  Trash2, 
  Edit, 
  MoreHorizontal,
  Tag, 
  Calendar, 
  User, 
  MapPin, 
  Camera, 
  Zap, 
  Brain, 
  Sparkles, 
  Layers, 
  Crop, 
  Palette, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  RefreshCw,
  Settings,
  Plus,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  BarChart3,
  PieChart,
  HardDrive,
  Upload,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Link,
  QrCode,
  Scissors,
  Wand2,
  Target,
  MousePointer,
  ExternalLink
} from 'lucide-react';
// Hooks
import { useT } from '@/hooks/useTranslation';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useDataLoadingStates } from '@/hooks/useLoadingStates';
// Componentes
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Select } from '@/components/ui/select';
import Input from '@/components/ui/Input';
import Progress from '@/components/ui/Progress';
import Skeleton from '@/components/ui/SkeletonLoaders';
import Tooltip from '@/components/ui/Tooltip';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';
interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  format: string;
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number;
  url: string;
  thumbnail_url?: string;
  folder_id?: string;
  tags: string[];
  metadata: {
    created_at: string;
    modified_at: string;
    uploaded_by: string;
    camera?: string;
    location?: string;
    description?: string;
    alt_text?: string;
  };
  ai_analysis?: {
    objects: string[];
    colors: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    quality_score: number;
    suggestions: string[];
  };
  usage: {
    view_count: number;
    download_count: number;
    share_count: number;
    last_used: string;
  };
  status: 'processing' | 'ready' | 'error';
  starred: boolean;
  public: boolean;
}
interface MediaFolder {
  id: string;
  name: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  description?: string;
  files_count: number;
  total_size: number;
  created_at: string;
  updated_at: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    share: boolean;
  };
}
interface MediaStats {
  total_files: number;
  total_size: number;
  files_by_type: {
    images: number;
    videos: number;
    documents: number;
    audio: number;
    other: number;
  };
  storage_used: number;
  storage_limit: number;
  monthly_uploads: number;
  popular_formats: Array<{ format: string; count: number }>;
  ai_processed: number;
  bandwidth_used: number;
}
interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  result?: MediaFile;
}
const MOCK_STATS: MediaStats = {
  total_files: 12456,
  total_size: 5890123456, // bytes
  files_by_type: {
    images: 8234,
    videos: 1567,
    documents: 1890,
    audio: 456,
    other: 309,
  },
  storage_used: 5890123456,
  storage_limit: 10737418240, // 10GB
  monthly_uploads: 1567,
  popular_formats: [
    { format: 'JPEG', count: 4567 },
    { format: 'PNG', count: 2890 },
    { format: 'MP4', count: 1234 },
    { format: 'PDF', count: 987 },
  ],
  ai_processed: 10234,
  bandwidth_used: 2345678901,
};
const MOCK_FOLDERS: MediaFolder[] = [
  {
    id: '1',
    name: 'Campanhas Marketing',
    color: 'blue',
    icon: 'target',
    description: 'Materiais para campanhas publicitárias',
    files_count: 234,
    total_size: 567890123,
    created_at: '2024-07-15T10:00:00Z',
    updated_at: '2024-08-15T10:30:00Z',
    permissions: { read: true, write: true, delete: true, share: true },
  },
  {
    id: '2',
    name: 'Produtos',
    color: 'green',
    icon: 'package',
    description: 'Fotos e vídeos dos produtos',
    files_count: 567,
    total_size: 890123456,
    created_at: '2024-06-10T14:00:00Z',
    updated_at: '2024-08-14T16:20:00Z',
    permissions: { read: true, write: true, delete: false, share: true },
  },
  {
    id: '3',
    name: 'Conteúdo Social',
    color: 'purple',
    icon: 'share',
    description: 'Posts para redes sociais',
    files_count: 345,
    total_size: 123456789,
    created_at: '2024-08-01T09:00:00Z',
    updated_at: '2024-08-15T11:45:00Z',
    permissions: { read: true, write: true, delete: true, share: true },
  },
];
const MOCK_FILES: MediaFile[] = [
  {
    id: '1',
    name: 'black-friday-banner.jpg',
    type: 'image',
    format: 'JPEG',
    size: 2456789,
    dimensions: { width: 1920, height: 1080 },
    url: '/api/media/1',
    thumbnail_url: '/api/media/1/thumb',
    folder_id: '1',
    tags: ['black-friday', 'banner', 'promocional'],
    metadata: {
      created_at: '2024-08-15T10:30:00Z',
      modified_at: '2024-08-15T10:30:00Z',
      uploaded_by: 'João Silva',
      camera: 'iPhone 15 Pro',
      description: 'Banner principal da campanha Black Friday 2024',
      alt_text: 'Banner promocional Black Friday com desconto de até 70%',
    },
    ai_analysis: {
      objects: ['text', 'logo', 'product', 'discount'],
      colors: ['red', 'black', 'white', 'yellow'],
      sentiment: 'positive',
      quality_score: 95,
      suggestions: ['Otimizar para mobile', 'Adicionar call-to-action'],
    },
    usage: {
      view_count: 1567,
      download_count: 89,
      share_count: 23,
      last_used: '2024-08-15T09:45:00Z',
    },
    status: 'ready',
    starred: true,
    public: false,
  },
  {
    id: '2',
    name: 'produto-video-demo.mp4',
    type: 'video',
    format: 'MP4',
    size: 45678901,
    dimensions: { width: 1920, height: 1080 },
    duration: 120,
    url: '/api/media/2',
    thumbnail_url: '/api/media/2/thumb',
    folder_id: '2',
    tags: ['produto', 'demonstração', 'vídeo'],
    metadata: {
      created_at: '2024-08-14T15:20:00Z',
      modified_at: '2024-08-14T15:20:00Z',
      uploaded_by: 'Maria Santos',
      description: 'Vídeo demonstrativo do produto principal',
    },
    ai_analysis: {
      objects: ['person', 'product', 'hands', 'demonstration'],
      colors: ['blue', 'white', 'gray'],
      sentiment: 'positive',
      quality_score: 88,
      suggestions: ['Adicionar legendas', 'Melhorar iluminação'],
    },
    usage: {
      view_count: 234,
      download_count: 45,
      share_count: 12,
      last_used: '2024-08-14T18:30:00Z',
    },
    status: 'ready',
    starred: false,
    public: true,
  },
];
interface IntelligentMediaLibraryProps {
  className?: string;
}
const IntelligentMediaLibrary: React.FC<IntelligentMediaLibraryProps> = ({
  className = '',
}) => {
  const { t } = useT();
  const { showSuccess, showError, showInfo } = useAdvancedNotifications();
  const { operations, isFetching, isUpdating } = useDataLoadingStates();
  // State
  const [stats, setStats] = useState<MediaStats>(MOCK_STATS);
  const [folders, setFolders] = useState<MediaFolder[]>(MOCK_FOLDERS);
  const [files, setFiles] = useState<MediaFile[]>(MOCK_FILES);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState<string | null>(null);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [refreshKey, setRefreshKey] = useState(0);
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  // Fetch data
  const fetchMediaData = useCallback(async () => {
    try {
      await operations.fetch('media-library', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock real-time updates
        setStats(prev => ({
          ...prev,
          total_files: prev.total_files + Math.floor(Math.random() * 5),
          monthly_uploads: prev.monthly_uploads + Math.floor(Math.random() * 3),
        }));
        return true;
      });
    } catch (error) {
      showError('Erro ao carregar biblioteca de mídia');
    }
  }, [operations, showError]);
  // Filtered files
  const filteredFiles = useMemo(() => {
    let filtered = files;
    // Filter by folder
    if (currentFolder) {
      filtered = filtered.filter(file => file.folder_id === currentFolder);
    }
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.type === filterType);
    }
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(query) ||
        file.tags.some(tag => tag.toLowerCase().includes(query)) ||
        file.metadata.description?.toLowerCase().includes(query)
      );
    }
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'created_at':
          return new Date(b.metadata.created_at).getTime() - new Date(a.metadata.created_at).getTime();
        case 'usage':
          return b.usage.view_count - a.usage.view_count;
        default:
          return 0;
      }
    });
    return filtered;
  }, [files, currentFolder, filterType, searchQuery, sortBy]);
  // File upload handling
  const handleFileUpload = useCallback(async (uploadedFiles: FileList) => {
    const newUploads: UploadProgress[] = Array.from(uploadedFiles).map(file => ({
      file,
      progress: 0,
      status: 'uploading',
    }));
    setUploadProgress(prev => [...prev, ...newUploads]);
    // Simulate upload process
    for (const upload of newUploads) {
      try {
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => 
            prev.map(u => u.file === upload.file ? { ...u, progress } : u)
          );
        }
        // Simulate processing
        setUploadProgress(prev => 
          prev.map(u => u.file === upload.file ? { ...u, status: 'processing' } : u)
        );
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Create mock file result
        const newFile: MediaFile = {
          id: Date.now().toString(),
          name: upload.file.name,
          type: upload.file.type.startsWith('image/') ? 'image' :
                upload.file.type.startsWith('video/') ? 'video' :
                upload.file.type.startsWith('audio/') ? 'audio' : 'document',
          format: upload.file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          size: upload.file.size,
          url: URL.createObjectURL(upload.file),
          folder_id: currentFolder || undefined,
          tags: [],
          metadata: {
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
            uploaded_by: 'Current User',
          },
          usage: {
            view_count: 0,
            download_count: 0,
            share_count: 0,
            last_used: new Date().toISOString(),
          },
          status: 'ready',
          starred: false,
          public: false,
        };
        setFiles(prev => [newFile, ...prev]);
        setUploadProgress(prev => 
          prev.map(u => u.file === upload.file ? { ...u, status: 'completed', result: newFile } : u)
        );
        showSuccess(`${upload.file.name} enviado com sucesso`);
      } catch (error) {
        setUploadProgress(prev => 
          prev.map(u => u.file === upload.file ? { ...u, status: 'error', error: 'Erro no upload' } : u)
        );
        showError(`Erro ao enviar ${upload.file.name}`);
      }
    }
    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploadProgress(prev => prev.filter(u => u.status === 'uploading' || u.status === 'processing'));
    }, 3000);
  }, [currentFolder, showSuccess, showError]);
  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, [handleFileUpload]);
  // File actions
  const handleFileAction = useCallback(async (fileId: string, action: 'star' | 'delete' | 'duplicate' | 'share') => {
    try {
      await operations.update(`file-${action}`, async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (action === 'star') {
          setFiles(prev => prev.map(file => 
            file.id === fileId ? { ...file, starred: !file.starred } : file
          ));
        } else if (action === 'delete') {
          setFiles(prev => prev.filter(file => file.id !== fileId));
        } else if (action === 'duplicate') {
          const originalFile = files.find(f => f.id === fileId);
          if (originalFile) {
            const duplicatedFile: MediaFile = {
              ...originalFile,
              id: Date.now().toString(),
              name: `${originalFile.name.replace(/\.[^/.]+$/, '')}_copy.${originalFile.format.toLowerCase()}`,
              metadata: {
                ...originalFile.metadata,
                created_at: new Date().toISOString(),
              },
            };
            setFiles(prev => [duplicatedFile, ...prev]);
          }
        }
        return true;
      });
      const actionText = {
        star: 'favoritado',
        delete: 'excluído',
        duplicate: 'duplicado',
        share: 'compartilhado'
      }[action];
      showSuccess(`Arquivo ${actionText} com sucesso`);
    } catch (error) {
      showError(`Erro ao ${action} arquivo`);
    }
  }, [operations, files, showSuccess, showError]);
  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);
  // Get file icon
  const getFileIcon = useCallback((file: MediaFile) => {
    switch (file.type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  }, []);
  // Actions
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    fetchMediaData();
    showSuccess('Biblioteca de mídia atualizada');
  }, [fetchMediaData, showSuccess]);
  // Initial load
  useEffect(() => {
    fetchMediaData();
  }, [fetchMediaData, refreshKey]);
  const isLoading = isFetching('media-library');
  const storagePercentage = (stats.storage_used / stats.storage_limit) * 100;
  return (
    <div className={`space-y-6 ${className}`} ref={dropzoneRef} onDragOver={handleDragOver} onDrop={handleDrop}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Biblioteca de Mídia Inteligente
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestão avançada de mídia com IA, organização automática e otimização inteligente
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={sortBy} onValueChange={setSortBy} className="w-40">
            <option value="created_at">Mais Recentes</option>
            <option value="name">Nome</option>
            <option value="size">Tamanho</option>
            <option value="usage">Mais Utilizados</option>
          </Select>
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center space-x-2"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAIInsights(true)}
            className="flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>Insights IA</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </div>
      </div>
      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Arquivos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total_files.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <File className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Armazenamento</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatFileSize(stats.storage_used)}
              </p>
              <div className="flex items-center mt-1">
                <Progress value={storagePercentage} className="w-20 h-2 mr-2" />
                <span className="text-xs text-gray-500">{storagePercentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <HardDrive className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploads Mensais</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.monthly_uploads.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+15% vs. mês anterior</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <CloudUpload className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">IA Processados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.ai_processed.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-600 ml-1">{((stats.ai_processed / stats.total_files) * 100).toFixed(1)}% dos arquivos</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Sparkles className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>
      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Uploads em Progresso</h3>
            <Button variant="ghost" size="sm" onClick={() => setUploadProgress([])}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {uploadProgress.map((upload, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{upload.file.name}</span>
                    <div className="flex items-center space-x-2">
                      {upload.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {upload.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      <span className="text-xs text-gray-500">{upload.progress}%</span>
                    </div>
                  </div>
                  <Progress value={upload.progress} className="h-1" />
                  {upload.status === 'processing' && (
                    <p className="text-xs text-blue-600 mt-1">Processando com IA...</p>
                  )}
                  {upload.error && (
                    <p className="text-xs text-red-600 mt-1">{upload.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Folders */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Pastas</h3>
              <Button variant="ghost" size="sm">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <button
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  !currentFolder ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                }`}
                onClick={() => setCurrentFolder(null)}
              >
                <Folder className="h-4 w-4" />
                <span className="text-sm">Todos os Arquivos</span>
                <span className="text-xs text-gray-500 ml-auto">{stats.total_files}</span>
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    currentFolder === folder.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                  }`}
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="text-sm">{folder.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{folder.files_count}</span>
                </button>
              ))}
            </div>
            {/* File Type Filters */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Tipo de Arquivo</h4>
              <div className="space-y-2">
                {[
                  { key: 'all', label: 'Todos', count: stats.total_files },
                  { key: 'image', label: 'Imagens', count: stats.files_by_type.images },
                  { key: 'video', label: 'Vídeos', count: stats.files_by_type.videos },
                  { key: 'document', label: 'Documentos', count: stats.files_by_type.documents },
                  { key: 'audio', label: 'Áudio', count: stats.files_by_type.audio },
                ].map((type) => (
                  <button
                    key={type.key}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      filterType === type.key ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                    }`}
                    onClick={() => setFilterType(type.key)}
                  >
                    <span className="text-sm">{type.label}</span>
                    <span className="text-xs text-gray-500">{type.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
        {/* Main Content - File Grid/List */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar arquivos, tags, descrições..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType} className="w-32">
                <option value="all">Todos</option>
                <option value="image">Imagens</option>
                <option value="video">Vídeos</option>
                <option value="document">Docs</option>
                <option value="audio">Áudio</option>
              </Select>
            </div>
            {/* Files Display */}
            {isLoading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className={viewMode === 'grid' ? 'h-48' : 'h-16'} />
                ))}
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <File className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum arquivo encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? `Nenhum resultado para "${searchQuery}"` : 'Comece fazendo upload de seus arquivos'}
                </p>
                <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </Button>
              </div>
            ) : (
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                  : 'grid-cols-1 gap-2'
              }`}>
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`group border rounded-lg hover:shadow-md transition-shadow ${
                      selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                    } ${viewMode === 'grid' ? 'p-4' : 'p-3'}`}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <div className="space-y-3">
                        {/* Thumbnail */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                          {file.type === 'image' ? (
                            <img
                              src={file.thumbnail_url || file.url}
                              alt={file.metadata.alt_text || file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getFileIcon(file)}
                            </div>
                          )}
                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:text-gray-300"
                              onClick={() => handleFileAction(file.id, 'star')}
                            >
                              <Star className={`h-4 w-4 ${file.starred ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                          {/* Status Indicators */}
                          <div className="absolute top-2 left-2 flex space-x-1">
                            {file.status === 'processing' && (
                              <Badge variant="warning" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                            {file.ai_analysis && (
                              <Badge variant="info" className="text-xs">
                                <Brain className="h-3 w-3" />
                              </Badge>
                            )}
                            {file.public && (
                              <Badge variant="success" className="text-xs">
                                <Globe className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          {/* Starred */}
                          {file.starred && (
                            <div className="absolute top-2 right-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            </div>
                          )}
                        </div>
                        {/* File Info */}
                        <div>
                          <h4 className="font-medium text-sm truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{file.format}</span>
                          </div>
                          {/* Tags */}
                          {file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {file.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          {/* AI Quality Score */}
                          {file.ai_analysis && (
                            <div className="flex items-center space-x-1 mt-2">
                              <span className="text-xs text-gray-500">Qualidade:</span>
                              <div className="flex-1">
                                <Progress value={file.ai_analysis.quality_score} className="h-1" />
                              </div>
                              <span className="text-xs font-medium">{file.ai_analysis.quality_score}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          {file.type === 'image' ? (
                            <img
                              src={file.thumbnail_url || file.url}
                              alt={file.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            getFileIcon(file)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm truncate">{file.name}</h4>
                            {file.starred && <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />}
                            {file.ai_analysis && <Brain className="h-4 w-4 text-purple-500 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{file.format}</span>
                            <span>{new Date(file.metadata.created_at).toLocaleDateString('pt-BR')}</span>
                            <span>{file.usage.view_count} visualizações</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />
      {/* AI Insights Modal */}
      <Modal
        isOpen={showAIInsights}
        onClose={() => setShowAIInsights(false)}
        title="Insights de IA"
        size="lg"
      >
        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium">Análise Automática</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Arquivos processados:</span>
                <span className="font-medium ml-2">{stats.ai_processed.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Taxa de processamento:</span>
                <span className="font-medium ml-2">{((stats.ai_processed / stats.total_files) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-3">Sugestões de Otimização</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Otimizar imagens grandes
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    123 imagens podem ser comprimidas para economizar 45% de espaço
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <Target className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Adicionar tags automáticas
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    A IA pode gerar tags para 567 arquivos sem classificação
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <Eye className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Melhorar acessibilidade
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                    89 imagens precisam de texto alternativo para melhor acessibilidade
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};
export default IntelligentMediaLibrary;

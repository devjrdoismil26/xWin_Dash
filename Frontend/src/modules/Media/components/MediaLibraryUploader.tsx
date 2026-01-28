/**
 * Uploader da MediaLibrary
 * Gerencia upload de arquivos com drag & drop e progresso
 */

import React, { useCallback, useState, memo } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/AdvancedProgress';
import { Badge } from '@/components/ui/Badge';
import { 
  Upload, 
  X, 
  Check, 
  AlertCircle,
  FileText,
  Image,
  Video,
  Music,
  Archive
} from 'lucide-react';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export const MediaLibraryUploader: React.FC = memo(() => {
  const {
    handleUpload,
    uploadProgress,
    isUploading,
    uploadError
  } = useMediaLibrarySimple();

  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return Archive;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const newUploadFiles: UploadFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
    
    // Simular upload
    newUploadFiles.forEach(uploadFile => {
      simulateUpload(uploadFile);
    });
  };

  const simulateUpload = (uploadFile: UploadFile) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
    ));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 100, status: 'completed' } : f
        ));
      } else {
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress } : f
        ));
      }
    }, 200);
  };

  const removeUploadFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'uploading':
        return <div className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="h-4 w-4 border-2 border-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'uploading':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Header>
          <Card.Title className="text-white">Upload de Arquivos</Card.Title>
        </Card.Header>
        <Card.Content>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-white/20 hover:border-white/40'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-400" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Suporte para imagens, vídeos, documentos e áudios
                </p>
                
                <Button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt';
                    input.onchange = (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || []);
                      if (files.length > 0) {
                        handleFiles(files);
                      }
                    };
                    input.click();
                  }}
                  className="backdrop-blur-sm bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Arquivos
                </Button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Lista de Uploads */}
      {uploadFiles.length > 0 && (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="text-white">Arquivos em Upload</Card.Title>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20 text-white">
                  {uploadFiles.length} arquivos
                </Badge>
                <Button
                  onClick={clearCompleted}
                  variant="outline"
                  size="sm"
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Limpar Concluídos
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => {
                const IconComponent = getFileIcon(uploadFile.file.type);
                
                return (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-4 p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="h-8 w-8 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {uploadFile.file.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Progresso */}
                      {uploadFile.status === 'uploading' && (
                        <div className="w-32">
                          <ProgressBar
                            value={uploadFile.progress}
                            max={100}
                            className="h-2"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {Math.round(uploadFile.progress)}%
                          </p>
                        </div>
                      )}

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(uploadFile.status)}
                        <Badge 
                          variant="outline" 
                          className={`backdrop-blur-sm ${getStatusColor(uploadFile.status)}`}
                        >
                          {uploadFile.status}
                        </Badge>
                      </div>

                      {/* Ações */}
                      <Button
                        onClick={() => removeUploadFile(uploadFile.id)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Progresso Global */}
      {isUploading && (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <Card.Content className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Upload em Progresso</h3>
                <span className="text-sm text-gray-400">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <ProgressBar
                value={uploadProgress}
                max={100}
                className="h-3"
              />
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Erro de Upload */}
      {uploadError && (
        <Card className="backdrop-blur-xl bg-red-500/10 border-red-500/20">
          <Card.Content className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-red-400 font-medium">Erro no Upload</h3>
                <p className="text-sm text-red-300">{uploadError}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
});

MediaLibraryUploader.displayName = 'MediaLibraryUploader';

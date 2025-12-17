import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  id?: string; }

export interface UploadOptions {
  folderId?: number;
  tags?: string[];
  onProgress??: (e: any) => void;
  onComplete??: (e: any) => void;
  onError??: (e: any) => void;
  [key: string]: unknown; }

export const useMediaUpload = () => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Tamanho máximo: 100MB
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo 100MB.'};

    }

    // Tipos permitidos
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
      'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de arquivo não suportado.'};

    }

    return { valid: true};

  }, []);

  const uploadFiles = useCallback(async (files: File[], options: UploadOptions = {}) => {
    const { folderId, tags, onProgress, onComplete, onError } = options;
    
    // Validar arquivos
    const validFiles: File[] = [];
    const invalidFiles: { file: File; error: string }[] = [];

    files.forEach(file => {
      const validation = validateFile(file);

      if (validation.valid) {
        validFiles.push(file);

      } else {
        invalidFiles.push({ file, error: validation.error! });

      } );

    if (invalidFiles.length > 0) {
      const errorMessage = `Arquivos inválidos: ${invalidFiles.map(f => f.file.name).join(', ')}`;
      onError?.(errorMessage);

      return;
    }

    if (validFiles.length === 0) {
      onError?.('Nenhum arquivo válido para upload.');

      return;
    }

    setIsUploading(true);

    // Inicializar progresso
    const initialProgress: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploads(initialProgress);

    onProgress?.(initialProgress);

    try {
      const formData = new FormData();

      validFiles.forEach((file: unknown) => {
        formData.append('files[]', file);

      });

      if (folderId) formData.append('folder_id', folderId.toString());

      if (tags && tags.length > 0) formData.append('tags', JSON.stringify(tags));

      const xhr = new XMLHttpRequest();

      // Atualizar progresso
      xhr.upload.addEventListener('progress', (event: unknown) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);

          setUploads(prev => {
            const updated = prev.map(upload => ({
              ...upload,
              progress,
              status: progress === 100 ? 'completed' as const : 'uploading' as const,
            }));

            onProgress?.(updated);

            return updated;
          });

        } );

      // Upload concluído
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);

            if (response.success) {
              setUploads(prev => prev.map(upload => ({
                ...upload,
                status: 'completed' as const,
                progress: 100,
              })));

              onComplete?.(response.data);

            } else {
              throw new Error(response.message || 'Erro no upload');

            } catch (error) {
            const errorMessage = getErrorMessage(error);

            setUploads(prev => prev.map(upload => ({
              ...upload,
              status: 'error' as const,
              error: errorMessage,
            })));

            onError?.(errorMessage);

          } else {
          const errorMessage = `Erro HTTP: ${xhr.status}`;
          setUploads(prev => prev.map(upload => ({
            ...upload,
            status: 'error' as const,
            error: errorMessage,
          })));

          onError?.(errorMessage);

        }
        setIsUploading(false);

      });

      // Erro no upload
      xhr.addEventListener('error', () => {
        const errorMessage = 'Erro de conexão durante o upload';
        setUploads(prev => prev.map(upload => ({
          ...upload,
          status: 'error' as const,
          error: errorMessage,
        })));

        onError?.(errorMessage);

        setIsUploading(false);

      });

      // Abortar upload
      xhr.addEventListener('abort', () => {
        setUploads(prev => prev.map(upload => ({
          ...upload,
          status: 'error' as const,
          error: 'Upload cancelado',
        })));

        setIsUploading(false);

      });

      xhr.open('POST', '/api/v1/media/upload');

      xhr.send(formData);

      return xhr;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      setUploads(prev => prev.map(upload => ({
        ...upload,
        status: 'error' as const,
        error: errorMessage,
      })));

      onError?.(errorMessage);

      setIsUploading(false);

    } , [validateFile]);

  const cancelUpload = useCallback((xhr: XMLHttpRequest) => {
    xhr.abort();

  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);

  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();

  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadFiles(Array.from(files));

    } , [uploadFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    e.stopPropagation();

    setDragActive(true);

  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    e.stopPropagation();

  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFiles(Array.from(files));

    } , [uploadFiles]);

  const getUploadStatus = useCallback(() => {
    const total = uploads.length;
    const completed = uploads.filter(u => u.status === 'completed').length;
    const error = uploads.filter(u => u.status === 'error').length;
    const uploading = uploads.filter(u => u.status === 'uploading').length;
    const pending = uploads.filter(u => u.status === 'pending').length;

    return {
      total,
      completed,
      error,
      uploading,
      pending,
      isComplete: total > 0 && completed + error === total,};

  }, [uploads]);

  const getTotalProgress = useCallback(() => {
    if (uploads.length === 0) return 0;
    const totalProgress = uploads.reduce((sum: unknown, upload: unknown) => sum + upload.progress, 0);

    return Math.round(totalProgress / uploads.length);

  }, [uploads]);

  return {
    // State
    uploads,
    isUploading,
    dragActive,
    fileInputRef,
    
    // Actions
    uploadFiles,
    cancelUpload,
    clearUploads,
    openFileDialog,
    handleFileSelect,
    
    // Drag & Drop
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    
    // Utilities
    validateFile,
    getUploadStatus,
    getTotalProgress,};
};

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/services';

export type MediaItem = {
  id: string | number;
  filename: string;
  original_filename?: string;
  file_type?: string;
  file_size?: number;
  url: string;
  thumbnail_url?: string;
  tags?: string[];
  created_at?: string;
};

export type UseMediaOptions = {
  projectId?: string | number;
  autoLoad?: boolean;
  filters?: {
    type?: string;
    folder_id?: string | number | null;
    search?: string;
  };
};

export const useMedia = (options: UseMediaOptions = {}) => {
  const { projectId, autoLoad = false, filters = {} } = options;
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/media', { params: { project_id: projectId, ...filters } });
      setMedia(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao carregar mídia';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [projectId, JSON.stringify(filters)]);

  const uploadFiles = useCallback(async (files: File[] | FileList, extra: { folder_id?: string | number; tags?: string[] } = {}) => {
    const list = Array.from(files as any);
    if (list.length === 0) return [] as MediaItem[];
    const formData = new FormData();
    list.forEach((f) => formData.append('files[]', f));
    if (extra.folder_id) formData.append('folder_id', String(extra.folder_id));
    if (extra.tags?.length) formData.append('tags', JSON.stringify(extra.tags));

    try {
      const response = await apiClient.post('/api/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const newMedia: MediaItem[] = Array.isArray(response?.data?.data) ? response.data.data : [];
      setMedia((prev) => [...newMedia, ...prev]);
      toast.success(`${newMedia.length} arquivo(s) enviado(s) com sucesso!`);
      return newMedia;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro no upload';
      toast.error(message);
      throw err;
    }
  }, []);

  const deleteMedia = useCallback(async (id: string | number) => {
    try {
      await apiClient.delete(`/api/media/${id}`);
      setMedia((prev) => prev.filter((m) => m.id !== id));
      toast.success('Arquivo excluído com sucesso!');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao excluir arquivo';
      toast.error(message);
      throw err;
    }
  }, []);

  const searchMedia = useCallback(async (query: { search?: string; type?: string }) => {
    try {
      const response = await apiClient.get('/api/media/search', { params: query });
      return Array.isArray(response?.data?.data) ? (response.data.data as MediaItem[]) : [];
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro na busca';
      toast.error(message);
      throw err;
    }
  }, []);

  const organizeMedia = useCallback(async (payload: { folder_id?: string | number; ids: Array<string | number> }) => {
    try {
      await apiClient.post('/api/media/organize', payload);
      setMedia((prev) => prev.slice());
      toast.success('Arquivos organizados com sucesso!');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao organizar arquivos';
      toast.error(message);
      throw err;
    }
  }, []);

  const generateReport = useCallback(async (format: 'pdf' | 'csv' = 'pdf') => {
    try {
      const response = await apiClient.post('/api/media/generate-report', { format });
      const url = response?.data?.download_url;
      if (url && typeof window !== 'undefined') window.open(url, '_blank');
      toast.success('Relatório gerado com sucesso!');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao gerar relatório';
      toast.error(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (autoLoad && projectId) loadMedia();
  }, [autoLoad, projectId, loadMedia]);

  return {
    media,
    loading,
    error,
    loadMedia,
    uploadFiles,
    deleteMedia,
    searchMedia,
    organizeMedia,
    generateReport,
    refresh: loadMedia,
  };
};

export default useMedia;

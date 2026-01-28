import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMediaUpload } from '../hooks/useMediaUpload';

// Mock do mediaLibraryService
vi.mock('../services/mediaLibraryService', () => ({
  mediaLibraryService: {
    uploadMedia: vi.fn()
  }
}));

describe('useMediaUpload', () => {
  const mockMediaLibraryService = require('../services/mediaLibraryService').mediaLibraryService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve inicializar com valores padrão corretos', () => {
      const { result } = renderHook(() => useMediaUpload());

      expect(result.current.uploads).toEqual([]);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.uploadProgress).toBe(0);
      expect(result.current.uploadStatus).toBe('idle');
    });
  });

  describe('uploadFiles', () => {
    it('deve fazer upload de arquivos com sucesso', async () => {
      const mockFiles = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.mp4', { type: 'video/mp4' })
      ];

      mockMediaLibraryService.uploadMedia.mockResolvedValue({
        id: '1',
        name: 'test1.jpg',
        type: 'image',
        url: 'test1.jpg'
      });

      const { result } = renderHook(() => useMediaUpload());

      await act(async () => {
        await result.current.uploadFiles(mockFiles);
      });

      expect(result.current.uploads).toHaveLength(2);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.uploadStatus).toBe('completed');
    });

    it('deve lidar com erro durante upload', async () => {
      const mockFiles = [
        new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      ];

      mockMediaLibraryService.uploadMedia.mockRejectedValue(new Error('Upload failed'));

      const { result } = renderHook(() => useMediaUpload());

      await act(async () => {
        await result.current.uploadFiles(mockFiles);
      });

      expect(result.current.uploads[0].status).toBe('error');
      expect(result.current.isUploading).toBe(false);
      expect(result.current.uploadStatus).toBe('error');
    });

    it('deve validar tipos de arquivo', async () => {
      const mockFiles = [
        new File(['test'], 'test.exe', { type: 'application/x-executable' })
      ];

      const { result } = renderHook(() => useMediaUpload());

      await act(async () => {
        await result.current.uploadFiles(mockFiles);
      });

      expect(result.current.uploads[0].status).toBe('error');
      expect(result.current.uploads[0].error).toContain('Tipo de arquivo não permitido');
    });

    it('deve validar tamanho de arquivo', async () => {
      const largeFile = new File(['x'.repeat(200 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

      const { result } = renderHook(() => useMediaUpload());

      await act(async () => {
        await result.current.uploadFiles([largeFile]);
      });

      expect(result.current.uploads[0].status).toBe('error');
      expect(result.current.uploads[0].error).toContain('Arquivo muito grande');
    });
  });

  describe('cancelUpload', () => {
    it('deve cancelar upload em andamento', async () => {
      const mockFiles = [
        new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      ];

      // Mock de upload que demora
      mockMediaLibraryService.uploadMedia.mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 1000))
      );

      const { result } = renderHook(() => useMediaUpload());

      // Iniciar upload
      act(() => {
        result.current.uploadFiles(mockFiles);
      });

      // Cancelar upload
      act(() => {
        result.current.cancelUpload();
      });

      expect(result.current.uploadStatus).toBe('cancelled');
      expect(result.current.isUploading).toBe(false);
    });
  });

  describe('clearUploads', () => {
    it('deve limpar lista de uploads', async () => {
      const mockFiles = [
        new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      ];

      mockMediaLibraryService.uploadMedia.mockResolvedValue({
        id: '1',
        name: 'test.jpg',
        type: 'image'
      });

      const { result } = renderHook(() => useMediaUpload());

      // Fazer upload
      await act(async () => {
        await result.current.uploadFiles(mockFiles);
      });

      expect(result.current.uploads).toHaveLength(1);

      // Limpar uploads
      act(() => {
        result.current.clearUploads();
      });

      expect(result.current.uploads).toHaveLength(0);
    });
  });

  describe('getUploadStatus', () => {
    it('deve retornar status correto dos uploads', async () => {
      const mockFiles = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
      ];

      mockMediaLibraryService.uploadMedia.mockResolvedValue({
        id: '1',
        name: 'test.jpg',
        type: 'image'
      });

      const { result } = renderHook(() => useMediaUpload());

      await act(async () => {
        await result.current.uploadFiles(mockFiles);
      });

      const status = result.current.getUploadStatus();
      expect(status.completed).toBe(2);
      expect(status.failed).toBe(0);
      expect(status.total).toBe(2);
    });
  });

  describe('getTotalProgress', () => {
    it('deve calcular progresso total corretamente', async () => {
      const mockFiles = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
      ];

      // Mock de upload com progresso
      mockMediaLibraryService.uploadMedia.mockImplementation((file, onProgress) => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 25;
            if (onProgress) onProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              resolve({ id: '1', name: file.name, type: 'image' });
            }
          }, 100);
        });
      });

      const { result } = renderHook(() => useMediaUpload());

      await act(async () => {
        await result.current.uploadFiles(mockFiles);
      });

      expect(result.current.getTotalProgress()).toBe(100);
    });
  });
});
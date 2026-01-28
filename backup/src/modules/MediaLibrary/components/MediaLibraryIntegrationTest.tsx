import React from 'react';
import { Image, Upload, Folder, BarChart3, Settings } from 'lucide-react';
import IntegrationTest, { TestCase } from '@/components/ui/IntegrationTest';
import { useMediaLibrary } from '../hooks/useMediaLibrary';

const MediaLibraryIntegrationTest: React.FC = () => {
  const {
    mediaFiles,
    folders,
    loading,
    error,
    fetchMediaFiles,
    uploadFile,
    createFolder,
    deleteFile,
    getMediaStats
  } = useMediaLibrary();

  const tests: TestCase[] = [
    {
      id: 'connection',
      name: 'Teste de Conexão',
      description: 'Verifica conectividade com MediaLibrary',
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: async () => {
        try {
          await fetchMediaFiles();
          return { success: true, message: 'Conexão com MediaLibrary estabelecida com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha na conexão', error: error.message };
        }
      }
    },
    {
      id: 'file-upload',
      name: 'Upload de Arquivos',
      description: 'Testa upload de arquivos',
      icon: Upload,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      action: async () => {
        try {
          // Simular upload de arquivo
          const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
          await uploadFile(testFile);
          return { success: true, message: 'Arquivo enviado com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha no upload', error: error.message };
        }
      }
    },
    {
      id: 'folder-management',
      name: 'Gerenciamento de Pastas',
      description: 'Testa operações com pastas',
      icon: Folder,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: async () => {
        try {
          await createFolder('Test Folder');
          return { success: true, message: 'Pasta criada com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha ao criar pasta', error: error.message };
        }
      }
    },
    {
      id: 'file-management',
      name: 'Gerenciamento de Arquivos',
      description: 'Testa operações com arquivos',
      icon: Settings,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: async () => {
        try {
          if (mediaFiles && mediaFiles.length > 0) {
            await deleteFile(mediaFiles[0].id);
            return { success: true, message: 'Arquivo gerenciado com sucesso' };
          }
          return { success: false, message: 'Nenhum arquivo disponível para teste' };
        } catch (error: any) {
          return { success: false, message: 'Falha no gerenciamento', error: error.message };
        }
      }
    },
    {
      id: 'analytics',
      name: 'Analytics de Mídia',
      description: 'Testa métricas e analytics',
      icon: BarChart3,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      action: async () => {
        try {
          await getMediaStats();
          return { success: true, message: 'Analytics carregados com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha nos analytics', error: error.message };
        }
      }
    }
  ];

  const statsConfig = {
    stats: [
      {
        label: 'Total de Arquivos',
        value: mediaFiles?.length || 0,
        color: 'blue'
      },
      {
        label: 'Pastas Criadas',
        value: folders?.length || 0,
        color: 'green'
      },
      {
        label: 'Espaço Usado',
        value: 0, // Placeholder - seria calculado com dados reais
        color: 'purple'
      },
      {
        label: 'Downloads Hoje',
        value: 0, // Placeholder - seria calculado com dados reais
        color: 'teal'
      }
    ]
  };

  return (
    <IntegrationTest
      moduleName="MediaLibrary"
      moduleDescription="Sistema de gerenciamento de arquivos e mídia"
      tests={tests}
      statsConfig={statsConfig}
      loading={loading}
      error={error}
    />
  );
};

export default MediaLibraryIntegrationTest;

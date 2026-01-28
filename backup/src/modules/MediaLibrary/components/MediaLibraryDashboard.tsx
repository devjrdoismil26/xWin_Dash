/**
 * Dashboard principal da MediaLibrary
 * Exibe estatísticas e controles principais
 */

import React, { memo } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';
import { 
  Archive, 
  Image, 
  Video, 
  FileText, 
  Music,
  Upload,
  FolderPlus,
  Grid,
  List,
  Filter
} from 'lucide-react';

export const MediaLibraryDashboard: React.FC = memo(() => {
  const {
    stats,
    loading,
    error,
    currentView,
    setCurrentView,
    handleUpload,
    handleCreateFolder,
    getTotalMedia,
    getImages,
    getVideos,
    getDocuments,
    getAudio
  } = useMediaLibrarySimple();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="backdrop-blur-xl bg-white/10 border-white/20">
              <Card.Content className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-white/20 rounded w-1/2"></div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Content className="p-6 text-center">
          <p className="text-red-400">Erro ao carregar dashboard: {error}</p>
        </Card.Content>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total de Arquivos',
      value: getTotalMedia() || stats?.total || 0,
      icon: Archive,
      color: 'blue',
    },
    {
      title: 'Imagens',
      value: getImages()?.length || stats?.images || 0,
      icon: Image,
      color: 'green',
    },
    {
      title: 'Vídeos',
      value: getVideos()?.length || stats?.videos || 0,
      icon: Video,
      color: 'purple',
    },
    {
      title: 'Documentos',
      value: getDocuments()?.length || stats?.documents || 0,
      icon: FileText,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <ResponsiveGrid
        cols={{ base: 1, sm: 2, lg: 4 }}
        gap={6}
        className="mb-6"
      >
        {statCards.map((stat, index) => (
          <Card 
            key={index}
            className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Controles Principais */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <Card.Header>
          <Card.Title className="text-white">Controles Principais</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleUpload}
              className="backdrop-blur-sm bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Arquivos
            </Button>
            
            <Button
              onClick={handleCreateFolder}
              variant="outline"
              className="backdrop-blur-sm bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Nova Pasta
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={currentView === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('grid')}
                className="backdrop-blur-sm"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={currentView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('list')}
                className="backdrop-blur-sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
});

MediaLibraryDashboard.displayName = 'MediaLibraryDashboard';

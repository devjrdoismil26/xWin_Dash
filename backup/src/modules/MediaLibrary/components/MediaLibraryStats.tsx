/**
 * Estatísticas da MediaLibrary
 * Exibe métricas e informações sobre o uso do armazenamento
 */

import React, { memo } from 'react';
import { Card } from "@/components/ui/Card";
import { Badge } from '@/components/ui/Badge';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import { 
  Archive, 
  Image, 
  Video, 
  FileText, 
  Music,
  HardDrive,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';

export const MediaLibraryStats: React.FC = memo(() => {
  const {
    stats,
    loading,
    error,
    getTotalMedia,
    getImages,
    getVideos,
    getDocuments,
    getAudio,
    getStorageUsage,
    getRecentActivity
  } = useMediaLibrarySimple();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 mb-6">
        <Card.Content className="p-6 text-center">
          <p className="text-red-400">Erro ao carregar estatísticas: {error}</p>
        </Card.Content>
      </Card>
    );
  }

  const totalMedia = getTotalMedia() || stats?.total || 0;
  const images = getImages()?.length || stats?.images || 0;
  const videos = getVideos()?.length || stats?.videos || 0;
  const documents = getDocuments()?.length || stats?.documents || 0;
  const audio = getAudio()?.length || stats?.audio || 0;
  const storageUsage = getStorageUsage() || stats?.storageUsage || 0;
  const recentActivity = getRecentActivity() || stats?.recentActivity || 0;

  const statCards = [
    {
      title: 'Total de Arquivos',
      value: totalMedia,
      icon: Archive,
      color: 'blue',
      trend: '+12%',
      description: 'Arquivos totais'
    },
    {
      title: 'Imagens',
      value: images,
      icon: Image,
      color: 'green',
      trend: '+8%',
      description: 'Fotos e imagens'
    },
    {
      title: 'Vídeos',
      value: videos,
      icon: Video,
      color: 'purple',
      trend: '+15%',
      description: 'Vídeos e filmes'
    },
    {
      title: 'Documentos',
      value: documents,
      icon: FileText,
      color: 'orange',
      trend: '+5%',
      description: 'PDFs e documentos'
    },
    {
      title: 'Áudio',
      value: audio,
      icon: Music,
      color: 'pink',
      trend: '+3%',
      description: 'Músicas e áudios'
    },
    {
      title: 'Armazenamento',
      value: `${storageUsage.toFixed(1)} GB`,
      icon: HardDrive,
      color: 'indigo',
      trend: '+7%',
      description: 'Espaço utilizado'
    }
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Cards de estatísticas principais */}
      <ResponsiveGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: 6 }}
        gap={6}
      >
        {statCards.map((stat, index) => (
          <Card 
            key={index}
            className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Card.Content className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                <Badge 
                  variant="outline" 
                  className="backdrop-blur-sm bg-green-500/20 text-green-400 border-green-500/30"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white mb-1">
                  {typeof stat.value === 'number' ? (
                    <AnimatedCounter value={stat.value} />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Estatísticas adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade recente */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <Card.Header>
            <Card.Title className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-400" />
              Atividade Recente
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Uploads hoje</span>
                <span className="text-white font-medium">{recentActivity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Arquivos processados</span>
                <span className="text-white font-medium">{Math.floor(totalMedia * 0.1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Taxa de sucesso</span>
                <span className="text-green-400 font-medium">98.5%</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Uso de armazenamento */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <Card.Header>
            <Card.Title className="text-white flex items-center">
              <HardDrive className="h-5 w-5 mr-2 text-indigo-400" />
              Uso de Armazenamento
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Usado</span>
                <span className="text-white font-medium">{storageUsage.toFixed(1)} GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((storageUsage / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>0 GB</span>
                <span>100 GB</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
});

MediaLibraryStats.displayName = 'MediaLibraryStats';

// =========================================
// MEDIA METRICS COMPONENT
// =========================================
// Componente para exibir métricas de mídia
// Máximo: 150 linhas

import React from 'react';
import { TrendingUp, TrendingDown, Archive, Image, Video, FileText, Music, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { MediaStats } from '../types';

interface MediaMetricsProps {
  stats: MediaStats;
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const MediaMetrics: React.FC<MediaMetricsProps> = ({
  stats,
  loading = false,
  onRefresh,
  className = ''
}) => {
  // =========================================
  // HELPER FUNCTIONS
  // =========================================

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageStatus = (percentage: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  const getStorageColor = (status: string): string => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  // =========================================
  // METRIC CARDS DATA
  // =========================================

  const metricCards = [
    {
      title: 'Total de Arquivos',
      value: stats.total_files,
      icon: Archive,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Imagens',
      value: stats.count_by_type.image,
      icon: Image,
      color: 'green',
      trend: '+8%'
    },
    {
      title: 'Vídeos',
      value: stats.count_by_type.video,
      icon: Video,
      color: 'purple',
      trend: '+15%'
    },
    {
      title: 'Documentos',
      value: stats.count_by_type.document,
      icon: FileText,
      color: 'orange',
      trend: '+5%'
    },
    {
      title: 'Áudio',
      value: stats.count_by_type.audio,
      icon: Music,
      color: 'pink',
      trend: '+3%'
    }
  ];

  const storageStatus = getStorageStatus(stats.storage_percentage);

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Métricas de Mídia
        </h2>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="secondary"
            size="sm"
            loading={loading}
          >
            Atualizar
          </Button>
        )}
      </div>

      <ResponsiveGrid columns={{ default: 2, md: 5 }} gap={4}>
        {metricCards.map((metric, index) => (
          <Card
            key={index}
            className="p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {metric.title}
                </p>
                <div className="flex items-center gap-2">
                  <AnimatedCounter
                    value={metric.value}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  />
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {metric.trend}
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </ResponsiveGrid>

      <ResponsiveGrid columns={{ default: 1, lg: 2 }} gap={4}>
        {/* Storage Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Armazenamento
              </h3>
            </div>
            <span className={`text-sm font-medium ${getStorageColor(storageStatus)}`}>
              {stats.storage_percentage}%
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Usado</span>
              <span>{formatFileSize(stats.storage_used)}</span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageStatus === 'critical' ? 'bg-red-500' :
                  storageStatus === 'high' ? 'bg-orange-500' :
                  storageStatus === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(stats.storage_percentage, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Limite</span>
              <span>{formatFileSize(stats.storage_limit)}</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Atividade Recente
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Uploads hoje
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.recent_uploads}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total de pastas
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.total_folders}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Tamanho total
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatFileSize(stats.total_size)}
              </span>
            </div>
          </div>
        </Card>
      </ResponsiveGrid>
    </div>
  );
};

export default MediaMetrics;
